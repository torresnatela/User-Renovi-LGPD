interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata = {
  title: 'Solicitação recebida — Renovi Saúde',
};

export default async function SucessoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const protocolo = typeof params['protocolo'] === 'string' ? params['protocolo'] : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Solicitação recebida!</h1>
          <p className="text-sm text-gray-500">
            Seu pedido de exclusão de dados foi registrado com sucesso.
          </p>
        </div>

        {protocolo && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col gap-1">
            <p className="text-xs text-green-700 font-medium">Número do protocolo</p>
            <p className="text-2xl font-bold text-green-800 tracking-wider">{protocolo}</p>
            <p className="text-xs text-green-600">Guarde este número para acompanhar sua solicitação.</p>
          </div>
        )}

        <div className="flex flex-col gap-3 text-sm text-gray-600 text-left">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 mt-0.5 flex-shrink-0">✉</span>
            <p>Enviamos uma confirmação para o seu e-mail com os detalhes da solicitação.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-500 mt-0.5 flex-shrink-0">⏱</span>
            <p>
              Vamos verificar sua identidade e concluir a exclusão em até{' '}
              <strong>15 dias úteis</strong>, conforme o Art. 18, §5º da LGPD.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400">
            Dúvidas? Entre em contato com{' '}
            <a
              href="mailto:privacidade@renovisaude.com.br"
              className="text-red-600 hover:underline font-medium"
            >
              privacidade@renovisaude.com.br
            </a>
            {protocolo && (
              <> informando o protocolo <strong>{protocolo}</strong></>
            )}
            .
          </p>
        </div>
      </div>
    </div>
  );
}
