const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "test",
});

router.get("/", (req, res) => {
  const { equipmentId } = req.query; // Get equipmentId from query parameters

  let query = "SELECT * FROM sensor_data";

  // If equipmentId is provided, add WHERE clause to filter by equipmentId
  if (equipmentId) {
    query += " WHERE equipmentId = ?";
  }

  // Execute the query with the provided parameters
  pool.query(query, [equipmentId], (error, results) => {
    if (error) {
      console.error("Error fetching sensor data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Send the filtered sensor data
    res.json(results);
  });
});

module.exports = router;
