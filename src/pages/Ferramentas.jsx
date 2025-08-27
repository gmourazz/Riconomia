import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const Ferramentas = () => {
  const { toast } = useToast();

  const tools = [
    { name: 'Calculadora de Salário Líquido', description: 'Descubra o valor líquido do seu salário após todos os descontos.', link: '/calculadora-salario-liquido', implemented: true },
    { name: 'Calculadora de 13º Salário', description: 'Calcule o valor exato do seu 13º salário, incluindo descontos.', link: '/calculadora-decimo-terceiro', implemented: true },
    { name: 'Calculadora de Custo de Vida', description: 'Organize suas finanças e entenda para onde seu dinheiro está indo.', link: '/calculadora-custo-de-vida', implemented: true },
    { name: 'Calculadora de Aposentadoria', description: 'Planeje seu futuro e descubra quanto precisa para se aposentar.', link: '/calculadora-aposentadoria', implemented: true },
    { name: 'Calculadora de Financiamento', description: 'Simule as parcelas e o custo total de um financiamento.', link: '/calculadora-financiamento', implemented: true },
    { name: 'Calculadora CAPM', description: 'Calcule o retorno esperado de um ativo com o Capital Asset Pricing Model.', link: '/calculadora-capm', implemented: true },
    { name: 'Modelo de Gordon', description: 'Estime o valor intrínseco de uma ação com base nos dividendos futuros.', link: '/modelo-de-gordon', implemented: true },
    { name: 'Independência Financeira', description: 'Descubra quanto você precisa para alcançar a independência financeira.', link: '/independencia-financeira', implemented: true },
    { name: 'Conversor de Taxas', description: 'Converta facilmente diferentes tipos de taxas de juros.', link: '/conversor-de-taxas', implemented: true },
    { name: 'Juros Compostos', description: 'Visualize o poder dos juros compostos em seus investimentos.', link: '/juros-compostos', implemented: true },
  ];

  const handleAccessClick = (implemented, e) => {
    if (!implemented) {
      e.preventDefault();
      toast({
        title: "🚧 Em desenvolvimento!",
        description: "Esta ferramenta ainda não está disponível, mas você pode solicitar na sua próxima mensagem! 🚀",
      });
    }
  };

  return (
    <PageWrapper title="Ferramentas" description="Acesse nossa coleção de calculadoras financeiras para planejar sua aposentadoria, financiamentos, investimentos e muito mais.">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Nossas Ferramentas</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Calculadoras poderosas e fáceis de usar para ajudar você a tomar as melhores decisões financeiras.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-8 rounded-xl shadow-lg flex flex-col border"
            >
              <div className="flex-grow">
                <Calculator className="h-8 w-8 text-primary mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">{tool.name}</h2>
                <p className="text-muted-foreground">{tool.description}</p>
              </div>
              <div className="mt-6">
                <Button asChild className="w-full" onClick={(e) => handleAccessClick(tool.implemented, e)}>
                  <Link to={tool.link}>
                    Acessar <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Ferramentas;