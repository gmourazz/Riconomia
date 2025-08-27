import React, { useState, useMemo } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calculator, Wallet, PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calcularINSS, calcularIRRF } from '@/lib/payroll';
import { formatCurrency, formatPercent, parseNumber } from '@/lib/utils';
import Explanation, { ExplanationBlock } from '@/components/Explanation';

const CalculadoraSalarioLiquido = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    salarioBruto: '5000',
    dependentes: '0',
    pensao: '0',
    outrosDescontos: [],
    beneficios: [],
  });
  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // aceita patch parcial { nome, valor }
  const handleDynamicFieldChange = (index, patch, fieldKey) => {
    const list = [...formData[fieldKey]];
    list[index] = { ...list[index], ...patch };
    setFormData(prev => ({ ...prev, [fieldKey]: list }));
  };

  const addDynamicField = (fieldKey) => {
    setFormData(prev => ({ ...prev, [fieldKey]: [...prev[fieldKey], { nome: '', valor: '' }] }));
  };

  const removeDynamicField = (index, fieldKey) => {
    const list = [...formData[fieldKey]];
    list.splice(index, 1);
    setFormData(prev => ({ ...prev, [fieldKey]: list }));
  };

  const calculo = useMemo(() => {
    try {
      const salarioBruto = parseNumber(formData.salarioBruto);
      const dependentes = parseInt(formData.dependentes, 10) || 0;
      const pensao = parseNumber(formData.pensao) || 0;

      const totalOutrosDescontos = (formData.outrosDescontos || []).reduce(
        (acc, d) => acc + (parseNumber(d?.valor) || 0), 0
      );
      const totalBeneficios = (formData.beneficios || []).reduce(
        (acc, b) => acc + (parseNumber(b?.valor) || 0), 0
      );

      if (isNaN(salarioBruto) || salarioBruto < 0) {
        return { error: "Salário bruto inválido." };
      }

      const inss = calcularINSS(salarioBruto);
      const irrf = calcularIRRF(salarioBruto, inss.valor, dependentes, pensao);
      const totalDescontos = inss.valor + irrf.imposto + totalOutrosDescontos;
      const salarioLiquido = salarioBruto - totalDescontos + totalBeneficios;

      return {
        salarioBruto,
        salarioLiquido,
        totalDescontos,
        totalBeneficios,
        inss,
        irrf,
        dependentes,
        pensao,
        outrosDescontos: formData.outrosDescontos,
        beneficios: formData.beneficios,
      };
    } catch (e) {
      return { error: "Erro no cálculo. Verifique os valores." };
    }
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (calculo.error) {
      toast({ title: "Erro", description: calculo.error, variant: "destructive" });
      setResultado(null);
    } else {
      setResultado(calculo);
      toast({ title: "Cálculo Realizado!", description: "Seu salário líquido foi calculado." });
      // REMOVIDO: scrollIntoView no mobile para evitar 'pulos'
    }
  };

  const InputField = ({ label, id, ...props }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );

  return (
    <PageWrapper title="Calculadora de Salário Líquido" description="Calcule seu salário líquido com base nos descontos de INSS, IRRF e outros.">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Wallet className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Calculadora de Salário Líquido</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Saiba exatamente quanto você receberá no final do mês após todos os descontos obrigatórios e opcionais.
          </p>
        </div>

        {/* No mobile (grid-cols-1), resultado fica dentro do mesmo Card, logo abaixo do form.
            No desktop (lg:grid-cols-2), resultado vai para o Card da direita. */}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Nº de Dependentes"
                    id="dependentes"
                    name="dependentes"
                    type="number"
                    min="0"
                    value={formData.dependentes}
                    onChange={handleChange}
                    inputMode="numeric"
                  />
                  <InputField
                    label="Pensão Alimentícia (R$)"
                    id="pensao"
                    name="pensao"
                    value={formData.pensao}
                    onChange={handleChange}
                    inputMode="decimal"
                  />
                </div>

                <DynamicFields
                  title="Outros Descontos"
                  fields={formData.outrosDescontos}
                  onFieldChange={(i, patch) => handleDynamicFieldChange(i, patch, 'outrosDescontos')}
                  onAddField={() => addDynamicField('outrosDescontos')}
                  onRemoveField={(i) => removeDynamicField(i, 'outrosDescontos')}
                  placeholder="Ex: Vale Transporte"
                />

                <DynamicFields
                  title="Benefícios/Outros Ganhos"
                  fields={formData.beneficios}
                  onFieldChange={(i, patch) => handleDynamicFieldChange(i, patch, 'beneficios')}
                  onAddField={() => addDynamicField('beneficios')}
                  onRemoveField={(i) => removeDynamicField(i, 'beneficios')}
                  placeholder="Ex: Vale Refeição"
                />

                <Button type="submit" className="w-full !h-auto py-3 text-lg mt-4">
                  <Calculator className="mr-2 h-5 w-5" />
                  Calcular
                </Button>
              </form>

              {/* RESULTADO FIXO LOGO ABAIXO DO FORM NO MOBILE */}
              <div className="mt-6 block lg:hidden">
                <ResultadoSalario resultado={resultado} />
              </div>
            </CardContent>
          </Card>

          {/* RESULTADO NA COLUNA DA DIREITA (DESKTOP) */}
          <Card className="order-2 lg:order-none hidden lg:block" id="resultado-salario-liquido">
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>Este é o resumo do seu salário.</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[280px] lg:min-h-[400px]">
              <ResultadoSalario resultado={resultado} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

const ResultadoSalario = ({ resultado }) => {
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
            <p className="text-sm text-muted-foreground">Salário Líquido</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(resultado.salarioLiquido)}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold text-muted-foreground">Salário Bruto</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(resultado.salarioBruto)}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold text-muted-foreground">Total de Descontos</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(resultado.totalDescontos)}</p>
            </div>
          </div>

          <Explanation>
            <ExplanationBlock title="INSS" value={formatCurrency(resultado.inss.valor)} />
            {(resultado.inss.faixas || []).map((f, i) => (
              <p key={i} className="pl-4 text-xs">
                {`Faixa ${i + 1}: ${formatCurrency(f.base)} * ${formatPercent(f.aliquota, 1)} = ${formatCurrency(f.valor)}`}
              </p>
            ))}

            <ExplanationBlock title="IRRF" value={formatCurrency(resultado.irrf.imposto)} />
            <p className="pl-4 text-xs">{`Base de Cálculo (${resultado.irrf.tipo}): ${formatCurrency(resultado.irrf.baseCalculo)}`}</p>
            <p className="pl-4 text-xs">{`Alíquota: ${formatPercent(resultado.irrf.aliquota)}`}</p>
            <p className="pl-4 text-xs">{`Fórmula: (Base * Alíquota) - Dedução`}</p>
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

const DynamicFields = ({ title, fields = [], onFieldChange, onAddField, onRemoveField, placeholder }) => (
  <div className="space-y-2 pt-2">
    <Label>{title}</Label>
    {fields.map((field, index) => (
      <div key={index} className="flex items-center gap-2">
        <Input
          placeholder={placeholder}
          value={field?.nome || ''}
          onChange={(e) => onFieldChange(index, { nome: e.target.value })}
          className="flex-grow"
        />
        <Input
          type="text"
          inputMode="decimal"
          placeholder="Valor (R$)"
          value={field?.valor || ''}
          onChange={(e) => onFieldChange(index, { valor: e.target.value })}
          className="w-32"
        />
        <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveField(index)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    ))}
    <Button type="button" variant="outline" size="sm" onClick={onAddField} className="w-full">
      <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Campo
    </Button>
  </div>
);

export default CalculadoraSalarioLiquido;
