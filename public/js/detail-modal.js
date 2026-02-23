function setupCommentModal() {
  const openButton = document.getElementById('add-comment-button');
  if (!openButton) return;

  const overlay = document.createElement('div');
  overlay.style.display = 'none';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(15, 23, 42, 0.55)';
  overlay.style.zIndex = '50';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.setAttribute('aria-hidden', 'true');

  const modal = document.createElement('div');
  modal.style.background = '#fff';
  modal.style.width = 'min(92vw, 520px)';
  modal.style.borderRadius = '12px';
  modal.style.padding = '20px';
  modal.style.boxShadow = '0 20px 60px rgba(2, 6, 23, 0.35)';

  modal.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;">
      <h3 style="font-size:1.125rem;font-weight:600;color:#0f172a;">Adicionar comentário</h3>
      <button type="button" id="close-comment-modal" aria-label="Fechar" style="border:none;background:transparent;font-size:1.5rem;line-height:1;cursor:pointer;color:#475569;">&times;</button>
    </div>
    <p style="margin-top:8px;color:#475569;">Preencha os dados abaixo para criar um comentário.</p>

    <form id="create-comment-form" style="margin-top:14px;display:grid;gap:10px;">

      <label style="display:grid;gap:6px;">
        <span style="font-size:0.875rem;color:#334155;">Comentário</span>
        <textarea id="comment-content" name="content" required maxlength="120" placeholder="Escreva seu comentário" class="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"></textarea>
      </label>

      <label style="display:grid;gap:6px;">
        <span style="font-size:0.875rem;color:#334155;">Criado por</span>
        <input id="comment-created-by" name="createdBy" type="text" required maxlength="120" placeholder="Seu nome ou identificador" class="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" />
      </label>

      <p id="create-comment-feedback" style="min-height:20px;font-size:0.875rem;color:#475569;margin-top:2px;"></p>

      <div style="margin-top:4px;display:flex;justify-content:flex-end;gap:8px;">
        <button type="button" id="cancel-comment-modal" class="rounded-md border border-slate-300 px-4 py-2 text-slate-700">Cancelar</button>
        <button type="submit" id="save-comment-button" class="rounded-md bg-slate-900 px-4 py-2 font-medium text-white">Salvar</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const closeButton = modal.querySelector('#close-comment-modal');
  const cancelButton = modal.querySelector('#cancel-comment-modal');
  const createForm = modal.querySelector('#create-comment-form');
  const saveButton = modal.querySelector('#save-comment-button');
  const createFeedback = modal.querySelector('#create-comment-feedback');
  const contentInput = modal.querySelector('#comment-content');
  const createdByInput = modal.querySelector('#comment-created-by');
  const linkInput = modal.querySelector('#comment-link');

  function getTopicIdFromPath() {
    const segments = window.location.pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] || '';
  }

  function openModal() {
    if (createFeedback) createFeedback.textContent = '';
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    contentInput?.focus();
  }

  function closeModal() {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
  }

  function setLoading(isLoading) {
    if (saveButton) {
      saveButton.disabled = isLoading;
      saveButton.textContent = isLoading ? 'Salvando...' : 'Salvar';
    }
  }

  async function submitCreateComment(event) {
    event.preventDefault();
    if (!createForm || !contentInput || !createdByInput || !createFeedback) {
      return;
    }

    const topicId = getTopicIdFromPath();
    const payload = {
      content: contentInput.value.trim(),
      createdBy: createdByInput.value.trim(),
      topicId,
      link: linkInput?.value.trim() || '',
    };

    if (!payload.topicId || !payload.content || !payload.createdBy) {
      createFeedback.style.color = '#b91c1c';
      createFeedback.textContent = 'Preencha todos os campos obrigatórios.';
      return;
    }

    setLoading(true);
    createFeedback.style.color = '#475569';
    createFeedback.textContent = 'Salvando comentário...';

    try {
      const response = await fetch('/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const data = await response.json();
      createFeedback.style.color = '#166534';
      createFeedback.textContent = data?.message || 'Comentário criado com sucesso.';
      createForm.reset();

      if (typeof window.loadTopicById === 'function') {
        await window.loadTopicById();
      }

      setTimeout(() => {
        closeModal();
      }, 700);
    } catch {
      createFeedback.style.color = '#b91c1c';
      createFeedback.textContent = 'Falha ao criar comentário.';
    } finally {
      setLoading(false);
    }
  }

  openButton.addEventListener('click', openModal);
  closeButton?.addEventListener('click', closeModal);
  cancelButton?.addEventListener('click', closeModal);
  createForm?.addEventListener('submit', submitCreateComment);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.style.display === 'flex') {
      closeModal();
    }
  });
}

window.setupCommentModal = setupCommentModal;
setupCommentModal();
