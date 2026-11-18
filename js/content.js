// PercentPath educational content: concepts, lessons, questions, hints, feedback, misconceptions.
// Error tags: M1 = percent treated as an absolute amount; M2 = profit/loss % computed on SP;
// PRE = prerequisite (percent/fraction/decimal or place-value) error; STEP = incomplete/mixed-up step.

var CONCEPT_ORDER = ['C1', 'C2', 'C3', 'C4'];

var CONCEPTS = {
  C0: {
    name: 'Percent, fractions & decimals', short: 'Basics (prerequisite)',
    lesson: [
      '"Per cent" means <b>per hundred</b>. 20% simply means <b>20 out of every 100</b>.',
      'So 20% = 20/100 = 1/5 = 0.20. They are three ways of writing the same amount.',
      'To turn a decimal into a percent, multiply by 100: 0.25 → 25%. To turn a percent into a decimal, divide by 100: 20% → 0.20.'
    ],
    example: 'Think of ₹1 = 100 paise. 25 paise is 25 out of 100, so it is <b>25%</b> of a rupee, or <b>1/4</b>, or <b>0.25</b>.',
    widget: { type: 'grid', pct: 20, total: 100 },
    gloss: ['प्रतिशत = percent', 'भिन्न = fraction', 'दशमलव = decimal']
  },
  C1: {
    name: 'Percent of a quantity', short: '% of a quantity',
    lesson: [
      'To find a percent of an amount, we find that many parts <b>out of every 100</b> of the amount.',
      '<b>p% of Q = p/100 × Q</b>.',
      'Quick trick: 10% of anything = divide it by 10. So 10% of ₹500 = ₹50, and 20% = 2 × ₹50 = ₹100.'
    ],
    example: 'A vegetable stall has 500 tomatoes and 20% are sold before 9 am. 500 has five 100s. Take 20 from each 100: 5 × 20 = <b>100 tomatoes</b>, not 20!',
    widget: { type: 'grid', pct: 20, total: 500 },
    gloss: ['प्रतिशत = percent', 'मात्रा = quantity']
  },
  C2: {
    name: 'Discount & final price', short: 'Discount',
    lesson: [
      'The <b>marked price (MP)</b> is the price on the tag. A <b>discount</b> is money taken off the marked price.',
      '<b>Discount = discount% × MP ÷ 100</b>. It depends on the price, so a bigger price means a bigger discount for the same percent.',
      '<b>Final price you pay = MP − Discount</b>.'
    ],
    example: 'A school bag has a tag of ₹500 with "20% OFF". Discount = 20/100 × 500 = <b>₹100</b>. You pay 500 − 100 = <b>₹400</b>.',
    widget: { type: 'discount', mp: 500, d: 20 },
    gloss: ['छूट = discount', 'अंकित मूल्य = marked price']
  },
  C3: {
    name: 'Cost price, selling price, profit & loss', short: 'Profit & loss',
    lesson: [
      '<b>Cost price (CP)</b> is what the shopkeeper <b>paid</b> to buy something. <b>Selling price (SP)</b> is what they <b>sell</b> it for.',
      'If SP is more than CP, there is a <b>profit = SP − CP</b>.',
      'If SP is less than CP, there is a <b>loss = CP − SP</b>. Extra costs like repair or transport are added to CP.'
    ],
    example: 'Aarav\'s mother buys tomatoes at the mandi for ₹300 and sells them at her stall for ₹360. Profit = 360 − 300 = <b>₹60</b>.',
    widget: { type: 'bars', cp: 300, sp: 360 },
    gloss: ['क्रय/लागत मूल्य = cost price', 'विक्रय मूल्य = selling price', 'लाभ = profit', 'हानि = loss']
  },
  C4: {
    name: 'Profit % and loss %', short: 'Profit/loss %',
    lesson: [
      'Profit % tells us how much we gained <b>compared with the money we paid</b>, the cost price.',
      '<b>Profit % = Profit ÷ CP × 100</b> and <b>Loss % = Loss ÷ CP × 100</b>.',
      'Always divide by the <b>cost price</b>, never by the selling price. The CP is the money that was "put in".'
    ],
    example: 'A vendor buys a cricket ball for ₹400 and sells it for ₹500. Profit = ₹100. Profit % = 100 ÷ <b>400</b> × 100 = <b>25%</b>.',
    widget: { type: 'bars', cp: 400, sp: 500 },
    gloss: ['लाभ प्रतिशत = profit percent', 'क्रय मूल्य = cost price']
  }
};

var MISCONCEPTIONS = {
  M1: {
    name: 'Percent seen as rupees (absolute amount)',
    teacherLabel: 'M1: Percent treated as an absolute amount, not a proportion',
    feedback: 'It looks like you used the percent number as rupees. A percent is not a fixed number of rupees. It is a <b>part out of every 100</b> of the price.',
    altExplanation: 'Let us try another way. Imagine the price is made of ₹100 notes. "20% off" means the shop gives back <b>₹20 from every ₹100 note</b>. A ₹500 price has five ₹100 notes, so you get back 5 × ₹20 = <b>₹100</b>. The percent tells you "how many out of each hundred". The bigger the price, the bigger the discount.',
    realExample: 'At the weekly market, a ₹500 saree and a ₹100 dupatta both have "20% OFF". The saree discount is ₹100 and the dupatta discount is ₹20. Same percent, different rupees!',
    widget: { type: 'grid', pct: 20, total: 500 }
  },
  M2: {
    name: 'Profit % calculated on selling price',
    teacherLabel: 'M2: Profit/loss % calculated on selling price instead of cost price',
    feedback: 'You divided by the <b>selling price</b>. Profit % compares the profit with the money that was <b>paid</b>, so we always divide by the <b>cost price</b>.',
    altExplanation: 'Think of the cost price as the money you "put in". Profit % asks: <b>for every ₹100 I put in, how much did I gain?</b> If you put in ₹400 and gained ₹100, then each ₹100 you put in earned ₹25. That is <b>25%</b>. The selling price is what you got back. It is not what you invested.',
    realExample: 'Aarav\'s mother pays ₹400 at the mandi for a crate of onions and sells it for ₹500. She invested ₹400, so her profit % = 100 ÷ 400 × 100 = 25%. Dividing by ₹500 (20%) would hide part of her gain.',
    widget: { type: 'bars', cp: 400, sp: 500 }
  },
  PRE: {
    name: 'Prerequisite gap: percent ↔ fraction ↔ decimal',
    teacherLabel: 'PRE: Prerequisite gap in percent/fraction/decimal conversion or place value',
    feedback: 'This answer suggests a mix-up between percent, fraction and decimal (for example 20% written as 0.02 instead of 0.20), or a place-value slip.'
  },
  STEP: {
    name: 'Incomplete step',
    feedback: 'You did part of the working correctly but stopped early or mixed up which amount was asked for (for example, the discount instead of the final price). Read the question again: what exactly is being asked?'
  }
};

// Explanation rubric helper keyword sets
var Q = {};
function addQ(q) { Q[q.id] = q; }

/* ---------- Diagnostic ---------- */
var DIAGNOSTIC = ['D1', 'D2', 'D3', 'D4', 'D5'];
addQ({ id: 'D1', concept: 'C0', level: 1, type: 'mcq', prompt: 'Which fraction is the same as 20%?',
  options: [{ t: '1/5', ok: true }, { t: '1/20', tag: 'PRE' }, { t: '20/10', tag: 'PRE' }, { t: '2/100', tag: 'PRE' }],
  hints: ['Percent means "out of 100". Write 20% as a fraction over 100.', '20/100. Now simplify by dividing top and bottom by 20.'],
  correctFb: 'Yes! 20% = 20/100 = 1/5.', modelAnswer: '20% = 20/100 = 1/5' });
addQ({ id: 'D2', concept: 'C0', level: 1, type: 'numeric', unit: '%', prompt: 'Write the decimal 0.25 as a percentage.', answer: 25,
  traps: { '2.5': 'PRE', '0.25': 'PRE', '250': 'PRE' },
  hints: ['To change a decimal into a percent, multiply by 100.', '0.25 × 100 = ?'],
  correctFb: 'Correct. 0.25 × 100 = 25%.', modelAnswer: '0.25 × 100 = 25%' });
addQ({ id: 'D3', concept: 'C1', level: 1, type: 'numeric', unit: '₹', prompt: 'A school bag costs ₹500. It has a 20% discount. How many rupees is the discount?', answer: 100,
  traps: { '20': 'M1', '480': 'M1', '400': 'STEP', '10': 'PRE', '1000': 'PRE' },
  hints: ['20% means ₹20 out of every ₹100.', 'How many ₹100s are in ₹500? Take ₹20 from each.'],
  correctFb: 'Correct! 20/100 × 500 = ₹100.', modelAnswer: '20/100 × 500 = ₹100' });
addQ({ id: 'D4', concept: 'C4', level: 1, type: 'mcq', prompt: 'A vendor buys a toy for ₹400 and sells it for ₹500. What is the profit percentage?',
  options: [{ t: '25%', ok: true }, { t: '20%', tag: 'M2' }, { t: '100%', tag: 'M1' }, { t: '125%', tag: 'STEP' }],
  hints: ['First find the profit in rupees: SP − CP.', 'Profit % = profit ÷ cost price × 100.'],
  correctFb: 'Correct! Profit ₹100, and 100 ÷ 400 × 100 = 25%.', modelAnswer: 'Profit = 500 − 400 = ₹100; 100/400 × 100 = 25%' });
addQ({ id: 'D5', concept: 'C2', level: 1, type: 'numeric', unit: '₹', prompt: 'A kurta has a marked price of ₹500 and 20% off. How much will you pay?', answer: 400,
  traps: { '480': 'M1', '100': 'STEP', '20': 'M1' },
  hints: ['First find the discount: 20% of ₹500.', 'Final price = marked price − discount.'],
  correctFb: 'Correct! Discount ₹100, so you pay ₹400.', modelAnswer: 'Discount = 20/100 × 500 = ₹100; pay 500 − 100 = ₹400' });

/* ---------- C0 Prerequisite pool ---------- */
addQ({ id: 'C0-a', concept: 'C0', level: 1, type: 'mcq', prompt: 'Which fraction is the same as 25%?',
  options: [{ t: '1/4', ok: true }, { t: '1/25', tag: 'PRE' }, { t: '25/10', tag: 'PRE' }, { t: '4/1', tag: 'PRE' }],
  hints: ['25% = 25/100.', 'Divide top and bottom by 25.'], correctFb: 'Yes! 25/100 = 1/4. That is a quarter, like 25 paise in a rupee.', modelAnswer: '25% = 25/100 = 1/4' });
addQ({ id: 'C0-b', concept: 'C0', level: 1, type: 'numeric', prompt: 'Write 20% as a decimal.', answer: 0.2, tolerance: 0.0001,
  traps: { '0.02': 'PRE', '2': 'PRE', '20': 'PRE', '2.0': 'PRE' },
  hints: ['To change a percent to a decimal, divide by 100.', '20 ÷ 100: move the decimal point two places left.'],
  correctFb: 'Correct! 20% = 20 ÷ 100 = 0.20 (the same as 0.2).', modelAnswer: '20 ÷ 100 = 0.2' });
addQ({ id: 'C0-c', concept: 'C0', level: 1, type: 'numeric', unit: '%', prompt: 'Write the fraction 3/4 as a percentage.', answer: 75,
  traps: { '0.75': 'PRE', '34': 'PRE', '7.5': 'PRE', '43': 'PRE' },
  hints: ['A percent is "out of 100". What do you multiply 4 by to get 100?', '3/4 = ?/100. Multiply top and bottom by 25.'],
  correctFb: 'Correct! 3/4 = 75/100 = 75%.', modelAnswer: '3/4 = 75/100 = 75%' });
addQ({ id: 'C0-d', concept: 'C0', level: 1, type: 'mcq', prompt: 'Which percentage is the same as the decimal 0.6?',
  options: [{ t: '60%', ok: true }, { t: '6%', tag: 'PRE' }, { t: '0.6%', tag: 'PRE' }, { t: '600%', tag: 'PRE' }],
  hints: ['Multiply the decimal by 100.', '0.6 × 100 = ?'], correctFb: 'Correct! 0.6 = 0.60 = 60/100 = 60%.', modelAnswer: '0.6 × 100 = 60%' });

/* ---------- C1 Percent of a quantity ---------- */
addQ({ id: 'C1-1a', concept: 'C1', level: 1, type: 'numeric', prompt: 'A shopkeeper has 200 eggs. 10% of them are broken. How many eggs are broken?', answer: 20,
  traps: { '10': 'M1', '190': 'STEP', '2': 'PRE', '2000': 'PRE' },
  hints: ['10% means 10 out of every 100.', '200 has two 100s. Take 10 from each.'], correctFb: 'Correct! 10/100 × 200 = 20 eggs.', modelAnswer: '10/100 × 200 = 20' });
addQ({ id: 'C1-1b', concept: 'C1', level: 1, type: 'mcq', prompt: 'What is 50% of ₹80?',
  options: [{ t: '₹40', ok: true }, { t: '₹50', tag: 'M1' }, { t: '₹30', tag: 'M1' }, { t: '₹4', tag: 'PRE' }],
  hints: ['50% is the same as one half.', 'Half of ₹80 = ?'], correctFb: 'Correct! 50% = 1/2, and half of ₹80 is ₹40.', modelAnswer: '50/100 × 80 = ₹40' });
addQ({ id: 'C1-1c', concept: 'C1', level: 1, type: 'numeric', unit: '₹', prompt: 'What is 25% of ₹200?', answer: 50,
  traps: { '25': 'M1', '175': 'M1', '5': 'PRE', '500': 'PRE' },
  hints: ['25% = 1/4.', 'One quarter of ₹200 = ?'], correctFb: 'Correct! 25/100 × 200 = ₹50.', modelAnswer: '25/100 × 200 = ₹50' });
addQ({ id: 'C1-2a', concept: 'C1', level: 2, type: 'numeric', unit: '₹', prompt: 'The learning centre collected ₹600 for a picnic. 15% was spent on snacks. How much money was spent on snacks?', answer: 90,
  traps: { '15': 'M1', '585': 'M1', '9': 'PRE', '900': 'PRE', '510': 'STEP' },
  hints: ['Find 10% first, then 5% (half of 10%).', '10% of 600 = 60, 5% = 30. Add them.'], correctFb: 'Correct! 15/100 × 600 = ₹90.', modelAnswer: '15/100 × 600 = ₹90' });
addQ({ id: 'C1-2b', concept: 'C1', level: 2, type: 'explain', prompt: 'Sana says: "20% of ₹500 is ₹20, because 20% means 20." Is Sana right? Explain in your own words and give the correct answer.',
  rubric: {
    base: ['500', 'price', 'whole', 'total', 'every 100', 'each 100', 'per 100'],
    method: ['100 rupees', '₹100', 'rs 100', 'rs. 100', '= 100', 'is 100', '20/100', '1/5', 'fifth', '5 ×', '5x', '5 x 20', '20 x 5', '20 × 5', 'five'],
    idea: ['out of 100', 'out of every', 'per hundred', 'per 100', 'every 100', 'each 100', 'not 20', 'not ₹20', 'part', 'proportion', 'hundred'],
    wrongAgree: true, misTag: 'M1', misPatterns: ['is 20 rupees', 'discount is 20', '= 20 rupees', 'answer is 20', '₹20 is correct']
  },
  hints: ['What does "per cent" mean? Per ___.', 'How many 100s are in 500? How much is taken from each 100?'],
  correctFb: 'Well explained! 20% is a proportion: 20 out of every 100.',
  modelAnswer: 'No, Sana is wrong. 20% means 20 out of every 100, not ₹20. ₹500 has five 100s, so 20% of ₹500 = 5 × 20 = ₹100 (or 20/100 × 500 = ₹100).' });
addQ({ id: 'C1-3a', concept: 'C1', level: 3, type: 'numeric', unit: '₹', prompt: 'A family earns ₹12,000 a month and spends 35% of it on food. How much money is spent on food?', answer: 4200,
  traps: { '35': 'M1', '11965': 'M1', '420': 'PRE', '42000': 'PRE', '7800': 'STEP' },
  hints: ['10% of ₹12,000 = ₹1,200.', '35% = 3 × 10% + 5%. 5% is half of 10%.'], correctFb: 'Excellent! 35/100 × 12000 = ₹4,200.', modelAnswer: '35/100 × 12000 = ₹4,200' });
addQ({ id: 'C1-3b', concept: 'C1', level: 3, type: 'mcq', prompt: 'Which is more money: 30% of ₹250 or 40% of ₹200?',
  options: [{ t: '30% of ₹250', tag: 'STEP' }, { t: '40% of ₹200', ok: true }, { t: 'Both are the same', tag: 'STEP' }, { t: 'Cannot be found', tag: 'M1' }],
  hints: ['Work out both amounts separately.', '30% of 250 = 3 × 25. 40% of 200 = 4 × 20.'], correctFb: 'Correct! 30% of ₹250 = ₹75, while 40% of ₹200 = ₹80.', modelAnswer: '30% of 250 = ₹75; 40% of 200 = ₹80, so 40% of ₹200 is more.' });

/* ---------- C2 Discount ---------- */
addQ({ id: 'C2-1a', concept: 'C2', level: 1, type: 'numeric', unit: '₹', prompt: 'A pair of shoes has a marked price of ₹500 and a 20% discount. How many rupees is the discount?', answer: 100,
  traps: { '20': 'M1', '480': 'M1', '400': 'STEP', '10': 'PRE', '1000': 'PRE' },
  hints: ['20% means ₹20 off every ₹100.', '₹500 has five ₹100s.'], correctFb: 'Correct! 20/100 × 500 = ₹100 off.', modelAnswer: '20/100 × 500 = ₹100' });
addQ({ id: 'C2-1b', concept: 'C2', level: 1, type: 'mcq', prompt: 'A ₹300 T-shirt has 10% off. What is the discount?',
  options: [{ t: '₹30', ok: true }, { t: '₹10', tag: 'M1' }, { t: '₹290', tag: 'M1' }, { t: '₹3', tag: 'PRE' }],
  hints: ['10% of any amount = amount ÷ 10.', '300 ÷ 10 = ?'], correctFb: 'Correct! 10% of ₹300 = ₹30.', modelAnswer: '10/100 × 300 = ₹30' });
addQ({ id: 'C2-1c', concept: 'C2', level: 1, type: 'numeric', unit: '₹', prompt: 'Chappals are marked ₹250 with a 20% discount. What is the discount in rupees?', answer: 50,
  traps: { '20': 'M1', '230': 'M1', '200': 'STEP', '5': 'PRE', '500': 'PRE' },
  hints: ['10% of ₹250 = ₹25.', '20% = 2 × 10%.'], correctFb: 'Correct! 20% of ₹250 = ₹50.', modelAnswer: '20/100 × 250 = ₹50' });
addQ({ id: 'C2-2a', concept: 'C2', level: 2, type: 'numeric', unit: '₹', prompt: 'A kurta has a marked price of ₹800. The shop gives a 25% discount. What price do you pay?', answer: 600,
  traps: { '775': 'M1', '25': 'M1', '200': 'STEP', '1000': 'STEP', '60': 'PRE' },
  hints: ['First find the discount: 25% (one quarter) of ₹800.', 'Then subtract the discount from ₹800.'], correctFb: 'Correct! Discount ₹200, so you pay ₹600.', modelAnswer: 'Discount = 25/100 × 800 = ₹200; pay 800 − 200 = ₹600' });
addQ({ id: 'C2-2b', concept: 'C2', level: 2, type: 'mcq', prompt: 'Shoes cost ₹1,200 with 15% off. What is the final price?',
  options: [{ t: '₹1,020', ok: true }, { t: '₹1,185', tag: 'M1' }, { t: '₹180', tag: 'STEP' }, { t: '₹1,380', tag: 'STEP' }],
  hints: ['15% = 10% + 5%. 10% of ₹1,200 = ₹120.', 'Discount = 120 + 60. Now subtract from ₹1,200.'], correctFb: 'Correct! Discount ₹180, final price ₹1,020.', modelAnswer: 'Discount = 15/100 × 1200 = ₹180; final = 1200 − 180 = ₹1,020' });
addQ({ id: 'C2-2c', concept: 'C2', level: 2, type: 'explain', prompt: 'A shop board says "Flat 20% off". A ₹500 bag and a ₹100 cap both have this offer. Raju says both items get ₹20 off. Explain why Raju is wrong and find each discount.',
  rubric: {
    base: ['500', 'price', 'each item', 'bag', 'depends'],
    method: ['₹100', '100 rupees', 'rs 100', '= 100', 'is 100', '20/100', '1/5', 'fifth'],
    idea: ['out of 100', 'per hundred', 'per 100', 'every 100', 'each 100', 'different', 'bigger', 'not the same', 'proportion', 'part'],
    wrongAgree: true, misTag: 'M1', misPatterns: ['both get 20', 'both 20', 'same discount', 'raju is right']
  },
  hints: ['Is 20% a fixed number of rupees, or a part of each price?', 'Find 20% of ₹500 and 20% of ₹100 separately.'],
  correctFb: 'Well explained! The same percent gives different rupee discounts on different prices.',
  modelAnswer: 'Raju is wrong. 20% is a part of each price (20 out of every 100), not a fixed ₹20. Bag: 20/100 × 500 = ₹100 off. Cap: 20/100 × 100 = ₹20 off. A bigger price gets a bigger discount.' });
addQ({ id: 'C2-3a', concept: 'C2', level: 3, type: 'numeric', unit: '₹', prompt: 'Diwali sale: a ₹2,000 mixer has 10% off. After the discount, you also use a ₹50 coupon. What is the final price?', answer: 1750,
  traps: { '1940': 'M1', '1800': 'STEP', '1950': 'STEP', '250': 'STEP', '1990': 'M1' },
  hints: ['First the 10% discount: 10% of ₹2,000.', 'Price after discount = 2000 − 200. Then subtract the ₹50 coupon.'], correctFb: 'Excellent multi-step work! 2000 − 200 − 50 = ₹1,750.', modelAnswer: '10% of 2000 = ₹200; 2000 − 200 = 1800; 1800 − 50 = ₹1,750' });
addQ({ id: 'C2-3b', concept: 'C2', level: 3, type: 'mcq', prompt: 'Shop A sells a jacket marked ₹600 at 25% off. Shop B sells the same jacket marked ₹550 at 10% off. Where is it cheaper?',
  options: [{ t: 'Shop A', ok: true }, { t: 'Shop B', tag: 'STEP' }, { t: 'Same price in both', tag: 'STEP' }, { t: 'Shop A, because ₹25 off is more than ₹10 off', tag: 'M1' }],
  hints: ['Find the final price in each shop.', 'A: 600 − 150. B: 550 − 55.'], correctFb: 'Correct! Shop A: ₹450. Shop B: ₹495.', modelAnswer: 'A: 600 − 25% of 600 = 600 − 150 = ₹450. B: 550 − 55 = ₹495. Shop A is cheaper.' });

/* ---------- C3 CP, SP, profit & loss ---------- */
addQ({ id: 'C3-1a', concept: 'C3', level: 1, type: 'mcq', prompt: 'A fruit seller buys a watermelon for ₹40 and sells it for ₹55. What does she make?',
  options: [{ t: 'Profit of ₹15', ok: true }, { t: 'Loss of ₹15', tag: 'STEP' }, { t: 'Profit of ₹95', tag: 'STEP' }, { t: 'Profit of ₹55', tag: 'STEP' }],
  hints: ['Is the selling price more or less than the cost price?', 'Profit = SP − CP.'], correctFb: 'Correct! SP > CP, so profit = 55 − 40 = ₹15.', modelAnswer: 'SP ₹55 > CP ₹40 → profit = ₹15' });
addQ({ id: 'C3-1b', concept: 'C3', level: 1, type: 'numeric', unit: '₹', prompt: 'Aarav\'s mother buys tomatoes for ₹300 and sells all of them for ₹360. What is her profit?', answer: 60,
  traps: { '660': 'STEP', '-60': 'STEP' },
  hints: ['Which is bigger: cost price or selling price?', 'Profit = 360 − 300.'], correctFb: 'Correct! Profit = ₹60.', modelAnswer: '360 − 300 = ₹60' });
addQ({ id: 'C3-1c', concept: 'C3', level: 1, type: 'numeric', unit: '₹', prompt: 'A shopkeeper buys a toy for ₹250 but sells it for ₹210 because it got scratched. What is the loss?', answer: 40,
  traps: { '460': 'STEP', '-40': 'STEP' },
  hints: ['SP is less than CP, so it is a loss.', 'Loss = CP − SP.'], correctFb: 'Correct! Loss = 250 − 210 = ₹40.', modelAnswer: '250 − 210 = ₹40 loss' });
addQ({ id: 'C3-2a', concept: 'C3', level: 2, type: 'numeric', unit: '₹', prompt: 'Raju buys an old cycle for ₹3,500 and spends ₹300 on repairs. He sells it for ₹4,200. What is his profit?', answer: 400,
  traps: { '700': 'STEP', '1000': 'STEP' },
  hints: ['Repair money is also part of the cost price.', 'CP = 3500 + 300. Profit = SP − CP.'], correctFb: 'Correct! CP = ₹3,800, so profit = ₹400.', modelAnswer: 'CP = 3500 + 300 = ₹3,800; profit = 4200 − 3800 = ₹400' });
addQ({ id: 'C3-2b', concept: 'C3', level: 2, type: 'mcq', prompt: 'Which statement is correct?',
  options: [{ t: 'Cost price is the price at which the shopkeeper buys an item.', ok: true }, { t: 'Selling price is always more than cost price.', tag: 'STEP' }, { t: 'Profit = CP − SP.', tag: 'STEP' }, { t: 'A loss happens when SP is more than CP.', tag: 'STEP' }],
  hints: ['Think about who pays which price.', 'A shopkeeper can sometimes sell for less than they paid.'], correctFb: 'Correct! CP is the buying price.', modelAnswer: 'Cost price = price at which the shopkeeper buys.' });
addQ({ id: 'C3-3a', concept: 'C3', level: 3, type: 'numeric', unit: '₹', prompt: 'A fruit seller buys 50 bananas for ₹200 in total and sells each banana for ₹5. What is the total profit?', answer: 50,
  traps: { '1': 'STEP', '195': 'STEP', '250': 'STEP' },
  hints: ['Total SP = 50 × ₹5.', 'Profit = total SP − total CP.'], correctFb: 'Excellent! SP = ₹250, profit = ₹50.', modelAnswer: 'SP = 50 × 5 = ₹250; profit = 250 − 200 = ₹50' });
addQ({ id: 'C3-3b', concept: 'C3', level: 3, type: 'explain', prompt: 'Meena buys a dupatta for ₹350 and sells it for ₹320. Explain whether she made a profit or a loss, and how much.',
  rubric: {
    base: ['cost', 'cp', 'bought', 'buy', '350', 'paid'],
    method: ['30', '350 - 320', '350 − 320', '350-320'],
    idea: ['loss', 'less', 'lower', 'smaller'],
    wrongAgree: false, misTag: null, misPatterns: []
  },
  hints: ['Compare the price she paid with the price she sold for.', 'If SP < CP, it is a loss. Loss = CP − SP.'],
  correctFb: 'Well explained! SP < CP means a loss.',
  modelAnswer: 'She made a loss, because she sold it (₹320) for less than she paid (₹350). Loss = 350 − 320 = ₹30.' });

/* ---------- C4 Profit % and loss % ---------- */
addQ({ id: 'C4-1a', concept: 'C4', level: 1, type: 'numeric', unit: '%', prompt: 'A vendor buys a cricket bat for ₹400 and sells it for ₹500. What is the profit percentage?', answer: 25,
  traps: { '20': 'M2', '100': 'M1', '125': 'STEP', '0.25': 'PRE', '2.5': 'PRE' },
  hints: ['Profit = SP − CP = ₹100.', 'Profit % = profit ÷ COST price × 100.'], correctFb: 'Correct! 100 ÷ 400 × 100 = 25%.', modelAnswer: 'Profit = ₹100; 100/400 × 100 = 25%' });
addQ({ id: 'C4-1b', concept: 'C4', level: 1, type: 'mcq', prompt: 'A pen is bought for ₹50 and sold for ₹60. What is the profit percentage?',
  options: [{ t: '20%', ok: true }, { t: 'about 16.7%', tag: 'M2' }, { t: '10%', tag: 'M1' }, { t: '60%', tag: 'STEP' }],
  hints: ['Profit = ₹10.', 'Divide by the cost price ₹50, then × 100.'], correctFb: 'Correct! 10 ÷ 50 × 100 = 20%.', modelAnswer: '10/50 × 100 = 20%' });
addQ({ id: 'C4-1c', concept: 'C4', level: 1, type: 'numeric', unit: '%', prompt: 'A lamp is bought for ₹200 and sold for ₹150. What is the loss percentage?', answer: 25,
  traps: { '33.33': 'M2', '33.3': 'M2', '33': 'M2', '50': 'M1', '0.25': 'PRE' },
  hints: ['Loss = CP − SP = ₹50.', 'Loss % = loss ÷ cost price × 100.'], correctFb: 'Correct! 50 ÷ 200 × 100 = 25% loss.', modelAnswer: 'Loss = ₹50; 50/200 × 100 = 25%' });
addQ({ id: 'C4-2a', concept: 'C4', level: 2, type: 'explain', prompt: 'Ravi bought a radio for ₹400 and sold it for ₹500. Riya says: "Profit % = 100/500 × 100 = 20%." Is Riya right? Explain your reasoning.',
  rubric: {
    base: ['cost price', 'cost', 'cp', 'bought', 'paid', '400', 'buying'],
    method: ['100/400', '100 / 400', '100÷400', '100 ÷ 400', 'divide by 400', 'divided by 400', 'by 400', '25'],
    idea: ['out of 100', 'per 100', 'compare', 'compared', 'invested', 'put in', 'paid', 'not selling', 'not the selling', 'not sp', 'not 500', 'instead of 500', 'instead of selling'],
    wrongAgree: true, misTag: 'M2', misPatterns: ['divide by 500', 'divided by 500', 'by selling price', 'riya is right', '20% is correct']
  },
  hints: ['Which price is the money Ravi "put in"?', 'Profit % = profit ÷ cost price × 100.'],
  correctFb: 'Well reasoned! Profit % is always found on the cost price.',
  modelAnswer: 'No, Riya is wrong. Profit % must be calculated on the cost price (₹400), the money Ravi paid, not on the selling price. Profit = ₹100, so profit % = 100/400 × 100 = 25%.' });
addQ({ id: 'C4-2b', concept: 'C4', level: 2, type: 'numeric', unit: '%', prompt: 'A shopkeeper buys a mobile cover for ₹160 and sells it for ₹200. What is the profit percentage?', answer: 25,
  traps: { '20': 'M2', '40': 'M1', '125': 'STEP' },
  hints: ['Profit = 200 − 160.', 'Profit % = 40 ÷ 160 × 100.'], correctFb: 'Correct! 40 ÷ 160 × 100 = 25%.', modelAnswer: 'Profit = ₹40; 40/160 × 100 = 25%' });
addQ({ id: 'C4-3a', concept: 'C4', level: 3, type: 'numeric', unit: '%', prompt: 'A trader buys 20 kg of rice at ₹45 per kg and sells all of it at ₹54 per kg. What is the profit percentage?', answer: 20,
  traps: { '16.67': 'M2', '16.7': 'M2', '16.66': 'M2', '17': 'M2', '9': 'M1', '180': 'M1' },
  hints: ['Profit per kg = ₹9. You can work per kg or in total.', 'Profit % = 9 ÷ 45 × 100.'], correctFb: 'Excellent! 9 ÷ 45 × 100 = 20%.', modelAnswer: 'CP = ₹900, SP = ₹1,080, profit = ₹180; 180/900 × 100 = 20%' });
addQ({ id: 'C4-3b', concept: 'C4', level: 3, type: 'mcq', prompt: 'Vendor A buys a basket for ₹200 and sells it for ₹250. Vendor B buys one for ₹400 and sells it for ₹460. Who has the higher profit percentage?',
  options: [{ t: 'Vendor A', ok: true }, { t: 'Vendor B, because ₹60 profit is more than ₹50', tag: 'M1' }, { t: 'Both are equal', tag: 'STEP' }, { t: 'Vendor B, because 60/460 is bigger', tag: 'M2' }],
  hints: ['Find each profit % on its own cost price.', 'A: 50/200 × 100. B: 60/400 × 100.'], correctFb: 'Correct! A: 25%, B: 15%. More rupees does not mean a higher percentage.', modelAnswer: 'A: 50/200 × 100 = 25%; B: 60/400 × 100 = 15%. Vendor A.' });

/* ---------- Targeted follow-up questions (Outcome 2) ---------- */
var FOLLOWUPS = { M1: ['F-M1-a', 'F-M1-b', 'F-M1-c'], M2: ['F-M2-a', 'F-M2-b', 'F-M2-c'] };
addQ({ id: 'F-M1-a', concept: null, level: 0, type: 'numeric', unit: '₹', followup: 'M1', prompt: 'Follow-up: A cap costs ₹200 and has 15% off. Using "₹15 off every ₹100", how many rupees is the discount?', answer: 30,
  traps: { '15': 'M1', '185': 'M1', '3': 'PRE', '300': 'PRE' },
  hints: ['₹200 has two ₹100s.', '₹15 off each ₹100 → 2 × 15.'], correctFb: 'Yes! 2 × ₹15 = ₹30. You used the percent as a part of every 100. That is the key idea.', modelAnswer: '15/100 × 200 = ₹30' });
addQ({ id: 'F-M1-b', concept: null, level: 0, type: 'numeric', unit: '₹', followup: 'M1', prompt: 'Follow-up: A ₹300 school bag is sold with 20% off. How many rupees do you save?', answer: 60,
  traps: { '20': 'M1', '280': 'M1', '240': 'STEP', '6': 'PRE' },
  hints: ['₹20 off every ₹100.', '₹300 has three ₹100s.'], correctFb: 'Correct! 3 × ₹20 = ₹60 saved.', modelAnswer: '20/100 × 300 = ₹60' });
addQ({ id: 'F-M1-c', concept: null, level: 0, type: 'mcq', followup: 'M1', prompt: 'Follow-up: Which shop gives more rupees off: 10% off a ₹900 phone cover box, or 10% off a ₹90 notebook?',
  options: [{ t: 'The ₹900 item (₹90 off)', ok: true }, { t: 'Both give ₹10 off', tag: 'M1' }, { t: 'The ₹90 item', tag: 'M1' }, { t: 'Both give the same rupees off', tag: 'M1' }],
  hints: ['10% = one tenth of the price.', '900 ÷ 10 and 90 ÷ 10.'], correctFb: 'Correct! Same percent, but ₹90 off vs ₹9 off.', modelAnswer: '10% of 900 = ₹90; 10% of 90 = ₹9' });
addQ({ id: 'F-M2-a', concept: null, level: 0, type: 'numeric', unit: '%', followup: 'M2', prompt: 'Follow-up: A vendor pays ₹200 for a crate of mangoes and sells it for ₹250. What is the profit percentage? (Remember: compare with what was PAID.)', answer: 25,
  traps: { '20': 'M2', '50': 'M1', '125': 'STEP' },
  hints: ['Profit = ₹50. What was paid?', '50 ÷ 200 × 100.'], correctFb: 'Yes! 50 ÷ 200 × 100 = 25%. You divided by the cost price.', modelAnswer: '50/200 × 100 = 25%' });
addQ({ id: 'F-M2-b', concept: null, level: 0, type: 'numeric', unit: '%', followup: 'M2', prompt: 'Follow-up: A tailor buys cloth for ₹500 and sells the stitched shirt for ₹600. What is the profit percentage?', answer: 20,
  traps: { '16.67': 'M2', '16.7': 'M2', '17': 'M2', '100': 'M1' },
  hints: ['Profit = ₹100.', 'Divide by the cost price ₹500.'], correctFb: 'Correct! 100 ÷ 500 × 100 = 20%.', modelAnswer: '100/500 × 100 = 20%' });
addQ({ id: 'F-M2-c', concept: null, level: 0, type: 'mcq', followup: 'M2', prompt: 'Follow-up: To find profit %, which number goes at the bottom of the fraction (profit ÷ ?)?',
  options: [{ t: 'Cost price, the money paid', ok: true }, { t: 'Selling price', tag: 'M2' }, { t: '100', tag: 'PRE' }, { t: 'Profit', tag: 'STEP' }],
  hints: ['Profit % compares the gain with what was put in.', 'What did the shopkeeper put in?'], correctFb: 'Correct! Profit % = profit ÷ cost price × 100.', modelAnswer: 'Cost price' });

// Question pools by concept and level (deterministic order for reproducible viva demos)
var POOLS = {
  C0: { 1: ['C0-b', 'C0-a', 'C0-c', 'C0-d'] },
  C1: { 1: ['C1-1a', 'C1-1b', 'C1-1c'], 2: ['C1-2a', 'C1-2b'], 3: ['C1-3a', 'C1-3b'] },
  C2: { 1: ['C2-1a', 'C2-1b', 'C2-1c'], 2: ['C2-2a', 'C2-2c', 'C2-2b'], 3: ['C2-3a', 'C2-3b'] },
  C3: { 1: ['C3-1a', 'C3-1b', 'C3-1c'], 2: ['C3-2a', 'C3-2b'], 3: ['C3-3a', 'C3-3b'] },
  C4: { 1: ['C4-1a', 'C4-1b', 'C4-1c'], 2: ['C4-2b', 'C4-2a'], 3: ['C4-3a', 'C4-3b'] }
};
