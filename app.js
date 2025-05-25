// app.js
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  loginBtn.addEventListener("click", login);
});

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("login-error");

  if (username === "admin" && password === "admin123") {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    initChart(); // initialize chart after login
  } else {
    errorMsg.textContent = "Invalid credentials. Try again.";
  }
}

function initChart() {
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

  const now = Math.floor(Date.now() / 1000);
  const dummyData = [
    { time: now - 240, value: 10100 },
    { time: now - 180, value: 10110 },
    { time: now - 120, value: 10090 },
    { time: now - 60, value: 10130 },
    { time: now, value: 10120 },
  ];

  lineSeries.setData(dummyData);
}
