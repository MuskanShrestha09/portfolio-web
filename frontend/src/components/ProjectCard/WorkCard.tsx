'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './WorkCard.module.css';

interface WorkCardProps {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  behanceUrl: string;
}

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1634942537034-22240b95da6d?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
];

export default function WorkCard({ id, title, category, imageUrl, behanceUrl }: WorkCardProps) {
  const placeholderImage = UNSPLASH_IMAGES[id.length % UNSPLASH_IMAGES.length];
  const src = imageUrl || placeholderImage;

  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href={behanceUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
        <div className={styles.imageWrapper}>
          <Image 
            src={src} 
            alt={title} 
            fill 
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        </div>
        
        <div className={styles.info}>
          <div className={styles.text}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.category}>{category}</p>
          </div>
          <div className={styles.arrowCircle}>
            <ArrowRight size={20} />
          </div>
        </div>
      </a>
    </motion.div>
  );
}
