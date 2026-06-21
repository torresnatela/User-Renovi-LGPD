export function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

export function validateCpf(cpf: string): boolean {
  const digits = normalizeCpf(cpf);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) {
      sum += parseInt(digits[i]) * (len + 1 - i);
    }
    const rem = (sum * 10) % 11;
    return rem === 10 ? 0 : rem;
  };

  return calc(9) === parseInt(digits[9]) && calc(10) === parseInt(digits[10]);
}

export function maskCpf(cpf: string): string {
  const digits = normalizeCpf(cpf);
  if (digits.length !== 11) return '***.***.***-**';
  return `***.***.**-${digits.slice(9)}`;
}
