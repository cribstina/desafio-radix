# Node.js API with Socket.io and Charts.js

This project is a web application for visualizing real-time sensor data. It allows users to filter sensor data based on equipment and different time intervals and view the data in a graphical representation. The application consists of a client-side interface built with HTML, CSS, and JavaScript, a server-side application developed using Node.js and Express.js, and a MySQL database for storing sensor data. The real-time communication between client and server is done through integration with Socket.Io.

![](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

## Features

- **Line Chart Visualisation**: the application returns a line chart showing different sensor data over time. It is possible to filter the values by Equipment ID and change the visualization intervals by clicking the available buttons (last 24 hours, last 48 hours, last week and last month).

- **CSV Upload**: The API provides an endpoint for uploading CSV files containing the respective columns: equipmentId; timestamp; value. This feature allows for manual late insertion of data (past current timestamp) in case sensors stop working.

## Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/cribstina/desafio-radix
```

2. Install server-side and client-side dependencies:
   \
   2.1.

```bash
cd server
npm install
```

\
2.2. Starting from desafio-radix/server:

```bash
cd ../client
npm install
```

3. Configure MySQL database:
   3.1. Create a MySQL database

3.2. Change the database credentials on `server/index.js:13:16` and `server/routes/sensorData.js:7:10` to your own.

```bash
const pool = mysql.createPool({
  host: "localhost",           // replace with your database host
  user: "your_user",           // replace with your database username
  password: "your_password",   // replace with your database password
  database: "your_database",   // replace with your database name
});
```

## Running the project locally

1. Access the server folder and start the project through

```bash
  npm run start
```

or

```bash
node index.js
```

2. Access the client by opening the `client/index.html`` file on your browser.

3. Upload a CSV file directly through the API endpoints.

## API Documentation

### Enter sensor data

```http
  POST api/taskRequest
```

| Key           | Value                          | Description                          |
| :------------ | :----------------------------- | :----------------------------------- |
| `equipmentId` | `VARCHAR(8)`                   | **Not null**. Equipment identifier   |
| `timestamp`   | `DATETIME (mmm d, yyy h:mm a)` | If empty, adds current date and time |
| `value`       | `DECIMAL(10,2)`                | **Not null**. Sensor value           |

### Upload CSV file

```http
  POST api/upload
```

| Key       | Value  | Description                                                        |
| :-------- | :----- | :----------------------------------------------------------------- |
| `csvFile` | `File` | CSV file containing "equipmentId", "timestamp" and "value" columns |

### Returns all data obtained from sensors

```http
  GET /api/sensorData/
```

### Returns data obtained from specified equipment

```http
  GET /api/sensorData/?equipmentId=${equipmentId}
```

| Key           | Value        | Description                                   |
| :------------ | :----------- | :-------------------------------------------- |
| `equipmentId` | `VARCHAR(8)` | **Not null**. Id of equipment to be selected. |

## Database

### ER Model

![](/database-models/ERM.png)

### Logical Data Model

![](/database-models/LDM.png)

### SQL file

- [Database code](/server/db.sql)

## References

- [Express docs](https://expressjs.com/pt-br/4x/api.html)
- [Socket.io docs](https://socket.io/docs/v4/server-api/)
- [Chart.js docs](https://www.chartjs.org/)
- [chartjs-plugin-annotation - Average Chart](https://www.chartjs.org/chartjs-plugin-annotation/1.2.0/samples/line/average.html)
- [Make socket.io work within an API endpoint in Node.js](https://stackoverflow.com/questions/56219098/make-socket-io-work-within-an-api-endpoint-in-node-js)
- [How to Switch Chart to Daily, Weekly and Monthly Data in Chart.js](https://www.youtube.com/watch?v=EVHi41f7psQ)
- Chat GPT was used to help me debug the code and write better comments :)
