# PercentPath: Design Document

**Exam card:** P4 – T9 – L2 – C5 · **Roll number:** 24B3019

## 1. Problem statement
Class 8 learners often treat a percentage as a fixed number of rupees ("20% off ₹500 = ₹20 off") rather than as a proportion of a base. They also divide by the wrong base when finding profit %. First-generation learners at NGO after-school centres have no one at home to correct these errors. They share a few tablets for short sessions. Static worksheets and MCQ apps mark answers wrong without diagnosing *why*. PercentPath is an adaptive tutor for **Percentages: Discounts, Profit and Loss**. It diagnoses misconceptions from the learner's actual answers and chooses the next step: a harder question, an alternative explanation, or prerequisite teaching. A facilitator reviews, approves or overrides the system's feedback.

## 2. Measurable learning outcomes
| LO | Statement | Success criterion |
|---|---|---|
| LO1 | Convert between percent, fraction and decimal, and calculate p% of a quantity | ≥ 80% correct on LO1 items in the final check; no M1 error in the last 3 opportunities |
| LO2 | Calculate the discount amount and the final selling price from the marked price and discount % | ≥ 80% correct on LO2 items |
| LO3 | Calculate profit/loss and profit/loss % using **cost price** as the base, and explain why | ≥ 80% correct on LO3 items; explanation rubric score ≥ 2/3; no M2 error in the last 2 opportunities |

## 3. Learner persona (L2)
- **Name:** Aarav, 13, Class 8, government school, Mumbai urban settlement.
- **Background:** First-generation school learner. His parents run a small vegetable stall, so he knows prices and bargaining but not formal notation.
- **Setting:** NGO after-school centre, 4–6 children per tablet group, a facilitator supervising ~25 children.
- **Device:** Shared, low-cost Android tablet (Chrome), sometimes with slow Wi-Fi. Several children use the same tablet one after another.
- **Time:** 20–25 minutes per session (design assumption).
- **Language:** Hindi at home, English-medium textbook. He reads simple English slowly, so the app uses short sentences and Hindi glossary chips for key terms (छूट discount, क्रय/लागत मूल्य cost price, विक्रय मूल्य selling price, लाभ profit, हानि loss).
- **Prior knowledge:** Multiplication, division, fractions, decimals.
- **Motivation:** Wants maths that helps with real shopping and with the family stall.
- **Misconceptions:**
  - **M1, percent as an absolute amount:** 20% off ₹500 → thinks the discount is ₹20 (not ₹100).
  - **M2, profit % on selling price:** CP ₹400, SP ₹500 → computes 100/500 × 100 = 20% (not 25%).
- **Prerequisite gap (PRE):** Shaky percent ↔ decimal conversion (thinks 20% = 0.02 or 2.0).

## 4. Educational content plan
| Concept | Content | Interaction |
|---|---|---|
| C0 Percent, fractions and decimals (prerequisite) | "Per cent = per hundred"; 20% = 20/100 = 1/5 = 0.20 | 100-square grid |
| C1 Percent of a quantity | p% of Q = p/100 × Q | 100-square grid with a rupee total |
| C2 Discount and final price | Discount = d% of marked price; final = MP − discount | Price-tag discount slider |
| C3 Cost price, selling price, profit and loss | SP > CP gives profit; SP < CP gives loss | CP/SP bar |
| C4 Profit % and loss % | Profit % = profit / **CP** × 100 | CP/SP bar |

Each concept has 3 difficulty levels (L1 direct, L2 two-step, L3 real-world multi-step), with MCQ, numeric and explanation items. Each item carries 2 graded hints, a model answer, correct-answer feedback, and "trap" values that identify M1, M2 or PRE errors.

## 5. Adaptive decision rule (applied in order, shown to the learner)
1. **PREREQUISITE (Outcome 3):** 2 or more PRE-tagged errors in the last 4 answers, or a prerequisite item failed in the diagnostic → teach C0, ask a check question, then return.
2. **ALTERNATIVE EXPLANATION (Outcome 2):** The latest answer is wrong and matches M1 or M2 → alternative explanation, a real-world ₹ example and a targeted follow-up question.
3. **HARDER (Outcome 1):** 2 consecutive correct answers at the current level with ≤ 1 hint (explanation rubric ≥ 2/3) → level +1. Correct at level 3 → concept mastered → next concept.
4. **PRACTISE:** Otherwise → worked solution and a similar question at the same level.

## 6. Teacher-in-the-loop (C5)
Feedback for every explanation answer and every misconception remediation goes into a review queue as *pending*. The facilitator can **approve** it or **override** it with their own text. Every action is logged. The learner sees "Awaiting teacher review", "✓ Teacher approved" or the teacher's own note. Overriding a misconception explanation can also replace that explanation for all future learners.

## 7. AI honesty
The MVP is a **rule-based engine** written in JavaScript. It uses no AI model. The proposed LLM features (explanation grading and feedback rewording) are specified in REPORT.md D6, and the rule engine is the fallback for them.
