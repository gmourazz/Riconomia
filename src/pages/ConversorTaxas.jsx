import React, { useState, useRef, useMemo } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Calculator, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPercent, parseNumber } from '@/lib/utils';
import Explanation, { ExplanationBlock } from '@/components/Explanation';

const ConversorTaxas = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    taxa: '1',
    origem: 'mensal',
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
      const taxa = parseNumber(formData.taxa) / 100;
      const origem = formData.origem;
      if (isNaN(taxa)) return { error: "Taxa inválida." };

      let res, tipo, formula;
      if (origem === 'mensal') {
        res = Math.pow(1 + taxa, 12) - 1;
        tipo = 'Equivalente anual';
        formula = `(1 + ${formatPercent(taxa, 4)})^12 - 1`;
      } else {
        res = Math.pow(1 + taxa, 1/12) - 1;
        tipo = 'Equivalente mensal';
        formula = `(1 + ${formatPercent(taxa, 4)})^(1/12) - 1`;
      }
      return { valor: res, tipo, formula };
    } catch {
      return { error: "Erro ao calcular." };
    }
  }, [formData]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    playSound();
    
    if (calculo.error) {
      toast({ title: "Erro na Conversão", description: calculo.error, variant: "destructive" });
      setResultado(null);
    } else {
      setResultado(calculo);
      toast({ title: "Conversão Realizada!", description: "Confira a taxa equivalente." });
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
    <PageWrapper title="Conversor de Taxas" description="Converta taxas de juros mensais para anuais e vice-versa de forma simples e rápida.">
      <audio ref={audioRef} src="/click.mp3" preload="auto"></audio>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <RefreshCw className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Conversor de Taxas</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Não se confunda mais com taxas de juros. Converta facilmente entre períodos mensal e anual.</p>
        </div>

        <div className="max-w-xl mx-auto bg-card p-8 rounded-xl shadow-lg border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputField label="Valor da taxa (%)" id="taxa" name="taxa" value={formData.taxa} onChange={handleChange} placeholder="Ex: 1" />
                <div>
                  <label htmlFor="origem" className="block text-sm font-medium text-muted-foreground mb-1">Período de Origem</label>
                  <select id="origem" name="origem" value={formData.origem} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-primary focus:border-primary h-[42px]">
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              </div>
              <Button type="submit" id="btnCalcular" className="w-full text-lg py-3 mt-4 !h-auto transition-transform active:scale-95">
                <Calculator className="mr-2 h-5 w-5" />Converter
              </Button>
            </form>
            
            {resultado && (
              <motion.div 
                id="resultado" 
                aria-live="polite" 
                className="mt-8 pt-6 border-t text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-muted-foreground">{resultado.tipo}</p>
                <p className="text-4xl font-bold text-primary">{formatPercent(resultado.valor, 4)}</p>
                <Explanation>
                    <ExplanationBlock title="Fórmula" value={formatPercent(resultado.valor, 4)} formula={resultado.formula} />
                </Explanation>
              </motion.div>
            )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ConversorTaxas;