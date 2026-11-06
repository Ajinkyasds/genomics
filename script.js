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
