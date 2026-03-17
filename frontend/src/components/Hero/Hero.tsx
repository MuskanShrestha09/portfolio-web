'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const [time, setTime] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className={styles.hero} ref={containerRef}>
      {/* Animated Background Image */}
      <motion.div
        className={styles.backgroundImage}
        style={{
          y: backgroundY,
          scale: backgroundScale
        }}
      >
        <img
          src="/hero_background.jpg"
          alt="Hero Background"
          className={styles.bgImg}
        />
        <div className={styles.overlay} />
      </motion.div>

      {/* HUD Elements */}
      <div className={styles.hud}>
        <div className={styles.topLeft}>
          {time}
        </div>
        <div className={styles.topCenter}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
          </svg>
        </div>
        <div className={styles.topRight}>
          <div className={styles.dots}>
            <span>.</span><span>.</span>
            <br />
            <span>.</span><span>.</span>
          </div>
        </div>

        <div className={styles.rightHud}>
          <div className={styles.globeIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div className={styles.hudText}>
            MY FORTE LIES IN AUTOMOTIVE,<br />
            SAAS, TECH, FASHION
          </div>
          <div
            className={styles.arrowDown}
            onClick={scrollToNext}
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          >
            ↓
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className={styles.content}>
        <motion.h1
          className={styles.title}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.line}>
            {" MAKING PEOPLE".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className={styles.word}
                variants={{
                  hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
                  visible: { y: 0, opacity: 1, filter: 'blur(0px)' }
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div className={`${styles.line} ${styles.line2}`}>
            {["[", "MUSKAN", "]"].map((word, i) => {
              let className = styles.word;
              if (word === "MUSKAN") className = styles.nameHighlight;
              else if (word === "[" || word === "]") className = styles.bracket;

              return (
                <motion.span
                  key={i}
                  className={className}
                  variants={{
                    hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
                    visible: { y: 0, opacity: 1, filter: 'blur(0px)' }
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 * i }}
                >
                  {word}
                </motion.span>
              );
            })}
            <motion.span
              className={styles.asterisk}
              variants={{
                hidden: { scale: 0, opacity: 0, rotate: -45 },
                visible: { scale: 1, opacity: 1, rotate: 0 }
              }}
              transition={{ delay: 0.8, duration: 0.5, ease: "backOut" }}
            >
              <svg 
                viewBox="0 0 100 100" 
                fill="currentColor"
              >
                {/* 8-pointed blocky asterisk */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <rect
                    key={angle}
                    x="42" y="0"
                    width="16" height="42"
                    rx="2"
                    transform={`rotate(${angle} 50 50)`}
                  />
                ))}
                <rect x="42" y="42" width="16" height="16" rx="2" />
              </svg>
            </motion.span>
          </div>
        </motion.h1>
      </div>
    </section>
  );
}
