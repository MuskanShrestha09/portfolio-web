'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  behanceUrl: string;
}

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1634942537034-22240b95da6d?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
];

export default function ProjectCard({ id, title, category, imageUrl, behanceUrl }: ProjectCardProps) {
  // Use a pseudo-random unsplash image if none provided
  const placeholderImage = UNSPLASH_IMAGES[id.length % UNSPLASH_IMAGES.length];
  const src = imageUrl || placeholderImage;

  return (
    <motion.div 
      className={styles.projectCard}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
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
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
          <div className={styles.overlay} />
        </div>
        
        <div className={styles.content}>
          <div className={styles.category}>{category || 'Visual Identity'}</div>
          <div className={styles.rightContent}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.smallDot} />
          </div>
        </div>
      </a>
    </motion.div>
  );
}
