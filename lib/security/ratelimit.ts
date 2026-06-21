import { db } from '@/lib/db/client';
import { rateLimitLog } from '@/lib/db/schema';
import { and, count, eq, gt, lt } from 'drizzle-orm';

const LIMITS = {
  email: 3,
  ip: 10,
} as const;

const ONE_HOUR_MS = 60 * 60 * 1000;
const TWO_HOURS_MS = 2 * ONE_HOUR_MS;

export async function checkRateLimit(
  emailAddress: string,
  ipAddress: string
): Promise<{ allowed: boolean; reason?: string }> {
  const oneHourAgo = new Date(Date.now() - ONE_HOUR_MS);
  const twoHoursAgo = new Date(Date.now() - TWO_HOURS_MS);

  const emailKey = `email:${emailAddress}`;
  const ipKey = `ip:${ipAddress}`;

  // Limpar entradas antigas (> 2h) e contar atuais em paralelo
  const [emailRows, ipRows] = await Promise.all([
    db
      .select({ count: count() })
      .from(rateLimitLog)
      .where(and(eq(rateLimitLog.key, emailKey), gt(rateLimitLog.requestedAt, oneHourAgo))),
    db
      .select({ count: count() })
      .from(rateLimitLog)
      .where(and(eq(rateLimitLog.key, ipKey), gt(rateLimitLog.requestedAt, oneHourAgo))),
    // Limpeza silenciosa de registros antigos
    db.delete(rateLimitLog).where(lt(rateLimitLog.requestedAt, twoHoursAgo)),
  ]);

  if (emailRows[0].count >= LIMITS.email) return { allowed: false, reason: 'email' };
  if (ipRows[0].count >= LIMITS.ip) return { allowed: false, reason: 'ip' };

  // Registrar a solicitação atual
  await db.insert(rateLimitLog).values([{ key: emailKey }, { key: ipKey }]);

  return { allowed: true };
}
