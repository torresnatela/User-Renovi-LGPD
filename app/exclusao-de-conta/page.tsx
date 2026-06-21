import { Suspense } from 'react';
import { InfoAccordion } from '@/components/InfoAccordion';
import { DeletionFormWrapper } from './DeletionFormWrapper';

export const metadata = {
  title: 'Excluir minha conta — Renovi Saúde',
  description:
    'Canal oficial da Renovi Saúde para solicitar a exclusão da sua conta e dados pessoais conforme a LGPD.',
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ExclusaoDeConta({ searchParams }: PageProps) {
  const params = await searchParams;
  const isApp = params['source'] === 'app';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isApp && (
        <header className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-gray-800">Renovi Saúde</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">Central de Privacidade</span>
          </div>
        </header>
      )}

      <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Título e aviso */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-gray-900">Excluir minha conta</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Este é o canal oficial da <strong>Renovi Saúde</strong> (desenvolvedor:{' '}
            <strong>[RAZÃO SOCIAL LEGAL]</strong>) para solicitar a exclusão da sua conta e dos
            dados pessoais associados.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Após confirmarmos sua identidade, seus dados serão excluídos em até{' '}
            <strong>15 dias úteis</strong>. Por exigência legal, alguns dados podem ser retidos
            pelos prazos previstos em lei.{' '}
            <a
              href="https://renovisaude.com.br/politica-privacidade"
              className="text-red-600 underline hover:text-red-700"
            >
              Saiba mais na nossa Política de Privacidade
            </a>
            .
          </p>
        </div>

        {/* Acordeons informativos */}
        <section className="flex flex-col gap-2" aria-label="Informações sobre a exclusão">
          <InfoAccordion title="Como solicitar a exclusão de dados">
            <p className="mb-2">
              Preencha o formulário abaixo com seus dados cadastrais na Renovi Saúde. Um número de
              protocolo será gerado e enviado ao seu e-mail.
            </p>
            <p className="mb-2">
              Nossa equipe verificará sua identidade e processará a solicitação em até{' '}
              <strong>15 dias úteis</strong> contados a partir da confirmação.
            </p>
            <p>
              Você receberá uma confirmação por e-mail ao concluir o processo, com informações sobre
              quais dados foram eliminados e quais foram retidos por obrigação legal.
            </p>
          </InfoAccordion>

          <InfoAccordion title="Dados que não podem ser excluídos">
            <p className="mb-3">
              De acordo com o Art. 16 da LGPD, alguns dados devem ser mantidos mesmo após
              solicitação de exclusão, quando houver obrigação legal ou regulatória:
            </p>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 border border-gray-200 font-semibold">Obrigação</th>
                    <th className="text-left p-2 border border-gray-200 font-semibold">Dados Retidos</th>
                    <th className="text-left p-2 border border-gray-200 font-semibold">Base Legal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-200 font-medium">ANS</td>
                    <td className="p-2 border border-gray-200">
                      Registros de atendimentos de saúde, dados de beneficiários
                    </td>
                    <td className="p-2 border border-gray-200">
                      Regulação setorial de saúde suplementar (Lei nº 9.656/98)
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border border-gray-200 font-medium">eSocial</td>
                    <td className="p-2 border border-gray-200">
                      Dados trabalhistas e previdenciários transmitidos ao governo
                    </td>
                    <td className="p-2 border border-gray-200">
                      Obrigações trabalhistas e fiscais (CLT, Lei nº 8.212/91)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 font-medium">NR-1</td>
                    <td className="p-2 border border-gray-200">
                      Registros de conformidade em saúde e segurança do trabalho
                    </td>
                    <td className="p-2 border border-gray-200">
                      Legislação trabalhista (Portaria MTE nº 3.214/78)
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border border-gray-200 font-medium">Fiscal e contábil</td>
                    <td className="p-2 border border-gray-200">
                      Dados para escrituração fiscal e emissão de notas
                    </td>
                    <td className="p-2 border border-gray-200">
                      Código Tributário Nacional, legislação fiscal aplicável
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 font-medium">Contratos vigentes</td>
                    <td className="p-2 border border-gray-200">
                      Dados necessários para execução de contrato ativo com a Renovi Saúde
                    </td>
                    <td className="p-2 border border-gray-200">
                      LGPD Art. 16, I — cumprimento de obrigação legal ou regulatória
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Nesses casos, os dados serão mantidos pelo prazo estritamente necessário, com acesso
              restrito, e eliminados assim que a obrigação cessar.
            </p>
          </InfoAccordion>

          <InfoAccordion title="O que acontece após a exclusão">
            <p className="mb-3">
              Após o processamento da sua solicitação, a <strong>Renovi Saúde</strong> realizará as
              seguintes ações:
            </p>
            <ul className="flex flex-col gap-2 mb-3">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                <span>
                  <strong>Confirmação por e-mail:</strong> você receberá uma confirmação detalhando
                  quais dados foram eliminados.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                <span>
                  <strong>Eliminação dos dados:</strong> seus dados pessoais serão removidos dos
                  sistemas ativos, backups recentes e sistemas de parceiros (quando aplicável).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                <span>
                  <strong>Desativação de conta:</strong> caso possua conta no portal corporativo,
                  ela será desativada permanentemente.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                <span>
                  <strong>Remoção de marketing:</strong> seu e-mail será removido de todas as listas
                  de newsletter e remarketing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                <span>
                  <strong>Notificação aos operadores:</strong> nossos parceiros (Doc24, ePharma,
                  Grupo Zelo, OdontoPrev) serão notificados para também excluírem seus dados.
                </span>
              </li>
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <strong>Atenção:</strong> a exclusão dos dados é irreversível. Caso deseje utilizar os
              serviços da Renovi Saúde novamente, será necessário realizar um novo cadastro.
            </div>
          </InfoAccordion>

          <InfoAccordion title="Prazo para exclusão">
            <p className="mb-2">
              Conforme previsto no <strong>Art. 18, §5º da LGPD</strong>, sua solicitação de
              exclusão será processada em até <strong>15 (quinze) dias úteis</strong> contados a
              partir da confirmação de identidade do titular.
            </p>
            <p className="mb-2">
              O prazo poderá ser estendido em casos de complexidade técnica excepcional, sendo o
              titular informado sobre a necessidade de prorrogação e o novo prazo estimado.
            </p>
            <p className="text-xs text-gray-500">
              Na confirmação de exclusão, informaremos quais dados (se houver) foram retidos por
              obrigação legal ou regulatória, com a respectiva justificativa e prazo estimado de
              retenção.
            </p>
          </InfoAccordion>
        </section>

        {/* Formulário */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Formulário de solicitação</h2>
          <Suspense fallback={null}>
            <DeletionFormWrapper />
          </Suspense>
        </section>
      </main>

      {!isApp && (
        <footer className="border-t border-gray-200 px-4 py-6 mt-8">
          <div className="max-w-lg mx-auto text-center text-xs text-gray-400 flex flex-col gap-1">
            <p>Renovi Saúde — Canal oficial de privacidade</p>
            <p>
              Dúvidas?{' '}
              <a
                href="mailto:privacidade@renovisaude.com.br"
                className="text-red-600 hover:underline"
              >
                privacidade@renovisaude.com.br
              </a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
