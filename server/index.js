const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const mysql = require("mysql2");
const taskRequestRouter = require("./routes/taskRequest");
const fileUploadRouter = require("./routes/fileUpload");
const sensorDataRouter = require("./routes/sensorData");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "test",
});

// Require the routers
app.use(cors());
app.use(express.json());
app.use("/api/taskRequest", taskRequestRouter(io, pool));
app.use("/api", fileUploadRouter(io, pool));
app.use("/api/sensorData", sensorDataRouter);

// Start the server
server.listen(4002, () => {
  console.log("Server is running on port 4002");
});
