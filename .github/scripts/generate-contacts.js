// .github/scripts/generate-contacts.js
import fs from 'fs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Ошибка: переменные SUPABASE_URL и SUPABASE_ANON_KEY не установлены');
  process.exit(1);
}

async function fetchContacts() {
  const url = `${SUPABASE_URL}/rest/v1/contacts?select=ФИО,Должность,Телефон,EMAIL`;
  
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function generate() {
  try {
    const contacts = await fetchContacts();

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
    console.log('✅ contacts.html успешно обновлён');
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
    process.exit(1);
  }
}

generate();
