'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './TechCard.module.css';

interface TechCardProps {
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  behanceUrl: string;
}

export default function TechCard({ title, imageUrl, description, behanceUrl }: TechCardProps) {
  const displayDescription = description || `A technology product for ${title}.`;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href={behanceUrl} target="_blank" rel="noopener noreferrer" className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className={styles.image}
              sizes="100vw"
              unoptimized
            />
          ) : (
            <div className={styles.placeholder} />
          )}
        </div>
      </a>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{displayDescription}</p>
      </div>
    </motion.div>
  );
}
