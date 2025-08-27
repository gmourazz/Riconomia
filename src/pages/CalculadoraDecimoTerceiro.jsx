import React, { useState, useMemo } from "react";
import PageWrapper from "@/components/PageWrapper";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calculator, Gift, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calcularINSS, calcularIRRF } from "@/lib/payroll";
import { formatCurrency, formatPercent, parseNumber } from "@/lib/utils";
import Explanation, { ExplanationBlock } from "@/components/Explanation";

const CalculadoraDecimoTerceiro = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    salarioBruto: "5000",
    mesesTrabalhados: "12",
    dependentes: "0",
    pensao: "0",
  });
  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculo = useMemo(() => {
    try {
      const salarioBruto = parseNumber(formData.salarioBruto);
      const mesesTrabalhados = parseInt(formData.mesesTrabalhados, 10);
      const dependentes = parseInt(formData.dependentes, 10) || 0;
      const pensao = parseNumber(formData.pensao) || 0;

      if (
        isNaN(salarioBruto) ||
        salarioBruto < 0 ||
        isNaN(mesesTrabalhados) ||
        mesesTrabalhados < 0 ||
        mesesTrabalhados > 12
      ) {
        return { error: "Valores inválidos. Verifique os campos." };
      }

      // 13º bruto proporcional
      const decimoBruto = (salarioBruto / 12) * mesesTrabalhados;

      // 1ª parcela é metade do 13º bruto (sem descontos)
      const primeiraParcela = decimoBruto / 2;

      // Descontos incidem sobre o 13º bruto
      const inss = calcularINSS(decimoBruto);
      const irrf = calcularIRRF(decimoBruto, inss.valor, dependentes, pensao);

      // Total líquido do 13º (soma das duas parcelas)
      const totalLiquido = decimoBruto - inss.valor - irrf.imposto;

      // 2ª parcela líquida é o que falta pagar após a 1ª
      const segundaParcela = totalLiquido - primeiraParcela;

      return {
        decimoBruto,
        primeiraParcela,
        segundaParcela,
        totalLiquido,
        inss,
        irrf,
        params: { salarioBruto, mesesTrabalhados, dependentes, pensao },
      };
    } catch (e) {
      return { error: "Erro no cálculo. Verifique os valores." };
    }
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (calculo.error) {
      toast({
        title: "Erro",
        description: calculo.error,
        variant: "destructive",
      });
      setResultado(null);
    } else {
      setResultado(calculo);
      toast({
        title: "Cálculo Realizado!",
        description: "Seu 13º salário foi calculado.",
      });
    }
  };

  const InputField = ({ label, id, ...props }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );

  return (
    <PageWrapper
      title="Calculadora de 13º Salário"
      description="Calcule o valor do seu 13º salário, incluindo as duas parcelas e os descontos."
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Gift className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Calculadora de 13º Salário
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Saiba o valor exato que você receberá no seu décimo terceiro
            salário, com o detalhamento de cada parcela.
          </p>
        </div>

        {/* Mobile: resultado abaixo do formulário no mesmo card.
            Desktop: resultado na coluna à direita. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="order-1 lg:order-none lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>Dados para Cálculo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="Salário Bruto Mensal (R$)"
                  id="salarioBruto"
                  name="salarioBruto"
                  value={formData.salarioBruto}
                  onChange={handleChange}
                  inputMode="decimal"
                />
                <InputField
                  label="Meses Trabalhados no Ano"
                  id="mesesTrabalhados"
                  name="mesesTrabalhados"
                  type="number"
                  min="1"
                  max="12"
                  value={formData.mesesTrabalhados}
                  onChange={handleChange}
                  inputMode="numeric"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Nº de Dependentes (IRRF)"
                    id="dependentes"
                    name="dependentes"
                    type="number"
                    min="0"
                    value={formData.dependentes}
                    onChange={handleChange}
                    inputMode="numeric"
                  />
                  <InputField
                    label="Pensão sobre 13º (R$)"
                    id="pensao"
                    name="pensao"
                    value={formData.pensao}
                    onChange={handleChange}
                    inputMode="decimal"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full !h-auto py-3 text-lg mt-4"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Calcular
                </Button>
              </form>

              {/* RESULTADO FIXO LOGO ABAIXO DO FORM NO MOBILE */}
              <div className="mt-6 block lg:hidden">
                <ResultadoDecimo resultado={resultado} />
              </div>
            </CardContent>
          </Card>

          {/* RESULTADO NA COLUNA DA DIREITA (DESKTOP) */}
          <Card
            className="order-2 lg:order-none hidden lg:block"
            id="resultado-decimo"
          >
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>
                Este é o resumo do seu 13º salário.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[280px] lg:min-h-[400px]">
              <ResultadoDecimo resultado={resultado} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

const ResultadoDecimo = ({ resultado }) => {
  return (
    <AnimatePresence mode="wait">
      {resultado && !resultado.error ? (
        <motion.div
          key="res-ok"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="space-y-4"
          aria-live="polite"
        >
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Total Líquido a Receber
            </p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(resultado.totalLiquido)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold text-muted-foreground">
                1ª Parcela (adiantamento)
              </p>
              <p className="text-lg font-bold">
                {formatCurrency(resultado.primeiraParcela)}
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold text-muted-foreground">
                2ª Parcela (líquida)
              </p>
              <p className="text-lg font-bold">
                {formatCurrency(resultado.segundaParcela)}
              </p>
            </div>
          </div>

          {/* EXPLICAÇÃO DIDÁTICA — PASSO A PASSO */}
          <Explanation>
            <p className="text-xs italic">
              Veja abaixo, de forma simples, como o valor foi calculado:
            </p>

            {/* 1. 13º Bruto */}
            <ExplanationBlock
              title="1) 13º Salário Bruto (proporcional)"
              value={formatCurrency(resultado.decimoBruto)}
              formula={`(${formatCurrency(
                resultado.params.salarioBruto
              )} ÷ 12) × ${resultado.params.mesesTrabalhados}`}
            />

            {/* 2. INSS */}
            <ExplanationBlock
              title="2) Desconto de INSS"
              value={formatCurrency(resultado.inss.valor)}
              formula="INSS incide sobre o 13º Bruto conforme as faixas vigentes"
            />

            {/* 3. IRRF */}
            <ExplanationBlock
              title="3) Desconto de IRRF"
              value={formatCurrency(resultado.irrf.imposto)}
              formula={`Base (${formatCurrency(
                resultado.irrf.baseCalculo
              )}) × ${formatPercent(
                resultado.irrf.aliquota
              )} − ${formatCurrency(resultado.irrf.deducao)}`}
            />

            {/* 4. Total Líquido */}
            <ExplanationBlock
              title="4) Total Líquido do 13º"
              value={formatCurrency(resultado.totalLiquido)}
              formula="13º Bruto − INSS − IRRF"
            />

            {/* 5. Parcelas */}
            <ExplanationBlock
              title="5) Parcelas"
              value={`1ª: ${formatCurrency(
                resultado.primeiraParcela
              )} • 2ª: ${formatCurrency(resultado.segundaParcela)}`}
              formula="2ª Parcela = Total Líquido − 1ª Parcela"
            />
          </Explanation>
        </motion.div>
      ) : (
        <motion.div
          key="res-vazio"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground py-6 flex flex-col items-center justify-center h-full"
        >
          <Wallet className="mx-auto h-10 w-10 mb-4" />
          <p>Os resultados aparecerão aqui.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalculadoraDecimoTerceiro;
