import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function generate() {
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('ФИО, Должность, Телефон, EMAIL');

  if (error) {
    console.error('Ошибка запроса:', error);
    process.exit(1);
  }

  let html = `<!-- Автоматически сгенерировано: ${new Date().toISOString()} -->
<div class="contacts-table-wrapper">
  <table class="contacts-table">
    <thead>
      <tr><th>ФИО</th><th>Должность</th><th>Телефон</th><th>Email</th></tr>
    </thead>
    <tbody>`;

  for (const contact of contacts) {
    html += `
      <tr>
        <td>${escapeHtml(contact.ФИО)}</td>
        <td>${escapeHtml(contact.Должность)}</td>
        <td>${escapeHtml(contact.Телефон)}</td>
        <td>${escapeHtml(contact.EMAIL)}</td>
      </tr>`;
  }

  html += `
    </tbody>
  </table>
</div>`;

  fs.writeFileSync('contacts.html', html);
  console.log('✅ contacts.html обновлён');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

generate();
