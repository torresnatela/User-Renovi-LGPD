'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { deletionSchema, type DeletionFormData } from '@/lib/validation/deletion-schema';
import { FormField } from './FormField';
import { TurnstileWidget } from './TurnstileWidget';

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

interface DeletionFormProps {
  source: 'web' | 'app_webview';
}

export function DeletionForm({ source }: DeletionFormProps) {
  const router = useRouter();
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DeletionFormData>({
    resolver: zodResolver(deletionSchema),
    defaultValues: {
      deletionScope: 'full_account',
      source,
    },
  });

  const deletionScope = watch('deletionScope');

  const onSubmit = async (formData: DeletionFormData) => {
    if (!turnstileToken) {
      setServerError('Por favor, complete o captcha antes de enviar.');
      return;
    }
    setIsSubmitting(true);
    setServerError('');

    try {
      const res = await fetch('/api/exclusao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });

      const json = await res.json();

      if (res.status === 201) {
        router.push(`/exclusao-de-conta/sucesso?protocolo=${json.protocol}`);
        return;
      }

      if (res.status === 429) {
        setServerError('Limite de solicitações atingido. Tente novamente em 1 hora.');
        return;
      }

      if (res.status === 403) {
        setServerError('Captcha inválido. Recarregue a página e tente novamente.');
        return;
      }

      setServerError(
        json.error ?? 'Ocorreu um erro. Tente novamente ou entre em contato com privacidade@renovisaude.com.br.'
      );
    } catch {
      setServerError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <input type="hidden" {...register('source')} value={source} />

      <FormField
        label="Nome completo"
        required
        autoComplete="name"
        placeholder="Seu nome completo"
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <FormField
        label="E-mail cadastrado no app"
        required
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="seuemail@exemplo.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <FormField
        label="CPF"
        required
        inputMode="numeric"
        autoComplete="off"
        placeholder="000.000.000-00"
        error={errors.cpf?.message}
        {...register('cpf', {
          onChange: (e) => {
            e.target.value = formatCpf(e.target.value);
          },
        })}
      />

      <FormField
        label="Telefone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="(11) 99999-9999"
        hint="Opcional — facilita a verificação de identidade"
        error={errors.phone?.message}
        {...register('phone')}
      />

      {/* Escopo da exclusão */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-gray-700">
          O que você quer excluir? <span className="text-red-500" aria-hidden="true">*</span>
        </legend>

        <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
          <input
            type="radio"
            value="full_account"
            className="mt-0.5 accent-red-600 w-4 h-4 flex-shrink-0"
            {...register('deletionScope')}
          />
          <div>
            <span className="text-sm font-medium text-gray-800">Toda a conta e dados pessoais</span>
            <p className="text-xs text-gray-500 mt-0.5">
              Remove todos os dados associados à sua conta na Renovi Saúde.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
          <input
            type="radio"
            value="specific_data"
            className="mt-0.5 accent-red-600 w-4 h-4 flex-shrink-0"
            {...register('deletionScope')}
          />
          <div>
            <span className="text-sm font-medium text-gray-800">Apenas dados específicos</span>
            <p className="text-xs text-gray-500 mt-0.5">
              Mantenha a conta ativa, mas remova dados selecionados.
            </p>
          </div>
        </label>

        {deletionScope === 'specific_data' && (
          <FormField
            as="textarea"
            label="Quais dados específicos?"
            required
            placeholder="Descreva os dados que deseja excluir..."
            rows={3}
            error={errors.specificDataDetails?.message}
            {...register('specificDataDetails')}
          />
        )}
      </fieldset>

      <FormField
        as="textarea"
        label="Motivo (opcional)"
        placeholder="Por que você está solicitando a exclusão?"
        rows={3}
        error={errors.reason?.message}
        {...register('reason')}
      />

      <div className="flex flex-col gap-2">
        <TurnstileWidget
          onSuccess={(token) => {
            setTurnstileToken(token);
            setValue('turnstileToken' as keyof DeletionFormData, token as string);
          }}
          onExpire={() => setTurnstileToken('')}
          onError={() => setTurnstileToken('')}
        />
        {errors.turnstileToken && (
          <p className="text-xs text-red-600 text-center">{errors.turnstileToken.message}</p>
        )}
      </div>

      <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
        <input
          type="checkbox"
          className="mt-0.5 accent-red-600 w-4 h-4 flex-shrink-0"
          {...register('consentConfirmed')}
        />
        <span className="text-sm text-gray-700">
          Confirmo que sou o titular desta conta e desejo solicitar a exclusão dos meus dados pessoais junto à Renovi Saúde.
        </span>
      </label>
      {errors.consentConfirmed && (
        <p className="text-xs text-red-600 -mt-3">{errors.consentConfirmed.message}</p>
      )}

      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3.5 px-6 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
      </button>
    </form>
  );
}
