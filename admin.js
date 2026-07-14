(() => {
  const STORAGE_KEY = 'lv-wedding-guests-v1';
  const form = document.getElementById('guestForm');
  const nameInput = document.getElementById('guestName');
  const greetingInput = document.getElementById('greeting');
  const siteUrlInput = document.getElementById('siteUrl');
  const result = document.getElementById('result');
  const linkInput = document.getElementById('generatedLink');
  const list = document.getElementById('guestList');
  const empty = document.getElementById('emptyState');

  const load = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const save = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  const baseUrl = () => {
    const custom = siteUrlInput.value.trim();
    if (custom) return custom.replace(/admin\.html.*$/i, '').replace(/\/$/, '') + '/';
    return location.href.replace(/admin\.html.*$/i, '');
  };
  const makeLink = (name, greeting) => `${baseUrl()}index.html?guest=${encodeURIComponent(name)}&greeting=${encodeURIComponent(greeting)}`;
  const shareText = (name, link) => `Дорогие ${name}! Приглашаем вас на свадьбу Larissa и Vladislav 22 августа 2026 года. Ваше персональное приглашение: ${link}`;

  function setResult(item) {
    const link = item.link;
    const text = shareText(item.name, link);
    linkInput.value = link;
    document.getElementById('previewLink').href = link;
    document.getElementById('whatsappLink').href = `https://wa.me/?text=${encodeURIComponent(text)}`;
    document.getElementById('telegramLink').href = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`Приглашение для ${item.name}`)}`;
    result.hidden = false;
  }

  function render() {
    const items = load();
    list.innerHTML = '';
    empty.hidden = items.length > 0;
    items.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td></td><td></td><td><div class="row-actions"><button data-copy>Копировать</button><button data-open>Открыть</button><button class="delete" data-delete>Удалить</button></div></td>`;
      tr.children[0].textContent = `${item.greeting} ${item.name}`;
      tr.children[1].textContent = item.link;
      tr.querySelector('[data-copy]').onclick = () => navigator.clipboard.writeText(item.link);
      tr.querySelector('[data-open]').onclick = () => window.open(item.link, '_blank', 'noopener');
      tr.querySelector('[data-delete]').onclick = () => { const next = load(); next.splice(index, 1); save(next); render(); };
      list.appendChild(tr);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const item = { name: nameInput.value.trim(), greeting: greetingInput.value, link: makeLink(nameInput.value.trim(), greetingInput.value), createdAt: new Date().toISOString() };
    const items = load(); items.unshift(item); save(items); setResult(item); render(); nameInput.value = ''; nameInput.focus();
  });
  document.getElementById('copyLink').onclick = async () => { await navigator.clipboard.writeText(linkInput.value); document.getElementById('copyLink').textContent = 'Скопировано'; setTimeout(() => document.getElementById('copyLink').textContent = 'Скопировать', 1200); };
  document.getElementById('exportCsv').onclick = () => {
    const rows = [['Обращение','Гость','Ссылка','Создано'], ...load().map(x => [x.greeting,x.name,x.link,x.createdAt])];
    const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csv], {type:'text/csv;charset=utf-8'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'wedding-guests.csv'; a.click(); URL.revokeObjectURL(a.href);
  };
  render();
})();
