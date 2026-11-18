// PercentPath persistent store (localStorage with in-memory fallback).
var Store = (function () {
  var memory = null;
  var state = null;

  function safeGet() {
    try { var raw = window.localStorage.getItem(CONFIG.STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
    catch (e) { return memory; }
  }
  function save() {
    memory = state;
    try { window.localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage blocked: memory only */ }
  }
  function uid(p) { return (p || 'id') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function newConcepts() {
    var c = {};
    ['C0', 'C1', 'C2', 'C3', 'C4'].forEach(function (k) {
      c[k] = { level: 1, streak: 0, attempts: 0, correct: 0, hints: 0, mastered: false, started: false, seen: [] };
    });
    return c;
  }
  function newStudent(name, opts) {
    opts = opts || {};
    return {
      id: opts.id || uid('stu'), name: name, color: opts.color || '#0f766e', seed: !!opts.seed,
      createdAt: Date.now(), lastActive: Date.now(),
      diag: { done: false, index: 0, answers: [] },
      concepts: newConcepts(),
      history: [], misconceptions: { M1: 0, M2: 0, PRE: 0, STEP: 0 },
      mode: { type: 'normal' }, current: { concept: null, qid: null },
      prereqClearedAt: 0, lastDecision: null, pendingLesson: null, complete: false
    };
  }

  /* ---------- Seeded simulated class dataset ---------- */
  function seedHistory(stu, rows) {
    var t = Date.now() - 1000 * 60 * 60 * 26;
    rows.forEach(function (r, i) {
      var q = Q[r[0]];
      var concept = q.concept || r[4] || 'C1';
      stu.history.push({ qid: r[0], concept: concept, level: q.level, type: q.type, answer: r[1], correct: r[2], tag: r[3] || null, hints: r[5] || 0, ts: t + i * 60000, decision: r[6] || null });
      var c = stu.concepts[concept]; c.attempts++; c.started = true; if (r[2]) c.correct++; c.hints += (r[5] || 0);
      if (r[3]) stu.misconceptions[r[3]]++;
    });
    stu.lastActive = t + rows.length * 60000;
  }

  function seed() {
    var s = { students: {}, order: [], currentId: null, feedbackQueue: [], auditLog: [], templateOverrides: {}, version: 1 };
    function add(stu) { s.students[stu.id] = stu; s.order.push(stu.id); return stu; }

    add(newStudent('Aarav', { id: 'aarav', color: '#0f766e', seed: false }));

    var priya = add(newStudent('Priya', { id: 'priya', color: '#7c3aed', seed: true }));
    priya.diag = { done: true, index: 5, answers: [], score: 5 };
    seedHistory(priya, [['C1-2a', '90', true], ['C1-2b', 'No. 20% means 20 out of every 100 so 5 x 20 = ₹100', true], ['C1-3a', '4200', true],
      ['C2-2a', '600', true], ['C2-2c', 'Raju is wrong, 20% of 500 is 100 and of 100 is 20, it depends on price', true], ['C2-3a', '1750', true],
      ['C3-1a', 'Profit of ₹15', true], ['C3-1b', '60', true], ['C4-1a', '25', true]]);
    ['C1', 'C2'].forEach(function (k) { priya.concepts[k].mastered = true; priya.concepts[k].level = 3; });
    priya.concepts.C3.level = 2; priya.concepts.C4.level = 1;

    var rohan = add(newStudent('Rohan', { id: 'rohan', color: '#ea580c', seed: true }));
    rohan.diag = { done: true, index: 5, answers: [], score: 2 };
    seedHistory(rohan, [['C1-1a', '10', false, 'M1', null, 1, 'ALT'], ['F-M1-a', '15', false, 'M1', 'C1', 2, 'ALT'], ['F-M1-b', '60', true, null, 'C1', 1],
      ['C1-1b', '₹40', true], ['C2-1a', '20', false, 'M1', null, 0, 'ALT'], ['F-M1-c', 'The ₹900 item (₹90 off)', true, null, 'C2']]);
    rohan.concepts.C1.level = 2;

    var fatima = add(newStudent('Fatima', { id: 'fatima', color: '#db2777', seed: true }));
    fatima.diag = { done: true, index: 5, answers: [], score: 1 };
    seedHistory(fatima, [['C0-b', '0.02', false, 'PRE', null, 2], ['C0-a', '1/4', true, null, null, 1, 'RETURN'], ['C1-1a', '2', false, 'PRE', null, 1],
      ['C1-1c', '5', false, 'PRE', null, 2, 'PREREQ'], ['C0-c', '75', true, null, null, 1, 'RETURN']]);
    fatima.concepts.C0.level = 1;

    var sameer = add(newStudent('Sameer', { id: 'sameer', color: '#2563eb', seed: true }));
    sameer.diag = { done: true, index: 5, answers: [], score: 3 };
    seedHistory(sameer, [['C1-2a', '90', true], ['C2-2a', '600', true], ['C3-1b', '60', true], ['C3-2a', '400', true],
      ['C4-1a', '20', false, 'M2', null, 0, 'ALT'], ['F-M2-a', '20', false, 'M2', 'C4', 1, 'ALT'], ['C4-2a', 'Riya is right because profit is 100 and selling price is 500 so 20%', false, 'M2']]);
    ['C1', 'C2'].forEach(function (k) { sameer.concepts[k].mastered = true; sameer.concepts[k].level = 3; });
    sameer.concepts.C3.mastered = true; sameer.concepts.C3.level = 3;

    var t0 = Date.now() - 1000 * 60 * 60 * 20;
    function fb(stuId, qid, ans, tag, kind, text, status, teacherText, mins) {
      s.feedbackQueue.push({ id: uid('fb'), studentId: stuId, studentName: s.students[stuId].name, questionId: qid, prompt: Q[qid].prompt,
        studentAnswer: ans, misconception: tag, kind: kind, autoFeedback: text, status: status, teacherText: teacherText || '', ts: t0 + (mins || 0) * 60000, seen: false });
    }
    fb('rohan', 'C1-1a', '10', 'M1', 'remediation', MISCONCEPTIONS.M1.feedback + ' ' + MISCONCEPTIONS.M1.altExplanation, 'pending', '', 1);
    fb('rohan', 'C2-1a', '20', 'M1', 'remediation', MISCONCEPTIONS.M1.feedback + ' ' + MISCONCEPTIONS.M1.altExplanation, 'pending', '', 9);
    fb('sameer', 'C4-1a', '20', 'M2', 'remediation', MISCONCEPTIONS.M2.feedback + ' ' + MISCONCEPTIONS.M2.altExplanation, 'pending', '', 20);
    fb('sameer', 'C4-2a', 'Riya is right because profit is 100 and selling price is 500 so 20%', 'M2', 'explanation',
      'Rubric score 0/3. Your explanation agrees with dividing by the selling price. Profit % must be found on the cost price: 100/400 × 100 = 25%.', 'pending', '', 25);
    fb('fatima', 'C1-1c', '5', 'PRE', 'remediation', MISCONCEPTIONS.PRE.feedback + ' Moving back to the basics: percent, fractions and decimals.', 'pending', '', 30);
    fb('priya', 'C1-2b', 'No. 20% means 20 out of every 100 so 5 x 20 = ₹100', null, 'explanation', 'Rubric score 3/3. Excellent: you named the base, used the correct method and explained "out of every 100".', 'approved', '', 2);
    s.auditLog.push({ ts: t0 + 3 * 60000, action: 'approved', feedbackId: s.feedbackQueue[5].id, student: 'Priya', questionId: 'C1-2b', teacher: 'Facilitator', note: 'Approved as written.' });
    return s;
  }

  function load() { state = safeGet() || seed(); save(); return state; }
  function reset() { state = seed(); save(); return state; }

  return {
    load: load, save: save, reset: reset, newStudent: newStudent, uid: uid,
    get: function () { return state || load(); },
    current: function () { var s = this.get(); return s.currentId ? s.students[s.currentId] : null; },
    setCurrent: function (id) { var s = this.get(); s.currentId = id; save(); },
    addStudent: function (name) {
      var s = this.get(); var colors = ['#0f766e', '#7c3aed', '#ea580c', '#db2777', '#2563eb', '#65a30d'];
      var stu = newStudent(name, { color: colors[s.order.length % colors.length] });
      s.students[stu.id] = stu; s.order.push(stu.id); save(); return stu;
    },
    enqueueFeedback: function (item) {
      var s = this.get(); item.id = uid('fb'); item.status = 'pending'; item.teacherText = ''; item.ts = Date.now(); item.seen = false;
      s.feedbackQueue.push(item); save(); return item;
    },
    feedbackFor: function (studentId) { return this.get().feedbackQueue.filter(function (f) { return f.studentId === studentId; }); },
    approve: function (id, note) {
      var s = this.get(); var f = s.feedbackQueue.filter(function (x) { return x.id === id; })[0]; if (!f) return;
      var before = f.status; f.status = 'approved'; f.reviewedAt = Date.now(); f.seen = false;
      s.auditLog.push({ ts: Date.now(), action: 'approved', feedbackId: id, student: f.studentName, questionId: f.questionId, teacher: 'Facilitator', note: note || 'Approved as written.', before: before });
      save();
    },
    override: function (id, text, applyGlobal) {
      var s = this.get(); var f = s.feedbackQueue.filter(function (x) { return x.id === id; })[0]; if (!f) return;
      var before = f.status; f.status = 'overridden'; f.teacherText = text; f.reviewedAt = Date.now(); f.seen = false;
      if (applyGlobal && f.misconception && (f.misconception === 'M1' || f.misconception === 'M2')) {
        s.templateOverrides[f.misconception] = { text: text, ts: Date.now() };
      }
      s.auditLog.push({ ts: Date.now(), action: applyGlobal ? 'overridden + template updated' : 'overridden', feedbackId: id, student: f.studentName, questionId: f.questionId, teacher: 'Facilitator', note: text, before: before });
      save();
    },
    clearTemplate: function (tag) {
      var s = this.get(); delete s.templateOverrides[tag];
      s.auditLog.push({ ts: Date.now(), action: 'template restored', feedbackId: '-', student: '-', questionId: tag, teacher: 'Facilitator', note: 'Default ' + tag + ' explanation restored.' });
      save();
    }
  };
})();
