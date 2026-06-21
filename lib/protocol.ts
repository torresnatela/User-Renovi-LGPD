const CHARSET = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';

function randomChar(): string {
  const idx = Math.floor(Math.random() * CHARSET.length);
  return CHARSET[idx];
}

export function generateProtocol(): string {
  const year = new Date().getFullYear();
  const suffix = Array.from({ length: 6 }, randomChar).join('');
  return `REN-${year}-${suffix}`;
}
