const announce = (text) => { document.querySelector('#announcement').textContent = text; };

const filters = document.querySelector('.filters');
if (filters) {
  const level = document.querySelector('#level');
  const person = document.querySelector('#person');
  const org = document.querySelector('#org');
  const cards = [...document.querySelectorAll('[data-level]')];
  const filter = () => {
    let visible = 0;
    for (const card of cards) {
      card.hidden = Boolean((level.value && level.value !== card.dataset.level) ||
        (person.value && !card.dataset.people.split('|').includes(person.value)) ||
        (org.checked && card.dataset.org !== 'true'));
      visible += Number(!card.hidden);
    }
    document.querySelector('#count').textContent = `${visible} dari ${cards.length} skenario`;
  };
  filters.addEventListener('change', filter);
  filters.hidden = false;
  filter();
}

const audience = document.querySelector('.audience');
const preferenceKey = 'workshop-audience';
const showAudience = (value) => {
  for (const section of document.querySelectorAll('[data-audience]')) {
    section.hidden = value !== 'all' && section.dataset.audience !== value;
  }
};
if (audience) {
  let saved = 'all';
  try { saved = localStorage.getItem(preferenceKey) ?? 'all'; }
  catch { announce('Preferensi berlaku selama halaman ini terbuka.'); }
  const valid = [...audience.querySelectorAll('input')].find((item) => item.value === saved);
  if (valid) { valid.checked = true; showAudience(saved); }
  audience.addEventListener('change', (event) => {
    showAudience(event.target.value);
    try { localStorage.setItem(preferenceKey, event.target.value); }
    catch { announce('Preferensi berlaku selama halaman ini terbuka.'); }
  });
  audience.hidden = false;
}

for (const button of document.querySelectorAll('.copy')) {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const code = button.previousElementSibling;
    try {
      await navigator.clipboard.writeText(code.textContent);
      announce('Disalin.');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      announce('Teks dipilih. Gunakan Ctrl+C atau Command+C untuk menyalin.');
    }
  });
}

for (const compare of document.querySelectorAll('[data-compare]')) {
  const input = compare.querySelector('input');
  const update = () => {
    compare.style.setProperty('--mix', `${input.value}%`);
    input.setAttribute('aria-valuetext', `${input.value}% bagian After`);
  };
  input.addEventListener('input', update);
  input.parentElement.hidden = false;
  update();
}

const stageButtons = [...document.querySelectorAll('[data-stage]')];
function selectStage(selected) {
  for (const button of stageButtons) {
    const active = selected === button;
    button.setAttribute('aria-expanded', String(active));
    const content = document.getElementById(button.getAttribute('aria-controls'));
    content.hidden = !active;
    const node = document.querySelector(`[data-timeline-node="${button.dataset.stage}"]`);
    if (node) node.classList.toggle('current', active);
  }
}
for (const button of stageButtons) {
  button.hidden = false;
  button.addEventListener('click', () => selectStage(button));
}
if (stageButtons.length) selectStage(stageButtons[0]);

const zoomable = document.querySelectorAll('a.zoom');
if (zoomable.length && typeof HTMLDialogElement === 'function') {
  const dialog = document.createElement('dialog');
  dialog.setAttribute('aria-label', 'Screenshot diperbesar');
  const close = document.createElement('button');
  close.textContent = 'Tutup';
  close.type = 'button';
  close.className = 'copy';
  const image = document.createElement('img');
  dialog.append(close, image);
  document.body.append(dialog);
  let opener;
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());
  for (const link of zoomable) {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      image.alt = link.querySelector('img')?.alt || link.textContent.trim();
      image.src = link.href;
      dialog.showModal();
      close.focus();
    });
  }
}

if (window.Chart) {
  const computed = getComputedStyle(document.documentElement);
  const fontColor = computed.getPropertyValue('--ink').trim();
  const lineColor = computed.getPropertyValue('--line').trim();
  const palette = ['#255cc3', '#7648a6', '#a54827', '#157362', '#975624', '#3f5b78', '#882d66', '#3e6e2d'];
  for (const chart of document.querySelectorAll('[data-chart]')) {
    const { type, labels, values } = JSON.parse(chart.dataset.chart);
    chart.hidden = false;
    new window.Chart(chart.querySelector('canvas'), {
      type,
      data: { labels, datasets: [{ data: values, backgroundColor: type === 'doughnut' ? palette : palette[0], borderColor: palette[0] }] },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false, color: fontColor,
        indexAxis: type === 'bar' ? 'y' : 'x',
        plugins: { legend: { display: type === 'doughnut' } },
        scales: type === 'doughnut' ? {} : {
          x: { beginAtZero: true, ticks: { color: fontColor }, grid: { color: lineColor } },
          y: { beginAtZero: true, ticks: { color: fontColor }, grid: { color: lineColor } },
        },
      },
    });
  }
}
