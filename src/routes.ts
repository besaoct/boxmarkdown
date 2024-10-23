export const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://boxmarkdown.com' : 'http://localhost:3000';
export const BASE_DOMAIN = process.env.NODE_ENV === 'production' ? 'boxmarkdown.com' : 'localhost:3000';
export const BASE_METHOD = process.env.NODE_ENV === 'production' ? 'https' : 'http';