import React, { useState, useMemo } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calculator, Home, Car, Utensils, HeartPulse, BookOpen, Film, AlertTriangle, PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatPercent, parseNumber } from '@/lib/utils';
import Explanation, { ExplanationBlock } from '@/components/Explanation';

const CATEGORIAS_INICIAIS = [
  { id: 'moradia', nome: 'Moradia', icone: Home, itens: [{ nome: 'Aluguel/Financiamento', valor: '' }] },
  { id: 'transporte', nome: 'Transporte', icone: Car, itens: [{ nome: 'Combustível/Público', valor: '' }] },
  { id: 'alimentacao', nome: 'Alimentação', icone: Utensils, itens: [{ nome: 'Supermercado', valor: '' }] },
  { id: 'saude', nome: 'Saúde', icone: HeartPulse, itens: [{ nome: 'Plano de Saúde', valor: '' }] },
  { id: 'educacao', nome: 'Educação', icone: BookOpen, itens: [{ nome: 'Cursos', valor: '' }] },
  { id: 'lazer', nome: 'Lazer', icone: Film, itens: [{ nome: 'Streaming/Cinema', valor: '' }] },
];

const CalculadoraCustoDeVida = () => {
  const { toast } = useToast();
  const [rendaLiquida, setRendaLiquida] = useState('5000');
  const [categorias, setCategorias] = useState(CATEGORIAS_INICIAIS);
  const [resultado, setResultado] = useState(null);

  const handleItemChange = (catIndex, itemIndex, field, value) => {
    const novasCategorias = [...categorias];
    novasCategorias[catIndex].itens[itemIndex][field] = value;
    setCategorias(novasCategorias);
  };

  const addItem = (catIndex) => {
    const novasCategorias = [...categorias];
    novasCategorias[catIndex].itens.push({ nome: '', valor: '' });
    setCategorias(novasCategorias);
  };

  const removeItem = (catIndex, itemIndex) => {
    const novasCategorias = [...categorias];
    novasCategorias[catIndex].itens.splice(itemIndex, 1);
    setCategorias(novasCategorias);
  };

  const calculo = useMemo(() => {
    try {
      const renda = parseNumber(rendaLiquida);
      if (isNaN(renda) || renda <= 0) return { error: "Renda líquida inválida." };

      const totaisCategorias = categorias.map(cat => ({
        ...cat,
        total: cat.itens.reduce((acc, item) => acc + (parseNumber(item.valor) || 0), 0)
      }));

      const totalDespesas = totaisCategorias.reduce((acc, cat) => acc + cat.total, 0);
      const saldo = renda - totalDespesas;
      const taxaPoupanca = renda > 0 ? saldo / renda : 0;

      const alertas = [];
      const moradia = totaisCategorias.find(c => c.id === 'moradia');
      if (moradia && (moradia.total / renda) > 0.35) alertas.push("Custo com moradia excede 35% da renda.");
      const transporte = totaisCategorias.find(c => c.id === 'transporte');
      if (transporte && (transporte.total / renda) > 0.15) alertas.push("Custo com transporte excede 15% da renda.");
      if (taxaPoupanca < 0.10) alertas.push("Taxa de poupança abaixo de 10%.");
      if (saldo < 0) alertas.push("Saldo negativo! Suas despesas são maiores que sua renda.");

      return { renda, totalDespesas, saldo, taxaPoupanca, totaisCategorias, alertas };
    } catch (e) {
      return { error: "Erro no cálculo." };
    }
  }, [rendaLiquida, categorias]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (calculo.error) {
      toast({ title: "Erro", description: calculo.error, variant: "destructive" });
      setResultado(null);
    } else {
      setResultado(calculo);
      toast({ title: "Cálculo Realizado!", description: "Seu custo de vida foi analisado." });
    }
  };

  return (
    <PageWrapper title="Calculadora de Custo de Vida" description="Organize suas finanças, entenda seus gastos e veja para onde seu dinheiro está indo.">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Home className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Calculadora de Custo de Vida</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Mapeie suas despesas, identifique oportunidades de economia e planeje seu orçamento com mais clareza.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Renda Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="rendaLiquida">Sua Renda Líquida (R$)</Label>
                <Input id="rendaLiquida" value={rendaLiquida} onChange={(e) => setRendaLiquida(e.target.value)} />
              </CardContent>
            </Card>

            {categorias.map((cat, catIndex) => (
              <Card key={cat.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><cat.icone className="h-6 w-6 text-primary" /> {cat.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {cat.itens.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <Input placeholder="Descrição (ex: Aluguel)" value={item.nome} onChange={(e) => handleItemChange(catIndex, itemIndex, 'nome', e.target.value)} />
                      <Input placeholder="Valor (R$)" value={item.valor} onChange={(e) => handleItemChange(catIndex, itemIndex, 'valor', e.target.value)} className="w-32" />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(catIndex, itemIndex)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem(catIndex)} className="w-full"><PlusCircle className="h-4 w-4 mr-2" /> Adicionar item</Button>
                </CardContent>
              </Card>
            ))}
            <Button type="submit" className="w-full !h-auto py-3 text-lg mt-4"><Calculator className="mr-2 h-5 w-5" />Analisar Custo de Vida</Button>
          </form>

          <div className="lg:col-span-2 sticky top-24 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise Financeira</CardTitle>
              </CardHeader>
              <CardContent className="min-h-[300px]">
                <AnimatePresence>
                  {resultado && !resultado.error ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4" aria-live="polite">
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Saldo Mensal</p>
                        <p className={`text-3xl font-bold ${resultado.saldo >= 0 ? 'text-primary' : 'text-destructive'}`}>{formatCurrency(resultado.saldo)}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-semibold text-muted-foreground">Renda Líquida</p>
                          <p className="text-lg font-bold text-green-500">{formatCurrency(resultado.renda)}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-semibold text-muted-foreground">Total de Despesas</p>
                          <p className="text-lg font-bold text-destructive">{formatCurrency(resultado.totalDespesas)}</p>
                        </div>
                      </div>
                      <Explanation>
                        <ExplanationBlock title="Taxa de Poupança" value={formatPercent(resultado.taxaPoupanca)} formula="Saldo / Renda" />
                        {resultado.totaisCategorias.filter(c => c.total > 0).map(c => (
                           <ExplanationBlock key={c.id} title={c.nome} value={`${formatCurrency(c.total)} (${formatPercent(c.total/resultado.renda)})`} />
                        ))}
                      </Explanation>
                      {resultado.alertas.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="font-semibold flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Pontos de Atenção</h4>
                          <ul className="list-disc list-inside text-sm text-destructive space-y-1">
                            {resultado.alertas.map((alerta, i) => <li key={i}>{alerta}</li>)}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center h-full">
                      <Calculator className="mx-auto h-10 w-10 mb-4" />
                      <p>Sua análise financeira aparecerá aqui.</p>
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

export default CalculadoraCustoDeVida;