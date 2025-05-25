const chartEl = document.querySelector('#chart');
const signalEl = document.getElementById('signal');
const siren = document.getElementById('siren');
let chart;
let ws;

function connect() {
  const symbol = 'boom_1000_index';
  const granularity = 3600; // 1 hour
  const appId = 1089;

  ws = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${appId}`);

  ws.onopen = () => {
    ws.send(JSON.stringify({
      candles: symbol,
      granularity,
      count: 50,
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
  ws.onclose = () => console.log('WebSocket closed.');
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
            upward: '#00f',   // Blue for bullish
            downward: '#f00'  // Red for bearish
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

  const isSpike = last.y[1] - last.y[0] > (prev.y[1] - prev.y[0]) * 1.5;
  if (isSpike) {
    signalEl.textContent = '🚨 Spike detected!';
    siren.play();
  } else {
    signalEl.textContent = 'Monitoring for spikes...';
  }
}

connect();
