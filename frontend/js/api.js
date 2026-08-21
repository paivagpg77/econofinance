// Ajuste esta URL quando o back-end for publicado (ex: https://api.econofinance.com.br/api)
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Wrapper único para chamadas à API. Já injeta o token JWT (quando existe)
 * e trata erros de forma padronizada, pra não repetir isso em cada página.
 */
async function apiRequest(path, { method = 'GET', body = null, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('econofinance_token');

  if (auth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const mensagem = data?.message || 'Ocorreu um erro ao falar com o servidor';
    throw new Error(Array.isArray(mensagem) ? mensagem.join(', ') : mensagem);
  }

  return data;
}

const Auth = {
  async register({ nomeFantasia, nome, email, senha }) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      auth: false,
      body: { nomeFantasia, nome, email, senha },
    });
    this.salvarSessao(data);
    return data;
  },

  async login({ email, senha }) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      auth: false,
      body: { email, senha },
    });
    this.salvarSessao(data);
    return data;
  },

  salvarSessao(data) {
    localStorage.setItem('econofinance_token', data.accessToken);
    localStorage.setItem('econofinance_user', JSON.stringify(data.user));
  },

  usuarioAtual() {
    const raw = localStorage.getItem('econofinance_user');
    return raw ? JSON.parse(raw) : null;
  },

  estaLogado() {
    return !!localStorage.getItem('econofinance_token');
  },

  logout() {
    localStorage.removeItem('econofinance_token');
    localStorage.removeItem('econofinance_user');
    window.location.href = 'login.html';
  },

  /** Chame no topo de qualquer página que exija login */
  exigirLogin() {
    if (!this.estaLogado()) {
      window.location.href = 'login.html';
    }
  },
};

const Companies = {
  listar() {
    return apiRequest('/companies');
  },
  criar(dto) {
    return apiRequest('/companies', { method: 'POST', body: dto });
  },
};

const TaxEngine = {
  apurar({ companyId, faturamentoMensal }) {
    return apiRequest('/tax-engine/apurar', {
      method: 'POST',
      body: { companyId, faturamentoMensal },
    });
  },
};

/** Mostra uma mensagem de erro/sucesso num elemento .alert já existente na página */
function mostrarAlerta(elementId, mensagem, tipo = 'error') {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = mensagem;
  el.className = `alert show alert-${tipo}`;
}
