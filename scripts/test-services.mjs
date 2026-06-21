// Teste de integração dos serviços — executar com: node --env-file=.env scripts/test-services.mjs
import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';

const results = [];

// ── 1. Banco de dados (Neon) ──────────────────────────────────────
process.stdout.write('🔍 Testando PostgreSQL (Neon)... ');
try {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
  const tables = rows.map(r => r.table_name);
  const expected = ['dsr_requests', 'dsr_status_history', 'rate_limit_log'];
  const missing = expected.filter(t => !tables.includes(t));
  if (missing.length > 0) {
    results.push({ service: 'PostgreSQL', status: '⚠️  PARCIAL', detail: `Tabelas faltando: ${missing.join(', ')}` });
  } else {
    results.push({ service: 'PostgreSQL', status: '✅ OK', detail: `Tabelas: ${tables.join(', ')}` });
  }
} catch (e) {
  results.push({ service: 'PostgreSQL', status: '❌ ERRO', detail: e.message });
}

// ── 2. Resend ─────────────────────────────────────────────────────
process.stdout.write('\n🔍 Testando Resend (e-mail)... ');
try {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const res = await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: process.env.TEAM_NOTIFICATION_EMAIL,
    subject: '[TESTE] Renovi LGPD — verificação Resend',
    html: '<p>Teste automático de integração. Sistema funcionando.</p>',
  });
  if (res.error) {
    results.push({ service: 'Resend', status: '❌ ERRO', detail: JSON.stringify(res.error) });
  } else {
    results.push({ service: 'Resend', status: '✅ OK', detail: `ID: ${res.data?.id} → ${process.env.TEAM_NOTIFICATION_EMAIL}` });
  }
} catch (e) {
  results.push({ service: 'Resend', status: '❌ ERRO', detail: e.message });
}

// ── 3. Turnstile (verificação de configuração) ───────────────────
process.stdout.write('\n🔍 Testando Turnstile... ');
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
const secretKey = process.env.TURNSTILE_SECRET_KEY ?? '';
if (!siteKey || siteKey.startsWith('0x000')) {
  results.push({ service: 'Turnstile', status: '⚠️  AVISO', detail: 'NEXT_PUBLIC_TURNSTILE_SITE_KEY não configurada ou é chave de teste' });
} else if (!secretKey || secretKey.startsWith('0x000')) {
  results.push({ service: 'Turnstile', status: '⚠️  AVISO', detail: 'TURNSTILE_SECRET_KEY não configurada ou é chave de teste' });
} else {
  // Testar com token inválido (esperamos success=false, não um erro de rede)
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: 'token-de-teste-invalido' }),
    });
    const data = await r.json();
    // success=false com erro "invalid-input-response" significa que a chave é válida mas o token não
    if (!data.success && data['error-codes']?.includes('invalid-input-response')) {
      results.push({ service: 'Turnstile', status: '✅ OK', detail: 'Chaves válidas (token de teste rejeitado corretamente)' });
    } else if (!data.success) {
      results.push({ service: 'Turnstile', status: '⚠️  AVISO', detail: `Erros: ${JSON.stringify(data['error-codes'])}` });
    } else {
      results.push({ service: 'Turnstile', status: '✅ OK', detail: 'API acessível' });
    }
  } catch (e) {
    results.push({ service: 'Turnstile', status: '❌ ERRO', detail: e.message });
  }
}

// ── Sumário ───────────────────────────────────────────────────────
console.log('\n\n╔══════════════════════════════════════════════════════╗');
console.log('║  RESULTADO DOS TESTES DE SERVIÇO                    ║');
console.log('╠══════════════════════════════════════════════════════╣');
for (const r of results) {
  console.log(`║  ${r.status}  ${r.service.padEnd(12)} ${r.detail.slice(0, 35).padEnd(35)} ║`);
  if (r.detail.length > 35) console.log(`║               ${r.detail.slice(35, 85).padEnd(50)} ║`);
}
console.log('╚══════════════════════════════════════════════════════╝\n');

const hasError = results.some(r => r.status.includes('ERRO'));
process.exit(hasError ? 1 : 0);
