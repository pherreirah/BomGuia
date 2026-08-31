# BomGuia — Conector de Email (IMAP)

Conector Node.js para ligar à caixa de email de recrutamento (`recrutamento@procenter.co.ao`) via IMAP e ler as mensagens recebidas.

## Servidor

| Serviço | Host | Porta | Segurança |
|---|---|---|---|
| IMAP (entrada) | `mail.procenter.co.ao` | 993 | SSL/TLS implícito |
| SMTP (saída, reservado para uso futuro) | `mail.procenter.co.ao` | 465 | SSL/TLS implícito |

## Setup

```bash
npm install
cp .env.example .env
```

Edita o `.env` e preenche `EMAIL_PASSWORD` com a password real. **O ficheiro `.env` nunca deve ser commitado** — já está listado no `.gitignore`.

## Uso

```bash
# Ler as últimas 20 mensagens
npm start

# Ler apenas mensagens não lidas
npm run fetch-unread
```

## Estrutura

- `src/config.js` — carrega e valida as variáveis de ambiente.
- `src/emailConnector.js` — classe `EmailConnector` (ligação IMAP via [`imapflow`](https://www.npmjs.com/package/imapflow), parsing de mensagens via [`mailparser`](https://www.npmjs.com/package/mailparser)).
- `src/index.js` — script de exemplo que liga à caixa de entrada e imprime as mensagens.

## Segurança

- As credenciais **nunca** ficam no código — só em variáveis de ambiente (`.env`, fora do controlo de versão).
- Liga sempre via TLS (porta 993 para IMAP).
- Antes de usar em produção, considera guardar a password num gestor de segredos (ex: variáveis de ambiente do servidor/CI, Vault, etc.) em vez de um ficheiro `.env` local.
