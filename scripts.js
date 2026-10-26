/**
 * Inclusão.net - Lógica de Interface e Acessibilidade
 * Foco: Modern Frutiger Aero + Acessibilidade Digital Avançada
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Estado de Acessibilidade ---
  const state = {
    fontSize: parseInt(localStorage.getItem('inclusao-font-size')) || 16,
    highContrast: localStorage.getItem('inclusao-contrast') === 'true',
    theme: localStorage.getItem('inclusao-theme') || 'light',
    readableFont: localStorage.getItem('inclusao-readable') === 'true',
    wideSpacing: localStorage.getItem('inclusao-spacing') === 'true',
    reducedMotion: localStorage.getItem('inclusao-motion') === 'true',
    language: localStorage.getItem('inclusao-lang') || 'pt'
  };

  const updateAccessibility = () => {
    document.documentElement.style.setProperty('--font-size-base', `${state.fontSize}px`);

    if (state.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (state.theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }

    document.body.classList.toggle('font-readable', state.readableFont);
    document.body.classList.toggle('spacing-wide', state.wideSpacing);
    document.body.classList.toggle('reduced-motion', state.reducedMotion);

    localStorage.setItem('inclusao-font-size', state.fontSize);
    localStorage.setItem('inclusao-contrast', state.highContrast);
    localStorage.setItem('inclusao-theme', state.theme);
    localStorage.setItem('inclusao-readable', state.readableFont);
    localStorage.setItem('inclusao-spacing', state.wideSpacing);
    localStorage.setItem('inclusao-motion', state.reducedMotion);
    localStorage.setItem('inclusao-lang', state.language);
  };

  if (!localStorage.getItem('inclusao-theme')) {
    state.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (!localStorage.getItem('inclusao-motion')) {
    state.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  updateAccessibility();

  // --- 2. Painel de Acessibilidade ---
  const panelTrigger = document.getElementById('acc-panel-trigger');
  const panel = document.getElementById('acc-panel');
  const closePanel = document.getElementById('close-acc-panel');

  if (panelTrigger && panel && closePanel) {
    panelTrigger.addEventListener('click', () => {
      panel.classList.add('open');
      closePanel.focus();
    });

    closePanel.addEventListener('click', () => {
      panel.classList.remove('open');
      panelTrigger.focus();
    });
  }

  const setFont = (delta) => {
    if (delta === 0) state.fontSize = 16;
    else state.fontSize = Math.min(Math.max(state.fontSize + delta, 12), 24);
    updateAccessibility();
  };

  const toggleState = (key, className) => {
    state[key] = !state[key];
    updateAccessibility();
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-font-inc')) setFont(1);
    if (e.target.closest('.btn-font-dec')) setFont(-1);
    if (e.target.closest('.btn-font-reset')) setFont(0);
    if (e.target.closest('.btn-theme-toggle')) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      updateAccessibility();
    }
    if (e.target.closest('.btn-contrast-toggle')) toggleState('highContrast', 'high-contrast');
    if (e.target.closest('.btn-readable-toggle')) toggleState('readableFont', 'font-readable');
    if (e.target.closest('.btn-spacing-toggle')) toggleState('wideSpacing', 'spacing-wide');
    if (e.target.closest('.btn-motion-toggle')) toggleState('reducedMotion', 'reduced-motion');
    if (e.target.closest('.btn-reset-defaults')) {
      localStorage.clear();
      location.reload();
    }
    if (e.target.closest('.btn-lang-toggle')) {
      state.language = state.language === 'pt' ? 'en' : 'pt';
      updateAccessibility();
      alert(`Idioma alterado para: ${state.language === 'pt' ? 'Português' : 'English'} (Estrutura pronta para tradução)`);
    }
  });

  // --- 3. Laboratório de Acessibilidade (Interativo) ---
  document.addEventListener('click', (e) => {
    if (e.target.closest('.lab-contrast-btn')) {
      const targetBox = e.target.closest('.lab-card').querySelector('.lab-demo-box');
      const color = e.target.closest('.lab-contrast-btn').dataset.color;
      const textColor = e.target.closest('.lab-contrast-btn').dataset.text;
      targetBox.style.backgroundColor = color;
      targetBox.style.color = textColor;
    }

    if (e.target.closest('.lab-font-btn')) {
      const targetBox = e.target.closest('.lab-card').querySelector('.lab-demo-box');
      const size = e.target.closest('.lab-font-btn').dataset.size;
      targetBox.style.fontSize = size;
    }

    if (e.target.closest('.tutorial-header')) {
      const item = e.target.closest('.tutorial-item');
      item.classList.toggle('active');
    }
  });

  // --- 4. Validação do Formulário de Cadastro / Feedback ---
  const forms = ['registration-form', 'feedback-form'];
  forms.forEach(formId => {
    const form = document.getElementById(formId);
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const fields = Array.from(form.querySelectorAll('input[required], textarea[required]')).map(input => ({
          id: input.id,
          errorId: `error-${input.id}`,
          validate: (val) => val.trim().length > 0
        }));

        fields.forEach(field => {
          const input = document.getElementById(field.id);
          const errorEl = document.getElementById(field.errorId);

          if (!field.validate(input.value)) {
            if (errorEl) errorEl.style.display = 'block';
            input.setAttribute('aria-invalid', 'true');
            input.style.borderColor = '#dc2626';
            isValid = false;
          } else {
            if (errorEl) errorEl.style.display = 'none';
            input.setAttribute('aria-invalid', 'false');
            input.style.borderColor = 'var(--glass-border)';
          }
        });

        if (isValid) {
          alert('Enviado com sucesso! (Simulação de frontend)');
          form.reset();
        }
      });
    }
  });

  // --- 5. Compartilhamento e Contato ---
  const shareBtn = document.getElementById('share-page');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: document.title,
        text: 'Confira o Inclusão.net, um projeto de inclusão digital!',
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(window.location.href);
          alert('Link copiado para a área de transferência!');
        }
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    });
  }
});
