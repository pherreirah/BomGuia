import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente "${name}" em falta. Copia ".env.example" para ".env" e preenche os valores.`
    );
  }
  return value;
}

export const imapConfig = {
  host: required('IMAP_HOST'),
  port: Number(process.env.IMAP_PORT ?? 993),
  secure: (process.env.IMAP_SECURE ?? 'true') === 'true',
  auth: {
    user: required('EMAIL_USER'),
    pass: required('EMAIL_PASSWORD'),
  },
};
