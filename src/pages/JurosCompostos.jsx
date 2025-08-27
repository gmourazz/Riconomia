import React, { useState, useRef, useMemo } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Calculator, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, formatPercent, parseNumber } from '@/lib/utils';
import Explanation, { ExplanationBlock } from '@/components/Explanation';

const JurosCompostos = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    aporteInicial: '1000',
    aporteMensal: '200',
    taxaAnual: '10',
    meses: '120',
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
      const PV = parseNumber(formData.aporteInicial);
      const PMT = parseNumber(formData.aporteMensal);
      const taxaAnual = parseNumber(formData.taxaAnual) / 100;
      const n = Math.max(0, Math.round(parseNumber(formData.meses)));
      
      if ([PV, PMT, taxaAnual, n].some(isNaN)) return { error: "Valores inválidos." };

      const i = Math.pow(1 + taxaAnual, 1/12) - 1;

      let FV = PV * Math.pow(1 + i, n);
      if (i !== 0) {
        FV += PMT * ((Math.pow(1 + i, n) - 1) / i);
      } else {
        FV += PMT * n;
      }
      
      const totalAportado = PV + PMT * n;
      const juros = FV - totalAportado;

      return {
        valorFuturo: FV,
        totalAportado: totalAportado,
        jurosAcumulados: juros,
        params: { PV, PMT, i, n }
      };
    } catch {
      return { error: "Erro ao calcular." };
    }
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    playSound();
    
    if (calculo.error) {
      toast({ title: "Erro no Cálculo", description: calculo.error, variant: "destructive" });
      setResultado(null);
    } else {
      setResultado(calculo);
      toast({ title: "Cálculo Realizado!", description: "Veja o poder dos juros compostos em ação." });
    }
  };

  const InputField = ({ label, id, name, value, onChange, placeholder, step = "0.01", type = "number" }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      <input
        type={type}
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
    <PageWrapper title="Calculadora de Juros Compostos" description="Visualize o poder dos juros compostos em seus investimentos ao longo do tempo.">
      <audio ref={audioRef} src="/click.mp3" preload="auto"></audio>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <BarChart2 className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Calculadora de Juros Compostos</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Veja como seu dinheiro pode crescer com aportes consistentes e a mágica dos juros sobre juros.</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-card p-8 rounded-xl shadow-lg border">
            <h2 className="text-2xl font-bold mb-6">Insira os Dados</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField label="Aporte inicial (R$)" id="aporteInicial" name="aporteInicial" value={formData.aporteInicial} onChange={handleChange} placeholder="Ex: 1000" />
              <InputField label="Aporte mensal (R$)" id="aporteMensal" name="aporteMensal" value={formData.aporteMensal} onChange={handleChange} placeholder="Ex: 200" />
              <InputField label="Taxa de retorno anual (%)" id="taxaAnual" name="taxaAnual" value={formData.taxaAnual} onChange={handleChange} placeholder="Ex: 10" />
              <InputField label="Período (meses)" id="meses" name="meses" value={formData.meses} onChange={handleChange} placeholder="Ex: 120" type="number" step="1" />
              <Button type="submit" id="btnCalcular" className="w-full text-lg py-3 mt-4 !h-auto transition-transform active:scale-95"><Calculator className="mr-2 h-5 w-5" />Calcular</Button>
            </form>
          </div>
          
          <div className="bg-card p-8 rounded-xl shadow-lg border flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6 text-center">Resultado da Simulação</h2>
            {resultado ? (
              <motion.div 
                id="resultado" 
                aria-live="polite" 
                className="space-y-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <p className="text-muted-foreground">Valor futuro</p>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(resultado.valorFuturo)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total aportado</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(resultado.totalAportado)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Juros acumulados</p>
                  <p className="text-xl font-bold text-green-500">{formatCurrency(resultado.jurosAcumulados)}</p>
                </div>
                <Explanation>
                    <ExplanationBlock title="Taxa Mensal (i)" value={formatPercent(resultado.params.i, 4)} formula={`(1 + ${formData.taxaAnual}%)^(1/12) - 1`} />
                    <ExplanationBlock title="Fórmula do Valor Futuro (FV)" value={formatCurrency(resultado.valorFuturo)} formula="FV = PV(1+i)^n + PMT[((1+i)^n-1)/i]" />
                </Explanation>
              </motion.div>
            ) : (
              <div id="resultado" className="text-center text-muted-foreground">
                <BarChart2 className="mx-auto h-10 w-10 mb-4" />
                <p>Preencha os campos para ver a projeção dos seus investimentos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default JurosCompostos;