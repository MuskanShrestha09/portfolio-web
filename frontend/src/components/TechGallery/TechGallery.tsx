'use client';

import React, { useState, useRef } from 'react';
import styles from './TechGallery.module.css';
import TechCard from '../ProjectCard/TechCard';

interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  behanceUrl: string;
}

interface TechGalleryProps {
  projects: Project[];
  description?: string;
}

export default function TechGallery({ projects, description }: TechGalleryProps) {
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[index];

  return (
    <section className={styles.carouselContainer}>
      <div className={styles.header}>
        <div className={styles.sectionHeadingWrapper}>
          <h2 className={styles.sectionHeading}>Technology</h2>
          <p className={styles.sectionDescription}>
            {description || (
              <>Exploring the intersection of design and code. My goal is to create 
              seamless digital products that are not just functional, but also 
              visually engaging and user-friendly.</>
            )}
          </p>
        </div>
        <div className={styles.controls}>
          <div className={styles.arrows}>
            <button className={styles.arrow} onClick={prevSlide} aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className={styles.arrow} onClick={nextSlide} aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.singleItemView}>
        <TechCard key={currentProject.id} {...currentProject} />
      </div>

      <div className={styles.pagination}>
        {projects.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
