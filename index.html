const chartEl = document.querySelector('#chart');
const signalEl = document.getElementById('signal');
const timeEl = document.getElementById('spike-time');
const countdownEl = document.getElementById('countdown');
const siren = document.getElementById('siren');
let chart;
let ws;
let countdownTimer;

function connect() {
  const symbol = 'R_1000'; // Boom 1000
  const granularity = 3600; // 1 hour

  ws = new WebSocket('wss://ws.deriv.com/websockets/v3');

  ws.onopen = () => {
    ws.send(JSON.stringify({ active_symbols: "brief", product_type: "basic" }));
    ws.send(JSON.stringify({
      ticks_history: symbol,
      style: 'candles',
      adjust_start_time: 1,
      count: 50,
      granularity,
      subscribe: 1
    }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    const candles = data.candles || data.history?.candles || [];

    if (candles.length) {
      const seriesData = candles.map(c => ({
        x: new Date(c.epoch * 1000),
        y: [parseFloat(c.open), parseFloat(c.high), parseFloat(c.low), parseFloat(c.close)]
      }));
      updateChart(seriesData);
      detectSpike(seriesData);
    }
  };

  ws.onerror = (e) => console.error('WebSocket error:', e);
  ws.onclose = () => console.warn('WebSocket closed. Retrying in 3s...') || setTimeout(connect, 3000);
}

function updateChart(data) {
  if (!chart) {
    chart = new ApexCharts(chartEl, {
      chart: {
        type: 'candlestick',
        height: 500,
        background: '#111',
        foreColor: '#0f0'
      },
      series: [{ data }],
      xaxis: { type: 'datetime' },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#00f',
            downward: '#f00'
          }
        }
      }
    });
    chart.render();
  } else {
    chart.updateSeries([{ data }]);
  }
}

function detectSpike(data) {
  if (data.length < 2) return;
  const last = data[data.length - 1];
  const prev = data[data.length - 2];

  const spike = last.y[1] - last.y[0];
  const prevRange = prev.y[1] - prev.y[0];

  if (spike > prevRange * 1.5) {
    startCountdown(30, () => {
      signalEl.textContent = '🚨 Spike detected!';
      timeEl.textContent = `Spike Time: ${last.x.toLocaleString()}`;
      siren.play();
    });
  } else {
    signalEl.textContent = 'Monitoring for spikes...';
    timeEl.textContent = '';
    countdownEl.textContent = '';
    clearInterval(countdownTimer);
  }
}

function startCountdown(seconds, onComplete) {
  clearInterval(countdownTimer);
  let timeLeft = seconds;
  countdownEl.textContent = `Spike in ${timeLeft} seconds...`;
  countdownTimer = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      countdownEl.textContent = `Spike in ${timeLeft} seconds...`;
    } else {
      clearInterval(countdownTimer);
      countdownEl.textContent = '';
      onComplete();
    }
  }, 1000);
}

connect();
