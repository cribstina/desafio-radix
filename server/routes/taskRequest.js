const express = require("express");
const router = express.Router();

module.exports = function (io, pool) {
  // Define the variables
  var sendResponse = function () {};

  // Socket.IO connection handling
  io.on("connection", function (socket) {
    console.log("Server-Client Connected!");

    socket.on("connected", function (data) {
      // Listen to event at any time (not only when endpoint is called)
      // Execute some code here
    });

    socket.on("taskResponse", (data) => {
      // Calling a function which is inside the router so we can send a response back
      sendResponse(data);
    });
  });

  // Route handler for task requests
  router.post("/", async (req, res) => {
    const { equipmentId, timestamp, value } = req.body;

    // Insert equipment if not exists
    const insertEquipmentQuery =
      "INSERT INTO equipments (id) VALUES (?) ON DUPLICATE KEY UPDATE id = id";
    pool.query(insertEquipmentQuery, [equipmentId], (error, results) => {
      if (error) {
        console.error("Error inserting equipment:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Insert sensor data
      let insertDataQuery;
      let queryParams;

      if (timestamp) {
        insertDataQuery =
          "INSERT INTO sensor_data (equipmentId, timestamp, value) VALUES (?, ?, ?)";
        queryParams = [equipmentId, timestamp, value];
      } else {
        insertDataQuery =
          "INSERT INTO sensor_data (equipmentId, value) VALUES (?, ?)";
        queryParams = [equipmentId, value];
      }

      pool.query(insertDataQuery, queryParams, (error, results) => {
        if (error) {
          console.error("Error inserting sensor data:", error);
          return res.status(500).json({ error: "Internal server error" });
        }

        return res.status(200).json({ message: "Data inserted successfully" });
      });
    });
  });

  return router;
};

// code built with a little help from https://stackoverflow.com/questions/56219098/make-socket-io-work-within-an-api-endpoint-in-node-js
