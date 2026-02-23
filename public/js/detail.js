const detailContainer = document.getElementById('detail-container');

function escapeHtml(text) {
  return String(text ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderDetail(item) {
  if (!detailContainer) return;

  const title = escapeHtml(item?.title || 'Sem título');
  const link = escapeHtml(item?.link || 'Sem link');
  const createdBy = escapeHtml(item?.createdBy || 'Desconhecido');
  const comments = Array.isArray(item?.comments) ? item.comments : [];
  const commentsHtml =
    comments.length > 0
      ? comments
          .map((comment) => {
            const content = escapeHtml(comment?.content || 'Sem conteúdo');
            const author = escapeHtml(comment?.createdBy || 'Desconhecido');
            return `
              <li class="rounded-md border border-slate-200 p-3">
                <p class="text-slate-800">${content}</p>
                <p class="mt-1 text-sm text-slate-500">Por: ${author}</p>
              </li>
            `;
          })
          .join('')
      : '<li class="rounded-md border border-slate-200 p-3 text-slate-500">Nenhum comentário ainda.</li>';

  detailContainer.innerHTML = ` 
    <h1 class="text-3xl font-semibold">${title}</h1>
    <p class="mt-3 text-slate-700">Link: ${link}</p>
    <p class="mt-1 text-slate-700">Criado por: ${createdBy}</p>
    <section class="mt-6">
      <h2 class="text-xl font-medium">Comentários</h2>
      <ul class="mt-3 space-y-3">${commentsHtml}</ul>
    </section>
  `;
}

function renderError(message) {
  if (!detailContainer) return;
  detailContainer.innerHTML = `<p class="text-red-700">${escapeHtml(message)}</p>`;
}

function getTopicIdFromPath() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  return segments[segments.length - 1] || '';
}

async function loadTopicById() {
  const id = getTopicIdFromPath();
  if (!id) {
    renderError('ID do tópico não encontrado na URL.');
    return;
  }

  try {
    const response = await fetch(`/topic/${encodeURIComponent(id)}`);
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const topic = await response.json();
    renderDetail(topic);
  } catch {
    renderError('Não foi possível carregar os detalhes do tópico.');
  }
}

window.renderDetail = renderDetail;
window.loadTopicById = loadTopicById;

if (detailContainer) {
  loadTopicById();
}
