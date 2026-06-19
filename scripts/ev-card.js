'use strict';

(function () {
  const $ = (id) => document.getElementById(id);
  const speedEl = $('evcSpeed');
  const socEl = $('evcSoc');
  const powEl = $('evcPow');
  const tempEl = $('evcTemp');
  const barEl = $('evcBar');
  if (!speedEl || !socEl || !powEl || !tempEl || !barEl) return;

  let t = 0;
  let soc = 85;

  function format1(value) {
    return Number(value).toFixed(1);
  }

  function update() {
    t += 0.065;
    const speed = 75 + Math.sin(t * 1.4) * 16 + Math.sin(t * .38) * 5;
    const power = 14.5 + Math.cos(t * 1.1) * 4.7 + Math.sin(t * .55) * 2.2;
    const temp = 32 + Math.sin(t * .62) * 3 + Math.cos(t * .2) * 1.4;
    soc -= 0.006;
    if (soc < 78) soc = 85;

    speedEl.textContent = String(Math.max(0, Math.round(speed)));
    socEl.textContent = format1(soc);
    powEl.textContent = format1(Math.max(0, power));
    tempEl.textContent = String(Math.round(temp));
    barEl.style.width = `${Math.max(8, Math.min(100, soc))}%`;
  }

  update();
  setInterval(update, 950);
})();
