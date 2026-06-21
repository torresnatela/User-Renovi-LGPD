import { maskCpf } from '@/lib/validation/cpf';

interface TeamEmailData {
  protocol: string;
  fullName: string;
  email: string;
  cpf: string;
  phone?: string;
  deletionScope: 'full_account' | 'specific_data';
  specificDataDetails?: string;
  source: 'web' | 'app_webview';
  createdAt: Date;
}

interface UserEmailData {
  protocol: string;
  fullName: string;
  email: string;
}

export function teamEmailHtml(data: TeamEmailData): string {
  const scopeLabel =
    data.deletionScope === 'full_account'
      ? 'Toda a conta e dados pessoais'
      : `Dados específicos: ${data.specificDataDetails || '(não informado)'}`;

  const sourceLabel = data.source === 'app_webview' ? 'App (WebView)' : 'Web';
  const dateStr = data.createdAt.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Nova solicitação de exclusão</title></head>
<body style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #dc2626;">Nova solicitação de exclusão de dados</h2>
  <p><strong>Protocolo:</strong> ${data.protocol}</p>
  <table style="border-collapse: collapse; width: 100%;">
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 8px 0; width: 40%; color: #6b7280;">Nome</td>
      <td style="padding: 8px 0;"><strong>${data.fullName}</strong></td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 8px 0; color: #6b7280;">E-mail</td>
      <td style="padding: 8px 0;">${data.email}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 8px 0; color: #6b7280;">CPF (mascarado)</td>
      <td style="padding: 8px 0;">${maskCpf(data.cpf)}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 8px 0; color: #6b7280;">Telefone</td>
      <td style="padding: 8px 0;">${data.phone || '(não informado)'}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 8px 0; color: #6b7280;">Escopo</td>
      <td style="padding: 8px 0;">${scopeLabel}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 8px 0; color: #6b7280;">Origem</td>
      <td style="padding: 8px 0;">${sourceLabel}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #6b7280;">Data/hora</td>
      <td style="padding: 8px 0;">${dateStr}</td>
    </tr>
  </table>
  <hr style="margin: 24px 0; border-color: #e5e7eb;" />
  <p style="background: #fef3c7; padding: 16px; border-radius: 8px; font-size: 14px;">
    Consulte o registro completo no banco com:<br>
    <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-size: 13px;">
      SELECT * FROM dsr_requests WHERE protocol = '${data.protocol}';
    </code><br><br>
    Após verificar a identidade, processe a exclusão na plataforma Renovi e atualize o status:
    <br>
    <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-size: 13px;">
      UPDATE dsr_requests SET status='completed', completed_at=now(), updated_at=now() WHERE protocol='${data.protocol}';
    </code>
  </p>
  <p style="color: #6b7280; font-size: 13px;">SLA: responder em ≤7 dias úteis; concluir em ≤15 dias úteis.</p>
</body>
</html>`;
}

export function userEmailHtml(data: UserEmailData): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Solicitação de exclusão recebida</title></head>
<body style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #16a34a;">Recebemos sua solicitação ✓</h2>
  <p>Olá, <strong>${data.fullName}</strong>!</p>
  <p>Confirmamos o recebimento da sua solicitação de exclusão de dados pessoais junto à <strong>Renovi Saúde</strong>.</p>
  <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin: 24px 0;">
    <p style="margin: 0; font-size: 14px; color: #15803d;">Número do protocolo</p>
    <p style="margin: 4px 0 0; font-size: 22px; font-weight: bold; letter-spacing: 0.05em;">${data.protocol}</p>
  </div>
  <p><strong>Próximos passos:</strong></p>
  <ol style="line-height: 1.8;">
    <li>Nossa equipe irá verificar sua identidade com base nos dados fornecidos.</li>
    <li>Após confirmação, seus dados serão excluídos conforme a legislação vigente.</li>
    <li>Você receberá uma confirmação de conclusão por e-mail.</li>
  </ol>
  <p><strong>Prazo:</strong> até <strong>15 dias úteis</strong> a partir da confirmação de identidade (Art. 18, §5º da LGPD).</p>
  <p>Dúvidas? Entre em contato com <a href="mailto:privacidade@renovisaude.com.br">privacidade@renovisaude.com.br</a> informando o número do protocolo.</p>
  <hr style="margin: 24px 0; border-color: #e5e7eb;" />
  <p style="color: #6b7280; font-size: 12px;">
    Renovi Saúde — Canal oficial de privacidade e exclusão de dados.<br>
    Este e-mail é uma confirmação automática. Não responda a esta mensagem.
  </p>
</body>
</html>`;
}
