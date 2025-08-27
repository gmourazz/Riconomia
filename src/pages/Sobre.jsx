import React from "react";
import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";
import { Users, Target, Lightbulb } from "lucide-react";

const Sobre = () => {
  return (
    <PageWrapper
      title="Sobre Nós"
      description="Conheça a missão, visão e valores da RICONOMIA. Nosso objetivo é democratizar o acesso à educação financeira de qualidade."
    >
      <div className="bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <motion.div
              className="md:col-span-2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-card p-4 rounded-full shadow-2xl border-4 border-primary/20">
                <img
                  src="/img/Riconomia_Logo.png"
                  alt="RICONOMIA Logo"
                  className="h-48 w-50"
                />
              </div>
            </motion.div>
            <div className="md:col-span-3 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
                Sobre a RICONOMIA
              </h1>
              <p className="text-lg text-muted-foreground">
                Democratizando o conhecimento financeiro para todos.
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 bg-card p-8 rounded-xl shadow-lg border"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Nossa História
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A RICONOMIA nasceu da percepção de que o mundo das finanças,
                embora crucial para a vida de todos, muitas vezes é apresentado
                de forma complexa e inacessível. Vimos amigos, familiares e
                colegas lutando para tomar decisões financeiras importantes por
                falta de informação clara e confiável.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Decidimos criar uma plataforma que quebra essas barreiras. Um
                lugar onde qualquer pessoa, independentemente do seu nível de
                conhecimento, possa encontrar ferramentas intuitivas, artigos
                didáticos e a confiança necessária para assumir o controle de
                seu futuro financeiro.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card p-8 rounded-xl shadow-lg border"
              >
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  Nossa Missão
                </h3>
                <p className="text-muted-foreground">
                  Capacitar pessoas a tomarem decisões financeiras mais
                  inteligentes através de educação e ferramentas acessíveis.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-card p-8 rounded-xl shadow-lg border"
              >
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  Nossa Visão
                </h3>
                <p className="text-muted-foreground">
                  Ser a principal referência em educação financeira no Brasil,
                  transformando a relação das pessoas com o dinheiro.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-card p-8 rounded-xl shadow-lg border"
              >
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  Nossos Valores
                </h3>
                <p className="text-muted-foreground">
                  Simplicidade, Transparência, Confiança e Inovação contínua
                  para servir melhor nossos usuários.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Sobre;
