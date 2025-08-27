import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-card border-t mt-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img src= "/img/Riconomia_Logo.png" alt="RICONOMIA F" className="h-20 w-30" />
              <span className="text-2xl font-bold text-foreground">RICONOMIA</span>
            </Link>
            <p className="text-muted-foreground text-sm">Seu guia simples para investir e planejar o futuro.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-4">Navegação</p>
            <ul className="space-y-2">
              <li><Link to="/ferramentas" className="text-muted-foreground hover:text-primary transition-colors">Ferramentas</Link></li>
              <li><Link to="/artigos" className="text-muted-foreground hover:text-primary transition-colors">Artigos</Link></li>
              <li><Link to="/sobre" className="text-muted-foreground hover:text-primary transition-colors">Sobre</Link></li>
              <li><Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors">Contato</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-4">Legal</p>
            <ul className="space-y-2">
              <li><Link to="/politica-de-privacidade" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos-de-uso" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-4">Siga-nos</p>
            <p className="text-muted-foreground">Em breve nossas redes sociais!</p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} RICONOMIA. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;