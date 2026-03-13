import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import DesignGrid from '@/components/DesignGrid/DesignGrid';
import Hero from '@/components/Hero/Hero';
import IntroSection from '@/components/IntroSection/IntroSection';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import styles from './page.module.css';
import { dbService } from '@/lib/db/service';

export const runtime = 'edge';
export const revalidate = 3600;

async function getData() {
  try {
    const [projects, settings, logos] = await Promise.all([
      dbService.getAllProjects(),
      dbService.getSettings(),
      dbService.getAllLogos()
    ]);
    return { projects, logos, settings };
  } catch (error) {
    console.error('Home Page Root Error:', error);
    return { projects: [], logos: [], settings: {} as any };
  }
}

export default async function Home() {
  const { projects, logos, settings } = await getData();
  const designProjects = projects.filter((p: any) => !p.type || p.type === 'design');

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Hero />
        <IntroSection 
          name="Muskan" 
          tagline={settings.site_tagline} 
        />

        <SectionHeader />

        {/* Selected Works */}
        <section className={styles.work} id="work">
          <div className="container">
            <DesignGrid projects={designProjects} />
          </div>
        </section>

        {/* Branding/Logos Section */}
        {logos.length > 0 && (
          <section className={styles.brands}>
            <div className="container">
              <div className={styles.brandContainer}>
                <div className={styles.brandTitleWrapper}>
                  <h2 className={styles.brandTitle}>Identity <br /> <span className="serif">Archives</span></h2>
                  <p className={styles.brandSubtitle}>A selection of marks and logotypes crafted for various industries.</p>
                </div>
                <div className={styles.logosGrid}>
                  {logos.map((logo: any) => (
                    <div key={logo.id} className={styles.logoItem}>
                      <img src={logo.imageUrl} alt={logo.name || 'Brand Logo'} className={styles.brandLogo} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
