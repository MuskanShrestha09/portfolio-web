import styles from './Footer.module.css';

export default async function Footer() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  let settings = null;
  try {
    const res = await fetch(`${baseUrl}/api/settings`, { cache: 'no-store' });
    if (res.ok) settings = await res.json();
  } catch (e) {}

  const email = settings?.email || 'muskanshrestha@gmail.com';
  const whatsapp = settings?.whatsapp || '9779840779710';

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.top}>
          <h2 className={styles.headline}>Let's talk design.</h2>
          <div className={styles.contactLinks}>
            <a href={`mailto:${email}`} className={styles.email}>{email}</a>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>WhatsApp</a>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            ©{new Date().getFullYear()} MUSKAN
          </div>
          <div className={styles.credits}>
            Handcrafted with intent.
          </div>
        </div>
      </div>
    </footer>
  );
}
