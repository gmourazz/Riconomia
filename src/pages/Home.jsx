import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Home as HomeIcon, TrendingUp } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const { toast } = useToast();

  const features = [
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: 'Planeje sua Aposentadoria',
      description: 'Descubra quanto você precisa economizar para se aposentar com tranquilidade.',
      link: '/calculadora-aposentadoria',
      implemented: true,
    },
    {
      icon: <HomeIcon className="h-10 w-10 text-primary" />,
      title: 'Simule seu Financiamento',
      description: 'Calcule as parcelas e o custo total do seu próximo grande investimento.',
      link: '/calculadora-financiamento',
      implemented: true,
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
      title: 'Avalie Ações',
      description: 'Use modelos como CAPM e Gordon para analisar o valor de ações.',
      link: '/calculadora-capm',
      implemented: true,
    },
  ];

  const blogPosts = [
    {
      slug: '5-estrategias-para-sair-das-dividas',
      title: '5 Estratégias Eficazes para Sair das Dívidas',
      summary: 'Dívidas estão tirando seu sono? Conheça estratégias práticas para organizar suas finanças e se livrar delas.',
      imageAlt: "Pessoa cortando um cartão de crédito ao meio, simbolizando o fim das dívidas."
    },
    {
      slug: 'importancia-da-diversificacao-de-carteira',
      title: 'A Importância da Diversificação de Carteira',
      summary: 'Não coloque todos os ovos na mesma cesta. Entenda por que diversificar é crucial para proteger seus investimentos.',
      imageAlt: "Gráfico de pizza com diferentes classes de ativos, representando uma carteira diversificada."
    },
    {
      slug: 'como-montar-reserva-de-emergencia',
      title: 'Como Montar sua Reserva de Emergência',
      summary: 'Construa seu colchão de segurança financeira. Um guia completo para calcular e investir sua reserva.',
      imageAlt: "Um cofre-porquinho seguro ao lado de um kit de primeiros socorros, simbolizando segurança financeira."
    },
  ];

  const handleFeatureClick = (implemented, e) => {
    if (!implemented) {
        e.preventDefault();
        toast({
            title: "🚧 Funcionalidade em breve!",
            description: "Esta calculadora ainda não foi implementada. Você pode solicitar na próxima interação! 🚀",
        });
    }
  };

  return (
    <PageWrapper title="Página Inicial" description="RICONOMIA, seu guia simples para investir e planejar o futuro. Acesse calculadoras e artigos sobre finanças pessoais.">
      <div className="bg-background">
        <section className="py-20 md:py-32 bg-gradient-to-br from-background to-card/50">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold text-foreground mb-6"
            >
              Seu guia simples para investir e planejar o futuro
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
            >
              Tome decisões financeiras mais inteligentes com nossas ferramentas e artigos. Transforme sua relação com o dinheiro.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button asChild size="lg">
                <Link to="/ferramentas">
                  Acesse as calculadoras <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Ferramentas Essenciais para Você</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border"
                >
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                   <Button asChild variant="link" className="p-0 text-primary" onClick={(e) => handleFeatureClick(feature.implemented, e)}>
                      <Link to={feature.link}>
                        Acessar agora <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Últimas do Nosso Blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="bg-card rounded-xl shadow-lg overflow-hidden group border"
                >
                  <Link to={`/artigos/${post.slug}`} className="block">
                    <img  className="w-full h-56 object-cover" alt={post.imageAlt} src="https://images.unsplash.com/photo-1548778052-311f4bc2b502" />
                    <div className="p-8">
                      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                      <p className="text-muted-foreground mb-6 line-clamp-3">{post.summary}</p>
                      <div className="flex items-center text-primary font-semibold">
                        <span>Leia mais</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline">
                <Link to="/artigos">Ver todos os artigos</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default Home;