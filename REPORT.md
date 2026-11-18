# PercentPath: Examination Report (D1–D8)

**ET617 End-Semester · Card P4–T9–L2–C5 · Roll No. 24B3019**
**Live app:** https://et617-24B3019.vercel.app · **Repository:** `et617-endsem-24B3019`

---

## D1 – Educational Problem
Class 8 learners often treat a percentage as a fixed number of rupees (M1). They also find profit % by dividing by the selling price instead of the cost price (M2). In both cases they have not understood that a percent is a proportion of a chosen base. First-generation learners at NGO after-school centres have no one at home to diagnose these errors. They share a few tablets for only 20–25 minutes, and the worksheets and MCQ apps they use mark answers wrong without explaining *why*. PercentPath is an adaptive tutor. It detects specific misconceptions from learners' actual answers, picks the next activity with transparent rules (harder question, alternative explanation, or prerequisite teaching), and lets the facilitator approve or override every piece of automatic feedback.

**Measurable learning outcomes**
| LO | The learner will be able to… | Measured by |
|---|---|---|
| LO1 | convert between percent, fraction and decimal, and calculate p% of a quantity | ≥ 80% correct on C0/C1 items; no M1 error in the last 3 opportunities |
| LO2 | calculate the discount and final selling price from the marked price and discount % | ≥ 80% correct on C2 items, including at least one level-3 multi-step item |
| LO3 | calculate profit/loss and profit/loss % on **cost price**, and justify the choice of base | ≥ 80% correct on C3/C4 items; explanation rubric ≥ 2/3; no M2 error in the last 2 opportunities |

**Context of use:** an NGO after-school learning centre in an urban low-income settlement. Small groups share Android tablets in Chrome, and one facilitator supervises about 25 children. Sessions last 20–25 minutes, and the facilitator reviews feedback between sessions.

## D2 – Learner Persona
| | |
|---|---|
| Name / age / class | **Aarav**, 13, Class 8, government school, Mumbai |
| Background | First-generation school learner. His parents run a vegetable stall, so he is comfortable with prices and change, but not with formal notation. |
| Prior knowledge | Multiplication, division, fractions, decimals. Shaky on percent ↔ decimal (e.g. writes 20% = 0.02). |
| Misconception 1 (M1) | A percent is an absolute amount: 20% off ₹500 → "₹20 off" (correct: ₹100). |
| Misconception 2 (M2) | Profit % is found on SP: CP ₹400, SP ₹500 → 100/500 × 100 = 20% (correct: 25%). |
| Device | Shared low-cost Android tablet; sometimes slow Wi-Fi. |
| Learning environment | NGO centre; 4–6 learners per tablet group; noisy room; one facilitator. |
| Language | Hindi at home; English-medium textbook. Reads short English sentences slowly. |
| Motivation | Wants maths that is useful for shopping, discounts and helping at the family stall. |
| Time | 20–25 minutes per session (design assumption). |
| Design implications | Profile picker for the shared tablet; short sentences; ₹ market contexts; Hindi word chips (छूट, लागत मूल्य, विक्रय मूल्य); read-aloud; large tap targets; works offline once loaded. |

## D3 – Educational Content

### One complete learning activity: "Discount at the market" (Concept C2)
1. **Learn (2 min):** a conversational card. "The marked price is the price on the tag… Discount = discount% × MP ÷ 100 … Final price = MP − discount." Worked example: ₹500 bag, 20% off, gives a ₹100 discount, so you pay ₹400. Learners move an **interactive discount slider** and see that the same percent gives a bigger rupee discount on a bigger price.
2. **Practise (L1 → L3):** numeric and MCQ questions, plus an explanation question (below), with 2 graded hints each.
3. **Feedback:** immediate, with a model answer. Misconception-specific text appears if the wrong value matches M1.
4. **Adapt:** two correct answers in a row lead to a harder question. An M1 answer leads to an alternative explanation (₹100-notes model, 100-squares widget) and a follow-up question.

### Questions (6 shown; the app contains 40+)
| # | Format | Question | Model answer | Trap answers |
|---|---|---|---|---|
| Q1 | Numeric | A pair of shoes is marked ₹500 with 20% discount. How many rupees is the discount? | 20/100 × 500 = **₹100** | 20 → M1, 480 → M1, 400 → STEP, 10/1000 → PRE |
| Q2 | MCQ | A ₹300 T-shirt has 10% off. What is the discount? (₹30 / ₹10 / ₹290 / ₹3) | **₹30** | ₹10, ₹290 → M1; ₹3 → PRE |
| Q3 | Numeric | A kurta is marked ₹800 with 25% discount. What price do you pay? | 800 − 200 = **₹600** | 775 → M1, 200 → STEP |
| Q4 | Explanation | A shop board says "Flat 20% off". A ₹500 bag and a ₹100 cap have this offer. Raju says both get ₹20 off. Explain why he is wrong and find each discount. | 20% is a part of each price, not a fixed ₹20. Bag: ₹100 off; cap: ₹20 off. | Agreeing with Raju → M1 |
| Q5 | Numeric | A vendor buys a cricket bat for ₹400 and sells it for ₹500. Profit %? | 100/400 × 100 = **25%** | 20 → M2, 100 → M1 |
| Q6 | Explanation | Ravi bought a radio for ₹400 and sold it for ₹500. Riya says profit % = 100/500 × 100 = 20%. Is she right? Explain. | No. Profit % is on cost price: 100/400 × 100 = 25%. | Agreeing / dividing by 500 → M2 |

### Feedback
- **Correct response (Q1):** "Correct! 20/100 × 500 = ₹100 off." This is followed by the decision card, e.g. "One more correct answer at this level will unlock a harder question."
- **M1 feedback (Q1 answer ₹20):** "It looks like you used the percent number as rupees. A percent is not a fixed number of rupees. It is a part out of every 100 of the price." **Alternative explanation:** "Imagine the price is made of ₹100 notes. '20% off' means the shop gives back ₹20 from every ₹100 note. A ₹500 price has five ₹100 notes, so you get back 5 × ₹20 = ₹100." **Real example:** a ₹500 saree and a ₹100 dupatta both 20% off: ₹100 vs ₹20. **Follow-up:** "A cap costs ₹200 and has 15% off. How many rupees is the discount?" (₹30).
- **M2 feedback (Q5 answer 20%):** "You divided by the selling price. Profit % compares the profit with the money that was paid, so we always divide by the cost price." **Alternative explanation:** "Think of the cost price as the money you 'put in'. For every ₹100 I put in, how much did I gain? Put in ₹400, gain ₹100 → ₹25 per ₹100 → 25%." The CP/SP bar widget shows the right and wrong calculations side by side. **Follow-up:** "A vendor pays ₹200 for a crate of mangoes and sells it for ₹250. Profit %?" (25%).
- **Hints (Q1):** "20% means ₹20 off every ₹100." → "₹500 has five ₹100s." These never state the answer.

## D4 – Working Application
**Nine connected screens/states:**
1. Welcome & learner profile
2. Diagnostic (5 items)
3. Concept learning
4. Assessment in 3 formats
5. Adaptive feedback & remediation, with the "Why this next?" card
6. Progress summary
7. Teacher dashboard
8. Teacher review: approve/override with audit log
9. About

Learner inputs (taps, numbers, free text, hints) change the state, the next question and the feedback. **C5 is visible:** every explanation answer and every remediation is queued for the teacher. The teacher can approve it or override it, optionally replacing the explanation for all future learners. The learner sees "Awaiting teacher review", "✓ Teacher approved" or "Teacher says: …". All teacher actions are logged. The **identity token 24B3019** is in the footer on every screen. Data persists in localStorage, with an in-memory fallback.

## D5 – Two Contrasting Learner Scenarios
Both scenarios can be reproduced with the exact keystrokes in README.md. Screenshots are in `screenshots/`.

| Step | Scenario A: correct learner | Scenario B: M1 learner |
|---|---|---|
| Diagnostic | 5/5 → start at **level 2** of % of a quantity (`A1-*`) | Answers ₹20 for "20% of ₹500" → M1 recorded, start at level 1 |
| Response | Correct numeric answer, then a correct explanation (rubric 3/3) (`A2-explanation-harder.png`) | Eggs question: answers **10** (10% → 10) (`B0-question.png`) |
| Tutor decision | **Outcome 1: harder question**, level 3 (`A3-harder-question.png`) | **Outcome 2: alternative explanation** with ₹100-notes model, market example, 100-squares widget (`B1-M1-alt-explanation.png`) |
| Next | Level-3 real-world item → concept mastered → next concept (`A4-concept-mastered.png`) | Targeted follow-up question (`B2-followup-question.png`) → correct → "Mistake fixed" (`B3-followup-correct.png`) |
| Teacher | Explanation feedback queued | Remediation queued; teacher overrides it (`T1-review-queue.png`); learner sees the teacher's note (`T4-learner-sees-override.png`) |

**Scenario C (Outcome 3):** two PRE errors → prerequisite decision (`C1-prereq-decision.png`) → basics lesson (`C2-prereq-lesson.png`) → check question → return (`C3-return-after-prereq.png`).

## D6 – AI Functionality Specification
**Implemented (no AI model):** every feature in the deployed app is deterministic JavaScript. The app works offline and never calls an external service, so it cannot fail because an AI service is down.

| Feature | Implemented now (rule-based) | Proposed AI enhancement |
|---|---|---|
| F1 Answer checking & misconception diagnosis | Numeric tolerance match; a per-question map of wrong values to tags (e.g. 20 → M1); generic ×10/×100 place-value detection → PRE; MCQ distractor tags | Not needed. Rules are exact and verifiable. |
| F2 Explanation evaluation | Keyword rubric (0–3): base named / correct method / key idea; agreement with the wrong claim → M1/M2 | LLM rubric grader (below) |
| F3 Feedback wording | Templates per misconception and question | LLM rewording at Class 8 reading level, with Hindi support |
| F4 Next-activity decision | Ordered rules (D7) | Kept rule-based for transparency |

**Proposed F2 call (not implemented).** It would go through a serverless function so that the key is never in the browser.
- **Input:** `{question, modelAnswer, rubric criteria, studentText}`
- **Prompt:** "You are grading a Class 8 student's explanation about percentages. Criteria: (1) names the correct base (cost price / original price); (2) uses a correct calculation; (3) explains the idea (out of 100 / compared with what was paid). Known misconceptions: M1 = percent as an absolute amount; M2 = profit % on selling price. Return ONLY JSON: `{"score":0-3,"criteria":[bool,bool,bool],"misconception":"M1"|"M2"|null,"feedback":"≤40 words, simple English, no final answer if score<2"}`. Student: «studentText»."
- **Output:** the JSON above.
- **Validation before presentation:**
  - Parse the JSON and check its schema. `score` must be an integer from 0 to 3, and `misconception` must be one of the allowed values.
  - Cross-check with the rule rubric. If they disagree by 2 or more, use the rule result.
  - Feedback must be at most 40 words. Reject it if it contains numbers that are not in the question or model answer, which guards against hallucinated arithmetic.
  - Every LLM feedback goes into the **teacher review queue** with the status pending, exactly as now.
- **Fallback:** if the call times out (>4 s), throws an error or fails validation, the existing rule-based `evaluateExplanation()` result is used. The learner never sees an error, and the teacher queue records "source: rule-based fallback".

## D7 – Pedagogical Rationale
- **How it supports learning:**
  - Active learning: a short lesson, a hands-on widget, then retrieval practice in three formats.
  - Explanation questions make learners articulate *why*, which builds conceptual understanding beyond procedures.
  - Contexts (vegetable stalls, Diwali sales, school bags) connect to Aarav's life and motivation.
- **Feedback & scaffolding:** feedback is immediate and explanatory, and every item has a model answer. Hints are graded (a nudge, then a step) and never reveal the answer; they are counted and affect level-up. Remediation explains the idea *differently* (₹100 notes, "money put in") rather than repeating it, and uses a manipulable visual. Prerequisite detours fix the foundation before moving on, and the learner is then returned to where they were.
- **The P4 decision challenge.** After every answer the tutor applies these rules in order and shows the learner which one fired:
  1. **Prerequisite:** 2 or more PRE-tagged errors in the last 4 answers, or a diagnostic prerequisite gap → teach the basics, ask a check question, return.
  2. **Alternative explanation:** the answer is wrong and matches M1 or M2 → new explanation, ₹ example, targeted follow-up question.
  3. **Harder:** 2 consecutive correct answers at the level with at most 1 hint each (explanation rubric ≥ 2/3) → level +1. Level 3 correct → mastered.
  4. **Practise:** otherwise → worked solution and a sibling item.

  **Why this order:** a learner without the foundation cannot use a misconception fix; a specific misconception needs targeted help, not more of the same; and challenge should follow only demonstrated, low-support success. Using several pieces of evidence (correctness, the specific wrong value, hints, streak, rubric) avoids reacting to a single lucky or careless answer.
- **How L2 shaped the design:**
  - Profile picker for shared tablets.
  - Short sessions: the diagnostic places strong learners at level 2.
  - Simple English with Hindi word chips and read-aloud.
  - Market contexts in ₹.
  - Large tap targets and a mobile-first layout.
  - No logins, no paid APIs, and it works offline.
- **How C5 shaped the design:**
  - The teacher has real control. Automatic feedback is provisional until reviewed.
  - Overrides replace what the learner sees, and can become the explanation for all future learners.
  - All actions are logged.
  - The dashboard surfaces misconceptions by learner, so the facilitator can group children for small-group teaching.

## D8 – Evaluation Plan
- **Design:** pre-test (5-item diagnostic) → 2–3 PercentPath sessions → post-test (a parallel 9-item paper or app test), plus a 1-week delayed retention check. N ≈ 20–25 learners at one centre.
- **Assessment items per LO:**
  - **LO1:** "Write 0.35 as a percent", "Find 15% of ₹600", "Which is more: 30% of ₹250 or 40% of ₹200?"
  - **LO2:** "₹1,200 shoes, 15% off: final price?", "₹2,000 mixer, 10% off then a ₹50 coupon", "Which shop is cheaper?"
  - **LO3:** "CP ₹160, SP ₹200: profit %?", "CP ₹200, SP ₹150: loss %?", plus one explanation item ("Is Riya right?").
- **Explanation rubric (0–3):**
  - +1: names the correct base (cost price / original price)
  - +1: correct calculation
  - +1: explains the idea (out of 100 / compared with what was paid)
  - Tagged M1/M2 if the learner agrees with the wrong claim. Two raters score 20% of scripts to check agreement.
- **Learning data collected (already logged by the app):** per-answer correctness, the wrong value and its misconception tag, difficulty level, hints used, timestamps, rubric score, decisions fired (HARDER/ALT/PREREQ), concept mastery, and teacher approvals/overrides with time to review.
- **Success criteria:**
  - Mean post-test score ≥ 80%, with a pre→post gain of ≥ 30 percentage points.
  - M1 and M2 error rates fall by ≥ 50% from diagnostic to post-test.
  - ≥ 70% of ALT follow-up questions are answered correctly.
  - ≥ 70% of PREREQ detours end with a correct check question within 2 attempts.
  - Explanation rubric ≥ 2/3 for ≥ 70% of learners.
  - Teachers review ≥ 90% of queued feedback within 24 h, and rate the dashboard as useful (≥ 4/5) in a short survey.
  - Average session fits within 25 minutes.
