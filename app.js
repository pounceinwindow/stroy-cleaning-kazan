const zones = [...document.querySelectorAll('.floor-plan input')];
const area = document.querySelector('#area');
const premise = document.querySelector('#premise');
const result = document.querySelector('#plan-result');
const feedback = document.querySelector('#plan-feedback');
const progress = document.querySelector('#zone-count');
const copy = document.querySelector('#copy-plan');

function selectedZones() {
  return zones.filter(zone => zone.checked).map(zone => zone.value);
}

function updatePlan() {
  const count = selectedZones().length;
  progress.textContent = 'Отмечено: ' + count + ' из ' + zones.length;
  copy.disabled = count === 0;
  feedback.textContent = '';
  area.removeAttribute('aria-invalid');
  result.hidden = true;
}

for (const field of [premise, area, ...zones]) {
  field.addEventListener('input', updatePlan);
}

copy.addEventListener('click', async () => {
  if (!area.validity.valid) {
    area.setAttribute('aria-invalid', 'true');
    feedback.textContent = 'Укажите площадь от 1 до 99 999 м².';
    area.focus();
    return;
  }
  const lines = [
    'Здравствуйте! Хочу обсудить уборку после ремонта.',
    'Помещение: ' + premise.value
  ];
  if (area.value) lines.push('Площадь: ' + area.value + ' м²');
  lines.push('Зоны уборки: ' + selectedZones().join(', '));
  result.value = lines.join('\n');
  try {
    await navigator.clipboard.writeText(result.value);
    feedback.textContent = 'План скопирован.';
  } catch {
    result.hidden = false;
    result.focus();
    result.select();
    feedback.textContent = 'Скопируйте выделенный текст.';
  }
});
