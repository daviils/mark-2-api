function setupTopicModal(formElement) {
  const container = formElement?.parentElement;
  if (!container) return;

  const actionBar = document.createElement('div');
  actionBar.style.marginTop = '12px';
  actionBar.style.display = 'flex';
  actionBar.style.justifyContent = 'flex-end';

  const openButton = document.createElement('button');
  openButton.type = 'button';
  openButton.textContent = 'Novo topico';
  openButton.className =
    'rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700';
  actionBar.appendChild(openButton);
  container.appendChild(actionBar);

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
      <h3 style="font-size:1.125rem;font-weight:600;color:#0f172a;">Criar topico</h3>
      <button type="button" id="close-topic-modal" aria-label="Fechar" style="border:none;background:transparent;font-size:1.5rem;line-height:1;cursor:pointer;color:#475569;">&times;</button>
    </div>
    <p style="margin-top:8px;color:#475569;">Preencha os dados abaixo para criar um topico.</p>

    <form id="create-topic-form" style="margin-top:14px;display:grid;gap:10px;">
      <label style="display:grid;gap:6px;">
        <span style="font-size:0.875rem;color:#334155;">Titulo</span>
        <input id="topic-title" name="title" type="text" required maxlength="200" placeholder="Ex.: Como usar NestJS com MSSQL" class="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" />
      </label>
      <label style="display:grid;gap:6px;">
        <span style="font-size:0.875rem;color:#334155;">Link</span>
        <input id="topic-link" name="link" type="text" required placeholder="https://..." class="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" />
      </label>
      <label style="display:grid;gap:6px;">
        <span style="font-size:0.875rem;color:#334155;">Criado por</span>
        <input id="topic-created-by" name="createdBy" type="text" required maxlength="120" placeholder="Seu nome ou identificador" class="rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" />
      </label>

      <p id="create-topic-feedback" style="min-height:20px;font-size:0.875rem;color:#475569;margin-top:2px;"></p>

      <div style="margin-top:4px;display:flex;justify-content:flex-end;gap:8px;">
        <button type="button" id="cancel-topic-modal" class="rounded-md border border-slate-300 px-4 py-2 text-slate-700">Cancelar</button>
        <button type="submit" id="save-topic-button" class="rounded-md bg-slate-900 px-4 py-2 font-medium text-white">Salvar</button>
      </div>
    </form>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const closeButton = modal.querySelector('#close-topic-modal');
  const cancelButton = modal.querySelector('#cancel-topic-modal');
  const createForm = modal.querySelector('#create-topic-form');
  const saveButton = modal.querySelector('#save-topic-button');
  const createFeedback = modal.querySelector('#create-topic-feedback');
  const titleInput = modal.querySelector('#topic-title');
  const linkInput = modal.querySelector('#topic-link');
  const createdByInput = modal.querySelector('#topic-created-by');

  function openModal() {
    if (createFeedback) createFeedback.textContent = '';
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    titleInput?.focus();
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

  async function submitCreateTopic(event) {
    event.preventDefault();
    if (!createForm || !titleInput || !linkInput || !createdByInput || !createFeedback) {
      return;
    }

    const payload = {
      title: titleInput.value.trim(),
      link: linkInput.value.trim(),
      createdBy: createdByInput.value.trim(),
    };

    if (!payload.title || !payload.link || !payload.createdBy) {
      createFeedback.style.color = '#b91c1c';
      createFeedback.textContent = 'Preencha todos os campos obrigatorios.';
      return;
    }

    setLoading(true);
    createFeedback.style.color = '#475569';
    createFeedback.textContent = 'Salvando topico...';

    try {
      const response = await fetch('/topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const data = await response.json();
      createFeedback.style.color = '#166534';
      createFeedback.textContent = data?.message || 'Topico criado com sucesso.';
      createForm.reset();

      if (typeof window.searchTopics === 'function') {
        window.searchTopics(1);
      }

      setTimeout(() => {
        closeModal();
      }, 700);
    } catch (error) {
      createFeedback.style.color = '#b91c1c';
      createFeedback.textContent = 'Falha ao criar topico.';
    } finally {
      setLoading(false);
    }
  }

  openButton.addEventListener('click', openModal);
  closeButton?.addEventListener('click', closeModal);
  cancelButton?.addEventListener('click', closeModal);
  createForm?.addEventListener('submit', submitCreateTopic);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.style.display === 'flex') {
      closeModal();
    }
  });
}

window.setupTopicModal = setupTopicModal;
