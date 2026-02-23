const form = document.getElementById('topic-search-form');
const keywordInput = document.getElementById('keyword');
const feedback = document.getElementById('feedback');
const results = document.getElementById('results');

function escapeHtml(text) {
  return String(text ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderResults(items) {
  if (!Array.isArray(items) || items.length === 0) {
    results.innerHTML =
      '<li class="rounded-md border border-slate-200 p-3 text-slate-500">Nenhum tópico encontrado.</li>';
    return;
  }

  results.innerHTML = items
    .map((topic) => {
      const title = escapeHtml(topic.title || 'Sem título');
      const tags = escapeHtml(topic.tags || '');
      const topicId = String(topic.id || '').trim();
      const detailHref = topicId ? `/detail/${encodeURIComponent(topicId)}` : '#';
      return `
        <li class="rounded-md border border-slate-200 p-3">
          <a href="${detailHref}" class="font-semibold hover:underline">${title}</a>
          ${tags ? `<p class="mt-1 text-sm text-slate-600">Tags: ${tags}</p>` : ''}
        </li>
      `;
    })
    .join('');
}

async function searchTopics(page = 1) {
  const keyword = keywordInput.value.trim();
  feedback.textContent = 'Buscando...';
  results.innerHTML = '';

  try {
    const response = await fetch('/topic/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, keyword }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();
    feedback.textContent = `Encontrados ${data.totalCount ?? 0} tópico(s).`;
    renderResults(data.results);
  } catch (error) {
    feedback.textContent = 'Falha ao buscar tópicos.';
    results.innerHTML =
      '<li class="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">Não foi possível carregar os tópicos.</li>';
  }
}

window.searchTopics = searchTopics;

if (form && keywordInput && feedback && results) {
  if (typeof window.setupTopicModal === 'function') {
    window.setupTopicModal(form);
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    searchTopics(1);
  });
}
