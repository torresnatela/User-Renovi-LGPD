import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

function createLimiters() {
  const redis = Redis.fromEnv();
  const email = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: 'rl:email',
  });
  const ip = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: 'rl:ip',
  });
  return { email, ip };
}

export async function checkRateLimit(
  emailAddress: string,
  ipAddress: string
): Promise<{ allowed: boolean; reason?: string }> {
  const limiters = createLimiters();

  const [emailResult, ipResult] = await Promise.all([
    limiters.email.limit(emailAddress),
    limiters.ip.limit(ipAddress),
  ]);

  if (!emailResult.success) return { allowed: false, reason: 'email' };
  if (!ipResult.success) return { allowed: false, reason: 'ip' };
  return { allowed: true };
}
