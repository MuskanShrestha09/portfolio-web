'use client';

import { motion } from 'framer-motion';
import styles from './WorkHero.module.css';

interface WorkHeroProps {
  title?: string;
  subtitle?: string;
}

export default function WorkHero({ title, subtitle }: WorkHeroProps) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.pattern} />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.title}>{title || <>Work <br /> Showcase</>}</h1>
          <p className={styles.subtitle}>{subtitle || "A collection of my design work across UI/UX, branding, and visual design, reflecting my learning process, creativity, and exploration."}</p>
        </motion.div>
      </div>
    </section>
  );
}
