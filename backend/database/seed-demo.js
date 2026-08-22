

const API = 'http://localhost:3000/api';

const CONTA_DEMO = {
  nomeFantasia: 'Grupo Demo EconoFinance',
  nome: 'Usuário Demo',
  email: 'demo@econofinance.com.br',
  senha: 'demo12345',
};

const EMPRESAS = [
  {
    cnpj: '11222333000181',
    razaoSocial: 'Mercadinho Boa Vista Comércio de Alimentos',
    cnaePrincipal: '4771701',
    uf: 'CE',
    municipio: 'Fortaleza',
    regimeTributario: 'simples_nacional',
    funcionarios: [
      { nome: 'Ana Paula Souza', cpf: '12345678901', cargo: 'Caixa', salarioBase: 1650, dataAdmissao: '2025-03-10' },
      { nome: 'Carlos Eduardo Lima', cpf: '23456789012', cargo: 'Repositor', salarioBase: 1518, dataAdmissao: '2025-06-01' },
    ],
    produtos: [
      { nome: 'Arroz tipo 1 5kg', sku: 'ARZ-5KG', custoUnitario: 18.50, precoVenda: 24.90, estoqueAtual: 120 },
      { nome: 'Óleo de soja 900ml', sku: 'OLE-900', custoUnitario: 6.20, precoVenda: 8.99, estoqueAtual: 4 },
      { nome: 'Feijão carioca 1kg', sku: 'FEI-1KG', custoUnitario: 7.10, precoVenda: 9.50, estoqueAtual: 85 },
    ],
    transacoes: [
      { tipo: 'receita', categoria: 'Venda de produtos', valor: 18500.00, data: '2026-08-05', descricao: 'Vendas do mês' },
      { tipo: 'despesa', categoria: 'Fornecedores', valor: 9800.00, data: '2026-08-06', descricao: 'Compra de mercadoria' },
      { tipo: 'despesa', categoria: 'Aluguel', valor: 2200.00, data: '2026-08-10' },
    ],
  },
  {
    cnpj: '44555666000122',
    razaoSocial: 'TechFlow Soluções em Tecnologia',
    cnaePrincipal: '6201501',
    uf: 'SP',
    municipio: 'São Paulo',
    regimeTributario: 'lucro_presumido',
    funcionarios: [
      { nome: 'Bruno Andrade', cpf: '34567890123', cargo: 'Desenvolvedor Backend', salarioBase: 8500, dataAdmissao: '2024-09-15' },
      { nome: 'Fernanda Rocha', cpf: '45678901234', cargo: 'Product Designer', salarioBase: 7200, dataAdmissao: '2025-01-20' },
      { nome: 'Rafael Nogueira', cpf: '56789012345', cargo: 'Gerente de Projetos', salarioBase: 9800, dataAdmissao: '2023-11-02' },
    ],
    produtos: [],
    transacoes: [
      { tipo: 'receita', categoria: 'Consultoria de software', valor: 62000.00, data: '2026-08-01', descricao: 'Contrato mensal Cliente A' },
      { tipo: 'receita', categoria: 'Licenciamento de sistema', valor: 15000.00, data: '2026-08-15' },
      { tipo: 'despesa', categoria: 'Infraestrutura em nuvem', valor: 4200.00, data: '2026-08-03' },
      { tipo: 'despesa', categoria: 'Folha de pagamento', valor: 25500.00, data: '2026-08-05' },
    ],
  },
  {
    cnpj: '77888999000133',
    razaoSocial: 'Confecções Vale Verde Indústria Têxtil',
    cnaePrincipal: '1412601',
    uf: 'MG',
    municipio: 'Belo Horizonte',
    regimeTributario: 'lucro_real',
    funcionarios: [
      { nome: 'José Ricardo Mendes', cpf: '67890123456', cargo: 'Costureiro', salarioBase: 1980, dataAdmissao: '2024-04-12' },
      { nome: 'Patrícia Gomes', cpf: '78901234567', cargo: 'Supervisora de Produção', salarioBase: 3200, dataAdmissao: '2022-08-01' },
    ],
    produtos: [
      { nome: 'Camiseta básica algodão', sku: 'CAM-BAS-M', custoUnitario: 12.00, precoVenda: 29.90, estoqueAtual: 340 },
      { nome: 'Calça jeans reta', sku: 'CAL-JNS-42', custoUnitario: 38.00, precoVenda: 89.90, estoqueAtual: 3 },
    ],
    transacoes: [
      { tipo: 'receita', categoria: 'Venda para varejo', valor: 41000.00, data: '2026-08-08' },
      { tipo: 'despesa', categoria: 'Matéria-prima (tecido)', valor: 17500.00, data: '2026-08-02' },
      { tipo: 'despesa', categoria: 'Energia elétrica', valor: 2800.00, data: '2026-08-09' },
    ],
  },
];

async function api(path, { method = 'GET', body = null, token = null } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function obterToken() {
  try {
    const registro = await api('/auth/register', { method: 'POST', body: CONTA_DEMO });
    console.log('✓ Conta demo criada');
    return registro.accessToken;
  } catch (err) {
    console.log('  Conta demo já existe, fazendo login...');
    const login = await api('/auth/login', {
      method: 'POST',
      body: { email: CONTA_DEMO.email, senha: CONTA_DEMO.senha },
    });
    return login.accessToken;
  }
}

async function popular() {
  console.log(`Conectando em ${API} ...\n`);
  const token = await obterToken();

  for (const empresa of EMPRESAS) {
    const { funcionarios, produtos, transacoes, ...dadosEmpresa } = empresa;

    let company;
    try {
      company = await api('/companies', { method: 'POST', body: dadosEmpresa, token });
      console.log(`✓ Empresa criada: ${company.razaoSocial}`);
    } catch (err) {
      console.log(`  Empresa "${dadosEmpresa.razaoSocial}" já deve existir (CNPJ duplicado) — pulando.`);
      continue;
    }

    for (const funcionario of funcionarios) {
      await api(`/companies/${company.id}/employees`, { method: 'POST', body: funcionario, token });
    }
    console.log(`  → ${funcionarios.length} funcionário(s) cadastrado(s)`);

    for (const produto of produtos) {
      await api(`/companies/${company.id}/products`, { method: 'POST', body: produto, token });
    }
    if (produtos.length) console.log(`  → ${produtos.length} produto(s) cadastrado(s)`);

    for (const transacao of transacoes) {
      await api(`/companies/${company.id}/transactions`, { method: 'POST', body: transacao, token });
    }
    console.log(`  → ${transacoes.length} lançamento(s) financeiro(s) cadastrado(s)\n`);
  }

  console.log('Concluído! Entre no site com:');
  console.log(`  E-mail: ${CONTA_DEMO.email}`);
  console.log(`  Senha:  ${CONTA_DEMO.senha}`);
}

popular().catch((err) => {
  console.error('\nErro ao popular o sistema:', err.message);
  console.error('Confira se o backend está rodando (npm run start:dev) antes de rodar este script.');
  process.exit(1);
});
