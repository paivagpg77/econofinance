# EconoFinance API (NestJS)

## Estrutura

```
src/
  common/
    middleware/tenant.middleware.ts   # extrai tenantId do JWT em todo request autenticado
    decorators/current-tenant.decorator.ts
  modules/
    auth/            # registro (cria tenant) e login (gera JWT)
    tenants/          # entidade Tenant
    companies/         # empresas do tenant (CNPJ, regime, CNAE, UF)
    tax-engine/         # motor de impostos — uma strategy por regime tributário
```

## Como rodar localmente

```bash
npm install

# copie o exemplo de variáveis de ambiente e ajuste usuário/senha do seu Postgres
cp .env.example .env

# crie o banco (só na primeira vez) — ajuste o usuário se não for "postgres"
psql -U postgres -c "CREATE DATABASE econofinance;"

npm run start:dev
```

Com `NODE_ENV=development`, o TypeORM cria as tabelas automaticamente a partir das entidades (`synchronize: true`) — não precisa rodar migration manual agora. Se o terminal mostrar as rotas mapeadas (`[RouterExplorer] Mapped {/api/auth/register, POST}`), está tudo certo.

## Conectando com o frontend

O front (pasta `frontend/`) espera a API em `http://localhost:3000/api` (definido em `frontend/js/api.js`). Se você mudar a porta no `.env`, atualize também essa constante no front.

## Fluxo de autenticação

1. `POST /api/auth/register` — cria o **tenant** (a empresa cliente do SaaS) + o primeiro usuário admin
2. `POST /api/auth/login` — retorna um JWT contendo `tenantId`
3. Toda rota protegida exige `Authorization: Bearer <token>` — o `TenantMiddleware` extrai o `tenantId` automaticamente

## Próximos módulos a implementar

- `employees` — folha de pagamento e encargos
- `products` — estoque de mercadorias
- `subscriptions` — planos e integração com gateway de pagamento (Asaas/Pagar.me)
- Popular a tabela `tax_rules` com as alíquotas reais por regime/CNAE/UF (hoje o motor de impostos depende dela estar preenchida)

## Regra importante

Nunca usar `number`/`float` nativo do JS para valores monetários em cálculos fiscais — este projeto já usa `decimal.js` no motor de impostos (`tax-engine`) por esse motivo. Mantenha o padrão nos módulos futuros.
