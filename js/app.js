// PercentPath learner app: hash router + screens.
var App = (function () {
  var app = document.getElementById('app');
  var ui = { hints: 0, answered: false, selected: null };

  function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function strip(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent; }
  function $(sel) { return app.querySelector(sel); }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function speakBtn(text) {
    if (!('speechSynthesis' in window)) return '';
    return '<button class="btn ghost small" data-speak="' + esc(strip(text)) + '" title="Read aloud">🔊 Read aloud</button>';
  }
  function bindSpeak() {
    app.querySelectorAll('[data-speak]').forEach(function (b) {
      b.onclick = function () { try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(b.dataset.speak); u.lang = 'en-IN'; u.rate = 0.9; speechSynthesis.speak(u); } catch (e) {} };
    });
  }
  function statusBadge(f) {
    if (!f) return '';
    if (f.status === 'approved') return '<span class="badge approved">✓ Teacher approved</span>';
    if (f.status === 'overridden') return '<span class="badge overridden">✎ Changed by teacher</span>';
    return '<span class="badge pending">⏳ Awaiting teacher review</span>';
  }
  function levelName(l) { return ['Follow-up', 'Level 1 · Basic', 'Level 2 · Two-step', 'Level 3 · Real-world challenge'][l] || ''; }
  function typeName(t) { return { mcq: 'Multiple choice', numeric: 'Calculate & type', explain: 'Explain your reasoning' }[t]; }

  /* ---------- Progress header ---------- */
  function updateProgress(show) {
    var wrap = document.getElementById('progressWrap'), stu = Store.current();
    if (!show || !stu || !stu.diag.done) { wrap.hidden = true; return; }
    wrap.hidden = false;
    var pct = Engine.progressPct(stu);
    document.getElementById('progressBar').style.width = pct + '%';
    var practice = stu.history.filter(function (h) { return !h.diag; }).length;
    document.getElementById('progressLabel').textContent = stu.name + ' · Learning progress ' + pct + '% · ' + practice + ' practice questions answered';
    document.getElementById('conceptMap').innerHTML = ['C0'].concat(CONCEPT_ORDER).map(function (k) {
      var c = stu.concepts[k], cls = c.mastered ? 'mastered' : (c.started ? 'learning' : '');
      if (stu.current.concept === k) cls += ' current';
      var lab = c.mastered ? '✓ ' : (c.started ? 'L' + c.level + ' ' : '');
      return '<span class="chip ' + cls + '">' + lab + CONCEPTS[k].short + '</span>';
    }).join('');
  }

  /* ---------- 1. Welcome & profile ---------- */
  function welcome() {
    var s = Store.get();
    var notes = function (id) { return Store.feedbackFor(id).filter(function (f) { return f.status !== 'pending' && !f.seen; }).length; };
    app.innerHTML =
      '<div class="card"><h1>Namaste! Welcome to PercentPath 👋</h1>' +
      '<p>Learn <b>percentages, discounts, profit and loss</b> using real shopping examples in rupees. The tutor changes the next question based on <b>your</b> answers.</p>' +
      '<p class="muted small">Sharing a tablet? Tap your own name so your progress stays yours.</p></div>' +
      '<div class="card"><h2>Who is learning today?</h2><div class="grid2" id="profiles">' +
      s.order.map(function (id) {
        var st = s.students[id], n = notes(id), stt = Engine.stats(st);
        return '<button class="profile" data-id="' + id + '"><span class="avatar" style="background:' + st.color + '">' + esc(st.name[0]) + '</span><span><b>' + esc(st.name) + '</b>' +
          (st.seed ? ' <span class="small muted">(sample learner)</span>' : '') + '<br><span class="small muted">' +
          (st.diag.done ? stt.attempts + ' questions · ' + stt.acc + '% correct' : 'New: start with a short check') + '</span>' +
          (n ? '<br><span class="badge overridden">' + n + ' new note' + (n > 1 ? 's' : '') + ' from teacher</span>' : '') + '</span></button>';
      }).join('') + '</div>' +
      '<form id="newForm" class="btn-row"><input type="text" id="newName" placeholder="New learner? Type your name" maxlength="20" aria-label="New learner name" style="flex:1;min-width:180px"><button class="btn primary" type="submit">Add me</button></form></div>' +
      '<div class="card persona"><h2>Designed for learners like Aarav</h2><dl>' +
      '<dt>Who</dt><dd>Aarav, 13, Class 8. A first-generation learner at an NGO after-school centre.</dd>' +
      '<dt>Device</dt><dd>A shared Android tablet in a small group, with about 20–25 minutes per session.</dd>' +
      '<dt>Knows</dt><dd>Multiplication, division, fractions and decimals.</dd>' +
      '<dt>Loves</dt><dd>Real examples about shopping, prices and discounts (his family runs a vegetable stall).</dd>' +
      '<dt>Common mistakes we watch for</dt><dd>M1: "20% off ₹500 = ₹20 off". M2: profit % found by dividing by the selling price.</dd></dl></div>';
    app.querySelectorAll('.profile').forEach(function (b) { b.onclick = function () { pick(b.dataset.id); }; });
    $('#newForm').onsubmit = function (e) { e.preventDefault(); var n = $('#newName').value.trim(); if (!n) { $('#newName').focus(); return; } var st = Store.addStudent(n); pick(st.id); };
  }
  function pick(id) {
    Store.setCurrent(id); var st = Store.current();
    if (!st.diag.done) go('#/diagnostic');
    else if (st.complete) go('#/summary');
    else if (st.pendingLesson) go('#/learn/' + st.pendingLesson);
    else go('#/practice');
  }
  function requireStudent() { var st = Store.current(); if (!st) { go('#/welcome'); return null; } return st; }

  /* ---------- Shared question renderer ---------- */
  function questionHTML(q, opts) {
    opts = opts || {};
    var input;
    if (q.type === 'mcq') input = '<div class="options" role="radiogroup">' + q.options.map(function (o, i) {
      return '<label class="option"><input type="radio" name="opt" value="' + i + '"> <span>' + esc(o.t) + '</span></label>'; }).join('') + '</div>';
    else if (q.type === 'numeric') input = '<div class="numrow">' + (q.unit === '₹' ? '<span class="unit">₹</span>' : '') +
      '<input type="text" inputmode="decimal" id="ans" autocomplete="off" placeholder="Type your answer" aria-label="Your answer">' + (q.unit === '%' ? '<span class="unit">%</span>' : '') + '</div>';
    else input = '<textarea id="ans" placeholder="Explain in your own words. Write the numbers you used and WHY." aria-label="Your explanation"></textarea>';
    return '<div class="card" id="qcard"><div class="q-meta">' + (opts.tags || '') + '<span class="tag type">' + typeName(q.type) + '</span></div>' +
      '<div class="q-prompt">' + esc(q.prompt) + '</div>' + input +
      '<div id="hintBox"></div><p id="msg" class="small" style="color:var(--bad)"></p>' +
      '<div class="btn-row"><button class="btn primary" id="submitBtn">Check my answer</button>' +
      '<button class="btn" id="hintBtn">💡 Hint (' + q.hints.length + ' left)</button>' + speakBtn(q.prompt) + '</div>' +
      '<div id="fbBox"></div></div>';
  }
  function bindQuestion(q, onSubmit) {
    ui.hints = 0; ui.answered = false;
    app.querySelectorAll('.option').forEach(function (l) { l.onclick = function () { app.querySelectorAll('.option').forEach(function (x) { x.classList.remove('selected'); }); l.classList.add('selected'); }; });
    $('#hintBtn').onclick = function () {
      if (ui.answered || ui.hints >= q.hints.length) return;
      ui.hints++;
      $('#hintBox').innerHTML += '<div class="hint">💡 Hint ' + ui.hints + ': ' + esc(q.hints[ui.hints - 1]) + '</div>';
      var left = q.hints.length - ui.hints; $('#hintBtn').textContent = left ? '💡 Another hint (' + left + ' left)' : 'No more hints';
      if (!left) $('#hintBtn').disabled = true;
    };
    $('#submitBtn').onclick = function () {
      if (ui.answered) return;
      var raw;
      if (q.type === 'mcq') { var c = app.querySelector('input[name=opt]:checked'); if (!c) { $('#msg').textContent = 'Please choose an option.'; return; } raw = +c.value; }
      else { raw = $('#ans').value.trim(); if (!raw) { $('#msg').textContent = 'Please write your answer first.'; return; } }
      var res = Engine.checkAnswer(q, raw);
      if (res.invalid) { $('#msg').textContent = 'Please type a number (for example 120 or 12.5).'; return; }
      $('#msg').textContent = '';
      ui.answered = true;
      app.querySelectorAll('#qcard input, #qcard textarea').forEach(function (i) { i.disabled = true; });
      $('#submitBtn').disabled = true; $('#hintBtn').disabled = true;
      onSubmit(res);
    };
    bindSpeak();
  }
  function feedbackHTML(q, res) {
    var h = '<div class="fb ' + (res.correct ? 'ok' : 'bad') + '"><h3>' + (res.correct ? '✅ Correct!' : '❌ Not quite') + '</h3>';
    if (q.type === 'explain') h += '<p>' + esc(res.rubric.rubricFeedback) + '</p>';
    if (res.correct) h += '<p>' + esc(q.correctFb) + '</p>';
    else if (res.tag && MISCONCEPTIONS[res.tag]) h += '<p>' + MISCONCEPTIONS[res.tag].feedback + '</p>';
    else h += '<p>Let us look at the correct working.</p>';
    h += '<p><b>Model answer:</b> ' + esc(q.modelAnswer) + '</p></div>';
    return h;
  }

  /* ---------- 2. Diagnostic ---------- */
  function diagnostic() {
    var st = requireStudent(); if (!st) return;
    if (st.diag.done) { pick(st.id); return; }
    var i = st.diag.index, q = Q[DIAGNOSTIC[i]];
    app.innerHTML = '<div class="card"><h1>Quick check: ' + (i + 1) + ' of 5</h1><p class="muted">Hi ' + esc(st.name) + '! These 5 questions help the tutor find the right starting point for you. Do your best. It is fine to make mistakes.</p>' +
      '<div class="progress"><div class="progress-bar" style="width:' + (i * 20) + '%"></div></div></div>' + questionHTML(q, { tags: '<span class="tag">Diagnostic</span>' });
    bindQuestion(q, function (res) {
      Engine.record(st, q, res, ui.hints, true); st.diag.index++; Store.save();
      var last = st.diag.index >= DIAGNOSTIC.length;
      $('#fbBox').innerHTML = feedbackHTML(q, res) + '<div class="btn-row"><button class="btn primary" id="nextBtn">' + (last ? 'See my learning path →' : 'Next question →') + '</button></div>';
      $('#nextBtn').onclick = function () {
        if (!last) { diagnostic(); return; }
        var d = Engine.finishDiagnostic(st); Store.save();
        if (d.rule === 'PREREQ') Store.enqueueFeedback({ studentId: st.id, studentName: st.name, questionId: 'D1', prompt: 'Diagnostic result', studentAnswer: 'Diagnostic ' + st.diag.score + '/5', misconception: 'PRE', kind: 'remediation', autoFeedback: MISCONCEPTIONS.PRE.feedback + ' ' + d.reason });
        diagResult(st, d);
      };
    });
  }
  function diagResult(st, d) {
    var dh = st.history.filter(function (h) { return h.diag; });
    app.innerHTML = '<div class="card"><h1>Your learning path</h1><p>You got <b>' + st.diag.score + ' out of 5</b> on the quick check.</p>' +
      '<table><tr><th>Question</th><th>Your answer</th><th>Result</th></tr>' + dh.map(function (h) {
        return '<tr><td>' + esc(Q[h.qid].prompt) + '</td><td>' + esc(h.answer) + '</td><td>' + (h.correct ? '✅' : '❌ ' + (h.tag ? '<span class="tag">' + h.tag + '</span>' : '')) + '</td></tr>'; }).join('') + '</table>' +
      decisionHTML(d) + '<div class="btn-row"><button class="btn primary" id="startBtn">Start learning →</button></div></div>';
    $('#startBtn').onclick = function () { go('#/learn/' + st.pendingLesson); };
  }

  /* ---------- Decision card (visible adaptive rule) ---------- */
  function decisionHTML(d) {
    var names = { PREREQ: 'Outcome 3 · Prerequisite instruction', ALT: 'Outcome 2 · Alternative explanation', HARDER: 'Outcome 1 · Harder question', PRACTISE: 'Practise at the same level', RETURN: 'Back on track after the prerequisite', START: 'Starting point chosen' };
    return '<div class="decision"><div class="rule">🧭 WHY THIS NEXT? ' + (names[d.rule] || d.rule) + '</div><h3 style="margin:6px 0">' + esc(d.title) + '</h3><p>' + d.reason + '</p>' +
      '<details><summary class="small">Evidence the tutor used</summary><ul class="small">' + d.evidence.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>' +
      '<p class="small muted">The tutor checks these rules in order: 1) prerequisite gap → 2) known misconception → 3) 2 correct in a row → harder → 4) otherwise practise. <a href="#/about">See the full rule</a></p></details></div>';
  }

  /* ---------- 3. Concept learning ---------- */
  function learn(conceptId) {
    var st = requireStudent(); if (!st) return;
    var c = CONCEPTS[conceptId]; if (!c) { go('#/practice'); return; }
    var prereq = st.mode.type === 'prereq' && conceptId === 'C0';
    app.innerHTML = (prereq ? '<div class="banner pre">⬅ Outcome 3 · Prerequisite instruction: we are stepping back to strengthen the basics. You will return to ' + CONCEPTS[st.mode.returnTo || 'C1'].name + ' after this.</div>' : '') +
      '<div class="card"><div class="q-meta"><span class="tag">Learn</span><span class="tag lvl">' + c.name + '</span></div><h1>' + c.name + '</h1>' +
      c.lesson.map(function (p) { return '<p>' + p + '</p>'; }).join('') +
      '<div class="remed"><b>🛒 Real-life example:</b> ' + c.example + '</div>' +
      '<div id="widget"></div>' +
      '<p class="small"><b>Words to know:</b> ' + c.gloss.map(function (g) { return '<span class="gloss">' + g + '</span>'; }).join(' ') + '</p>' +
      '<div class="btn-row"><button class="btn primary" id="practiceBtn">I am ready, let me try →</button>' + speakBtn(c.lesson.join(' ') + ' ' + c.example) + '</div></div>';
    Widgets.render($('#widget'), c.widget); bindSpeak();
    $('#practiceBtn').onclick = function () { st.pendingLesson = null; st.concepts[conceptId].started = true; Store.save(); go('#/practice'); };
    updateProgress(true);
  }

  /* ---------- 4/5. Practice + adaptive feedback ---------- */
  function teacherNotesHTML(st) {
    var items = Store.feedbackFor(st.id).filter(function (f) { return f.status !== 'pending' && !f.seen; });
    if (!items.length) return '';
    items.forEach(function (f) { f.seen = true; }); Store.save();
    return '<div class="card"><h2>📬 New notes from your teacher</h2>' + items.map(function (f) {
      return '<div class="review-item">' + statusBadge(f) + '<p class="small muted">About: ' + esc(f.prompt) + '</p>' +
        (f.status === 'overridden' ? '<div class="teacher-note"><b>Teacher says:</b> ' + esc(f.teacherText) + '</div>' : '<p>' + f.autoFeedback + '</p><p class="small">Your teacher checked this feedback and agrees.</p>') + '</div>';
    }).join('') + '</div>';
  }
  function practice() {
    var st = requireStudent(); if (!st) return;
    if (!st.diag.done) { go('#/diagnostic'); return; }
    if (st.complete) { go('#/summary'); return; }
    if (st.pendingLesson) { go('#/learn/' + st.pendingLesson); return; }
    if (!st.current.qid) { var nc = Engine.nextConcept(st) || 'C1'; st.current = { concept: nc, qid: POOLS[nc][st.concepts[nc].level][0] }; Store.save(); }
    var q = Q[st.current.qid], concept = st.current.concept, c = st.concepts[concept];
    var banner = '';
    var ld = st.lastDecision;
    if (ld && ld.shown !== true) {
      if (ld.rule === 'HARDER' && ld.next === 'question') banner = '<div class="banner up">⬆ Outcome 1 · Harder question: ' + esc(ld.title) + '</div>';
      if (ld.rule === 'RETURN') banner = '<div class="banner up">✓ ' + esc(ld.title) + '</div>';
    }
    if (q.followup) banner = '<div class="banner alt">🎯 Outcome 2 · Targeted follow-up question on: ' + MISCONCEPTIONS[q.followup].name + '</div>';
    if (st.mode.type === 'prereq') banner = '<div class="banner pre">⬅ Outcome 3 · Prerequisite check: answer one basics question correctly to return.</div>';
    var tags = '<span class="tag">' + CONCEPTS[concept].name + '</span><span class="tag lvl">' + (q.followup ? 'Follow-up' : (concept === 'C0' ? 'Basics' : levelName(c.level))) + '</span>';
    app.innerHTML = teacherNotesHTML(st) + banner + questionHTML(q, { tags: tags }) +
      '<div class="btn-row"><a class="btn ghost" href="#/learn/' + concept + '">📖 Review the lesson</a><a class="btn ghost" href="#/summary">End session & see my progress</a></div>';
    bindQuestion(q, function (res) {
      if (ld) ld.shown = true;
      var hints = ui.hints;
      var d = Engine.decide(st, q, res, hints);
      Store.save();
      var fbItem = null, html = feedbackHTML(q, res);
      if (q.type === 'explain') {
        fbItem = Store.enqueueFeedback({ studentId: st.id, studentName: st.name, questionId: q.id, prompt: q.prompt, studentAnswer: res.display, misconception: res.tag, kind: 'explanation',
          autoFeedback: res.rubric.rubricFeedback + ' Model answer: ' + q.modelAnswer });
      }
      if (d.rule === 'ALT') {
        var alt = Engine.altExplanation(d.tag), M = MISCONCEPTIONS[d.tag];
        html += '<div class="card" style="margin-top:14px"><h2>💡 Another way to think about it</h2>' +
          (alt.teacher ? '<div class="teacher-note"><b>Your teacher\'s explanation:</b> ' + esc(alt.text) + '</div>' : '<div class="remed">' + alt.text + '</div>') +
          '<div class="remed"><b>🛒 Real-life example:</b> ' + M.realExample + '</div><div id="altWidget"></div></div>';
        fbItem = fbItem || Store.enqueueFeedback({ studentId: st.id, studentName: st.name, questionId: q.id, prompt: q.prompt, studentAnswer: res.display, misconception: d.tag, kind: 'remediation',
          autoFeedback: M.feedback + ' ' + strip(alt.text) });
      }
      if (d.rule === 'PREREQ') {
        Store.enqueueFeedback({ studentId: st.id, studentName: st.name, questionId: q.id, prompt: q.prompt, studentAnswer: res.display, misconception: 'PRE', kind: 'remediation',
          autoFeedback: MISCONCEPTIONS.PRE.feedback + ' ' + strip(d.reason) });
      }
      if (fbItem) html += '<p class="small" style="margin-top:8px">' + statusBadge(fbItem) + ' Your teacher will check this feedback. Their note will appear here and on your progress page.</p>';
      html += decisionHTML(d) + '<div class="btn-row"><button class="btn primary" id="contBtn">' +
        ({ lesson: 'Go to the lesson →', complete: 'See my summary 🎉', question: d.rule === 'ALT' ? 'Try the follow-up question →' : (d.rule === 'HARDER' ? 'Bring on the harder question →' : 'Next question →') }[d.next]) + '</button></div>';
      $('#fbBox').innerHTML = html;
      if (d.rule === 'ALT') Widgets.render($('#altWidget'), MISCONCEPTIONS[d.tag].widget);
      $('#contBtn').onclick = function () { if (d.next === 'lesson') go('#/learn/' + st.pendingLesson); else if (d.next === 'complete') go('#/summary'); else practice(); window.scrollTo(0, 0); };
      $('#fbBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateProgress(true);
    });
    updateProgress(true);
  }

  /* ---------- 6. Progress summary ---------- */
  function summary() {
    var st = requireStudent(); if (!st) return;
    var s = Engine.stats(st), fbs = Store.feedbackFor(st.id);
    fbs.forEach(function (f) { if (f.status !== 'pending') f.seen = true; }); Store.save();
    var mis = ['M1', 'M2', 'PRE'].filter(function (k) { return st.misconceptions[k]; });
    function list(arr, empty) { return arr.length ? '<ul>' + arr.map(function (c) { return '<li>' + c.name + (c.attempts ? ' <span class="small muted">(' + c.attempts + ' tries, ' + Math.round(100 * (c.acc || 0)) + '% correct)</span>' : '') + '</li>'; }).join('') + '</ul>' : '<p class="muted">' + empty + '</p>'; }
    app.innerHTML = '<div class="card"><h1>' + esc(st.name) + '\'s progress' + (st.complete ? ' 🎉' : '') + '</h1>' +
      (st.complete ? '<p class="banner up">You mastered every concept in this unit. Shabash!</p>' : '') +
      '<div class="stats"><div class="stat"><b>' + s.attempts + '</b>questions tried</div><div class="stat"><b>' + s.acc + '%</b>correct overall</div>' +
      '<div class="stat"><b>' + Engine.progressPct(st) + '%</b>unit progress</div><div class="stat"><b>' + s.hints + '</b>hints used</div>' +
      '<div class="stat"><b>' + (s.diagScore !== null ? s.diagScore + '/5' : '–') + '</b>quick-check score</div><div class="stat"><b>' + (s.recentAcc !== null ? s.recentAcc + '%' : '–') + '</b>last 5 answers</div></div>' +
      '<div class="grid2"><div><h3>✅ Concepts learned</h3>' + list(s.mastered, 'Keep going. Your first mastered concept is close!') + '</div>' +
      '<div><h3>🔁 Needs revision</h3>' + list(s.improve, 'Nothing to revise right now.') + '</div></div>' +
      (s.learning.length ? '<h3>📈 In progress</h3>' + list(s.learning, '') : '') +
      '<h3>🧠 Mistakes the tutor helped you with</h3>' + (mis.length ? '<ul>' + mis.map(function (k) { return '<li><b>' + MISCONCEPTIONS[k].name + '</b>: seen ' + st.misconceptions[k] + ' time(s)</li>'; }).join('') + '</ul>' : '<p class="muted">No common mistakes found yet. Great!</p>') +
      '<div class="btn-row">' + (st.complete ? '' : '<button class="btn primary" id="contBtn">Continue learning →</button>') + '<a class="btn" href="#/welcome">Switch learner</a></div></div>' +
      '<div class="card"><h2>📬 Feedback from your teacher</h2>' + (fbs.length ? fbs.slice().reverse().map(function (f) {
        return '<div class="review-item">' + statusBadge(f) + ' <span class="small muted">' + new Date(f.ts).toLocaleString() + '</span><p class="small"><b>Question:</b> ' + esc(f.prompt) + '<br><b>Your answer:</b> ' + esc(f.studentAnswer) + '</p>' +
          (f.status === 'overridden' ? '<div class="teacher-note"><b>Teacher says:</b> ' + esc(f.teacherText) + '</div><details class="small"><summary>Original automatic feedback</summary>' + f.autoFeedback + '</details>' : '<p class="small">' + f.autoFeedback + '</p>') + '</div>';
      }).join('') : '<p class="muted">No feedback yet. Explanation answers and extra help appear here after your teacher reviews them.</p>') + '</div>' +
      '<div class="card"><h2>Recent answers</h2><div class="table-wrap"><table><tr><th>Question</th><th>Concept</th><th>Answer</th><th>Result</th><th>Hints</th></tr>' +
      st.history.slice(-10).reverse().map(function (h) { return '<tr><td class="small">' + esc(Q[h.qid].prompt.slice(0, 70)) + '…</td><td class="small">' + CONCEPTS[h.concept].short + (h.diag ? ' (check)' : '') + '</td><td>' + esc(String(h.answer).slice(0, 40)) + '</td><td>' + (h.correct ? '✅' : '❌' + (h.tag ? ' ' + h.tag : '')) + '</td><td>' + h.hints + '</td></tr>'; }).join('') +
      '</table></div></div>';
    var cb = $('#contBtn'); if (cb) cb.onclick = function () { pick(st.id); };
    updateProgress(true);
  }

  /* ---------- 9. About ---------- */
  function about() {
    app.innerHTML = '<div class="card"><h1>About PercentPath</h1>' +
      '<p><b>PercentPath</b> is an adaptive tutor for Class 8 <b>Percentages: Discounts, Profit and Loss</b>. It was built for first-generation learners who use shared tablets at NGO after-school centres.</p>' +
      '<p><b>Identity:</b> ET617 End-Semester Examination · Card P4–T9–L2–C5 · Roll No. <b>24B3019</b></p>' +
      '<h2>Educational rationale</h2><ul>' +
      '<li><b>Active learning:</b> short conversational lessons, interactive widgets (100 squares, discount slider, CP/SP bars), then practice in three formats: multiple choice, typed calculations and written explanations.</li>' +
      '<li><b>Diagnosing misconceptions:</b> wrong answers are matched to known mistakes. <b>M1</b> means a percent is treated as rupees (20% of ₹500 → ₹20). <b>M2</b> means profit % is divided by the selling price (100/500 → 20%).</li>' +
      '<li><b>Scaffolding:</b> two graded hints per question that never give the answer away, worked model answers, alternative explanations and prerequisite detours.</li>' +
      '<li><b>Familiar context:</b> rupees, markets, vegetable stalls and Diwali sales, with Hindi word chips and read-aloud for learners who read English slowly.</li>' +
      '<li><b>Teacher-in-the-loop:</b> automatic feedback waits for facilitator review. Teachers approve it or override it, and learners see the teacher\'s version.</li></ul>' +
      '<h2>How the tutor decides what comes next</h2><p>After every answer, the tutor checks these rules <b>in order</b> and shows the learner which rule fired:</p>' +
      '<div class="table-wrap"><table class="rule-table"><tr><th>#</th><th>Outcome</th><th>When</th><th>Then</th></tr>' +
      Engine.RULES.map(function (r, i) { return '<tr><td>' + (i + 1) + '</td><td>' + r.name + '</td><td>' + r.when + '</td><td>' + r.then + '</td></tr>'; }).join('') + '</table></div>' +
      '<p class="small">Why this order? A learner who lacks the foundation cannot benefit from a misconception fix. A specific misconception needs targeted help, not just more questions. Challenge comes only after demonstrated success.</p>' +
      '<h2>Honesty statement: what is and is not AI</h2><p>This version uses <b>no AI model and no external API</b>. Everything is a <b>transparent rule-based engine</b> written in JavaScript: answer matching, misconception detection from specific wrong values, a keyword rubric for explanations, and the decision rules above. The feedback labelled "automatic" is generated from templates. A proposed LLM extension (explanation grading and feedback rewording, with validation and this rule engine as the fallback) is described in the project report (REPORT.md, D6). All data stays on this device (localStorage).</p>' +
      '<h2>Demo tools</h2><p class="small">Reset all learners, teacher decisions and the sample class data to the starting state (useful before a demonstration).</p>' +
      '<button class="btn danger" id="resetBtn">Reset demo data</button> <span id="resetMsg" class="small"></span></div>';
    $('#resetBtn').onclick = function () { if (confirm('Reset all progress and teacher decisions to the starting demo data?')) { Store.reset(); $('#resetMsg').textContent = 'Demo data has been reset.'; } };
  }

  /* ---------- Router ---------- */
  function route() {
    var h = location.hash.replace(/^#\/?/, '') || 'welcome';
    var parts = h.split('/');
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      var n = a.dataset.nav; a.classList.toggle('active', n === parts[0] || (n === 'welcome' && ['diagnostic', 'learn', 'practice'].indexOf(parts[0]) !== -1));
    });
    updateProgress(false);
    switch (parts[0]) {
      case 'welcome': welcome(); break;
      case 'diagnostic': diagnostic(); break;
      case 'learn': learn(parts[1]); break;
      case 'practice': practice(); break;
      case 'summary': summary(); break;
      case 'teacher': parts[1] === 'review' ? Teacher.review(app) : Teacher.dashboard(app); break;
      case 'about': about(); break;
      default: welcome();
    }
    app.focus({ preventScroll: true }); window.scrollTo(0, 0);
  }

  Store.load();
  window.addEventListener('hashchange', route);
  route();
  return { esc: esc, go: go, statusBadge: statusBadge };
})();
