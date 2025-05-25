// app.js
document.addEventListener("DOMContentLoaded", function () {
  const chartDiv = document.getElementById("chart");

  const chart = LightweightCharts.createChart(chartDiv, {
    width: chartDiv.clientWidth,
    height: 500,
    layout: {
      background: { color: '#111' },
      textColor: '#0f0',
    },
    grid: {
      vertLines: { color: '#222' },
      horzLines: { color: '#222' },
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    },
    timeScale: {
      borderColor: '#71649C',
    },
  });

  const lineSeries = chart.addLineSeries();

  // Dummy data to visualize the chart (will replace with real Deriv data later)
  const dummyData = [
    { time: Math.floor(Date.now() / 1000) - 60 * 4, value: 10100 },
    { time: Math.floor(Date.now() / 1000) - 60 * 3, value: 10110 },
    { time: Math.floor(Date.now() / 1000) - 60 * 2, value: 10090 },
    { time: Math.floor(Date.now() / 1000) - 60 * 1, value: 10130 },
    { time: Math.floor(Date.now() / 1000), value: 10120 },
  ];

  lineSeries.setData(dummyData);
});
