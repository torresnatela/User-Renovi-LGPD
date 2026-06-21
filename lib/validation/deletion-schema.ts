import { z } from 'zod';
import { normalizeCpf } from './cpf';

export const deletionSchema = z
  .object({
    fullName: z.string().min(3, 'Nome completo é obrigatório (mínimo 3 caracteres)'),
    email: z.string().email('E-mail inválido'),
    cpf: z
      .string()
      .min(1, 'CPF é obrigatório')
      .transform(normalizeCpf)
      .refine((v) => v.length === 11, 'CPF deve ter 11 dígitos'),
    phone: z.string().optional().transform((v) => v?.replace(/\D/g, '') || undefined),
    deletionScope: z.enum(['full_account', 'specific_data']),
    specificDataDetails: z.string().optional(),
    reason: z.string().optional(),
    consentConfirmed: z
      .boolean()
      .refine((v) => v === true, {
        message: 'Você precisa confirmar que é o titular da conta',
      }),
    source: z.enum(['web', 'app_webview']).default('web'),
    turnstileToken: z.string().min(1, 'Captcha inválido'),
  })
  .refine(
    (data) => {
      if (data.deletionScope === 'specific_data') {
        return !!data.specificDataDetails?.trim();
      }
      return true;
    },
    {
      message: 'Descreva quais dados específicos deseja excluir',
      path: ['specificDataDetails'],
    }
  );

export type DeletionFormData = z.input<typeof deletionSchema>;
export type DeletionPayload = z.output<typeof deletionSchema>;
