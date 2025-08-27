import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const PageWrapper = ({
  title,
  description,
  children,
  showBackMobile = true, // novo: controla seta de voltar no mobile
  backLabel = 'Voltar',  // opcional: texto ao lado da seta
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>{`${title} | RICONOMIA`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${title} | RICONOMIA`} />
        <meta property="og:description" content={description} />
      </Helmet>

      {/* Barra de voltar apenas no mobile */}
      {showBackMobile && (
        <div className="md:hidden sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto px-4 h-12 flex items-center">
            <button
              type="button"
              onClick={() => window.history.back()}
              aria-label="Voltar"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              {/* Seta esquerda (inline SVG para evitar import extra) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>{backLabel}</span>
            </button>
          </div>
        </div>
      )}

      {children}
    </motion.div>
  );
};

export default PageWrapper;
