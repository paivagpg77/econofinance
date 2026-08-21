-- ============================================================
-- Dados de exemplo para testar a apuração de impostos.
-- Estes NÃO são as alíquotas oficiais reais — são valores aproximados
-- só para o motor de cálculo ter o que consultar durante o desenvolvimento.
-- Rode DEPOIS do schema.sql, no Query Tool do pgAdmin.
-- ============================================================

-- Simples Nacional — comércio (CNAE de exemplo: 4771701, Fortaleza/CE)
INSERT INTO tax_rules (regime_tributario, cnae, uf, tipo_imposto, aliquota, faixa_faturamento_min, faixa_faturamento_max, vigencia_inicio)
VALUES ('simples_nacional', '4771701', 'CE', 'das', 0.0600, 0, 180000, '2026-01-01');

-- Lucro Presumido — mesmo CNAE/UF, vários impostos separados
INSERT INTO tax_rules (regime_tributario, cnae, uf, tipo_imposto, aliquota, vigencia_inicio) VALUES
  ('lucro_presumido', '4771701', 'CE', 'irpj', 0.0150, '2026-01-01'),
  ('lucro_presumido', '4771701', 'CE', 'csll', 0.0090, '2026-01-01'),
  ('lucro_presumido', '4771701', 'CE', 'pis', 0.0065, '2026-01-01'),
  ('lucro_presumido', '4771701', 'CE', 'cofins', 0.0300, '2026-01-01'),
  ('lucro_presumido', '4771701', 'CE', 'icms', 0.1800, '2026-01-01');

-- Dica: para testar com uma empresa sua, cadastre-a com CNAE 4771701 e UF CE,
-- ou insira aqui novas linhas trocando "cnae" e "uf" para os valores que você usou no cadastro.
