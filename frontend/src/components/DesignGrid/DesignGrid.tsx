'use client';

import React, { useState } from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';
import styles from './DesignGrid.module.css';

interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  behanceUrl: string;
}

interface DesignGridProps {
  projects: Project[];
  variant?: 'default' | 'work';
}

export default function DesignGrid({ projects, variant = 'default' }: DesignGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const visibleProjects = isExpanded ? projects : projects.slice(0, 6);
  const hasMore = projects.length > 6;

  return (
    <div className={styles.container}>
      <div className={variant === 'work' ? styles.workGrid : styles.grid}>
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} {...project} variant={variant} />
        ))}
      </div>
      
      {hasMore && (
        <div className={styles.buttonWrapper}>
          <button 
            className={styles.showMoreBtn} 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less -' : 'Show More +'}
          </button>
        </div>
      )}
    </div>
  );
}
