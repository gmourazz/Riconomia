import React, { useState, useRef, useMemo } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import Explanation, { ExplanationBlock } from '@/components/Explanation';

// Parser robusto para evitar bug do "2.50" virar "250"
const parseDecimal = (v) => {
  if (typeof v === 'number') return v;
  const s = String(v).trim();

  if (s.includes('.') && s.includes(',')) {
    // ex.: "1.234,56" → 1234.56
    return parseFloat(s.replace(/\./g, '').replace(',', '.'));
  }
  if (s.includes(',')) {
    // ex.: "2,50" → 2.50
    return parseFloat(s.replace(',', '.'));
  }
  // ex.: "2.50" ou "2500"
  return parseFloat(s);
};

// Helper para exibir porcentagens corretas a partir de decimal
const percentFromDecimal = (x, d = 2) => `${(x * 100).toFixed(d)}%`;

const ModeloGordon = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    d1: '2.50',
    k: '12',
    g: '5',
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
      const d1 = parseDecimal(formData.d1);
      const k = parseDecimal(formData.k) / 100;
      const g = parseDecimal(formData.g) / 100;

      if ([d1, k, g].some(isNaN)) return { error: "Valores inválidos." };
      if (k <= g) return { error: "A taxa de desconto (k) deve ser maior que a taxa de crescimento (g)." };

      const valor = d1 / (k - g);
      return { valor, params: { d1, k, g } };
    } catch {
      return { error: "Erro ao calcular." };
    }
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    playSound();
    
    if (calculo.error) {
      toast({ title: "Erro de Validação", description: calculo.error, variant: "destructive" });
      setResultado(null);
    } else {
      setResultado(calculo);
      toast({ title: "Cálculo Realizado!", description: "Confira o valor justo estimado da ação." });
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
    <PageWrapper title="Modelo de Gordon" description="Estime o valor justo de uma ação com base no Modelo de Crescimento de Gordon.">
      <audio ref={audioRef} src="/click.mp3" preload="auto"></audio>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <DollarSign className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Modelo de Gordon</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Use o Modelo de Crescimento de Gordon para encontrar o valor intrínseco de uma ação que paga dividendos com crescimento constante.</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-card p-8 rounded-xl shadow-lg border">
            <h2 className="text-2xl font-bold mb-6">Dados da Ação</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField label="Dividendo do próximo ano (D1) R$" id="d1" name="d1" value={formData.d1} onChange={handleChange} placeholder="Ex: 2.50" />
              <InputField label="Taxa de desconto (k) %" id="k" name="k" value={formData.k} onChange={handleChange} placeholder="Ex: 12" />
              <InputField label="Taxa de crescimento (g) %" id="g" name="g" value={formData.g} onChange={handleChange} placeholder="Ex: 5" />
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
                  <p className="text-muted-foreground">Valor justo estimado</p>
                  <p className="text-4xl font-bold text-primary">{formatCurrency(resultado.valor)}</p>
                </div>
                <Explanation>
                  <p className="text-xs italic">Ideal para empresas maduras com crescimento estável.</p>
                  <ExplanationBlock 
                    title="Fórmula"
                    value={formatCurrency(resultado.valor)}
                    formula={`Valor = ${formatCurrency(resultado.params.d1)} / (${percentFromDecimal(resultado.params.k)} - ${percentFromDecimal(resultado.params.g)})`}
                  />
                  {resultado.params.k <= resultado.params.g && <p className="text-red-500 font-bold">Aviso: k deve ser maior que g.</p>}
                </Explanation>
              </motion.div>
            ) : (
              <div id="resultado" className="text-center text-muted-foreground">
                <p>Preencha os campos para calcular o valor justo.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ModeloGordon;
