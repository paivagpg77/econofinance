-- ============================================================
-- EconoFinance — Estrutura do banco de dados
-- Rode este script no pgAdmin (Query Tool) dentro do banco "econofinance"
-- Observação: se você já rodou "npm run start:dev" com NODE_ENV=development,
-- o TypeORM já criou essas tabelas sozinho (synchronize: true) — rodar este
-- script de novo não vai fazer mal, os "IF NOT EXISTS" evitam duplicar.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------- ENUMS ----------
DO $$ BEGIN
  CREATE TYPE tenant_status AS ENUM ('trial','ativo','suspenso','cancelado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE regime_tributario AS ENUM ('simples_nacional','lucro_presumido','lucro_real');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE tipo_imposto AS ENUM ('icms','iss','pis','cofins','irpj','csll','das');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin','financeiro','contador','leitura');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------- TENANTS (empresas clientes do SaaS) ----------
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_fantasia VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  status tenant_status NOT NULL DEFAULT 'trial',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  nome VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  senha_hash VARCHAR NOT NULL,
  role user_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);

-- ---------- COMPANIES (CNPJs cadastrados por cada tenant) ----------
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  cnpj VARCHAR(14) NOT NULL UNIQUE,
  razao_social VARCHAR NOT NULL,
  cnae_principal VARCHAR(7) NOT NULL,
  uf VARCHAR(2) NOT NULL,
  municipio VARCHAR NOT NULL,
  regime_tributario regime_tributario NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_companies_tenant ON companies(tenant_id);

-- ---------- TAX_RULES (base de conhecimento fiscal — não pertence a nenhum tenant) ----------
CREATE TABLE IF NOT EXISTS tax_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regime_tributario regime_tributario NOT NULL,
  cnae VARCHAR(7),
  uf VARCHAR(2),
  tipo_imposto tipo_imposto NOT NULL,
  aliquota DECIMAL(6,4) NOT NULL,
  faixa_faturamento_min DECIMAL(14,2),
  faixa_faturamento_max DECIMAL(14,2),
  vigencia_inicio DATE NOT NULL,
  vigencia_fim DATE
);
CREATE INDEX IF NOT EXISTS idx_tax_rules_lookup ON tax_rules(regime_tributario, cnae, uf);
