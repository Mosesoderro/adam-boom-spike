
document.addEventListener('DOMContentLoaded', () => {
  const signal = document.getElementById('signal');
  setInterval(() => {
    const spike = Math.random() < 0.1;
    signal.textContent = spike ? "🚨 Spike Incoming! Get Ready!" : "Monitoring...";
  }, 10000);
});
