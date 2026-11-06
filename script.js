const helix = document.getElementById('helix');
if (helix) {
  for (let i = 0; i < 24; i++) {
    const rung = document.createElement('span');
    rung.className = 'helix-rung';
    const y = i * 13;
    const angle = i * 0.55;
    const x = Math.sin(angle) * 35;
    const scale = 0.65 + (Math.cos(angle) + 1) * 0.2;
    rung.style.top = `${y}px`;
    rung.style.marginLeft = `${x}px`;
    rung.style.transform = `translateX(-50%) rotate(${Math.sin(angle) * 28}deg) scaleX(${scale})`;
    rung.style.opacity = `${0.35 + (Math.cos(angle) + 1) * 0.3}`;
    helix.appendChild(rung);
  }
}

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.lab-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.lab-tab').forEach(t => {
      t.classList.remove('active'); t.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.lab-panel').forEach(panel => panel.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.dataset.tab)?.classList.add('active');
  });
});

const complementMap = { A: 'T', T: 'A', G: 'C', C: 'G' };
const dnaInput = document.getElementById('dnaInput');
function renderPairing() {
  const seq = dnaInput.value.toUpperCase().replace(/[^ATGC]/g, '').slice(0, 24);
  dnaInput.value = seq;
  const comp = [...seq].map(base => complementMap[base]).join('');
  document.getElementById('originalStrand').textContent = seq ? [...seq].join(' ') : '—';
  document.getElementById('complementStrand').textContent = comp ? [...comp].join(' ') : '—';
  document.getElementById('pairNote').textContent = seq.length ? `${seq.length} bases paired using A–T and G–C rules.` : 'Enter at least one valid DNA base: A, T, G or C.';
}
document.getElementById('pairButton')?.addEventListener('click', renderPairing);
dnaInput?.addEventListener('input', renderPairing);

document.getElementById('mutationButton')?.addEventListener('click', () => {
  const original = 'ATGCCGTA';
  const type = document.getElementById('mutationType').value;
  let changed = original, note = '';
  if (type === 'substitution') { changed = 'ATGTCGTA'; note = 'Substitution: one base has been replaced by another.'; }
  if (type === 'insertion') { changed = 'ATGACCGTA'; note = 'Insertion: an extra base has been added to the sequence.'; }
  if (type === 'deletion') { changed = 'ATCCGTA'; note = 'Deletion: one base has been removed from the sequence.'; }
  document.getElementById('mutationOriginal').textContent = original;
  document.getElementById('mutationChanged').textContent = changed;
  document.getElementById('mutationNote').textContent = note;
});

document.getElementById('assemblyButton')?.addEventListener('click', () => {
  document.getElementById('assemblyOutput').textContent = 'A T G C A T T A C';
  document.getElementById('assemblyNote').textContent = 'One possible reconstruction: ATGC → GCAT → ATTA → TTAC, using shared overlaps.';
});

renderPairing();


// GENOMICS QUEST: terminology learning game
const termQuestions = [
  {term:"DNA", question:"What does DNA mean?", hint:"It is the molecule that stores hereditary information.", correct:"Deoxyribonucleic acid", wrong:["A type of protein that carries oxygen","A cell structure that makes energy","A method used to photograph chromosomes"], explain:"DNA stands for deoxyribonucleic acid. Its sequence stores biological information."},
  {term:"GENE", question:"What is a gene?", hint:"Think of a section of DNA with a functional role.", correct:"A DNA sequence that contributes to a functional product", wrong:["The complete set of DNA in an organism","A tiny part of a cell membrane","A machine used to read DNA"], explain:"A gene is a DNA sequence that contributes to a functional product, often a protein or functional RNA."},
  {term:"GENOME", question:"What does the word genome describe?", hint:"Think bigger than one gene.", correct:"The complete genetic material of an organism", wrong:["Only the genes that are switched on today","A single chromosome","The protein coat around a virus"], explain:"A genome is an organism's complete genetic material, including genes and non-coding regions."},
  {term:"CHROMOSOME", question:"What is a chromosome?", hint:"DNA is packaged and organised with proteins.", correct:"A DNA molecule packaged with proteins", wrong:["A single nucleotide base","A type of RNA enzyme","A complete cell"], explain:"Chromosomes are organised structures made of DNA and associated proteins."},
  {term:"NUCLEOTIDE", question:"What is a nucleotide?", hint:"It is one of the repeating building blocks of DNA and RNA.", correct:"A building block of nucleic acids", wrong:["A complete chromosome","A type of microscope","A protein-building organelle"], explain:"A nucleotide contains a sugar, phosphate group and nitrogenous base."},
  {term:"SEQUENCING", question:"What does DNA sequencing find out?", hint:"It reads the order of the bases.", correct:"The order of bases in a DNA molecule", wrong:["The age of an organism","The number of cells in a tissue","The shape of a protein only"], explain:"DNA sequencing determines the order of nucleotide bases in a DNA molecule."},
  {term:"CONTIG", question:"In genome assembly, what is a contig?", hint:"It is built by joining overlapping reads.", correct:"A continuous assembled DNA sequence", wrong:["A single protein molecule","A machine that copies DNA","A type of mutation"], explain:"A contig is a continuous DNA sequence assembled from overlapping sequencing reads."},
  {term:"MUTATION", question:"What is a mutation?", hint:"It describes a change in genetic sequence.", correct:"A change in a DNA sequence", wrong:["The normal pairing of A with T","The process of making a cell membrane","A tool for viewing cells"], explain:"A mutation is a change in genetic material. Its effects depend on its type and context."}
];
let termIndex = 0, termScore = 0, termAnswered = false;
const termScoreEl = document.getElementById('termScore');
const termProgressEl = document.getElementById('termProgress');
const termOrbEl = document.getElementById('termOrb');
const termQuestionEl = document.getElementById('termQuestion');
const termHintEl = document.getElementById('termHint');
const termAnswersEl = document.getElementById('termAnswers');
const termFeedbackEl = document.getElementById('termFeedback');
const termRoundEl = document.getElementById('termRound');
const nextTermBtn = document.getElementById('nextTerm');

function renderTermQuestion() {
  const q = termQuestions[termIndex];
  termAnswered = false;
  termOrbEl.textContent = q.term;
  termQuestionEl.textContent = q.question;
  termHintEl.textContent = `Hint: ${q.hint}`;
  termFeedbackEl.textContent = 'Choose the best answer to earn 10 XP.';
  termFeedbackEl.className = 'game-feedback';
  termRoundEl.textContent = `QUESTION ${termIndex + 1} / ${termQuestions.length}`;
  termProgressEl.style.width = `${(termIndex / termQuestions.length) * 100}%`;
  nextTermBtn.disabled = true;
  nextTermBtn.textContent = termIndex === termQuestions.length - 1 ? 'See your result →' : 'Next challenge →';
  const options = [{text:q.correct, correct:true}, ...q.wrong.map(text => ({text,correct:false}))];
  // Shuffle answer order for replay value.
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  termAnswersEl.innerHTML = '';
  options.forEach(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-choice';
    button.textContent = option.text;
    button.addEventListener('click', () => chooseTermAnswer(button, option.correct, q));
    termAnswersEl.appendChild(button);
  });
}
function chooseTermAnswer(button, correct, question) {
  if (termAnswered) return;
  termAnswered = true;
  const buttons = [...termAnswersEl.querySelectorAll('button')];
  buttons.forEach(b => {
    b.disabled = true;
    if (b.textContent === question.correct) b.classList.add('correct-choice');
  });
  if (correct) {
    termScore += 10;
    termScoreEl.textContent = termScore;
    termFeedbackEl.textContent = `Correct! +10 XP. ${question.explain}`;
    termFeedbackEl.classList.add('good');
  } else {
    button.classList.add('wrong-choice');
    termFeedbackEl.textContent = `Not quite. ${question.explain}`;
    termFeedbackEl.classList.add('bad');
  }
  termProgressEl.style.width = `${((termIndex + 1) / termQuestions.length) * 100}%`;
  nextTermBtn.disabled = false;
}
nextTermBtn?.addEventListener('click', () => {
  if (!termAnswered) return;
  if (termIndex < termQuestions.length - 1) {
    termIndex++;
    renderTermQuestion();
  } else {
    termOrbEl.textContent = '✓';
    termQuestionEl.textContent = `Quest complete — ${termScore} / 80 XP`;
    termHintEl.textContent = termScore >= 60 ? 'Excellent work. You have a strong start in genomics vocabulary.' : 'Good effort. Replay the quest to strengthen your terminology knowledge.';
    termAnswersEl.innerHTML = '<button class="answer-choice" type="button" id="replayQuest">↻ Replay the terminology quest</button>';
    document.getElementById('replayQuest').addEventListener('click', () => {
      termIndex = 0; termScore = 0; termScoreEl.textContent = '0'; renderTermQuestion();
    });
    termFeedbackEl.textContent = 'You have completed all eight terminology questions.';
    termFeedbackEl.className = 'game-feedback good';
    termRoundEl.textContent = 'QUEST COMPLETED';
    nextTermBtn.disabled = true;
    nextTermBtn.textContent = 'Completed';
  }
});
document.querySelectorAll('[data-open-tab]').forEach(link => {
  link.addEventListener('click', () => {
    const target = link.dataset.openTab;
    const tab = document.querySelector(`.lab-tab[data-tab="${target}"]`);
    tab?.click();
  });
});
renderTermQuestion();
