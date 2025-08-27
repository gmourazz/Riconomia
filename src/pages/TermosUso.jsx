import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import { FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const TermosUso = () => {
  return (
    <PageWrapper title="Termos de Uso" description="Leia nossos termos de uso e condições para utilização da RICONOMIA. Conheça seus direitos e responsabilidades ao usar nossas ferramentas financeiras.">
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Termos de Uso
            </h1>
            <p className="text-xl text-muted-foreground">
              Última atualização: 11 de Agosto, 2025
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary prose-li:marker:text-primary">
            <div className="bg-card p-6 rounded-lg border mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Bem-vindo à RICONOMIA
              </h2>
              <p>
                Estes termos de uso estabelecem as regras e condições para utilização do nosso site 
                e ferramentas. Ao acessar e usar a RICONOMIA, você concorda com estes termos.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Aceitação dos Termos
              </h2>
              
              <div className="bg-card p-6 rounded-lg border">
                <p className="mb-4">
                  Ao acessar e usar o site RICONOMIA, você declara que leu, compreendeu e concorda com estes termos e usará o site de acordo com todas as leis aplicáveis.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Descrição dos Serviços
              </h2>
              
              <div className="bg-card p-6 rounded-lg border">
                <p className="mb-4">
                  A RICONOMIA oferece calculadoras financeiras, conteúdo educativo e ferramentas de planejamento.
                </p>
                <p>
                  <strong>Importante:</strong> Nossos serviços são exclusivamente educativos e informativos. 
                  Não oferecemos consultoria financeira personalizada ou recomendações de investimento específicas.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">
                  3. Uso Permitido
                </h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <p>
                  Você pode usar nosso site para realizar cálculos financeiros pessoais, ler e compartilhar nosso conteúdo educativo e aprender sobre finanças.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">
                  4. Uso Proibido
                </h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <p>
                  É expressamente proibido usar o site para atividades ilegais, tentar hackear ou danificar o site, copiar nosso conteúdo sem autorização ou transmitir vírus.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">
                  5. Limitações e Responsabilidades
                </h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Natureza Educativa
                </h3>
                <p className="mb-4">
                  Todas as informações e ferramentas fornecidas são para fins educativos. 
                  Não constituem aconselhamento financeiro, de investimento ou fiscal personalizado.
                </p>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Limitação de Responsabilidade
                </h3>
                <p>
                  A RICONOMIA não se responsabiliza por perdas ou danos decorrentes do uso das 
                  informações ou ferramentas. Sempre consulte um profissional 
                  qualificado antes de tomar decisões financeiras importantes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Propriedade Intelectual
              </h2>
              
              <div className="bg-card p-6 rounded-lg border">
                <p>
                  Todo o conteúdo da RICONOMIA, incluindo textos, gráficos, logos e software, é nossa propriedade ou de nossos licenciadores e está protegido por leis de direitos autorais.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Privacidade e Dados
              </h2>
              
              <div className="bg-card p-6 rounded-lg border">
                <p>
                  O tratamento de seus dados pessoais é regido por nossa 
                  <a href="/politica-de-privacidade" className="mx-1">
                    Política de Privacidade
                  </a>
                  , que faz parte integrante destes termos.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. Contato
              </h2>
              
              <div className="bg-card p-6 rounded-lg border">
                <p className="mb-4">
                  Se você tiver dúvidas sobre estes termos de uso, entre em contato conosco:
                </p>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> contato@riconomia.com.br</li>
                  <li><strong>Formulário:</strong> <a href="/contato">Página de Contato</a></li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default TermosUso;