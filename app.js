const marketSelect = document.getElementById('market');
const granularitySelect = document.getElementById('granularity');
let chart;
let ws;

function getSymbolFromValue(value) {
  if (value === 'R_50') return 'boom_500_index';
  if (value === 'R_100') return 'boom_1000_index';
  return 'boom_500_index';
}

function connectToDeriv(symbol, granularity) {
  if (ws) ws.close();

  ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');

  ws.onopen = () => {
    const candleRequest = {
      candles: symbol,
      granularity: parseInt(granularity),
      count: 100,
      subscribe: 1
    };
    ws.send(JSON.stringify(candleRequest));
  };

  ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    const candles = response.candles || response.history?.candles || [];

    if (candles.length) {
      const seriesData = candles.map(c => ({
        x: new Date(c.epoch * 1000),
        y: [
          parseFloat(c.open),
          parseFloat(c.high),
          parseFloat(c.low),
          parseFloat(c.close)
        ]
      }));
      updateChart(seriesData);
    }
  };

  ws.onerror = (err) => {
    console.error("WebSocket Error:", err);
    document.getElementById("signal").textContent = "⚠️ Connection Error";
  };

  ws.onclose = () => {
    console.warn("WebSocket Closed");
    document.getElementById("signal").textContent = "🔌 Disconnected";
  };
}

function updateChart(data) {
  if (!chart) {
    chart = new ApexCharts(document.querySelector('#chart'), {
      chart: {
        type: 'candlestick',
        height: 500,
        background: '#111',
        foreColor: '#0f0'
      },
      series: [{ data }],
      xaxis: {
        type: 'datetime'
      },
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

function update() {
  const market = getSymbolFromValue(marketSelect.value);
  const granularity = granularitySelect.value;
  connectToDeriv(market, granularity);
}

marketSelect.addEventListener('change', update);
granularitySelect.addEventListener('change', update);

update(); // initial load
