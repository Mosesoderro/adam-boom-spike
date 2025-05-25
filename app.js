
document.addEventListener("DOMContentLoaded", () => {
  const chart = LightweightCharts.createChart(document.getElementById('chart'), {
    layout: { background: { color: '#000' }, textColor: '#0f0' },
    grid: { vertLines: { color: '#333' }, horzLines: { color: '#333' } },
    timeScale: { timeVisible: true, secondsVisible: false },
  });
  const candleSeries = chart.addCandlestickSeries();
  const signalDiv = document.getElementById('signal');

  let ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
  let candles = [];

  ws.onopen = () => {
    ws.send(JSON.stringify({
      ticks_history: "boom_500_index",
      style: "candles",
      granularity: 60,
      count: 100,
      subscribe: 1
    }));
  };

  ws.onmessage = msg => {
    const data = JSON.parse(msg.data);
    if (data.candles) {
      candles = data.candles.map(c => ({
        time: c.epoch,
        open: +c.open,
        high: +c.high,
        low: +c.low,
        close: +c.close
      }));
      candleSeries.setData(candles);
    }
    if (data.candle) {
      const c = data.candle;
      const candle = {
        time: c.epoch,
        open: +c.open,
        high: +c.high,
        low: +c.low,
        close: +c.close
      };
      candles.push(candle);
      if (candles.length > 100) candles.shift();
      candleSeries.update(candle);

      const last = candle;
      const prev = candles[candles.length - 2];
      if (prev && (prev.low - last.low) > 20) {
        signalDiv.textContent = "🚨 Spike likely in 10 seconds!";
        signalDiv.style.color = "red";
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.play();
      } else {
        signalDiv.textContent = "Monitoring for spikes...";
        signalDiv.style.color = "yellow";
      }
    }
  };
});
