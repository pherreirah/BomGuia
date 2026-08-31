import { EmailConnector } from './emailConnector.js';

async function main() {
  const onlyUnseen = process.argv.includes('--unread');
  const connector = new EmailConnector();

  await connector.connect();
  try {
    const messages = await connector.fetchMessages({ onlyUnseen, limit: 20 });

    if (messages.length === 0) {
      console.log('Nenhuma mensagem encontrada.');
      return;
    }

    for (const msg of messages) {
      console.log('----------------------------------------');
      console.log(`De:      ${msg.from}`);
      console.log(`Assunto: ${msg.subject}`);
      console.log(`Data:    ${msg.date}`);
      console.log(`Texto:   ${msg.text.slice(0, 200)}${msg.text.length > 200 ? '...' : ''}`);
    }
    console.log('----------------------------------------');
    console.log(`Total: ${messages.length} mensagem(ns).`);
  } finally {
    await connector.disconnect();
  }
}

main().catch((error) => {
  console.error('Erro ao ligar à caixa de email:', error.message);
  process.exitCode = 1;
});
