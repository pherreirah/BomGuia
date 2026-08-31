import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { imapConfig } from './config.js';

export class EmailConnector {
  constructor(config = imapConfig) {
    this.client = new ImapFlow({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
      logger: false,
    });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.logout();
  }

  /**
   * Lê mensagens da caixa de entrada.
   * @param {{ onlyUnseen?: boolean, limit?: number }} options
   * @returns {Promise<Array<{uid: number, subject: string, from: string, date: Date, text: string}>>}
   */
  async fetchMessages({ onlyUnseen = false, limit = 20 } = {}) {
    const lock = await this.client.getMailboxLock('INBOX');
    const messages = [];
    try {
      const searchCriteria = onlyUnseen ? { seen: false } : { all: true };
      const uids = await this.client.search(searchCriteria);
      const recentUids = uids.slice(-limit).reverse();

      for (const uid of recentUids) {
        const message = await this.client.fetchOne(uid, { source: true });
        const parsed = await simpleParser(message.source);

        messages.push({
          uid,
          subject: parsed.subject ?? '(sem assunto)',
          from: parsed.from?.text ?? '(desconhecido)',
          date: parsed.date,
          text: parsed.text ?? '',
        });
      }
    } finally {
      lock.release();
    }
    return messages;
  }
}
