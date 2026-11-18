// PercentPath teacher dashboard + feedback approval/override (C5: teacher-in-the-loop).
var Teacher = (function () {
  var unlocked = false;
  var filter = 'pending';
  function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(ts) { return new Date(ts).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
  function badge(st) { return { pending: '<span class="badge pending">⏳ Pending</span>', approved: '<span class="badge approved">✓ Approved</span>', overridden: '<span class="badge overridden">✎ Overridden</span>' }[st]; }

  function gate(el, then) {
    if (unlocked) return true;
    el.innerHTML = '<div class="card" style="max-width:420px;margin:30px auto"><h1>Teacher area</h1><p class="muted">For NGO centre facilitators. Enter the centre PIN.</p>' +
      '<form id="pinForm"><input type="password" id="pin" inputmode="numeric" placeholder="PIN" aria-label="Teacher PIN" autocomplete="off"><p id="pinMsg" class="small" style="color:var(--bad)"></p>' +
      '<button class="btn primary" type="submit">Open dashboard</button></form><p class="small muted">Demo PIN: <b>1234</b>. This is a simple gate for a shared tablet, not real security.</p></div>';
    el.querySelector('#pinForm').onsubmit = function (e) {
      e.preventDefault();
      if (el.querySelector('#pin').value === CONFIG.TEACHER_PIN) { unlocked = true; then(el); }
      else el.querySelector('#pinMsg').textContent = 'Wrong PIN. Try again.';
    };
    el.querySelector('#pin').focus();
    return false;
  }

  function tabs(active) {
    var p = Store.get().feedbackQueue.filter(function (f) { return f.status === 'pending'; }).length;
    return '<div class="btn-row" style="margin:0 0 14px"><a class="btn ' + (active === 'dash' ? 'primary' : '') + '" href="#/teacher">📊 Class dashboard</a>' +
      '<a class="btn ' + (active === 'review' ? 'primary' : '') + '" href="#/teacher/review">📝 Review feedback (' + p + ' pending)</a></div>';
  }

  /* ---------- 7. Teacher dashboard ---------- */
  function dashboard(el) {
    if (!gate(el, dashboard)) return;
    var s = Store.get();
    var rows = s.order.map(function (id) { var st = s.students[id]; return { st: st, s: Engine.stats(st) }; });
    var active = rows.filter(function (r) { return r.s.attempts; });
    var avg = active.length ? Math.round(active.reduce(function (a, r) { return a + r.s.acc; }, 0) / active.length) : 0;
    var totM = { M1: 0, M2: 0, PRE: 0 }; rows.forEach(function (r) { ['M1', 'M2', 'PRE'].forEach(function (k) { totM[k] += r.st.misconceptions[k] || 0; }); });
    var pending = s.feedbackQueue.filter(function (f) { return f.status === 'pending'; }).length;
    el.innerHTML = tabs('dash') + '<div class="card"><h1>Class dashboard</h1><p class="muted">NGO after-school centre · Class 8 · Percentages unit. Includes the sample class data plus any live learners on this tablet.</p>' +
      '<div class="stats"><div class="stat"><b>' + rows.length + '</b>learners</div><div class="stat"><b>' + avg + '%</b>average accuracy</div>' +
      '<div class="stat"><b>' + rows.reduce(function (a, r) { return a + r.s.attempts; }, 0) + '</b>questions attempted</div><div class="stat"><b style="color:var(--warn)">' + pending + '</b>feedback awaiting review</div></div>' +
      '<h2>Student progress</h2><div class="table-wrap"><table><tr><th>Learner</th><th>Attempted</th><th>Accuracy</th><th>Progress</th><th>Concepts mastered</th><th>Needs improvement</th><th>Misconceptions</th><th>Last active</th></tr>' +
      rows.map(function (r) {
        var m = r.st.misconceptions;
        var tags = ['M1', 'M2', 'PRE'].filter(function (k) { return m[k]; }).map(function (k) { return '<span class="tag" title="' + esc(MISCONCEPTIONS[k].teacherLabel) + '">' + k + ' ×' + m[k] + '</span>'; }).join(' ');
        return '<tr><td><b>' + esc(r.st.name) + '</b>' + (r.st.seed ? '<br><span class="small muted">sample</span>' : '<br><span class="small muted">live</span>') + '</td><td>' + r.s.attempts + '</td>' +
          '<td>' + (r.s.attempts ? r.s.acc + '%' : '–') + '</td><td>' + Engine.progressPct(r.st) + '%</td>' +
          '<td class="small">' + (r.s.mastered.map(function (c) { return c.name; }).join(', ') || '–') + '</td>' +
          '<td class="small">' + (r.s.improve.map(function (c) { return c.name; }).join(', ') || '–') + '</td>' +
          '<td>' + (tags || '–') + '</td><td class="small">' + (r.s.attempts ? fmt(r.st.lastActive) : 'not started') + '</td></tr>';
      }).join('') + '</table></div></div>' +
      '<div class="card"><h2>Misconceptions identified across the class</h2><ul>' + ['M1', 'M2', 'PRE'].map(function (k) {
        var who = rows.filter(function (r) { return r.st.misconceptions[k]; }).map(function (r) { return r.st.name; });
        return '<li><b>' + esc(MISCONCEPTIONS[k].teacherLabel) + '</b>: ' + totM[k] + ' occurrence(s)' + (who.length ? ' · Learners: ' + who.join(', ') : '') + '</li>';
      }).join('') + '</ul><p class="small muted">Suggested action: group learners with the same misconception for a 5-minute guided discussion using the 100-squares or CP-bar activity.</p></div>';
  }

  /* ---------- 8. Review: approve / override + audit log ---------- */
  function review(el) {
    if (!gate(el, review)) return;
    var s = Store.get();
    var items = s.feedbackQueue.slice().reverse().filter(function (f) { return filter === 'all' || f.status === filter; });
    var tpl = Object.keys(s.templateOverrides);
    el.innerHTML = tabs('review') + '<div class="card"><h1>Review automatic feedback</h1>' +
      '<p class="muted">Feedback below was generated by PercentPath\'s <b>rule-based engine</b> (templates + keyword rubric, no AI model). Approve it, or override it with your own explanation. Learners see your decision on their feedback and progress pages.</p>' +
      '<div class="btn-row" style="margin-top:0">' + ['pending', 'approved', 'overridden', 'all'].map(function (f) { return '<button class="btn ' + (filter === f ? 'primary' : '') + '" data-filter="' + f + '">' + f[0].toUpperCase() + f.slice(1) + '</button>'; }).join('') + '</div></div>' +
      (items.length ? items.map(function (f) {
        return '<div class="review-item" id="' + f.id + '"><div class="q-meta">' + badge(f.status) + '<span class="tag">' + esc(f.studentName) + '</span><span class="tag type">' + (f.kind === 'explanation' ? 'Explanation feedback' : 'Remediation') + '</span>' +
          (f.misconception ? '<span class="tag lvl">' + f.misconception + '</span>' : '') + '<span class="small muted">' + fmt(f.ts) + '</span></div>' +
          '<p class="small"><b>Question:</b> ' + esc(f.prompt) + '</p><p class="small"><b>Student answer:</b> "' + esc(f.studentAnswer) + '"</p>' +
          (f.misconception && MISCONCEPTIONS[f.misconception] ? '<p class="small"><b>Diagnosis:</b> ' + esc(MISCONCEPTIONS[f.misconception].teacherLabel) + '</p>' : '') +
          '<div class="remed small"><b>Automatic feedback shown to learner:</b><br>' + f.autoFeedback + '</div>' +
          (f.status === 'overridden' ? '<div class="teacher-note small"><b>Your override:</b> ' + esc(f.teacherText) + '</div>' : '') +
          (f.status === 'pending' ? '<div class="btn-row"><button class="btn primary" data-approve="' + f.id + '">✓ Approve</button><button class="btn" data-open="' + f.id + '">✎ Override</button></div>' +
            '<form class="ovr" data-form="' + f.id + '" hidden><label class="small"><b>Your explanation or correction for ' + esc(f.studentName) + ':</b></label><textarea required placeholder="e.g. Rohan, think of ₹500 as five ₹100 notes. 20% means ₹20 from each note…"></textarea>' +
            (f.misconception === 'M1' || f.misconception === 'M2' ? '<label class="small" style="display:flex;gap:8px;align-items:center;margin-top:6px"><input type="checkbox" class="glob"> Also use my explanation for <b>all future learners</b> who show ' + f.misconception + '</label>' : '') +
            '<div class="btn-row"><button class="btn primary" type="submit">Save override</button><button class="btn ghost" type="button" data-cancel="' + f.id + '">Cancel</button></div></form>' : '') + '</div>';
      }).join('') : '<div class="card"><p class="muted">No ' + filter + ' feedback items.</p></div>') +
      (tpl.length ? '<div class="card"><h2>Teacher explanations in use for all learners</h2>' + tpl.map(function (k) {
        return '<div class="review-item"><b>' + esc(MISCONCEPTIONS[k].teacherLabel) + '</b><div class="teacher-note small">' + esc(s.templateOverrides[k].text) + '</div><button class="btn small" data-restore="' + k + '">Restore default explanation</button></div>'; }).join('') + '</div>' : '') +
      '<div class="card"><h2>Record of approvals and overrides</h2>' + (s.auditLog.length ? '<div class="table-wrap"><table><tr><th>When</th><th>Action</th><th>Learner</th><th>Item</th><th>By</th><th>Note</th></tr>' +
        s.auditLog.slice().reverse().map(function (a) { return '<tr><td class="small">' + fmt(a.ts) + '</td><td>' + esc(a.action) + '</td><td>' + esc(a.student) + '</td><td class="small">' + esc(a.questionId) + '</td><td>' + esc(a.teacher) + '</td><td class="small">' + esc(a.note) + '</td></tr>'; }).join('') +
        '</table></div>' : '<p class="muted">No teacher actions yet.</p>') + '</div>';

    el.querySelectorAll('[data-filter]').forEach(function (b) { b.onclick = function () { filter = b.dataset.filter; review(el); }; });
    el.querySelectorAll('[data-approve]').forEach(function (b) { b.onclick = function () { Store.approve(b.dataset.approve); review(el); }; });
    el.querySelectorAll('[data-open]').forEach(function (b) { b.onclick = function () { var f = el.querySelector('[data-form="' + b.dataset.open + '"]'); f.hidden = false; f.querySelector('textarea').focus(); }; });
    el.querySelectorAll('[data-cancel]').forEach(function (b) { b.onclick = function () { el.querySelector('[data-form="' + b.dataset.cancel + '"]').hidden = true; }; });
    el.querySelectorAll('[data-restore]').forEach(function (b) { b.onclick = function () { Store.clearTemplate(b.dataset.restore); review(el); }; });
    el.querySelectorAll('form.ovr').forEach(function (f) {
      f.onsubmit = function (e) {
        e.preventDefault(); var t = f.querySelector('textarea').value.trim(); if (!t) return;
        var g = f.querySelector('.glob'); Store.override(f.dataset.form, t, g && g.checked); review(el);
      };
    });
  }

  return { dashboard: dashboard, review: review };
})();
