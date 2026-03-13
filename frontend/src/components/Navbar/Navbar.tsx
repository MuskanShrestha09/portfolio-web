'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Navbar.module.css';

interface NavbarProps {
  hideName?: boolean;
}

export default function Navbar({ hideName }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
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
    </nav>
  );
}
