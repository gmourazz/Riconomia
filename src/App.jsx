import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Ferramentas from '@/pages/Ferramentas';
import CalculadoraAposentadoria from '@/pages/CalculadoraAposentadoria';
import CalculadoraFinanciamento from '@/pages/CalculadoraFinanciamento';
import CalculadoraCAPM from '@/pages/CalculadoraCAPM';
import ModeloGordon from '@/pages/ModeloGordon';
import IndependenciaFinanceira from '@/pages/IndependenciaFinanceira';
import ConversorTaxas from '@/pages/ConversorTaxas';
import JurosCompostos from '@/pages/JurosCompostos';
import CalculadoraSalarioLiquido from '@/pages/CalculadoraSalarioLiquido';
import CalculadoraDecimoTerceiro from '@/pages/CalculadoraDecimoTerceiro';
import CalculadoraCustoDeVida from '@/pages/CalculadoraCustoDeVida';
import Artigos from '@/pages/Artigos';
import ArtigoDetalhes from '@/pages/ArtigoDetalhes';
import Sobre from '@/pages/Sobre';
import Contato from '@/pages/Contato';
import PoliticaPrivacidade from '@/pages/PoliticaPrivacidade';
import TermosUso from '@/pages/TermosUso';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

const AppContent = () => {
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <div className={`${theme} font-sans bg-background text-foreground`}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/ferramentas" element={<Ferramentas />} />
              <Route path="/calculadora-aposentadoria" element={<CalculadoraAposentadoria />} />
              <Route path="/calculadora-financiamento" element={<CalculadoraFinanciamento />} />
              <Route path="/calculadora-capm" element={<CalculadoraCAPM />} />
              <Route path="/modelo-de-gordon" element={<ModeloGordon />} />
              <Route path="/independencia-financeira" element={<IndependenciaFinanceira />} />
              <Route path="/conversor-de-taxas" element={<ConversorTaxas />} />
              <Route path="/juros-compostos" element={<JurosCompostos />} />
              <Route path="/calculadora-salario-liquido" element={<CalculadoraSalarioLiquido />} />
              <Route path="/calculadora-decimo-terceiro" element={<CalculadoraDecimoTerceiro />} />
              <Route path="/calculadora-custo-de-vida" element={<CalculadoraCustoDeVida />} />
              <Route path="/artigos" element={<Artigos />} />
              <Route path="/artigos/:slug" element={<ArtigoDetalhes />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/termos-de-uso" element={<TermosUso />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <Router>
          <ThemeProvider>
            <AppContent />
            <Toaster />
          </ThemeProvider>
        </Router>
      </HelmetProvider>
    </React.StrictMode>
  );
}

export default App;