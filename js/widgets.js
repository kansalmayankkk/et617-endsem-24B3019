// Interactive learning widgets (plain DOM, no libraries).
var Widgets = (function () {
  function rupee(n) { return '₹' + (Math.round(n * 100) / 100).toLocaleString('en-IN'); }

  // 10x10 "100 squares" grid: shade p squares; shows p% of a total.
  function grid(el, pct, total) {
    el.innerHTML = '<div class="widget"><b>Try it: 100 squares</b><p class="small muted">Tap a square to set the percent. Each square is 1 out of 100.</p>' +
      '<div class="grid100"></div><div class="gout" aria-live="polite"></div></div>';
    var g = el.querySelector('.grid100'), out = el.querySelector('.gout');
    for (var i = 1; i <= 100; i++) { var s = document.createElement('span'); s.dataset.n = i; s.setAttribute('role', 'button'); s.setAttribute('aria-label', i + ' percent'); g.appendChild(s); }
    function draw(p) {
      Array.prototype.forEach.call(g.children, function (s) { s.classList.toggle('on', +s.dataset.n <= p); });
      var line = '<b>' + p + ' out of 100 squares = ' + p + '%</b> = ' + p + '/100 = ' + (p / 100) + '.';
      if (total && total !== 100) line += '<br>' + p + '% of ' + rupee(total) + ' = ' + p + '/100 × ' + total + ' = <b>' + rupee(p * total / 100) + '</b> (not ' + rupee(p) + '!)';
      out.innerHTML = line;
    }
    g.addEventListener('click', function (e) { if (e.target.dataset.n) draw(+e.target.dataset.n); });
    draw(pct);
  }

  // Price-tag discount slider.
  function discount(el, mp, d) {
    el.innerHTML = '<div class="widget"><b>Try it: discount slider</b><p class="small muted">Move the slider and watch the discount change with the price.</p>' +
      '<label>Marked price: <select class="mp"><option>100</option><option>250</option><option selected>500</option><option>800</option><option>1200</option></select></label>' +
      '<p><label>Discount: <b class="dv"></b>%<br><input type="range" min="0" max="50" step="5" class="dr"></label></p>' +
      '<div class="pricetag dout" aria-live="polite"></div></div>';
    var sel = el.querySelector('.mp'), r = el.querySelector('.dr'), dv = el.querySelector('.dv'), out = el.querySelector('.dout');
    sel.value = String(mp); r.value = d;
    function draw() {
      var m = +sel.value, p = +r.value, disc = p * m / 100; dv.textContent = p;
      out.innerHTML = 'Tag ' + rupee(m) + ' · ' + p + '% off → Discount = ' + p + '/100 × ' + m + ' = ' + rupee(disc) + ' · <span style="color:var(--ok)">You pay ' + rupee(m - disc) + '</span>';
    }
    sel.addEventListener('change', draw); r.addEventListener('input', draw); draw();
  }

  // CP / SP bar diagram: profit shown on top of the cost price.
  function bars(el, cp, sp) {
    el.innerHTML = '<div class="widget"><b>Try it: compare with the cost price</b><p class="small muted">Change the selling price. The percent is always found on the cost price (blue bar).</p>' +
      '<label>Selling price: <b class="sv"></b><input type="range" class="sr" min="' + Math.round(cp * 0.5) + '" max="' + Math.round(cp * 1.5) + '" step="10"></label>' +
      '<div class="bars"></div><div class="bout" aria-live="polite"></div></div>';
    var r = el.querySelector('.sr'), sv = el.querySelector('.sv'), b = el.querySelector('.bars'), out = el.querySelector('.bout');
    r.value = sp;
    function draw() {
      var s = +r.value, max = cp * 1.5, diff = s - cp; sv.textContent = rupee(s);
      var cpW = 100 * cp / max, dW = 100 * Math.abs(diff) / max;
      b.innerHTML = '<div style="display:flex"><div class="bar cp" style="width:' + cpW + '%">CP ' + rupee(cp) + '</div>' +
        (diff > 0 ? '<div class="bar pr" style="width:' + dW + '%">+' + rupee(diff) + '</div>' : '') + '</div>' +
        '<div class="bar sp" style="width:' + (100 * s / max) + '%">SP ' + rupee(s) + '</div>' +
        (diff < 0 ? '<div class="bar ls" style="width:' + dW + '%">Loss ' + rupee(-diff) + '</div>' : '');
      if (diff === 0) out.innerHTML = 'No profit, no loss.';
      else out.innerHTML = (diff > 0 ? 'Profit' : 'Loss') + ' % = ' + rupee(Math.abs(diff)) + ' ÷ <b>' + rupee(cp) + ' (CP)</b> × 100 = <b>' + (Math.round(10000 * Math.abs(diff) / cp) / 100) + '%</b>' +
        '<br><span class="small muted">Wrong way (÷ SP): ' + (Math.round(10000 * Math.abs(diff) / s) / 100) + '%. That is not what we want.</span>';
    }
    r.addEventListener('input', draw); draw();
  }

  function render(el, spec) {
    if (!spec || !el) return;
    if (spec.type === 'grid') grid(el, spec.pct, spec.total);
    else if (spec.type === 'discount') discount(el, spec.mp, spec.d);
    else if (spec.type === 'bars') bars(el, spec.cp, spec.sp);
  }
  return { render: render, rupee: rupee };
})();
