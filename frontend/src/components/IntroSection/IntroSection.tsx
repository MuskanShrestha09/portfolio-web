'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import styles from './IntroSection.module.css';

interface IntroSectionProps {
  name: string;
  tagline: string;
}

const GALLERY_IMAGES = [
  '/ui_ux_design_1.png',
  '/ui_ux_design_2.png',
  '/ui_ux_design_3.png'
];

export default function IntroSection({ name, tagline }: IntroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Parallax movement for background images
  const y1 = useTransform(scrollYProgress, [0, 1], [400, -600]);
  const y2 = useTransform(scrollYProgress, [0, 1], [800, -1000]);
  const y3 = useTransform(scrollYProgress, [0, 1], [1200, -800]);

  // Subtle opacity fade for the sticky text to transition out
  const textOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);

  return (
    <>
      {/* PHASE 1: Sticky Carousel & Text */}
      <section ref={sectionRef} className={styles.introWrapper}>
        <div className={styles.galleryBackground}>
          <motion.div style={{ y: y1 }} className={styles.galleryItem}>
            <Image src={GALLERY_IMAGES[0]} alt="Design 1" width={400} height={500} className={styles.image} unoptimized />
          </motion.div>
          <motion.div style={{ y: y2 }} className={styles.galleryItem}>
            <Image src={GALLERY_IMAGES[1]} alt="Design 2" width={500} height={350} className={styles.image} unoptimized />
          </motion.div>
          <motion.div style={{ y: y3 }} className={styles.galleryItem}>
            <Image src={GALLERY_IMAGES[2]} alt="Design 3" width={450} height={600} className={styles.image} unoptimized />
          </motion.div>
        </div>

        <motion.div style={{ opacity: textOpacity }} className={styles.stickyContent}>
          <div className={styles.pattern} />
          <div className="container">
            <div className={styles.content}>
              <div className={styles.transitionElements}>
                <motion.div
                  className={styles.starWrapper}
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.star}>
                    <path d="M20 0C20 11.0457 28.9543 20 40 20C28.9543 20 20 28.9543 20 40C20 28.9543 11.0457 20 0 20C11.0457 20 20 11.0457 20 0Z" fill="currentColor" />
                  </svg>
                  <div className={styles.glow} />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className={styles.greeting}>Hi, I&apos;m {name}.</h2>
                <p className={styles.statement}>
                  {tagline || "A UI/UX designer creating intuitive, user-centered digital experiences for web and mobile."}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* PHASE 2: Scrolling Capabilities List (Directly below, no overlap) */}
      <section className={styles.capabilitiesLayer}>
        <div className="container">
          <div className={styles.capabilitiesContent}>
            <motion.p
              className={styles.subtext}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              / There&apos;s a lot I can do, here&apos;s a few
            </motion.p>

            <div className={styles.servicesList}>
              {[
                "USER RESEARCH",
                "PROTOTYPING",
                "USER TESTING",
                "WORKSHOPS",
                "INTERACTION DESIGN",
                "UX WORKSHOPS",
                "UI DESIGN"
              ].map((service, idx) => (
                <motion.div
                  key={idx}
                  className={styles.serviceItem}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1 + (idx * 0.1),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  {service}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
