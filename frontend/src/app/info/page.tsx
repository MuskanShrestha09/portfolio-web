import Image from 'next/image';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import InfoHero from '@/components/InfoHero/InfoHero';
import Reveal from '@/components/Reveal/Reveal';
import styles from './page.module.css';
import { dbService } from '@/lib/db/service';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: "Info",
  description: "Learn more about Muskan, a UI/UX focused designer from Kathmandu, Nepal.",
};

export default async function InfoPage() {
  const settings = await dbService.getSettings();
  const bio = settings?.info_bio || "UI/UX focused designer crafting intuitive digital experiences and visual identities with clarity and purpose.";

  // Use dummy experience data if none is set in db to showcase the design
  const rawExperience = settings?.info_experience && settings.info_experience !== '[]'
    ? settings.info_experience
    : '[{"title": "UI/UX Supervisor @ ING Skill Academy", "label": "Feb 2026 - Present"}, {"title": "UI/UX Designer @ ING Skill Academy", "label": "Jun 2024 - Feb 2026"}]';

  const experience = JSON.parse(rawExperience);
  const email = settings?.email || 'muskanshrestha@gmail.com';
  const whatsapp = settings?.whatsapp || '9779840779710';

  // Splitting about me into two columns
  const aboutParas = settings?.info_about_me
    ? settings.info_about_me.split('\n')
    : [
      "I believe great design is not just about aesthetics, but about removing friction. Every project is an opportunity to solve problems creatively.",
      "Driven by curiosity and a detail-oriented approach, I specialize in creating seamless user flows and striking visual systems that elevate brands."
    ];

  const mid = Math.ceil(aboutParas.length / 2);
  const leftCol = aboutParas.slice(0, mid);
  const rightCol = aboutParas.slice(mid);

  return (
    <>
      <Navbar hideName={false} />
      <main className={styles.main}>
        <InfoHero portrait={settings?.info_portrait || "/muskan.png"} bio={bio} email={email} />

        <section className={styles.bioSection}>
          <div className="container">
            <Reveal className={styles.bioGrid}>
              <div className={styles.bioLabel}>● About Me</div>
              <div className={styles.bioContent}>
                <h2 className={styles.bioLarge}>{bio}</h2>
                <div className={styles.bioDetailWrapper}>
                  <div className={styles.bioDetail}>
                    {leftCol.map((para: string, i: number) => (
                      <p key={`left-${i}`}>{para}</p>
                    ))}
                  </div>
                  <div className={styles.bioDetail}>
                    {rightCol.map((para: string, i: number) => (
                      <p key={`right-${i}`}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {experience.length > 0 && (
          <section className={styles.experienceSection}>
            <div className="container">
              <Reveal className={styles.experienceGrid}>
                <div className={styles.experienceHeader}>
                  <h2 className={styles.experienceTitle}>Experience</h2>
                  <span className={styles.experienceLabel}>Career Timeline</span>
                </div>
                <div className={styles.experienceList}>
                  {experience.map((exp: any, idx: number) => (
                    <div key={idx} className={styles.experienceItem}>
                      <h3 className={styles.expRole}>{exp.title}</h3>
                      <span className={styles.expYear}>{exp.label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        <section className={styles.contactSection}>
          <div className="container">
            <Reveal className={styles.contactContainer}>
              <div className={styles.contactLabel}>Available for new opportunities</div>
              <h2 className={styles.contactHuge}>HAVE A PROJECT IN MIND?</h2>
              <div className={styles.contactInfo}>
                <a href={`mailto:${email}`} className={styles.contactLink}>Send Email</a>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  WhatsApp
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
