import { NextRequest, NextResponse } from 'next/server';
import { deletionSchema } from '@/lib/validation/deletion-schema';
import { validateCpf } from '@/lib/validation/cpf';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { checkRateLimit } from '@/lib/security/ratelimit';
import { generateProtocol } from '@/lib/protocol';
import { db } from '@/lib/db/client';
import { dsrRequests } from '@/lib/db/schema';
import { sendEmail } from '@/lib/email/send';
import { teamEmailHtml, userEmailHtml } from '@/lib/email/templates';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  // 1. Validação Zod
  const parsed = deletionSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return NextResponse.json({ errors }, { status: 400 });
  }
  const data = parsed.data;

  // 2. Validação CPF (dígitos verificadores)
  if (!validateCpf(data.cpf)) {
    return NextResponse.json(
      { errors: { cpf: ['CPF inválido'] } },
      { status: 400 }
    );
  }

  // 3. Verificar Turnstile
  const turnstileOk = await verifyTurnstile(data.turnstileToken);
  if (!turnstileOk) {
    return NextResponse.json({ error: 'Captcha inválido' }, { status: 403 });
  }

  // 4. Rate limit
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
  const rateLimitResult = await checkRateLimit(data.email, ip);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error:
          'Limite de solicitações atingido. Tente novamente mais tarde.',
      },
      { status: 429 }
    );
  }

  // 5. Gerar protocolo
  const protocol = generateProtocol();

  // 6. Inserir no banco
  const createdAt = new Date();
  try {
    await db.insert(dsrRequests).values({
      protocol,
      fullName: data.fullName,
      email: data.email,
      cpf: data.cpf,
      phone: data.phone,
      deletionScope: data.deletionScope,
      specificDataDetails: data.specificDataDetails,
      reason: data.reason,
      source: data.source,
      consentConfirmed: data.consentConfirmed as boolean,
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') ?? undefined,
    });
  } catch (err) {
    console.error('[api/exclusao] DB insert error:', err);
    return NextResponse.json(
      { error: 'Erro interno. Tente novamente.' },
      { status: 500 }
    );
  }

  // 7. Enviar e-mails (fire and forget)
  const teamEmail = process.env.TEAM_NOTIFICATION_EMAIL ?? 'privacidade@renovisaude.com.br';

  Promise.all([
    sendEmail({
      to: teamEmail,
      subject: `Nova solicitação de exclusão — ${protocol}`,
      html: teamEmailHtml({
        protocol,
        fullName: data.fullName,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        deletionScope: data.deletionScope,
        specificDataDetails: data.specificDataDetails,
        source: data.source,
        createdAt,
      }),
    }),
    sendEmail({
      to: data.email,
      subject: `Recebemos sua solicitação de exclusão — Renovi Saúde`,
      html: userEmailHtml({
        protocol,
        fullName: data.fullName,
        email: data.email,
      }),
    }),
  ]).catch((err) => {
    console.error('[api/exclusao] Email send error:', err);
  });

  return NextResponse.json({ protocol, status: 'received' }, { status: 201 });
}
