-- ============================================================
-- Dados de exemplo para testar a apuração de impostos.
-- Estes NÃO são as alíquotas oficiais reais — são valores aproximados
-- só para o motor de cálculo ter o que consultar durante o desenvolvimento.
-- Rode DEPOIS do schema.sql, no Query Tool do pgAdmin.
-- ============================================================

-- ---------- COMÉRCIO — Simples Nacional (CNAE 4771701, CE) ----------
INSERT INTO tax_rules (regime_tributario, cnae, uf, tipo_imposto, aliquota, faixa_faturamento_min, faixa_faturamento_max, vigencia_inicio)
VALUES ('simples_nacional', '4771701', 'CE', 'das', 0.0600, 0, 180000, '2026-01-01');

-- ---------- COMÉRCIO — Lucro Presumido (mesmo CNAE/UF, impostos separados) ----------
INSERT INTO tax_rules (regime_tributario, cnae, uf, tipo_imposto, aliquota, vigencia_inicio) VALUES
  ('lucro_presumido', '4771701', 'CE', 'irpj', 0.0150, '2026-01-01'),
  ('lucro_presumido', '4771701', 'CE', 'csll', 0.0090, '2026-01-01'),
  ('lucro_presumido', '4771701', 'CE', 'pis', 0.0065, '2026-01-01'),
  ('lucro_presumido', '4771701', 'CE', 'cofins', 0.0300, '2026-01-01'),
  ('lucro_presumido', '4771701', 'CE', 'icms', 0.1800, '2026-01-01');

-- ---------- SERVIÇOS — Lucro Presumido (CNAE 6201501, desenvolvimento de software, SP) ----------
INSERT INTO tax_rules (regime_tributario, cnae, uf, tipo_imposto, aliquota, vigencia_inicio) VALUES
  ('lucro_presumido', '6201501', 'SP', 'irpj', 0.0192, '2026-01-01'),
  ('lucro_presumido', '6201501', 'SP', 'csll', 0.0115, '2026-01-01'),
  ('lucro_presumido', '6201501', 'SP', 'pis', 0.0065, '2026-01-01'),
  ('lucro_presumido', '6201501', 'SP', 'cofins', 0.0300, '2026-01-01'),
  ('lucro_presumido', '6201501', 'SP', 'iss', 0.0500, '2026-01-01');

-- ---------- SERVIÇOS — Simples Nacional (mesmo CNAE, Anexo III) ----------
INSERT INTO tax_rules (regime_tributario, cnae, uf, tipo_imposto, aliquota, faixa_faturamento_min, faixa_faturamento_max, vigencia_inicio)
VALUES ('simples_nacional', '6201501', 'SP', 'das', 0.0600, 0, 180000, '2026-01-01');

-- ---------- INDÚSTRIA — CNAE 1412601 (confecção), MG ----------
-- Regime Lucro Real: o motor de cálculo ainda não está implementado para este
-- regime (depende do módulo financeiro para apurar o lucro líquido real do
-- período — ver LucroRealStrategy no backend). As linhas abaixo ficam prontas
-- para quando essa lógica for implementada.
INSERT INTO tax_rules (regime_tributario, cnae, uf, tipo_imposto, aliquota, vigencia_inicio) VALUES
  ('lucro_real', '1412601', 'MG', 'irpj', 0.1500, '2026-01-01'),
  ('lucro_real', '1412601', 'MG', 'csll', 0.0900, '2026-01-01'),
  ('lucro_real', '1412601', 'MG', 'icms', 0.1800, '2026-01-01');

-- Dica: para testar com uma empresa sua, cadastre-a com um dos pares
-- CNAE/UF acima, ou insira aqui novas linhas trocando "cnae" e "uf" para os
-- valores que você usou no cadastro.
