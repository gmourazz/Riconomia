import React, { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';

const Contato = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contato de ${formData.name}`);
    const body = encodeURIComponent(formData.message);
    window.location.href = `mailto:suporte@riconomia.com.br?subject=${subject}&body=${body}`;
  };

  return (
    <PageWrapper title="Contato" description="Entre em contato com a equipe da RICONOMIA. Envie suas dúvidas, sugestões ou feedback. Estamos aqui para ajudar.">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Entre em Contato</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Tem alguma dúvida ou sugestão? Adoraríamos ouvir você!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }} 
            className="bg-card p-8 rounded-xl shadow-lg border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Envie uma Mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">Nome</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  className="w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-primary focus:border-primary" 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Seu Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  className="w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-primary focus:border-primary" 
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">Mensagem</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="4" 
                  value={formData.message}
                  onChange={handleChange}
                  required 
                  className="w-full px-4 py-2 bg-background border border-border rounded-md focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
              <Button type="submit" className="w-full text-lg py-3 !h-auto transition-transform active:scale-95">
                <Send className="mr-2 h-5 w-5" />
                Enviar via Email
              </Button>
            </form>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }} 
            className="space-y-8 flex flex-col justify-center"
          >
            <div className="bg-card p-8 rounded-xl shadow-lg border">
              <Mail className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Suporte e Dúvidas</h3>
              <p className="text-muted-foreground">Para dúvidas gerais, suporte sobre nossas ferramentas, parcerias e outros assuntos.</p>
              <a href="mailto:suporte@riconomia.com.br" className="text-primary font-medium hover:underline">suporte@riconomia.com.br</a>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Contato;