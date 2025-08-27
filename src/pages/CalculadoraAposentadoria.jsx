import React, { useState, useMemo, useRef } from "react";
import PageWrapper from "@/components/PageWrapper";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.jsx";
import {
  PiggyBank,
  Target,
  BarChart2,
  AlertCircle,
  Calculator,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { annualToMonthlyRate, futureValue } from "@/lib/finance";
import { formatPercent } from "@/lib/utils";
import Explanation, { ExplanationBlock } from "@/components/Explanation";

/** ============================
 *  PARSE & FORMAT (pt-BR)
 *  ============================
 * Aceita:
 * - "1.234,56" => 1234.56
 * - "50.000"   => 50000
 * - "2,50"     => 2.5
 * - "2.50"     => 2.5 (fallback)
 */
const parseDecimal = (v) => {
  if (typeof v === "number") return v;
  const s = String(v ?? "").trim();
  if (!s) return 0;

  // Se tem vírgula, assume padrão BR: remove pontos (milhar) e troca vírgula por ponto
  if (s.includes(",")) {
    return parseFloat(s.replace(/\./g, "").replace(",", "."));
  }

  // Sem vírgula: se parecer milhar BR (grupos de 3), remove pontos
  if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    return parseFloat(s.replace(/\./g, ""));
  }

  // Fallback: parse normal (aceita "2.50")
  return parseFloat(s);
};

const formatBRL = (n) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

// Capital necessário (retorna NaN em casos inválidos para não quebrar a UI)
const requiredCapital = (rendaMensal, regraAA) => {
  const rr = parseDecimal(regraAA);
  const renda = parseDecimal(rendaMensal);
  if (!isFinite(rr) || rr <= 0) return NaN;
  return (renda * 12) / (rr / 100);
};

const CalculadoraAposentadoria = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    idadeAtual: "30",
    idadeAposentadoria: "65",
    patrimonioAtual: "50.000",
    contribuicaoMensal: "1.000",
    rendaMensalDesejada: "5.000",
    retornoAnual: "8",
    inflacaoAnual: "4",
    regraRetiradaAA: "4,0",
  });
  const [resultado, setResultado] = useState(null);
  const resultRef = useRef(null); // âncora do resultado (para scroll no mobile)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculo = useMemo(() => {
    try {
      const idadeAtual = parseInt(formData.idadeAtual || "0", 10);
      const idadeAposentadoria = parseInt(
        formData.idadeAposentadoria || "0",
        10
      );

      const patrimonioAtual = parseDecimal(formData.patrimonioAtual);
      const contribuicaoMensal = parseDecimal(formData.contribuicaoMensal);
      const rendaMensalDesejada = parseDecimal(formData.rendaMensalDesejada);

      const retornoAnual = parseDecimal(formData.retornoAnual) / 100; // decimal
      const inflacaoAnual = parseDecimal(formData.inflacaoAnual) / 100; // decimal
      const regraRetiradaAA = parseDecimal(formData.regraRetiradaAA); // em %

      if (
        [idadeAtual, idadeAposentadoria].some((v) => Number.isNaN(v)) ||
        [
          patrimonioAtual,
          contribuicaoMensal,
          rendaMensalDesejada,
          retornoAnual,
          inflacaoAnual,
          regraRetiradaAA,
        ].some((v) => !isFinite(v))
      ) {
        return {
          error: "Por favor, preencha todos os campos com números válidos.",
        };
      }

      if (idadeAposentadoria <= idadeAtual) {
        return {
          error: "A idade de aposentadoria deve ser maior que a idade atual.",
        };
      }

      if (!(regraRetiradaAA > 0 && regraRetiradaAA < 100)) {
        return {
          error: "A ‘Regra de Retirada’ deve estar entre 0 e 100% ao ano.",
        };
      }

      const anosParaAposentar = idadeAposentadoria - idadeAtual;
      const n = anosParaAposentar * 12;

      // taxas
      const iNomM = annualToMonthlyRate(retornoAnual);
      const iRealAnual = (1 + retornoAnual) / (1 + inflacaoAnual) - 1;
      const iRealM = annualToMonthlyRate(iRealAnual);
      if (iRealM <= -1) {
        return {
          error: "A inflação não pode ser maior ou igual ao retorno anual.",
        };
      }

      // FV (valores reais de hoje)
      const fvReal = futureValue(
        patrimonioAtual,
        contribuicaoMensal,
        iRealM,
        n
      );

      // Patrimônio necessário
      const necessario4pc = requiredCapital(rendaMensalDesejada, 4);
      const necessarioUsuario = requiredCapital(
        rendaMensalDesejada,
        regraRetiradaAA
      );
      const gap = fvReal - necessarioUsuario;

      return {
        anosParaAposentar,
        n,
        iNomM,
        iRealM,
        fvReal,
        necessario4pc,
        necessarioUsuario,
        gap,
        formData: {
          idadeAtual,
          idadeAposentadoria,
          patrimonioAtual,
          contribuicaoMensal,
          rendaMensalDesejada,
          retornoAnual,
          inflacaoAnual,
          regraRetiradaAA,
        },
      };
    } catch (e) {
      console.error(e);
      return { error: "Erro no cálculo. Verifique os valores." };
    }
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (calculo.error) {
      toast({
        title: "Erro de Validação",
        description: calculo.error,
        variant: "destructive",
      });
      setResultado(null);
    } else {
      setResultado(calculo);
      toast({
        title: "Cálculo Realizado!",
        description: "Confira sua projeção para a aposentadoria.",
      });

      // Scroll automático no MOBILE (lg < 1024px)
      try {
        if (
          window &&
          window.matchMedia &&
          window.matchMedia("(max-width: 1023px)").matches
        ) {
          setTimeout(() => {
            resultRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 50);
        }
      } catch {}
    }
  };

  // Helpers de exibição à prova de falhas (evitam quebrar a UI com NaN/Infinity)
  const safeBRL = (v) => {
    try {
      if (!isFinite(v)) return "—";
      return formatBRL(v);
    } catch {
      return "—";
    }
  };
  const safePct = (v, d = 6) => {
    try {
      if (!isFinite(v)) return "—";
      return formatPercent(v, d);
    } catch {
      return "—";
    }
  };

  // Inputs amigáveis para mobile
  const InputField = ({ label, id, type = "text", ...props }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        inputMode={type === "number" ? "numeric" : "decimal"}
        pattern={type === "number" ? "[0-9]*" : "[0-9]*[.,]?[0-9]*"}
        className="bg-background border-border"
        {...props}
      />
    </div>
  );

  return (
    <PageWrapper
      title="Calculadora de Aposentadoria"
      description="Planeje sua aposentadoria, calcule o patrimônio necessário e veja se você está no caminho certo."
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <PiggyBank className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Calculadora de Aposentadoria
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Descubra o valor que você precisa acumular para viver de renda e
            qual será seu patrimônio futuro.
          </p>
        </div>

        {/* Ordem garantida: formulário em cima, resultado embaixo no mobile.
           No desktop (lg:), grid lado a lado; sticky só no desktop. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* sticky apenas >= lg */}
          <Card className="lg:sticky lg:top-24 order-1">
            <CardHeader>
              <CardTitle>Simulação</CardTitle>
              <CardDescription>
                Preencha os campos para simular seu plano.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Idade Atual"
                    id="idadeAtual"
                    name="idadeAtual"
                    type="number"
                    value={formData.idadeAtual}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Idade de Aposentadoria"
                    id="idadeAposentadoria"
                    name="idadeAposentadoria"
                    type="number"
                    value={formData.idadeAposentadoria}
                    onChange={handleChange}
                  />
                </div>
                <InputField
                  label="Patrimônio Atual (R$)"
                  id="patrimonioAtual"
                  name="patrimonioAtual"
                  value={formData.patrimonioAtual}
                  onChange={handleChange}
                />
                <InputField
                  label="Contribuição Mensal (R$)"
                  id="contribuicaoMensal"
                  name="contribuicaoMensal"
                  value={formData.contribuicaoMensal}
                  onChange={handleChange}
                />
                <InputField
                  label="Renda Mensal Desejada (R$)"
                  id="rendaMensalDesejada"
                  name="rendaMensalDesejada"
                  value={formData.rendaMensalDesejada}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Retorno Anual (%)"
                    id="retornoAnual"
                    name="retornoAnual"
                    value={formData.retornoAnual}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Inflação Anual (%)"
                    id="inflacaoAnual"
                    name="inflacaoAnual"
                    value={formData.inflacaoAnual}
                    onChange={handleChange}
                  />
                </div>
                <InputField
                  label="Sua Regra de Retirada Anual (%)"
                  id="regraRetiradaAA"
                  name="regraRetiradaAA"
                  value={formData.regraRetiradaAA}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  className="w-full !h-auto py-3 text-lg mt-4"
                >
                  <Calculator className="mr-2 h-5 w-5" /> Calcular
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resultado SEM sticky, com ref para scroll no mobile */}
          <div className="space-y-6 order-2" ref={resultRef}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target /> Resultado da Simulação
                </CardTitle>
                <CardDescription>
                  Com base nos dados fornecidos, este é o seu cenário projetado.
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[250px]">
                <AnimatePresence>
                  {resultado && !resultado.error ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                      aria-live="polite"
                    >
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Patrimônio projetado (em valores de hoje)
                        </p>
                        <p className="text-3xl font-bold text-primary">
                          {safeBRL(resultado.fvReal)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Aos {formData.idadeAposentadoria} anos.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-semibold text-muted-foreground">
                            Necessário (Sua Regra {formData.regraRetiradaAA}%)
                          </p>
                          <p className="text-lg font-bold text-secondary-foreground">
                            {safeBRL(resultado.necessarioUsuario)}
                          </p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-semibold text-muted-foreground">
                            Necessário (Regra 4%)
                          </p>
                          <p className="text-lg font-bold text-secondary-foreground">
                            {safeBRL(resultado.necessario4pc)}
                          </p>
                        </div>
                      </div>

                      {!isFinite(resultado.necessarioUsuario) && (
                        <div className="p-3 bg-amber-100 border border-amber-300 text-amber-800 rounded-lg">
                          Defina a <strong>Regra de Retirada</strong> (ex.: 4)
                          para calcular o patrimônio necessário.
                        </div>
                      )}

                      {resultado.gap < 0 ? (
                        <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/50 text-destructive rounded-lg">
                          <AlertCircle className="h-5 w-5 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">
                              Atenção: Falta um pouco!
                            </p>
                            <p className="text-sm">
                              Seu patrimônio projetado é{" "}
                              <strong className="text-foreground">
                                {safeBRL(Math.abs(resultado.gap))}
                              </strong>{" "}
                              menor que o necessário para sua meta. Considere
                              aumentar seus aportes ou ajustar seus objetivos.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/50 text-green-700 dark:text-green-400 rounded-lg">
                          <AlertCircle className="h-5 w-5 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Parabéns!</p>
                            <p className="text-sm">
                              Você está no caminho! Com o que você está
                              poupando, você vai atingir sua meta de
                              aposentadoria, sobrando ainda{" "}
                              <strong className="text-foreground">
                                {safeBRL(resultado.gap)}
                              </strong>
                              .
                            </p>
                          </div>
                        </div>
                      )}

                      <Explanation>
                        <p className="text-xs italic">
                          Valores ajustados pela inflação para refletir o poder
                          de compra de hoje.
                        </p>
                        <ExplanationBlock
                          title="Taxa Real Mensal (iReal)"
                          value={safePct(resultado.iRealM, 6)}
                          formula="((1+retorno)/(1+inflacao))^(1/12) - 1"
                        />
                        <ExplanationBlock
                          title="Valor Futuro Projetado (FV)"
                          value={safeBRL(resultado.fvReal)}
                          formula="FV = PV(1+i)^n + PMT[((1+i)^n-1)/i]"
                        />
                        <ExplanationBlock
                          title={`Patrimônio Necessário (${formData.regraRetiradaAA}%)`}
                          value={safeBRL(resultado.necessarioUsuario)}
                          formula="(Renda Mensal * 12) / Taxa de Retirada"
                        />
                      </Explanation>
                    </motion.div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center h-full">
                      <BarChart2 className="mx-auto h-10 w-10 mb-4" />
                      <p>Os resultados da sua simulação aparecerão aqui.</p>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CalculadoraAposentadoria;
