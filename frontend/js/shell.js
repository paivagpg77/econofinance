/**
 * Monta o app shell (sidebar + topbar) dentro do elemento #app.
 * Chame renderShell({ active: 'dashboard', title: 'Painel' }) no topo de cada página autenticada.
 */
function renderShell({ active, title }) {
  const usuario = Auth.usuarioAtual();
  const iniciais = usuario?.nome ? usuario.nome.trim().charAt(0).toUpperCase() : '?';

  const itemNav = (key, icon, label, href, disponivel = true) => `
    <a href="${href}" class="${active === key ? 'active' : ''} ${!disponivel ? 'disabled' : ''}">
      <span class="icon">${icon}</span>
      <span>${label}</span>
      ${!disponivel ? '<span class="soon">em breve</span>' : ''}
    </a>`;

  document.getElementById('app').insertAdjacentHTML('afterbegin', `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-logo">
          <div class="sidebar-logo-mark">
            <svg width="18" height="18" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#123328"/><rect x="13" y="34" width="8" height="16" rx="1.5" fill="#EDE6D6"/><rect x="25" y="24" width="8" height="26" rx="1.5" fill="#C9942F"/><path d="M37 50 V22 C37 22 37 15 41 11 C45 15 45 22 45 22 V50 Z" fill="#123328"/></svg>
          </div>
          <div class="sidebar-logo-text">Econo<span>Finance</span></div>
        </div>

        <div class="sidebar-section-label">Geral</div>
        <ul class="sidebar-nav">
          <li>${itemNav('dashboard', '&#9632;', 'Painel', 'dashboard.html')}</li>
          <li>${itemNav('empresas', '&#127970;', 'Empresas', 'dashboard.html')}</li>
        </ul>

        <div class="sidebar-section-label">Gestão</div>
        <ul class="sidebar-nav">
          <li>${itemNav('funcionarios', '&#128101;', 'Funcionários', 'funcionarios.html')}</li>
          <li>${itemNav('estoque', '&#128230;', 'Estoque', 'estoque.html')}</li>
          <li>${itemNav('financeiro', '&#128176;', 'Financeiro', 'financeiro.html')}</li>
        </ul>

        <div class="sidebar-section-label">Análise</div>
        <ul class="sidebar-nav">
          <li>${itemNav('relatorios', '&#128200;', 'Relatórios', 'relatorios.html')}</li>
        </ul>

        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="sidebar-user-avatar">${iniciais}</div>
            <div>
              <div class="sidebar-user-name">${usuario?.nome ?? ''}</div>
              <div class="sidebar-user-email">${usuario?.email ?? ''}</div>
            </div>
          </div>
          <button class="sidebar-logout" onclick="Auth.logout()">Sair da conta</button>
        </div>
      </aside>

      <div class="main-area">
        <div class="topbar">
          <h1>${title}</h1>
          <div class="topbar-actions" id="topbarActions"></div>
        </div>
        <div class="content" id="pageContent"></div>
      </div>
    </div>
  `);
}
