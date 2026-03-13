'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './InfoHero.module.css';

interface InfoHeroProps {
  portrait: string;
  bio?: string;
  email?: string;
}

export default function InfoHero({ portrait, bio, email }: InfoHeroProps) {
  const imageSrc = '/M.png'; // Explicitly using M.png as requested

  const fadeInUp: any = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <section className={styles.hero}>
      {/* Background Columns */}
      <div className={styles.backgroundCols}>
        <div className={styles.colLeft}></div>
        <div className={styles.colCenter}></div>
        <div className={styles.colRight}></div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Huge Background Text */}
        <div className={styles.textBackground}>
          <div className={styles.hugeText}>
            <div className={styles.textLineWrapper}>
              <motion.div
                className={styles.textLine}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                MUSKAN
              </motion.div>
            </div>
            <div className={styles.textLineWrapper}>
              <motion.div
                className={styles.textLine}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                SHRESTHA
              </motion.div>
            </div>
          </div>
        </div>

        {/* Foreground Image */}
        <motion.div
          className={styles.imageContainer}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={imageSrc}
            alt="Muskan Profile"
            fill
            className={styles.portrait}
            priority
            unoptimized
          />
        </motion.div>

        {/* Bottom Left Content */}
        <motion.div
          className={styles.bottomLeft}
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <p className={styles.description}>
            AS A UI/UX DESIGNER, I SPECIALIZE IN<br />
            CRAFTING INTUITIVE, USER-CENTERED<br />
            AND VISUALLY ENGAGING DIGITAL EXPERIENCES.
          </p>
          <p className={styles.description}>
            MUSKAN&apos;S INTERACTION DESIGN<br />
            EXPERTISE DELIVERED.
          </p>
          <a href={`mailto:${email || 'hello@example.com'}`} className={styles.contactBtn}>
            Let&apos;s talk <span className={styles.arrow}>→</span>
          </a>
        </motion.div>

        {/* Bottom Right Content */}
        <motion.div
          className={styles.bottomRight}
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className={styles.circleBadge}>
            <span className={styles.badgeText}>05</span>
          </div>


          <div className={styles.tags}>
            <span className={styles.tag}>DIGITAL DESIGN</span>
            <span className={styles.tagDark}>2024</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
