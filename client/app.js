document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch sensor data for a specific time interval
  document.querySelector('input[name="interval"]:first-of-type').checked = true;
  function fetchSensorDataForInterval(interval) {
    const currentTime = new Date();
    let startTime;

    switch (interval) {
      case "24h":
        startTime = new Date(currentTime - 24 * 60 * 60 * 1000);
        break;
      case "48h":
        startTime = new Date(currentTime - 48 * 60 * 60 * 1000);
        break;
      case "week":
        startTime = new Date(currentTime - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startTime = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth() - 1,
          currentTime.getDate(),
          currentTime.getHours(),
          currentTime.getMinutes(),
          currentTime.getSeconds()
        );
        break;
      default:
        startTime = new Date(currentTime - 24 * 60 * 60 * 1000); // Default to last 24 hours
    }

    console.log("Fetching sensor data for interval:", interval);
    console.log("Start time:", startTime);

    const equipmentId = document.getElementById("equipmentId").value;

    fetch(
      `http://localhost:4002/api/sensorData?equipmentId=${equipmentId}&startTime=${startTime.toISOString()}`
    )
      .then((response) => response.json())
      .then((sensorData) => {
        console.log("Raw sensor data:", sensorData);

        if (sensorData.length > 0) {
          // Filter sensor data to include only data points within the specified interval
          const filteredData = sensorData.filter(
            (data) => new Date(data.timestamp) >= startTime
          );

          // Log filtered data for debugging
          console.log("Filtered Data:", filteredData);

          // Process filtered sensor data
          renderLineChart(filteredData);

          // Calculate average value for the filtered data
          const average = calculateAverage(filteredData);
          console.log("Average value:", average);
        } else {
          console.log("No sensor data available for the specified interval.");
        }
      })
      .catch((error) => console.error("Error fetching sensor data:", error));
  }

  // Function to calculate the average value for a given dataset
  function calculateAverage(dataset) {
    console.log("Dataset:", dataset);

    const sum = dataset.reduce((acc, data) => acc + data.y, 0);
    console.log("Sum of values:", sum);

    const length = dataset.length;
    console.log("Number of data points:", length);

    const average = sum / length;
    console.log("Calculated average:", average);

    return average;
  }

  // Function to render the line chart with annotations
  function renderLineChart(sensorData) {
    const data = sensorData.map((data) => ({
      x: new Date(data.timestamp), // Convert timestamp to Date object
      y: parseFloat(data.value), // Convert value to a number
    }));

    console.log("Data array: ", data);

    if (window.ctx) {
      window.ctx.destroy();
    }

    // Calculate average value for the filtered data
    const avg = calculateAverage(sensorData);

    // Render line chart using Chart.js
    const ctx = document.getElementById("lineChart").getContext("2d");
    window.ctx = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Sensor Data",
            data: data,
            borderColor: "black",
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
              tooltipFormat: "mmm d, yyy h:mm a",
            },
            scaleLabel: {
              display: true,
              labelString: "Time",
            },
          },
          y: {
            scaleLabel: {
              display: true,
              labelString: "Value",
            },
          },
        },
        plugins: {
          annotation: {
            annotations: {
              averageLine: {
                type: "line",
                mode: "horizontal",
                scaleID: "y",
                borderColor: "red",
                borderWidth: 2,
                borderDash: [6, 6],
                value: avg,
                label: {
                  enabled: true,
                  content: "Average: " + avg.toFixed(2),
                  position: "end",
                },
              },
            },
          },
        },
      },
    });
  }

  // Event listener for form submission
  const filterForm = document.getElementById("filterForm");
  filterForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const interval = document.querySelector(
      'input[name="interval"]:checked'
    ).value;

    fetchSensorDataForInterval(interval);
  });

  // Event listeners for interval buttons
  document.getElementById("last24h").addEventListener("click", function () {
    fetchSensorDataForInterval("24h");
    console.log("interval changed to 24h");
  });

  document.getElementById("last48h").addEventListener("click", function () {
    fetchSensorDataForInterval("48h");
  });

  document.getElementById("lastWeek").addEventListener("click", function () {
    fetchSensorDataForInterval("week");
  });

  document.getElementById("lastMonth").addEventListener("click", function () {
    fetchSensorDataForInterval("month");
  });
});
