# PercentPath: an adaptive percentages tutor

ET617 End-Semester · Card **P4–T9–L2–C5** · Roll No. **24B3019**

PercentPath is an adaptive tutor for Class 8 **Percentages: Discounts, Profit and Loss**. It is built for first-generation learners on shared tablets at NGO centres, and it has a teacher-in-the-loop dashboard for reviewing feedback.

- **Live:** https://et617-24B3019.vercel.app
- **Report:** [REPORT.md](REPORT.md) (D1–D8)
- **Design:** [DESIGN.md](DESIGN.md)

## Run
The app is plain HTML, CSS and JavaScript. It has no build step, no dependencies and no API keys. Open `index.html` in a browser, or deploy the folder as a static site (Vercel → Framework "Other", no build command).

## Structure
| File | Purpose |
|---|---|
| `index.html` | App shell, nav, progress bar, footer with roll number |
| `js/content.js` | Lessons, 40+ questions (MCQ, numeric, explanation), hints, model answers, misconception content |
| `js/engine.js` | Rule-based decision engine, answer and misconception checking, explanation rubric |
| `js/store.js` | localStorage persistence, seeded class, feedback queue, audit log |
| `js/app.js` | Learner screens: welcome, diagnostic, learn, practice and feedback, summary, about |
| `js/teacher.js` | Teacher dashboard, approve/override review, audit log |
| `js/widgets.js` | 100-squares grid, discount slider, CP/SP bars |
| `tools/shot.html` | Test driver used to reproduce the scenarios and take screenshots |

## Viva demo scripts
Before each run, go to **About → Reset demo data**, then choose **Aarav**.

**Scenario A: a learner who answers correctly (Outcome 1, harder question)**
1. Diagnostic: choose `1/5`, type `25`, type `100`, choose `25%`, type `400`. The tutor gives a start, placed at level 2.
2. Practice: type `90` (correct, one more to level up).
3. Explanation: *"No, Sana is wrong. 20% means 20 out of every 100, so 20% of 500 = 5 x 20 = 100 rupees"* → rubric 3/3 → **HARDER** (level 3).
4. Type `4200` → concept mastered → next concept.

**Scenario B: misconception M1 (Outcome 2, alternative explanation)**
1. Diagnostic: choose `1/5`, type `25`, type **`20`**, choose `25%`, type `480`.
2. Eggs question: type **`10`**. The answer is tagged M1, triggering **ALTERNATIVE EXPLANATION**: ₹100-notes explanation, market example and 100-squares widget.
3. Follow-up question: type `30` → "Mistake fixed".

**Scenario C: prerequisite gap (Outcome 3, prerequisite instruction)**
1. Diagnostic: choose `1/5`, type `25`, type `20`, choose `25%`, type `400`.
2. Type `2` (PRE), then choose `₹4` (PRE). The second PRE error triggers **PREREQUISITE**: the basics lesson.
3. Type `0.2` → **RETURN** to percent of a quantity.

**Alternative for Scenario C:** in the diagnostic, choose `1/20` and type `2.5`. This sends the learner straight to the prerequisite.

**Teacher-in-the-loop**
1. Open **Teacher** and enter PIN `1234`, then go to **Review feedback**.
2. **Approve** one item, and **Override** another with your own text. Optionally tick "use for all future learners".
3. Switch to the learner's **Progress** page. It shows the "Changed by teacher" note, and the record of approvals and overrides is updated.

Seeded sample learners: Priya (strong), Rohan (M1), Fatima (prerequisite gap), Sameer (M2).

## AI honesty
No AI model is used. All adaptivity is transparent rule-based JavaScript. The proposed LLM features are specified in REPORT.md D6.
