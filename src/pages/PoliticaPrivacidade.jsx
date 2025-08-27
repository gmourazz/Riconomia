import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import { Shield, Eye, Lock, UserCheck } from 'lucide-react';

const PoliticaPrivacidade = () => {
  return (
    <PageWrapper title="Política de Privacidade" description="Conheça nossa política de privacidade e como protegemos seus dados pessoais. Transparência total sobre coleta, uso e proteção de informações na RICONOMIA.">
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Política de Privacidade
            </h1>
            <p className="text-xl text-muted-foreground">
              Última atualização: 11 de Agosto, 2025
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary prose-li:marker:text-primary">
            <div className="bg-card p-6 rounded-lg border mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Nosso Compromisso com sua Privacidade
              </h2>
              <p>
                A RICONOMIA está comprometida em proteger sua privacidade e dados pessoais. 
                Esta política explica como coletamos, usamos, armazenamos e protegemos suas informações 
                quando você utiliza nosso site e ferramentas.
              </p>
            </div>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Informações que Coletamos
                </h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Informações Fornecidas Voluntariamente
                </h3>
                <ul className="space-y-2">
                  <li>• Nome e endereço de email (quando você nos contata)</li>
                  <li>• Dados inseridos nas calculadoras (armazenados localmente no seu dispositivo)</li>
                  <li>• Preferências de tema (modo claro/escuro)</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                  Informações Coletadas Automaticamente
                </h3>
                <ul className="space-y-2">
                  <li>• Endereço IP e localização aproximada</li>
                  <li>• Tipo de navegador e sistema operacional</li>
                  <li>• Páginas visitadas e tempo de permanência</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <UserCheck className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Como Usamos suas Informações
                </h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <ul className="space-y-3">
                  <li>
                    <strong>Funcionamento do Site:</strong> Para fornecer e melhorar nossos serviços, 
                    incluindo o funcionamento das calculadoras e ferramentas.
                  </li>
                  <li>
                    <strong>Comunicação:</strong> Para responder suas dúvidas e sugestões.
                  </li>
                  <li>
                    <strong>Melhorias:</strong> Para analisar como o site é usado e identificar 
                    oportunidades de melhoria na experiência do usuário.
                  </li>
                  <li>
                    <strong>Segurança:</strong> Para proteger nosso site contra fraudes e uso inadequado.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Armazenamento e Proteção de Dados
                </h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Armazenamento Local
                </h3>
                <p className="mb-4">
                  Os dados inseridos nas calculadoras são armazenados localmente no seu navegador 
                  (localStorage) e não são enviados para nossos servidores. Isso significa que seus cálculos são privados e ficam apenas no seu dispositivo.
                </p>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Medidas de Segurança
                </h3>
                <ul className="space-y-2">
                  <li>• Conexão segura HTTPS em todo o site</li>
                  <li>• Servidores protegidos com firewalls e monitoramento</li>
                  <li>• Acesso restrito aos dados por nossa equipe</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Compartilhamento de Informações
              </h2>
              
              <div className="bg-card p-6 rounded-lg border">
                <p className="mb-4">
                  <strong>Não vendemos, alugamos ou compartilhamos</strong> suas informações pessoais 
                  com terceiros para fins comerciais.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Seus Direitos
              </h2>
              
              <div className="bg-card p-6 rounded-lg border">
                <p className="mb-4">
                  De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a acessar, corrigir e solicitar a exclusão de seus dados.
                </p>
                <p>
                  Para exercer esses direitos, entre em contato conosco através do email 
                  <strong> contato@riconomia.com.br</strong>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Contato
              </h2>
              
              <div className="bg-card p-6 rounded-lg border">
                <p className="mb-4">
                  Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco:
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

export default PoliticaPrivacidade;