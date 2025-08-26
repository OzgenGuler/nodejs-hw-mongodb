import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc', // artan sıralama
  DESC: 'desc', // azalan sıralama
};

//auth için sabit değerler

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 1000 * 60 * 60 * 24;

// Kullanıcı rolleri

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
};

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
