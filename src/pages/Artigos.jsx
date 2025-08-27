import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Artigos = () => {
  const { toast } = useToast();

  const allArticles = [
    {
      title: "5 Estratégias Eficazes para Sair das Dívidas",
      excerpt: "Assuma o controle da sua vida financeira com um plano de ação claro para eliminar dívidas e construir um futuro próspero.",
      slug: "5-estrategias-para-sair-das-dividas",
      date: "10 de Agosto, 2025",
      author: "RICONOMIA",
      category: "Finanças Pessoais",
      readTime: "9 min",
      imageAlt: "Pessoa cortando um cartão de crédito ao meio, simbolizando o fim das dívidas.",
      imageFile: "financaspessoais.png"
    },
    {
      title: "A Importância da Diversificação de Carteira",
      excerpt: "Não coloque todos os ovos na mesma cesta. Entenda por que diversificar seus investimentos é crucial para reduzir riscos e otimizar retornos.",
      slug: "importancia-da-diversificacao-de-carteira",
      date: "08 de Agosto, 2025",
      author: "RICONOMIA",
      category: "Investimentos",
      readTime: "11 min",
      imageAlt: "Gráfico de pizza com diferentes classes de ativos, representando uma carteira diversificada.",
      imageFile: "investimentos-importanciacarteira.png"
    },
    {
      title: "Como Montar sua Reserva de Emergência Passo a Passo",
      excerpt: "Construa seu colchão de segurança financeira. Um guia completo para calcular, poupar e investir sua reserva de emergência.",
      slug: "como-montar-reserva-de-emergencia",
      date: "05 de Agosto, 2025",
      author: "RICONOMIA",
      category: "Planejamento",
      readTime: "8 min",
      imageAlt: "Um cofre-porquinho seguro ao lado de um kit de primeiros socorros, simbolizando segurança financeira.",
      imageFile: "planejamento.png"
    },
    {
      title: "Psicologia do Investidor: Como Evitar Erros Comuns",
      excerpt: "Suas emoções podem ser suas piores inimigas nos investimentos. Aprenda a identificar vieses comportamentais e a tomar decisões mais racionais.",
      slug: "psicologia-do-investidor-erros-comuns",
      date: "02 de Agosto, 2025",
      author: "RICONOMIA",
      category: "Comportamento",
      readTime: "12 min",
      imageAlt: "Duas silhuetas de cabeça, uma com um cérebro calmo e outra com engrenagens caóticas, representando a psicologia do investidor.",
      imageFile: "comportamento.png"
    },
    {
      title: "Renda Fixa vs. Renda Variável: Qual a Melhor para Você?",
      excerpt: "Segurança ou potencial de lucro? Desvende as diferenças, vantagens e desvantagens de cada modalidade para alinhar seus investimentos aos seus objetivos.",
      slug: "renda-fixa-vs-renda-variavel",
      date: "30 de Julho, 2025",
      author: "RICONOMIA",
      category: "Investimentos",
      readTime: "10 min",
      imageAlt: "Uma balança equilibrando um título de renda fixa e uma ação de empresa, comparando os dois tipos de investimento.",
      imageFile: "investimentos-rendas.png"
    },
    {
      title: "Ideias Criativas para Gerar Renda Extra",
      excerpt: "Explore novas formas de aumentar seus ganhos mensais e acelerar seus objetivos financeiros.",
      slug: "ideias-criativas-renda-extra",
      date: "25 de Julho, 2025",
      author: "RICONOMIA",
      category: "Renda extra",
      readTime: "7 min",
      imageAlt: "Pessoa trabalhando em um laptop com moedas e notas ao redor, simbolizando renda extra.",
      imageFile: "rendaextra.png"
    },
    {
      title: "Curiosidades do Mercado Financeiro que Você Não Sabia",
      excerpt: "Mitos, verdades e fatos interessantes sobre o mundo dos investimentos que podem surpreender você.",
      slug: "curiosidades-mercado-financeiro",
      date: "20 de Julho, 2025",
      author: "RICONOMIA",
      category: "Curiosidades",
      readTime: "6 min",
      imageAlt: "Uma lupa sobre um gráfico financeiro, destacando detalhes curiosos.",
      imageFile: "curiosidades.png"
    },
    {
      title: "Inovação e Tecnologia nas Finanças Pessoais",
      excerpt: "Como a tecnologia está transformando a maneira como gerenciamos nosso dinheiro, de apps a IA.",
      slug: "inovacao-tecnologia-financas",
      date: "15 de Julho, 2025",
      author: "RICONOMIA",
      category: "Inovação",
      readTime: "8 min",
      imageAlt: "Ícones de tecnologia e finanças se misturando, representando inovação no setor.",
      imageFile: "inovacao-tecnologia-financas.png"
    }
  ];

  const allCategories = ["Todos", "Finanças Pessoais", "Investimentos", "Planejamento", "Comportamento", "Renda extra", "Curiosidades", "Inovação"];
  const [filteredArticles, setFilteredArticles] = useState(allArticles);
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filterByCategory = (category) => {
    setActiveCategory(category);
    if (category === "Todos") {
      setFilteredArticles(allArticles);
    } else {
      setFilteredArticles(allArticles.filter(article => article.category === category));
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Inscrição em breve!",
      description: "🚧 Este recurso ainda não foi implementado.",
    });
  };

  return (
    <PageWrapper title="Artigos - Riconomia" description="Aprenda sobre finanças pessoais e investimentos com nossos artigos educativos.">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            <BookOpen className="mx-auto h-16 w-16 text-primary mb-4" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Blog da RICONOMIA</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Conhecimento é o melhor investimento. Explore nossos artigos e fortaleça sua jornada financeira.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          {allCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => filterByCategory(category)}
              className="rounded-full px-4 py-2 text-sm sm:text-base"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/artigos/${article.slug}`} className="block group">
                <div className="bg-card border rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="relative">
                    <img
                      className="w-full h-56 object-cover"
                      alt={article.imageAlt}
                      src={`/img/${article.imageFile}`}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold z-10">
                      {article.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{article.title}</h2>
                    <p className="text-muted-foreground mb-4 flex-grow">{article.excerpt}</p>
                    <div className="text-sm text-muted-foreground flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <span>Leia mais</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-card border rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Junte-se à nossa comunidade</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Receba as melhores análises e dicas de finanças diretamente no seu e-mail. Totalmente gratuito.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-primary focus:border-primary"
              required
            />
            <Button type="submit" className="whitespace-nowrap">Inscrever-se</Button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Artigos;
