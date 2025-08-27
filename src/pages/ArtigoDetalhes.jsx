import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Clock } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const ArtigoDetalhes = () => {
  const { slug } = useParams();

  const allArticles = [
    {
      title: "5 Estratégias Eficazes para Sair das Dívidas",
      excerpt: "Assuma o controle da sua vida financeira com um plano de ação claro para eliminar dívidas e construir um futuro próspero.",
      content: `
        <p>Sair das dívidas é um passo crucial para a saúde financeira. Aqui estão cinco estratégias comprovadas:</p>
        <ol>
          <li><strong>Método Bola de Neve:</strong> Pague as dívidas da menor para a maior, ganhando motivação a cada quitação.</li>
          <li><strong>Método Avalancha:</strong> Priorize as dívidas com os maiores juros para economizar mais dinheiro a longo prazo.</li>
          <li><strong>Consolidação de Dívidas:</strong> Junte todas as suas dívidas em um único empréstimo com juros menores.</li>
          <li><strong>Orçamento Base Zero:</strong> Dê um propósito para cada real que você ganha, garantindo que não sobre dinheiro sem destino.</li>
          <li><strong>Renda Extra:</strong> Aumente sua capacidade de pagamento buscando novas fontes de renda.</li>
        </ol>
        <p>Implementar essas estratégias exige disciplina, mas o resultado é a liberdade financeira.</p>
      `,
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
      content: `
        <p>A diversificação é um dos pilares do investimento inteligente. Distribuir seus investimentos por diferentes classes de ativos (ações, títulos, imóveis) e geografias pode proteger seu portfólio de oscilações de mercado. Quando um ativo vai mal, outro pode ir bem, equilibrando seus retornos.</p>
        <p>Lembre-se: o objetivo não é eliminar o risco, mas gerenciá-lo de forma eficaz.</p>
      `,
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
      content: `
        <p>Uma reserva de emergência é o seu escudo contra imprevistos. O ideal é ter de 3 a 6 meses de seus custos de vida guardados em um investimento de alta liquidez e baixo risco, como um CDB com liquidez diária ou o Tesouro Selic.</p>
        <p>Comece com pouco, mas comece hoje. A paz de espírito que uma reserva proporciona não tem preço.</p>
      `,
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
      content: `
        <p>O mercado financeiro é um teste constante para nossas emoções. Medo e ganância podem levar a decisões precipitadas, como vender na baixa e comprar na alta. Entender vieses como o 'efeito manada' e a 'aversão à perda' é o primeiro passo para se tornar um investidor mais disciplinado e bem-sucedido.</p>
        <p>Estude, tenha uma estratégia clara e, acima de tudo, mantenha a calma.</p>
      `,
      slug: "psicologia-do-investidor-erros-comuns",
      date: "02 de Agosto, 2025",
      author: "RICONOMIA",
      category: "Comportamento",
      readTime: "12 min",
      imageAlt: "Duas silhuetas de cabeça, uma com um cérebro calmo e outra com engrenagens caóticas.",
      imageFile: "comportamento.png"
    },
    {
      title: "Renda Fixa vs. Renda Variável: Qual a Melhor para Você?",
      excerpt: "Segurança ou potencial de lucro? Desvende as diferenças, vantagens e desvantagens de cada modalidade para alinhar seus investimentos aos seus objetivos.",
      content: `
        <p>A escolha entre renda fixa e variável depende do seu perfil de risco, objetivos e horizonte de tempo. Renda fixa oferece mais segurança e previsibilidade. Renda variável tem maior potencial de retorno, mas também maior risco.</p>
        <p>A melhor abordagem geralmente envolve uma combinação de ambas, balanceada de acordo com suas necessidades.</p>
      `,
      slug: "renda-fixa-vs-renda-variavel",
      date: "30 de Julho, 2025",
      author: "RICONOMIA",
      category: "Investimentos",
      readTime: "10 min",
      imageAlt: "Uma balança equilibrando renda fixa e variável.",
      imageFile: "investimentos-rendas.png"
    },
    {
      title: "Ideias Criativas para Gerar Renda Extra",
      excerpt: "Explore novas formas de aumentar seus ganhos mensais e acelerar seus objetivos financeiros.",
      content: `
        <p>Gerar renda extra pode ser a chave para acelerar o pagamento de dívidas, investir mais e conquistar objetivos importantes. Aqui estão algumas ideias práticas e criativas:</p>
        <ul>
          <li><strong>Venda produtos artesanais ou usados:</strong> Use plataformas online ou feiras locais.</li>
          <li><strong>Freelance:</strong> Use suas habilidades para oferecer serviços sob demanda.</li>
          <li><strong>Alugue espaços ou objetos:</strong> Desde um quarto vago até ferramentas.</li>
          <li><strong>Crie conteúdo digital:</strong> Vídeos, e-books ou cursos monetizados.</li>
          <li><strong>Economia colaborativa:</strong> Apps de transporte, entrega ou hospedagem.</li>
        </ul>
      `,
      slug: "ideias-criativas-renda-extra",
      date: "25 de Julho, 2025",
      author: "RICONOMIA",
      category: "Renda extra",
      readTime: "7 min",
      imageAlt: "Pessoa trabalhando em um laptop com moedas ao redor.",
      imageFile: "rendaextra.png"
    },
    {
      title: "Curiosidades do Mercado Financeiro que Você Não Sabia",
      excerpt: "Mitos, verdades e fatos interessantes sobre o mundo dos investimentos que podem surpreender você.",
      content: `
        <p>O mercado financeiro está repleto de histórias curiosas e fatos inusitados que mostram sua complexidade e impacto.</p>
      `,
      slug: "curiosidades-mercado-financeiro",
      date: "20 de Julho, 2025",
      author: "RICONOMIA",
      category: "Curiosidades",
      readTime: "6 min",
      imageAlt: "Uma lupa sobre um gráfico financeiro.",
      imageFile: "curiosidades.png"
    },
    {
      title: "Inovação e Tecnologia nas Finanças Pessoais",
      excerpt: "Como a tecnologia está transformando a maneira como gerenciamos nosso dinheiro, de apps a IA.",
      content: `
        <p>A tecnologia está mudando radicalmente a forma como cuidamos das finanças, tornando tudo mais rápido, seguro e acessível.</p>
      `,
      slug: "inovacao-tecnologia-financas",
      date: "15 de Julho, 2025",
      author: "RICONOMIA",
      category: "Inovação",
      readTime: "8 min",
      imageAlt: "Ícones de tecnologia e finanças se misturando.",
      imageFile: "inovacao-tecnologia-financas.png"
    }
  ];

  const article = allArticles.find(a => a.slug === slug);

  if (!article) {
    return (
      <PageWrapper title="Artigo não encontrado" description="O artigo que você procura não foi encontrado.">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Artigo não encontrado</h1>
          <Link to="/artigos" className="text-primary hover:underline">Voltar para artigos</Link>
        </div>
      </PageWrapper>
    );
  }

  const createMarkup = (htmlString) => ({ __html: htmlString });

  return (
    <PageWrapper title={article.title} description={article.excerpt}>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-card p-8 rounded-xl shadow-lg border"
        >
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6 flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Artigos
          </Button>

          <h1 className="text-4xl font-extrabold text-foreground mb-4">{article.title}</h1>
          <div className="flex items-center text-muted-foreground text-sm mb-6 space-x-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{article.readTime}</span>
            </div>
          </div>
          <img 
            src={`/img/${article.imageFile}`}
            alt={article.imageAlt}
            className="w-full h-auto rounded-lg my-8"
            loading="lazy"
            decoding="async"
          />
          <div className="prose dark:prose-invert max-w-none mt-8 text-lg/relaxed" dangerouslySetInnerHTML={createMarkup(article.content)}></div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default ArtigoDetalhes;
