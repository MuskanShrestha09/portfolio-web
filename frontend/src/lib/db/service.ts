import { Project, Logo, SiteSettings } from '../types';
import { getDb } from './client';
import { DUMMY_PROJECTS } from '../../app/constants';

export class DatabaseService {
  private async getClient() {
    return getDb();
  }

  async getAllProjects(): Promise<Project[]> {
    const db = await this.getClient();
    if (!db) return DUMMY_PROJECTS as Project[];

    try {
      const { results } = await db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC').all();
      return (results as unknown as Project[]) || [];
    } catch (e) {
      console.error('DatabaseService.getAllProjects failed:', e);
      return DUMMY_PROJECTS as Project[];
    }
  }

  async createProject(project: Partial<Project>): Promise<boolean> {
    const db = await this.getClient();
    if (!db) return false;

    try {
      await db.prepare(
        'INSERT INTO projects (id, title, category, description, imageUrl, behanceUrl, sort_order, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        project.id, 
        project.title, 
        project.category, 
        project.description || '', 
        project.imageUrl, 
        project.behanceUrl, 
        project.sort_order || 0, 
        project.type || 'design'
      ).run();
      return true;
    } catch (e) {
      console.error('DatabaseService.createProject failed:', e);
      return false;
    }
  }

  async updateProject(id: string, updates: Partial<Project>, targetId?: string): Promise<boolean> {
    const db = await this.getClient();
    if (!db) return false;

    const tId = targetId || id;
    try {
      await db.prepare(
        'UPDATE projects SET id = ?, title = ?, category = ?, description = ?, imageUrl = ?, behanceUrl = ?, sort_order = ?, type = ? WHERE id = ?'
      ).bind(
        updates.id, 
        updates.title, 
        updates.category, 
        updates.description || '', 
        updates.imageUrl, 
        updates.behanceUrl, 
        updates.sort_order || 0, 
        updates.type || 'design', 
        tId
      ).run();
      return true;
    } catch (e) {
      console.error('DatabaseService.updateProject failed:', e);
      return false;
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    const db = await this.getClient();
    if (!db) return false;

    try {
      await db.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
      return true;
    } catch (e) {
      console.error('DatabaseService.deleteProject failed:', e);
      return false;
    }
  }

  async getAllLogos(): Promise<Logo[]> {
    const db = await this.getClient();
    if (!db) return [];

    try {
      const { results } = await db.prepare('SELECT * FROM logos ORDER BY created_at DESC').all();
      return (results as unknown as Logo[]) || [];
    } catch (e) {
      console.error('DatabaseService.getAllLogos failed:', e);
      return [];
    }
  }

  async createLogo(logo: Partial<Logo>): Promise<boolean> {
    const db = await this.getClient();
    if (!db) return false;

    try {
      await db.prepare('INSERT INTO logos (imageUrl, name) VALUES (?, ?)')
        .bind(logo.imageUrl, logo.name || '').run();
      return true;
    } catch (e) {
      console.error('DatabaseService.createLogo failed:', e);
      return false;
    }
  }

  async deleteLogo(id: number): Promise<boolean> {
    const db = await this.getClient();
    if (!db) return false;

    try {
      await db.prepare('DELETE FROM logos WHERE id = ?').bind(id).run();
      return true;
    } catch (e) {
      console.error('DatabaseService.deleteLogo failed:', e);
      return false;
    }
  }

  async getSettings(): Promise<SiteSettings> {
    const db = await this.getClient();
    
    if (!db) {
      if (process.env.NODE_ENV === 'development') {
        return {
          site_tagline: 'A UI/UX designer creating intuitive, user-centered digital experiences for web and mobile.',
          info_bio: "Hi, I'm Muskan.",
          intro_gallery: JSON.stringify(['/p.jpg', '/project-01.jpg', '/project-02.jpg'])
        } as SiteSettings;
      }
      return {};
    }

    try {
      const { results } = await db.prepare('SELECT * FROM site_settings').all();
      return (results as any[]).reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as SiteSettings);
    } catch (e) {
      console.error('DatabaseService.getSettings failed:', e);
      return {};
    }
  }

  async updateSettings(updates: SiteSettings): Promise<boolean> {
    const db = await this.getClient();
    
    if (!db) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('DatabaseService: Local development mode - simulating successful settings update.');
        return true;
      }
      console.error('DatabaseService.updateSettings: No database client available.');
      return false;
    }

    try {
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === null) continue;
        
        await db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)')
          .bind(key.trim(), String(value).trim()).run();
      }
      return true;
    } catch (e) {
      console.error('DatabaseService.updateSettings failed:', e);
      return false;
    }
  }
}

export const dbService = new DatabaseService();
