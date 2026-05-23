/**
 * ev-card.js
 *
 * أربع مسؤوليات:
 *  1. دوران الحدود الكهربائية (conic-gradient angle)
 *  2. إمالة البطاقة ثلاثية الأبعاد تتبع الماوس (magnetic tilt)
 *  3. محاكاة أرقام التيليمتري الحية
 *  4. تأثير الشرارة عند الكليك
 *
 * كل شي محدود بـ #evCard — آمن للحقن داخل أي كود أكبر
 */

(function () {
  'use strict';

  // ── مراجع الـ DOM ──────────────────────────────────────────
  const root    = document.getElementById('evCard');
  if (!root) return;   // الكود ما يشتغل إذا البطاقة مش موجودة

  const inner   = root.querySelector('.evc-inner');
  const elSpeed = root.querySelector('#evcSpeed');
  const elSoc   = root.querySelector('#evcSoc');
  const elPow   = root.querySelector('#evcPow');
  const elTemp  = root.querySelector('#evcTemp');
  const elBar   = root.querySelector('#evcBar');

  // ═══════════════════════════════════════════════════════════
  // 1. دوران الحدود الكهربائية
  //    كيف تشتغل: بنغير --border-angle بـ requestAnimationFrame
  //    البطاقة عندها الـ conic-gradient يقرأ هاد المتغير
  // ═══════════════════════════════════════════════════════════
  let angle = 0;
  let borderRAF = null;

  function rotateBorder() {
    angle = (angle + 1.2) % 360;
    root.style.setProperty('--border-angle', angle + 'deg');
    borderRAF = requestAnimationFrame(rotateBorder);
  }

  // ابدأ الدوران بس لما يكون hover
  root.addEventListener('mouseenter', () => {
    if (!borderRAF) rotateBorder();
  });

  root.addEventListener('mouseleave', () => {
    cancelAnimationFrame(borderRAF);
    borderRAF = null;
    // أعد الزاوية للصفر بشكل سلس عند الخروج
    angle = 0;
    root.style.setProperty('--border-angle', '0deg');
    // إعادة الإمالة للوضع المحايد
    root.style.setProperty('--rx', '0deg');
    root.style.setProperty('--ry', '0deg');
  });


  // ═══════════════════════════════════════════════════════════
  // 2. الإمالة المغناطيسية ثلاثية الأبعاد
  //    المبدأ: نحسب موضع الماوس نسبة لمركز البطاقة،
  //    ونحوّله لزاوية دوران على محوري X و Y
  //    الحد الأقصى ±8 درجات عشان يبقى أنيق مش مبالغ
  // ═══════════════════════════════════════════════════════════
  root.addEventListener('mousemove', (e) => {
    const rect   = inner.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;   // مركز البطاقة أفقياً
    const cy     = rect.top  + rect.height / 2;   // مركز البطاقة عمودياً
    const dx     = (e.clientX - cx) / (rect.width  / 2);  // -1 لـ +1
    const dy     = (e.clientY - cy) / (rect.height / 2);  // -1 لـ +1
    const MAX    = 6;  // أقصى درجات إمالة

    // rotateY يتبع حركة الماوس أفقياً، rotateX عكس العمودي
    const ry =  dx * MAX;
    const rx = -dy * MAX;

    root.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    root.style.setProperty('--rx', rx.toFixed(2) + 'deg');
  });


  // ═══════════════════════════════════════════════════════════
  // 3. محاكاة التيليمتري
  //    سيناريوهات قيادة دائرية مع فيزياء مبسطة:
  //    idle → تسارع → كروز → فرملة تعافي → idle → ...
  //    الحرارة تزيد مع الحمل وتبرد ببطء
  // ═══════════════════════════════════════════════════════════
  const PHASES = [
    { name: 'idle',    dur: 3000,  target:  0   },
    { name: 'accel',   dur: 4500,  target:  75  },
    { name: 'cruise',  dur: 5000,  target:  75  },
    { name: 'sport',   dur: 3000,  target: 115  },
    { name: 'cruise2', dur: 4000,  target: 115  },
    { name: 'regen',   dur: 3500,  target:  25  },
    { name: 'idle2',   dur: 2500,  target:   0  },
  ];

  let phaseIdx   = 0;
  let phaseStart = Date.now();

  // حالة السيارة
  const car = {
    speed:  0,
    soc:    85.0,
    power:  0.0,
    temp:   28.0,
  };

  function tickTelemetry() {
    const now     = Date.now();
    const phase   = PHASES[phaseIdx];

    // انتقل للمرحلة الجاية إذا انتهى وقتها
    if (now - phaseStart >= phase.dur) {
      phaseIdx   = (phaseIdx + 1) % PHASES.length;
      phaseStart = now;
    }

    const target = PHASES[phaseIdx].target;
    const diff   = target - car.speed;

    // السرعة: تتقرب للهدف بسلاسة + ضجيج صغير عشان يبدو حياً
    car.speed += diff * 0.055 + (Math.random() - 0.5) * 0.6;
    car.speed  = Math.max(0, car.speed);

    // القدرة: محسوبة من السحب الهوائي + الإمالة
    const isRegen = diff < -3 && car.speed > 10;
    const isAccel = diff > 3;

    if (isRegen) {
      // فرملة تعافي: القدرة سلبية (الطاقة راجعة للبطارية)
      car.power = -(Math.abs(diff) * 1.5 + 8 + Math.random() * 5);
    } else if (isAccel) {
      // تسارع: قدرة عالية
      car.power = diff * 2.8 + car.speed * 0.9 + Math.random() * 12;
    } else {
      // كروز: قدرة للتغلب على السحب الهوائي فقط (Fd = ½ρCdAv²)
      car.power = car.speed * 0.19 + Math.random() * 2.5;
    }
    car.power = Math.max(-85, Math.min(260, car.power));

    // SOC: ينزل عند الصرف، يرتفع قليلاً عند الـ regen
    const socDelta = car.power > 0
      ? -car.power * 0.0000018
      :  Math.abs(car.power) * 0.0000009;
    car.soc = Math.max(20, Math.min(100, car.soc + socDelta));

    // الحرارة: ترتفع مع الحمل وتبرد ببطء لـ 28°C
    const heatTarget = 28 + Math.abs(car.power) * 0.06;
    car.temp += (heatTarget - car.temp) * 0.008 + (Math.random() - 0.5) * 0.08;
    car.temp  = Math.max(25, Math.min(75, car.temp));

    // ── اكتب القيم في الـ DOM ──────────────────────────────
    if (elSpeed) elSpeed.textContent = Math.round(car.speed);
    if (elSoc)   elSoc.textContent   = car.soc.toFixed(1);
    if (elTemp)  elTemp.textContent  = Math.round(car.temp);

    if (elPow) {
      elPow.textContent = car.power.toFixed(1);
      // لوّن القدرة: أخضر للـ regen، أصفر للتحذير، عادي للقيادة
      elPow.className = isRegen ? 'regen' : (car.power > 200 ? 'warn' : '');
    }

    // شريط التقدم = SOC
    if (elBar) {
      elBar.style.width = car.soc.toFixed(1) + '%';
      // لوّن الشريط: أحمر إذا SOC منخفض
      elBar.style.background = car.soc < 30
        ? 'linear-gradient(90deg, #ff335500, #ff3355, #ffaa00)'
        : 'linear-gradient(90deg, #00ff8800, #00ff88, #00d4ff)';
    }
  }

  setInterval(tickTelemetry, 80);


  // ═══════════════════════════════════════════════════════════
  // 4. تأثير الشرارة عند الكليك
  //    12 جزيئة تنفجر من موضع الكليك بزوايا موزعة + عشوائية
  //    كل جزيئة بلون ومسافة وحجم مختلف
  // ═══════════════════════════════════════════════════════════
  const COLORS = ['#00d4ff', '#00ff88', '#ffffff', '#00d4ff'];

  root.addEventListener('click', function (e) {
    const count = 14;

    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      spark.className = 'evc-spark';

      // الموضع يبدأ من مكان الكليك
      const size = 3 + Math.random() * 5;
      spark.style.cssText = `
        left: ${e.clientX}px;
        top:  ${e.clientY}px;
        width:  ${size}px;
        height: ${size}px;
        margin-left: ${-size/2}px;
        margin-top:  ${-size/2}px;
      `;

      // اتجاه عشوائي موزع بالتساوي حول 360 درجة
      const angle  = (i / count) * 360 + Math.random() * 26;
      const dist   = 35 + Math.random() * 60;
      const rad    = angle * Math.PI / 180;
      const color  = COLORS[Math.floor(Math.random() * COLORS.length)];

      spark.style.background = color;
      spark.style.boxShadow  = `0 0 ${size * 2}px ${color}`;
      spark.style.setProperty('--sdx', (Math.cos(rad) * dist).toFixed(1) + 'px');
      spark.style.setProperty('--sdy', (Math.sin(rad) * dist).toFixed(1) + 'px');

      document.body.appendChild(spark);

      // احذف الجزيئة بعد انتهاء الأنيميشن (550ms)
      setTimeout(() => spark.remove(), 560);
    }
  });

})();