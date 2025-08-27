const TABELA_INSS = [
  { teto: 1412.00, aliquota: 0.075, parcela: 0 },
  { teto: 2666.68, aliquota: 0.09,  parcela: 21.18 },
  { teto: 4000.03, aliquota: 0.12,  parcela: 101.18 },
  { teto: 7786.02, aliquota: 0.14,  parcela: 181.18 },
];

const TETO_INSS = 7786.02;

const TABELA_IRRF = [
  { base: 2259.20, aliquota: 0,     deducao: 0 },
  { base: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { base: 3751.05, aliquota: 0.15,  deducao: 381.44 },
  { base: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { base: Infinity,aliquota: 0.275, deducao: 896.00 },
];

const DEDUCAO_DEPENDENTE = 189.59;
const DEDUCAO_SIMPLIFICADA_IRRF = 564.80;

export function calcularINSS(salarioBruto) {
  const salarioContribuicao = Math.min(salarioBruto, TETO_INSS);
  let inss = 0;
  let salarioRestante = salarioContribuicao;
  let faixaAnterior = 0;
  const faixasCalculadas = [];

  for (const faixa of TABELA_INSS) {
    if (salarioRestante > 0) {
      const baseFaixa = Math.min(salarioRestante, faixa.teto - faixaAnterior);
      const valorFaixa = baseFaixa * faixa.aliquota;
      inss += valorFaixa;
      faixasCalculadas.push({
        faixa: `Até ${faixa.teto.toFixed(2)}`,
        base: baseFaixa,
        aliquota: faixa.aliquota,
        valor: valorFaixa,
      });
      salarioRestante -= baseFaixa;
      faixaAnterior = faixa.teto;
    } else {
      break;
    }
  }
  
  if (salarioBruto > TETO_INSS) {
    const ultimaFaixa = TABELA_INSS[TABELA_INSS.length - 1];
    const inssTeto = (ultimaFaixa.teto * ultimaFaixa.aliquota) - ultimaFaixa.parcela;
    return { valor: inssTeto, faixas: faixasCalculadas };
  }

  return { valor: inss, faixas: faixasCalculadas };
}

export function calcularIRRF(salarioBruto, inss, dependentes = 0, pensao = 0) {
  const baseCalculo = salarioBruto - inss - (dependentes * DEDUCAO_DEPENDENTE) - pensao;
  
  const deducaoPadrao = baseCalculo * 0.25;
  const baseComSimplificado = salarioBruto - inss - pensao;
  const descontoSimplificado = Math.min(baseComSimplificado * 0.25, DEDUCAO_SIMPLIFICADA_IRRF);
  
  const baseFinal = Math.max(0, baseCalculo);
  const baseFinalSimplificada = Math.max(0, baseComSimplificado - descontoSimplificado);

  const calculoNormal = calcularImposto(baseFinal);
  const calculoSimplificado = calcularImposto(baseFinalSimplificada);

  if (calculoSimplificado.imposto < calculoNormal.imposto) {
    return {
      ...calculoSimplificado,
      baseCalculo: baseFinalSimplificada,
      tipo: 'Simplificado',
      descontoSimplificado,
    };
  }
  
  return {
    ...calculoNormal,
    baseCalculo: baseFinal,
    tipo: 'Completo',
    descontoSimplificado: 0,
  };
}

function calcularImposto(base) {
  for (const faixa of TABELA_IRRF) {
    if (base <= faixa.base) {
      const imposto = (base * faixa.aliquota) - faixa.deducao;
      return { imposto: Math.max(0, imposto), aliquota: faixa.aliquota, deducao: faixa.deducao };
    }
  }
  return { imposto: 0, aliquota: 0, deducao: 0 };
}