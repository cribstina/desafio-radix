const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

module.exports = function (io, pool) {
  router.post("/upload", upload.single("csvFile"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        fs.unlinkSync(req.file.path);
        const errors = [];
        let completedOperations = 0;

        results.forEach((row) => {
          const { equipmentId, timestamp, value } = row;

          const checkEquipmentQuery = "SELECT id FROM equipments WHERE id = ?";
          pool.query(checkEquipmentQuery, [equipmentId], (error, results) => {
            if (error) {
              console.error("Error checking equipment:", error);
              errors.push(`Error checking equipment: ${error}`);
              checkCompletion();
              return;
            }

            if (results.length === 0) {
              console.error("Equipment does not exist:", equipmentId);
              errors.push(`Equipment ${equipmentId} does not exist`);

              const addEquipmentQuery =
                "INSERT INTO equipments (id) VALUES (?)";
              pool.query(addEquipmentQuery, [equipmentId], (error, results) => {
                if (error) {
                  console.error("Error adding equipment:", error);
                  errors.push(`Error adding equipment: ${error}`);
                }
                checkCompletion();
              });
            } else {
              insertSensorData(equipmentId, timestamp, value);
            }
          });
        });

        function insertSensorData(equipmentId, timestamp, value) {
          let insertQuery;
          let queryParams;

          if (timestamp) {
            insertQuery =
              "INSERT INTO sensor_data (equipmentId, timestamp, value) VALUES (?, ?, ?)";
            queryParams = [equipmentId, timestamp, value];
          } else {
            insertQuery =
              "INSERT INTO sensor_data (equipmentId, value) VALUES (?, ?)";
            queryParams = [equipmentId, value];
          }

          pool.query(insertQuery, queryParams, (error, results) => {
            if (error) {
              console.error("Error inserting sensor data:", error);
              errors.push(`Error inserting sensor data: ${error}`);
            }
            checkCompletion();
          });
        }

        function checkCompletion() {
          completedOperations++;
          if (completedOperations === results.length) {
            if (errors.length > 0) {
              return res.status(500).json({ errors });
            } else {
              return res
                .status(200)
                .json({ message: "Data inserted successfully" });
            }
          }
        }
      });
  });

  return router;
};
