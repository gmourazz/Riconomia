import React, { useState, useRef, useMemo } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Calculator, Home as HomeIcon, Car, Building, Table } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { computeCET, annualToMonthlyRate } from '@/lib/finance';
import { formatCurrency, formatPercent, parseNumber } from '@/lib/utils';
import Explanation, { ExplanationBlock } from '@/components/Explanation';

const FinanciamentoForm = ({ tipo, playSound }) => {
  const { toast } = useToast();
  const isCar = tipo === 'carro';
  const [formData, setFormData] = useState({
    valor: isCar ? '80000' : '400000',
    entrada: isCar ? '20000' : '80000',
    taxaAnual: isCar ? '22' : '10',
    prazo: isCar ? '48' : '360',
    sistema: isCar ? 'PRICE' : 'SAC',
    tarifaCadastro: isCar ? '800' : '0',
    tarifaMensal: '0',
    seguroPct: isCar ? '0' : '0.035',
  });
  const [resultado, setResultado] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const N = (x) => parseNumber(x.toString());

  const calculo = useMemo(() => {
    try {
        const valor = N(formData.valor);
        const entrada = N(formData.entrada);
        const principal = valor - entrada;
        const taxaAnual = N(formData.taxaAnual) / 100;
        const nMeses = Math.round(N(formData.prazo));
        const sistema = formData.sistema;
        const tarifaCadastro = N(formData.tarifaCadastro);
        const tarifaMensal = N(formData.tarifaMensal);
        const seguroPct = N(formData.seguroPct) / 100;

        if (principal <= 0) {
            return { error: "O valor a ser financiado (valor do bem - entrada) deve ser positivo." };
        }

        const params = {
            principal,
            rateAnual: taxaAnual,
            nMeses,
            sistema,
            fees: {
                upfront: tarifaCadastro,
                monthly: tarifaMensal,
                insurancePctOnBalance: seguroPct,
            },
        };

        const result = computeCET(params);
        if (result.error) return result;

        return { ...result, params };
    } catch (error) {
        return { error: error.message || "Verifique os valores e tente novamente." };
    }
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    playSound();
    setShowSchedule(false);

    if (calculo.error) {
        toast({ title: "Erro no Cálculo", description: calculo.error, variant: "destructive" });
        setResultado(null);
    } else {
        setResultado(calculo);
        toast({ title: "Cálculo Realizado!", description: "Confira a estimativa do seu financiamento." });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label={`Valor do ${isCar ? 'carro' : 'imóvel'} (R$)`} id={`${tipo}_valor`} name="valor" value={formData.valor} onChange={handleChange} />
        <InputField label="Entrada (R$)" id={`${tipo}_entrada`} name="entrada" value={formData.entrada} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Taxa anual (%)" id={`${tipo}_taxaAnual`} name="taxaAnual" value={formData.taxaAnual} onChange={handleChange} />
          <InputField label="Prazo (meses)" id={`${tipo}_prazo`} name="prazo" value={formData.prazo} onChange={handleChange} type="number" step="1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Tarifa de Cadastro (R$)" id={`${tipo}_tarifaCadastro`} name="tarifaCadastro" value={formData.tarifaCadastro} onChange={handleChange} />
          <InputField label="Seguro/Taxas (% a.m. s/ saldo)" id={`${tipo}_seguroPct`} name="seguroPct" value={formData.seguroPct} onChange={handleChange} />
        </div>
        <div className="pt-2">
          <label htmlFor={`${tipo}_sistema`} className="block text-sm font-medium text-muted-foreground mb-1">Sistema de Amortização</label>
          <select id={`${tipo}_sistema`} name="sistema" value={formData.sistema} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-primary focus:border-primary">
            <option value="PRICE">Price (parcelas fixas)</option>
            <option value="SAC">SAC (parcelas decrescentes)</option>
          </select>
        </div>
        <Button type="submit" className="w-full text-lg py-3 mt-4 !h-auto transition-transform active:scale-95"><Calculator className="mr-2 h-5 w-5" />Calcular</Button>
      </form>
      {resultado && !resultado.error && (
        <div className="mt-8 pt-6 border-t" aria-live="polite">
          <h3 className="text-xl font-bold mb-4 text-center">Resultado da Simulação ({formData.sistema})</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div><p className="text-muted-foreground">1ª Parcela</p><p className="text-2xl font-bold text-primary">{formatCurrency(resultado.preview[0]?.parcela)}</p></div>
            <div><p className="text-muted-foreground">CET Mensal</p><p className="text-lg font-bold">{formatPercent(resultado.cetMensal)}</p></div>
            <div><p className="text-muted-foreground">Total Pago</p><p className="text-lg font-bold">{formatCurrency(resultado.totalPago)}</p></div>
            <div><p className="text-muted-foreground">CET Anual</p><p className="text-2xl font-bold text-primary">{formatPercent(resultado.cetAnual)}</p></div>
          </div>
          
          <Explanation>
            <p className="text-xs italic">Valores aproximados para fins educativos.</p>
            {formData.sistema === 'PRICE' ? (
              <PriceExplanation params={resultado.params} result={resultado} />
            ) : (
              <SacExplanation params={resultado.params} result={resultado} />
            )}
          </Explanation>

          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => setShowSchedule(!showSchedule)}>
              <Table className="mr-2 h-4 w-4" /> {showSchedule ? 'Ocultar' : 'Ver'} Cronograma
            </Button>
          </div>
          <AnimatePresence>
            {showSchedule && <ScheduleTable schedule={resultado.preview} />}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

const PriceExplanation = ({ params, result }) => {
    const i = annualToMonthlyRate(params.rateAnual);
    return (
        <div className="space-y-2">
            <ExplanationBlock title="Taxa Mensal (i)" value={formatPercent(i, 4)} formula={`(1 + ${formatPercent(params.rateAnual)})^(1/12) - 1`} />
            <ExplanationBlock title="Valor Financiado (PV)" value={formatCurrency(params.principal)} />
            <ExplanationBlock title="Parcela (PMT)" value={formatCurrency(result.preview[0]?.parcela)} formula={`PMT = PV * [i(1+i)^n / ((1+i)^n - 1)] + custos`} />
            <ExplanationBlock title="Juros Totais" value={formatCurrency(result.totalJuros)} formula="Total Pago - PV" />
        </div>
    );
};

const SacExplanation = ({ params, result }) => {
    const i = annualToMonthlyRate(params.rateAnual);
    const amortizacao = params.principal / params.nMeses;
    return (
        <div className="space-y-2">
            <p className="text-xs italic">No sistema SAC, a parcela diminui a cada mês.</p>
            <ExplanationBlock title="Taxa Mensal (i)" value={formatPercent(i, 4)} formula={`(1 + ${formatPercent(params.rateAnual)})^(1/12) - 1`} />
            <ExplanationBlock title="Amortização Fixa" value={formatCurrency(amortizacao)} formula="Valor Financiado / Prazo" />
            <ExplanationBlock title="1ª Parcela" value={formatCurrency(result.preview[0]?.parcela)} formula="Amortização + (PV * i) + custos" />
            <ExplanationBlock title="Juros Totais" value={formatCurrency(result.totalJuros)} formula="Total Pago - PV" />
        </div>
    );
};

const ScheduleTable = ({ schedule }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    className="mt-6 overflow-x-auto"
  >
    <table className="w-full text-sm text-left">
      <thead className="bg-muted">
        <tr>
          <th className="p-2">Mês</th>
          <th className="p-2">Parcela</th>
          <th className="p-2">Juros</th>
          <th className="p-2">Amort.</th>
          <th className="p-2">Saldo</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map(row => (
          <tr key={row.mes} className="border-b">
            <td className="p-2">{row.mes}</td>
            <td className="p-2">{formatCurrency(row.parcela)}</td>
            <td className="p-2">{formatCurrency(row.juros)}</td>
            <td className="p-2">{formatCurrency(row.amort)}</td>
            <td className="p-2">{formatCurrency(row.saldo)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </motion.div>
);

const InputField = ({ label, id, name, value, onChange, type = 'text', placeholder, required = true, step = "0.01" }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      step={step}
      className="w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-primary focus:border-primary appearance-none m-0"
    />
  </div>
);

const CalculadoraFinanciamento = () => {
  const [activeTab, setActiveTab] = useState('carro');
  const audioRef = useRef(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Erro ao tocar som:", e));
    }
  };

  return (
    <PageWrapper title="Calculadora de Financiamento com CET" description="Simule o financiamento do seu carro ou imóvel com cálculo preciso do Custo Efetivo Total (CET).">
      <audio ref={audioRef} src="/click.mp3" preload="auto"></audio>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <HomeIcon className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Calculadora de Financiamento</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Calcule o Custo Efetivo Total (CET) do seu financiamento. O CET é a taxa que realmente importa, pois inclui todos os custos da operação.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-card p-8 rounded-xl shadow-lg border">
          <div className="flex justify-center mb-8 border-b">
            <button onClick={() => setActiveTab('carro')} className={`flex-1 p-4 text-lg font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'carro' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <Car /> Carro
            </button>
            <button onClick={() => setActiveTab('imovel')} className={`flex-1 p-4 text-lg font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'imovel' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <Building /> Imóvel
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'carro' && <FinanciamentoForm key="carro" tipo="carro" playSound={playSound} />}
            {activeTab === 'imovel' && <FinanciamentoForm key="imovel" tipo="imovel" playSound={playSound} />}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CalculadoraFinanciamento;