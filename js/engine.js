// PercentPath adaptive decision engine.
// TRANSPARENT RULE-BASED LOGIC: this is ordinary JavaScript, not an AI model.
var Engine = (function () {

  var RULES = [
    { id: 'PREREQ', name: 'Prerequisite instruction', when: '2 or more prerequisite (percent/fraction/decimal or place-value) errors in the last 4 answers, or the diagnostic shows a prerequisite gap', then: 'Go back to "Percent, fractions & decimals", teach it, ask a check question, then return' },
    { id: 'ALT', name: 'Alternative explanation', when: 'The latest answer is wrong AND matches a known misconception (M1: percent as rupees, M2: profit % on selling price)', then: 'Explain it a different way, give a real-life ₹ example, then ask a targeted follow-up question' },
    { id: 'HARDER', name: 'Harder question', when: '2 correct answers in a row at this level with at most 1 hint each (explanations need a rubric score of 2/3 or more)', then: 'Move up one difficulty level. Correct at level 3 → concept mastered → next concept' },
    { id: 'PRACTISE', name: 'Practise again', when: 'None of the above (a slip, a step mix-up, or not enough evidence yet)', then: 'Show the worked solution and give a similar question at the same level' }
  ];

  function parseNum(raw) {
    if (raw === null || raw === undefined) return NaN;
    var s = String(raw).toLowerCase().replace(/rs\.?|₹|%|,|\s|rupees?/g, '');
    if (/^-?\d+\/\d+$/.test(s)) { var p = s.split('/'); return parseFloat(p[0]) / parseFloat(p[1]); }
    return s === '' ? NaN : Number(s);
  }
  function near(a, b, tol) { return Math.abs(a - b) <= (tol || 0.011); }

  function evaluateExplanation(q, text) {
    var t = ' ' + String(text || '').toLowerCase().replace(/\s+/g, ' ') + ' ';
    var r = q.rubric;
    function any(list) { for (var i = 0; i < list.length; i++) { if (t.indexOf(list[i].toLowerCase()) !== -1) return list[i]; } return null; }
    var hit = { base: any(r.base), method: any(r.method), idea: any(r.idea) };
    var score = (hit.base ? 1 : 0) + (hit.method ? 1 : 0) + (hit.idea ? 1 : 0);
    var negation = /\b(not|wrong|incorrect|isn'?t|no)\b/.test(t);
    var agrees = r.wrongAgree && /\b(yes|is right|is correct|are right)\b/.test(t) && !negation;
    var misHit = any(r.misPatterns || []);
    var mis = null;
    if (r.misTag && (agrees || (misHit && !hit.method))) mis = r.misTag;
    var tooShort = t.trim().split(' ').length < 4;
    var correct = score >= 2 && !mis && !tooShort;
    var parts = [];
    parts.push(hit.base ? '✓ You named the right base/amount ("' + hit.base + '").' : '✗ Say which amount the percent is taken from.');
    parts.push(hit.method ? '✓ Your method/number is correct ("' + hit.method + '").' : '✗ Show the calculation with the correct numbers.');
    parts.push(hit.idea ? '✓ You explained the key idea ("' + hit.idea + '").' : '✗ Explain the idea in words (for example "out of every 100" or "compared with what was paid").');
    if (agrees) parts.push('✗ You agreed with the wrong statement.');
    if (tooShort) parts.push('✗ Please write a full sentence or two.');
    return { correct: correct, score: score, tag: mis, hits: hit, rubricFeedback: 'Rubric score ' + score + '/3. ' + parts.join(' ') };
  }

  function checkAnswer(q, raw) {
    if (q.type === 'mcq') {
      var opt = q.options[raw];
      if (!opt) return { invalid: true };
      return { correct: !!opt.ok, tag: opt.ok ? null : (opt.tag || null), display: opt.t };
    }
    if (q.type === 'numeric') {
      var v = parseNum(raw);
      if (isNaN(v)) return { invalid: true };
      var tol = q.tolerance !== undefined ? q.tolerance : 0.011;
      if (near(v, q.answer, Math.max(tol, 0.0001))) return { correct: true, tag: null, display: raw };
      var tag = null;
      Object.keys(q.traps || {}).forEach(function (k) { if (!tag && near(v, parseFloat(k), 0.011)) tag = q.traps[k]; });
      // Generic place-value detection: off by a factor of 10 or 100 → prerequisite error
      if (!tag && [10, 100].some(function (f) { return near(v * f, q.answer, 0.011) || near(v / f, q.answer, 0.011); })) tag = 'PRE';
      return { correct: false, tag: tag, display: raw };
    }
    if (q.type === 'explain') {
      var ev = evaluateExplanation(q, raw);
      return { correct: ev.correct, tag: ev.tag, display: raw, rubric: ev };
    }
  }

  function pickQuestion(stu, concept, level) {
    var pool = concept === 'C0' ? POOLS.C0[1] : POOLS[concept][level];
    var c = stu.concepts[concept];
    var unseen = pool.filter(function (id) { return c.seen.indexOf(id) === -1; });
    var id = unseen.length ? unseen[0] : pool[c.attempts % pool.length];
    if (c.seen.indexOf(id) === -1) c.seen.push(id);
    return id;
  }
  function pickFollowup(stu, tag) {
    var used = stu.history.map(function (h) { return h.qid; });
    var list = FOLLOWUPS[tag];
    var unused = list.filter(function (id) { return used.indexOf(id) === -1; });
    return unused.length ? unused[0] : list[stu.misconceptions[tag] % list.length];
  }
  function nextConcept(stu) {
    for (var i = 0; i < CONCEPT_ORDER.length; i++) if (!stu.concepts[CONCEPT_ORDER[i]].mastered) return CONCEPT_ORDER[i];
    return null;
  }

  function record(stu, q, res, hints, isDiag) {
    var concept = q.concept || stu.current.concept;
    var c = stu.concepts[concept];
    stu.history.push({ qid: q.id, concept: concept, level: q.level || c.level, type: q.type, answer: String(res.display), correct: res.correct,
      tag: res.correct ? null : res.tag, hints: hints, ts: Date.now(), diag: !!isDiag, score: res.rubric ? res.rubric.score : undefined });
    c.attempts++; c.started = true; c.hints += hints; if (res.correct) c.correct++;
    if (!res.correct && res.tag) stu.misconceptions[res.tag] = (stu.misconceptions[res.tag] || 0) + 1;
    stu.lastActive = Date.now();
    return concept;
  }

  // Apply the ordered decision rules after a practice answer. Mutates the student state.
  function decide(stu, q, res, hints) {
    var concept = record(stu, q, res, hints, false);
    var c = stu.concepts[concept];
    var d = { evidence: [] };
    d.evidence.push('Answer: ' + (res.correct ? 'correct' : 'incorrect') + (res.tag ? ' (matches ' + res.tag + ')' : ''));
    d.evidence.push('Hints used: ' + hints);

    // Inside a prerequisite detour
    if (stu.mode.type === 'prereq') {
      if (res.correct) {
        var back = stu.mode.returnTo || nextConcept(stu);
        stu.mode = { type: 'normal' }; stu.prereqClearedAt = stu.history.length;
        c.mastered = true;
        d.rule = 'RETURN'; d.title = 'Foundation fixed. Back to ' + CONCEPTS[back].name;
        d.reason = 'You answered the prerequisite check correctly, so the tutor returns you to where you were.';
        return go(stu, d, back, 'question');
      }
      d.rule = 'PRACTISE'; d.title = 'One more basics question';
      d.reason = 'The prerequisite check was not correct yet. Study the worked solution, then try a similar basics question.';
      return go(stu, d, 'C0', 'question');
    }

    // Rule 1: PREREQUISITE
    var start = Math.max(stu.prereqClearedAt || 0, stu.history.length - 4);
    var recent = stu.history.slice(start);
    var preCount = recent.filter(function (h) { return h.tag === 'PRE'; }).length;
    d.evidence.push('Prerequisite errors in last 4 answers: ' + preCount);
    if (!res.correct && preCount >= 2) {
      stu.mode = { type: 'prereq', returnTo: concept }; c.streak = 0;
      stu.concepts.C0.mastered = false;
      d.rule = 'PREREQ'; d.title = 'Let us strengthen the basics first';
      d.reason = 'You made ' + preCount + ' errors that come from mixing up percent, fractions and decimals. The tutor will teach that foundation, then bring you back.';
      return go(stu, d, 'C0', 'lesson');
    }

    // Rule 2: ALTERNATIVE EXPLANATION
    if (!res.correct && (res.tag === 'M1' || res.tag === 'M2')) {
      stu.mode = { type: 'followup', tag: res.tag }; c.streak = 0;
      d.rule = 'ALT'; d.tag = res.tag; d.title = 'Let us look at this another way';
      d.reason = 'Your answer matches a common mistake: <b>' + MISCONCEPTIONS[res.tag].name + '</b>. You will see a different explanation, a real-life example and a follow-up question.';
      stu.current = { concept: concept, qid: pickFollowup(stu, res.tag) };
      stu.pendingLesson = null; d.next = 'question';
      stu.lastDecision = d; return d;
    }

    // Rule 3: HARDER
    if (res.correct) {
      if (stu.mode.type === 'followup') { d.evidence.push('Follow-up on ' + stu.mode.tag + ' answered correctly'); stu.mode = { type: 'normal' }; }
      c.streak = hints <= 1 ? c.streak + 1 : 0;
      d.evidence.push('Correct-in-a-row at level ' + c.level + ': ' + c.streak);
      if (c.level === 3 && hints <= 1) {
        c.mastered = true; c.streak = 0;
        var nc = nextConcept(stu);
        d.rule = 'HARDER'; d.title = 'Concept mastered: ' + CONCEPTS[concept].name + '!';
        d.reason = 'You solved a level-3 (hardest) problem with at most 1 hint. ' + (nc ? 'Moving on to the next concept: ' + CONCEPTS[nc].name + '.' : 'You have mastered every concept!');
        if (!nc) { stu.complete = true; d.next = 'complete'; stu.lastDecision = d; return d; }
        return go(stu, d, nc, stu.concepts[nc].started ? 'question' : 'lesson');
      }
      if (c.streak >= 2) {
        c.level++; c.streak = 0;
        d.rule = 'HARDER'; d.title = 'Level up! Harder question (level ' + c.level + ')';
        d.reason = 'You answered 2 in a row correctly with at most 1 hint. You are ready for a more challenging problem.';
        return go(stu, d, concept, 'question');
      }
      d.rule = 'PRACTISE'; d.title = 'Correct! One more to level up';
      d.reason = hints > 1 ? 'Correct, but you used ' + hints + ' hints. Try a similar one with fewer hints to move up.' : 'One more correct answer at this level will unlock a harder question.';
      return go(stu, d, concept, 'question');
    }

    // Rule 4: PRACTISE
    c.streak = 0;
    d.rule = 'PRACTISE'; d.title = 'Study the solution, then try a similar question';
    d.reason = res.tag === 'STEP' ? 'You were partly right but stopped early or answered a different part. A similar question will help.' : 'This looks like a slip rather than a known misconception. A similar question at the same level will help.';
    return go(stu, d, concept, 'question');
  }

  function go(stu, d, concept, kind) {
    var c = stu.concepts[concept];
    stu.current = { concept: concept, qid: pickQuestion(stu, concept, c.level) };
    stu.pendingLesson = kind === 'lesson' ? concept : null;
    d.next = kind;
    stu.lastDecision = d;
    return d;
  }

  // Diagnostic placement (5 items). Returns a summary and sets the starting point.
  function finishDiagnostic(stu) {
    var diagH = stu.history.filter(function (h) { return h.diag; });
    var score = diagH.filter(function (h) { return h.correct; }).length;
    var pre = diagH.filter(function (h) { return h.tag === 'PRE'; }).length;
    var m1 = diagH.filter(function (h) { return h.tag === 'M1'; }).length;
    var m2 = diagH.filter(function (h) { return h.tag === 'M2'; }).length;
    var ok = {}; diagH.forEach(function (h) { ok[h.qid] = h.correct; });
    stu.diag.done = true; stu.diag.score = score;
    // diagnostic attempts should not count toward concept streaks; reset counters but keep seen lists empty
    ['C0', 'C1', 'C2', 'C3', 'C4'].forEach(function (k) { stu.concepts[k].attempts = 0; stu.concepts[k].correct = 0; stu.concepts[k].hints = 0; stu.concepts[k].started = false; });
    var placement = [];
    if (ok.D3) { stu.concepts.C1.level = 2; placement.push('% of a quantity → start at level 2'); }
    if (ok.D5) { stu.concepts.C2.level = 2; placement.push('Discount → start at level 2'); }
    if (ok.D4) { stu.concepts.C4.level = 2; placement.push('Profit % → start at level 2'); }
    stu.prereqClearedAt = stu.history.length;
    var d = { evidence: ['Diagnostic score: ' + score + '/5', 'Prerequisite errors: ' + pre, 'M1 matches: ' + m1, 'M2 matches: ' + m2] };
    if (pre >= 2 || (!ok.D1 && !ok.D2)) {
      stu.mode = { type: 'prereq', returnTo: 'C1' };
      d.rule = 'PREREQ'; d.title = 'We will start with the basics';
      d.reason = 'The diagnostic shows a gap in percent ↔ fraction ↔ decimal. The tutor teaches this foundation first, then moves to percent of a quantity.';
      return go(stu, d, 'C0', 'lesson');
    }
    d.rule = 'START'; d.title = 'Your learning path is ready';
    d.reason = 'Your basics look fine, so you will start with percent of a quantity.' +
      (m1 ? ' The tutor noticed the "percent = rupees" mistake and will watch for it.' : '') +
      (m2 ? ' The tutor noticed profit % being found on the selling price and will watch for it.' : '') +
      (placement.length ? ' Placement: ' + placement.join('; ') + '.' : '');
    return go(stu, d, 'C1', 'lesson');
  }

  function stats(stu) {
    var h = stu.history;
    var attempts = h.length, correct = h.filter(function (x) { return x.correct; }).length;
    var hints = h.reduce(function (a, x) { return a + (x.hints || 0); }, 0);
    var mastered = [], improve = [], learning = [];
    ['C0', 'C1', 'C2', 'C3', 'C4'].forEach(function (k) {
      var ch = h.filter(function (x) { return x.concept === k && !x.diag; });
      var cc = ch.filter(function (x) { return x.correct; }).length;
      var acc = ch.length ? cc / ch.length : null;
      var obj = { id: k, name: CONCEPTS[k].name, attempts: ch.length, acc: acc, level: stu.concepts[k].level };
      if (stu.concepts[k].mastered && k !== 'C0') mastered.push(obj);
      else if (k === 'C0' && stu.concepts.C0.mastered) mastered.push(obj);
      else if (ch.length && (acc < 0.6 || h.some(function (x) { return x.concept === k && x.tag && !x.correct; }))) improve.push(obj);
      else if (ch.length) learning.push(obj);
    });
    var recent = h.filter(function (x) { return !x.diag; }).slice(-5);
    return { attempts: attempts, correct: correct, acc: attempts ? Math.round(100 * correct / attempts) : 0, hints: hints,
      mastered: mastered, improve: improve, learning: learning,
      recentAcc: recent.length ? Math.round(100 * recent.filter(function (x) { return x.correct; }).length / recent.length) : null,
      diagScore: stu.diag.done ? stu.diag.score : null };
  }

  function progressPct(stu) {
    var total = CONCEPT_ORDER.length * 3, got = 0;
    CONCEPT_ORDER.forEach(function (k) { var c = stu.concepts[k]; got += c.mastered ? 3 : (c.started ? c.level - 1 : 0); });
    return Math.round(100 * got / total);
  }

  function altExplanation(tag) {
    var o = Store.get().templateOverrides[tag];
    return o ? { text: o.text, teacher: true } : { text: MISCONCEPTIONS[tag].altExplanation, teacher: false };
  }

  return { RULES: RULES, checkAnswer: checkAnswer, evaluateExplanation: evaluateExplanation, decide: decide, record: record,
    finishDiagnostic: finishDiagnostic, stats: stats, progressPct: progressPct, altExplanation: altExplanation, nextConcept: nextConcept, parseNum: parseNum };
})();
