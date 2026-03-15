import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import DesignGrid from '@/components/DesignGrid/DesignGrid';
import WorkHero from '@/components/WorkHero/WorkHero';
import styles from './page.module.css';
import { dbService } from '@/lib/db/service';

export const runtime = 'edge';

async function getData() {
  try {
    const projects = await dbService.getAllProjects();
    return { projects };
  } catch (error) {
    console.error('Work Page Data Error:', error);
    return { projects: [] };
  }
}

export default async function WorkPage() {
  const { projects } = await getData();
  const allWorks = projects;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <WorkHero />

        <section className={styles.workList}>
          <div className="container">
            <DesignGrid projects={allWorks} variant="work" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
