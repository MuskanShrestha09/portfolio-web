'use client';

import { motion } from 'framer-motion';
import Reveal from '../Reveal/Reveal';
import styles from './SectionHeader.module.css';

export default function SectionHeader() {
  return (
    <section className={styles.sectionHeader}>
      <motion.div 
        className="container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-200px" }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.topBar}>
          <div className={styles.brackets}>&gt;&gt;&gt;</div>
          <div className={styles.workTag}>//WORK</div>
          <div className={styles.years}>2021 - 2026</div>
        </div>
        
        <div className={styles.mainContent}>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            SELECTED<br />WORK
          </motion.h2>

          <motion.div 
            className={styles.whiteDot}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
