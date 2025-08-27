import React, { useState, useRef, useMemo } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPercent, parseNumber } from '@/lib/utils';
import Explanation, { ExplanationBlock } from '@/components/Explanation';

const CalculadoraCAPM = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    rf: '10.50',
    rm: '15',
    beta: '1.2',
  });
  const [resultado, setResultado] = useState(null);
  const audioRef = useRef(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Erro ao tocar som:", e));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculo = useMemo(() => {
    try {
      const rf = parseNumber(formData.rf) / 100;
      const rm = parseNumber(formData.rm) / 100;
      const beta = parseNumber(formData.beta);
      
      if ([rf, rm, beta].some(isNaN)) return { error: "Valores inválidos" };

      const er = rf + beta * (rm - rf);
      const premioRiscoMercado = rm - rf;
      const premioRiscoAtivo = beta * premioRiscoMercado;

      return {
        er,
        premioRiscoMercado,
        premioRiscoAtivo,
        params: { rf, rm, beta }
      };
    } catch {
      return { error: "Erro ao calcular" };
    }
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    playSound();
    
    if (calculo.error) {
      toast({ title: "Erro no Cálculo", description: "Verifique os valores e tente novamente.", variant: "destructive" });
      setResultado(null);
    } else {
      setResultado(calculo);
      toast({ title: "Cálculo Realizado!", description: "Confira o retorno esperado do ativo." });
    }
  };

  const InputField = ({ label, id, name, value, onChange, placeholder, step = "0.01" }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      <input
        type="number"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        step={step}
        className="w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-primary focus:border-primary"
      />
    </div>
  );

  return (
    <PageWrapper title="Calculadora CAPM" description="Calcule o retorno esperado de um ativo usando o modelo CAPM (Capital Asset Pricing Model).">
      <audio ref={audioRef} src="/click.mp3" preload="auto"></audio>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <TrendingUp className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Calculadora CAPM</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">O Capital Asset Pricing Model (CAPM) ajuda a determinar o retorno esperado de um ativo, considerando seu risco em relação ao mercado.</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-card p-8 rounded-xl shadow-lg border">
            <h2 className="text-2xl font-bold mb-6">Parâmetros do Modelo</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField label="Taxa Livre de Risco (Rf) %" id="rf" name="rf" value={formData.rf} onChange={handleChange} placeholder="Ex: 10.50" />
              <InputField label="Retorno Esperado do Mercado (Rm) %" id="rm" name="rm" value={formData.rm} onChange={handleChange} placeholder="Ex: 15" />
              <InputField label="Beta do Ativo (β)" id="beta" name="beta" value={formData.beta} onChange={handleChange} placeholder="Ex: 1.2" />
              <Button type="submit" id="btnCalcular" className="w-full text-lg py-3 mt-4 !h-auto transition-transform active:scale-95">
                <Calculator className="mr-2 h-5 w-5" />Calcular
              </Button>
            </form>
          </div>

          <div className="bg-card p-8 rounded-xl shadow-lg border flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6 text-center">Resultado</h2>
            {resultado ? (
              <motion.div 
                id="resultado" 
                aria-live="polite" 
                className="space-y-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <p className="text-muted-foreground">Retorno esperado E(Ri)</p>
                  <p className="text-4xl font-bold text-primary">{formatPercent(resultado.er)}</p>
                </div>
                <div className="text-sm text-muted-foreground pt-2 space-y-1">
                  <p><strong>Prêmio de Risco do Mercado:</strong> {formatPercent(resultado.premioRiscoMercado)}</p>
                  <p><strong>Prêmio de Risco do Ativo:</strong> {formatPercent(resultado.premioRiscoAtivo)}</p>
                </div>
                <Explanation>
                    <p className="text-xs italic">Este é um modelo teórico e não garante retornos futuros.</p>
                    <ExplanationBlock 
                        title="Fórmula"
                        value={formatPercent(resultado.er)}
                        formula={`E(Ri) = ${formatPercent(resultado.params.rf)} + ${resultado.params.beta} * (${formatPercent(resultado.params.rm)} - ${formatPercent(resultado.params.rf)})`}
                    />
                </Explanation>
              </motion.div>
            ) : (
              <div id="resultado" className="text-center text-muted-foreground">
                <p>Preencha os campos para calcular o retorno esperado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CalculadoraCAPM;