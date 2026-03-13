'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import styles from './Navbar.module.css';

interface NavbarProps {
  hideName?: boolean;
}

export default function Navbar({ hideName }: NavbarProps) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Don't hide for admin panel
  const isAdmin = pathname?.startsWith('/admin');
  const actualHidden = isAdmin ? false : hidden;

  return (
    <motion.nav 
      className={styles.navbar}
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: '-100%', opacity: 0 }
      }}
      animate={actualHidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.brand}>
          {!hideName && (
            <span className={styles.name}>MUSKAN</span>
          )}
        </Link>
        
        <div className={styles.navLinks}>
          <Link 
            href="/" 
            className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
          >
            Work
            {pathname === '/' && <motion.div layoutId="nav-underline" className={styles.underline} />}
          </Link>
          <Link 
            href="/info" 
            className={`${styles.link} ${pathname === '/info' ? styles.active : ''}`}
          >
            Info
            {pathname === '/info' && <motion.div layoutId="nav-underline" className={styles.underline} />}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
