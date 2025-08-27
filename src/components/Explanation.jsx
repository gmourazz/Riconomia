import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const Explanation = ({ children }) => {
  return (
    <motion.details
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6 rounded-lg border p-4 bg-slate-50 dark:bg-slate-800/50"
    >
      <summary className="cursor-pointer font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <Info className="h-4 w-4" />
        Como chegamos a este valor
      </summary>
      <div className="mt-3 space-y-2 text-slate-700 dark:text-slate-200 text-sm">
        {children}
      </div>
    </motion.details>
  );
};

export const ExplanationBlock = ({ title, value, formula }) => (
    <div>
        <p className="font-semibold text-slate-800 dark:text-slate-100">{title}: <strong className="text-primary">{value}</strong></p>
        {formula && <p className="text-xs font-mono p-2 bg-slate-200 dark:bg-slate-700/50 rounded mt-1 break-all">{formula}</p>}
    </div>
);

export default Explanation;