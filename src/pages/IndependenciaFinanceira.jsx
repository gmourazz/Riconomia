import React, { useState, useMemo } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Target, Flame, Info, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { annualToMonthlyRate } from '@/lib/finance';
import { formatCurrency, formatPercent, parseNumber } from '@/lib/utils';
import Explanation, { ExplanationBlock } from '@/components/Explanation';

const IndependenciaFinanceira = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patrimonioAtual: '0',
    aporteMensal: '500',
    rendaMensalDesejada: '5000',
    taxaRealAnual: '6',
  });
  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculo = useMemo(() => {
    try {
      const PV = parseNumber(formData.patrimonioAtual);
      const PMT = parseNumber(formData.aporteMensal);
      const R = parseNumber(formData.rendaMensalDesejada);
      const i_anual_real = parseNumber(formData.taxaRealAnual) / 100;
      
      if ([PV, PMT, R, i_anual_real].some(isNaN) || R <= 0) {
        return { error: "Por favor, preencha todos os campos com números válidos." };
      }
      
      const i = annualToMonthlyRate(i_anual_real);
      
      if (i <= 0 && PMT <= 0) {
        return { error: "Com juros e aportes nulos ou negativos, a meta é inalcançável." };
      }
      if (i > 0 && PMT <= R * i && PV < (R/i)) {
        return { error: "Com esse aporte mensal e taxa de juros, você nunca atingirá a independência financeira. A renda passiva gerada pela sua meta é maior que seus aportes." };
      }
      
      const patrimonioAlvo = R / i;
      
      let n;
      if (i > 0) {
          const logNumerator = Math.log(PMT + i * patrimonioAlvo);
          const logDenominator = Math.log(PMT + i * PV);
          if (logDenominator >= logNumerator) {
             return { error: "Meta já atingida ou inalcançável com os parâmetros atuais." };
          }
          n = (logNumerator - logDenominator) / Math.log(1 + i);
      } else {
         n = (patrimonioAlvo - PV) / PMT;
      }
      
      if (n < 0 || !isFinite(n)) {
        return { error: "Com os valores atuais, a meta não é alcançável. Tente aumentar o aporte ou a rentabilidade." };
      }
      
      const anos = Math.floor(n / 12);
      const meses = Math.round(n % 12);

      return {
        anos,
        meses,
        patrimonioAlvo,
        params: { PV, PMT, R, i, n, taxaRealAnual: i_anual_real },
      };

    } catch(e) {
      console.error(e);
      return { error: "Ocorreu um erro no cálculo. Verifique os valores informados." };
    }
  }, [formData]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (calculo.error) {
      toast({
        title: "Aviso de Cálculo",
        description: calculo.error,
        variant: "destructive",
      });
      setResultado(null);
    } else {
      setResultado(calculo);
      toast({
        title: "Simulação Concluída!",
        description: "Seu caminho para a liberdade financeira foi traçado."
      });
    }
  };

  const InputField = ({ label, id, ...props }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">{label}</Label>
      <Input id={id} className="bg-background border-border" {...props} />
    </div>
  );

  return (
    <PageWrapper
      title="Calculadora de Independência Financeira (FIRE)"
      description="Calcule quanto tempo falta para você atingir a independência financeira e viver de rendimentos."
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Flame className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Independência Financeira (FIRE)</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Descubra em quanto tempo você atingirá seu objetivo de viver de renda, com base em seus aportes e rentabilidade.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="p-8 shadow-lg border">
            <h2 className="text-2xl font-bold mb-6">Insira seus Dados</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField label="Patrimônio Inicial (R$)" id="patrimonioAtual" name="patrimonioAtual" value={formData.patrimonioAtual} onChange={handleChange} />
              <InputField label="Aporte Mensal (R$)" id="aporteMensal" name="aporteMensal" value={formData.aporteMensal} onChange={handleChange} />
              <InputField label="Renda Passiva Mensal Desejada (R$)" name="rendaMensalDesejada" value={formData.rendaMensalDesejada} onChange={handleChange} />
              <InputField label="Taxa de Retorno Real Anual (%)" id="taxaRealAnual" name="taxaRealAnual" value={formData.taxaRealAnual} onChange={handleChange} />
              
              <div className="flex items-start space-x-3 pt-2">
                <Info className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  A <strong>taxa de retorno real</strong> é a rentabilidade dos seus investimentos já descontada a inflação. Ex: Se seu investimento rende 10% ao ano e a inflação é 5%, sua taxa real é de aproximadamente 4,76%.
                </p>
              </div>

              <Button type="submit" className="w-full text-lg py-3 mt-4 !h-auto transition-transform active:scale-95">
                <Calculator className="mr-2 h-5 w-5" />Calcular Tempo
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-8 shadow-lg border flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-6 text-center">Seu Objetivo</h2>
              <AnimatePresence>
                {resultado && !resultado.error ? (
                  <motion.div
                    id="resultado"
                    aria-live="polite"
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-center">
                      <p className="text-muted-foreground">Tempo estimado para a independência:</p>
                      <p className="text-3xl font-bold text-primary my-2">
                        {resultado.anos} anos e {resultado.meses} meses
                      </p>
                    </div>
                    <div className="pt-4 grid grid-cols-1 gap-4 text-center">
                       <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-muted-foreground">Patrimônio-Alvo para sua Renda</p>
                        <p className="text-lg font-bold text-secondary-foreground">{formatCurrency(resultado.patrimonioAlvo)}</p>
                      </div>
                    </div>
                    <Explanation>
                        <p className="text-xs italic">Este é um cálculo simplificado que não considera impostos sobre rendimentos.</p>
                        <ExplanationBlock title="Taxa Real Mensal (i)" value={formatPercent(resultado.params.i, 6)} formula={`(1 + ${formData.taxaRealAnual}%)^(1/12) - 1`} />
                        <ExplanationBlock title="Patrimônio-Alvo (Meta)" value={formatCurrency(resultado.patrimonioAlvo)} formula={`Renda / i = ${formatCurrency(resultado.params.R)} / ${resultado.params.i.toFixed(8)}`} />
                        <ExplanationBlock title="Tempo para Atingir a Meta (n)" value={`${Math.round(resultado.params.n)} meses`} formula="n = ln((PMT + i*Meta)/(PMT + i*PV)) / ln(1+i)" />
                    </Explanation>
                  </motion.div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Target className="mx-auto h-10 w-10 mb-4" />
                    <p>Preencha os campos para descobrir quando atingirá sua meta.</p>
                    <p className="text-sm mt-2">A calculadora também pode mostrar o valor total do seu patrimônio e a sua renda passiva projetada na data em que você atingirá o objetivo.</p>
                  </div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default IndependenciaFinanceira;