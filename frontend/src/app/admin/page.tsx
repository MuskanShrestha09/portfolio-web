'use client';

import { useState, useEffect } from 'react';
import { 
  Trash2, LogOut, 
  Upload, User, Plus, X, Briefcase, GripVertical, Grid
} from 'lucide-react';
import { Reorder } from 'framer-motion';
import styles from './admin.module.css';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  behanceUrl: string;
  type?: string;
}

interface Logo {
  id?: number;
  imageUrl: string;
  name: string;
}

interface SiteSettings {
  email: string;
  phone: string;
  whatsapp: string;
  info_about: string; // The new small about section below Info Title
  info_bio: string;
  info_experience: string; // JSON string
  info_portrait: string;
  info_about_me: string;
  site_tagline: string;
  design_description: string;
  tech_description: string;
  intro_gallery: string; // JSON string
}

type Tab = 'projects' | 'works' | 'logos' | 'info';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [projectFilter, setProjectFilter] = useState<'design' | 'technology'>('design');

  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [logos, setLogos] = useState<Logo[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    email: '',
    phone: '',
    whatsapp: '',
    info_about: '',
    info_bio: '',
    info_experience: '[]',
    info_portrait: '',
    info_about_me: '',
    site_tagline: '',
    design_description: '',
    tech_description: '',
    intro_gallery: '[]',
  });

  // Form States
  const [isEditing, setIsEditing] = useState(false);
  const [newProject, setNewProject] = useState<Project>({
    id: '', title: '', category: '', description: '', imageUrl: '', behanceUrl: '', type: 'design'
  });

  const [originalId, setOriginalId] = useState<string | null>(null);
  const [newLogo, setNewLogo] = useState<Logo>({ imageUrl: '', name: '' });
  const [experience, setExperience] = useState<{label: string, title: string}[]>([]);
  const [introGallery, setIntroGallery] = useState<string[]>([]);

  useEffect(() => {
    const savedPassword = sessionStorage.getItem('admin_password');
    if (savedPassword) {
      setIsLoggedIn(true);
      fetchAllData(savedPassword);
    } else {
      setLoading(false);
    }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchAllData = async (pwd: string) => {
    setLoading(true);
    const headers = { 'X-Admin-Password': pwd };
    try {
      const [projRes, logoRes, setRes] = await Promise.all([
        fetch('/api/projects', { headers }),
        fetch('/api/logos', { headers }),
        fetch('/api/settings', { headers }),
      ]);

      if (projRes.ok) setProjects(await projRes.json());
      if (logoRes.ok) setLogos(await logoRes.json());
      if (setRes.ok) {
        const s = await setRes.json();
        setSettings(s);
        try {
          setExperience(JSON.parse(s.info_experience || '[]'));
        } catch (error) {
          setExperience([]);
        }
        try {
          setIntroGallery(JSON.parse(s.intro_gallery || '[]'));
        } catch (error) {
          setIntroGallery([]);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        sessionStorage.setItem('admin_password', password);
        setIsLoggedIn(true);
        fetchAllData(password);
      } else {
        alert(data.error || 'Incorrect password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error during login');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    // No-Card Workaround: Compress and convert to Base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 2560; // Increased for high-fidelity assets
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              width = maxDim; // Fixed logic bug here too
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Boost quality to 0.95 for maximum fidelity
          const dataUrl = canvas.toDataURL('image/webp', 0.95);
          resolve(dataUrl);
        };
      };
    });
  };

  const saveOrder = async () => {
    setIsSavingOrder(true);
    const pwd = sessionStorage.getItem('admin_password');
    const filterType = activeTab === 'works' ? 'work' : projectFilter;
    const filteredProjects = projects.filter(p => (p.type || (activeTab === 'works' ? 'work' : 'design')) === filterType);
    const reorderedProjects = filteredProjects.map((p, index) => ({ id: p.id, sort_order: index }));
    
    try {
      const res = await fetch('/api/projects/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': pwd || '' },
        body: JSON.stringify({ projects: reorderedProjects }),
      });
      
      if (res.ok) {
        showNotification('Order saved successfully');
      } else {
        alert('Failed to save order');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving order');
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Projects CRUD
  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!newProject.id || !newProject.title) {
      alert('Please fill in both ID and Title');
      return;
    }

    const pwd = sessionStorage.getItem('admin_password');
    const method = isEditing ? 'PUT' : 'POST';
    const body = isEditing ? { ...newProject, oldId: originalId } : newProject;
    
    try {
      const res = await fetch('/api/projects', {
        method: method,
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': pwd || '' },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setNewProject({ id: '', title: '', category: '', description: '', imageUrl: '', behanceUrl: '', type: 'design' });
        setOriginalId(null);
        setIsEditing(false);
        setIsModalOpen(false);
        fetchAllData(pwd!);
        showNotification(isEditing ? 'Project updated' : 'Project saved');
      } else {
        alert(`Error: ${data.error || 'Failed to save project'}${data.details ? `\n\nDetails: ${data.details}` : ''}${data.hint ? `\n\nHint: ${data.hint}` : ''}`);
      }
    } catch (error) {
      console.error('Save project error:', error);
      alert('Network error while saving project. Please check your connection.');
    }
  };

  const editProject = (p: Project) => {
    setNewProject(p);
    setOriginalId(p.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const cancelEdit = () => {
    setNewProject({ id: '', title: '', category: '', description: '', imageUrl: '', behanceUrl: '', type: 'design' });
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete project?')) return;
    const pwd = sessionStorage.getItem('admin_password');
    await fetch('/api/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Password': pwd || '' },
      body: JSON.stringify({ id }),
    });
    fetchAllData(pwd!);
  };

  // Logos CRUD
  const saveLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwd = sessionStorage.getItem('admin_password');
    const res = await fetch('/api/logos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Password': pwd || '' },
      body: JSON.stringify(newLogo),
    });
    if (res.ok) {
      setNewLogo({ imageUrl: '', name: '' });
      fetchAllData(pwd!);
      showNotification('Logo saved');
    }
  };

  const deleteLogo = async (id: number) => {
    const pwd = sessionStorage.getItem('admin_password');
    await fetch('/api/logos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Password': pwd || '' },
      body: JSON.stringify({ id }),
    });
    fetchAllData(pwd!);
  };

  // Settings Save
  const saveSettings = async () => {
    const pwd = sessionStorage.getItem('admin_password');
    const updated = {
      ...settings,
      info_experience: JSON.stringify(experience),
      intro_gallery: JSON.stringify(introGallery)
    };
    
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': pwd || '' },
        body: JSON.stringify(updated),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showNotification('Settings saved');
        fetchAllData(pwd!);
      } else {
        alert(`Error: ${data.error || 'Failed to update settings'}${data.details ? `\n\nDetails: ${data.details}` : ''}`);
      }
    } catch (error) {
      console.error('Save settings error:', error);
      alert('Network error while saving settings.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          <h1>Admin access</h1>
          <form onSubmit={handleLogin} className={styles.inputGroup}>
            <input 
              type="password" 
              placeholder="Enter password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className={styles.loginInput}
              required 
            />
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1>MUSKAN CMS</h1>
          <p>Portfolio Manager</p>
        </div>

        <nav className={styles.nav}>
          <div 
            className={`${styles.navItem} ${activeTab === 'projects' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <Briefcase size={18} /> Projects
          </div>
          <div 
            className={`${styles.navItem} ${activeTab === 'works' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('works')}
          >
            <Grid size={18} /> Works
          </div>
          <div 
            className={`${styles.navItem} ${activeTab === 'logos' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('logos')}
          >
            <Plus size={18} /> Client Logos
          </div>
          <div 
            className={`${styles.navItem} ${activeTab === 'info' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <User size={18} /> Info & Contact
          </div>
        </nav>

        <button onClick={() => { setIsLoggedIn(false); sessionStorage.removeItem('admin_password'); }} className={styles.logoutBtn}>
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          
          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <section className={styles.section}>
              <div className={styles.tableActions}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Project list</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button 
                    className={styles.submitBtn} 
                    style={{ margin: 0 }} 
                    onClick={saveOrder}
                    disabled={isSavingOrder}
                  >
                    {isSavingOrder ? 'Saving...' : 'Save Order'}
                  </button>
                  <button className={styles.addNewBtn} onClick={() => { setIsEditing(false); setNewProject({ id: '', title: '', category: '', description: '', imageUrl: '', behanceUrl: '', type: 'design' }); setIsModalOpen(true); }}>
                    <Plus size={18} /> Add New Project
                  </button>
                </div>
              </div>

              {/* PROJECT TABS / FILTER */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button 
                  onClick={() => setProjectFilter('design')}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: projectFilter === 'design' ? '#111' : '#f4f4f7', 
                    color: projectFilter === 'design' ? '#fff' : '#666',
                    border: 'none', borderRadius: '2px', cursor: 'pointer' 
                  }}
                >
                  Design Projects
                </button>
                <button 
                  onClick={() => setProjectFilter('technology')}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: projectFilter === 'technology' ? '#111' : '#f4f4f7', 
                    color: projectFilter === 'technology' ? '#fff' : '#666',
                    border: 'none', borderRadius: '2px', cursor: 'pointer' 
                  }}
                >
                  Technology Projects
                </button>
              </div>

              <div className={styles.projectListHeader} style={{ display: 'flex', padding: '1rem', borderBottom: '2px solid #eee', fontWeight: 'bold' }}>
                <div style={{ width: '40px' }}></div>
                <div style={{ flex: 1 }}>Project</div>
                <div style={{ flex: 1 }}>Category</div>
                <div style={{ width: '150px', textAlign: 'right' }}>Actions</div>
              </div>

              <Reorder.Group 
                axis="y" 
                values={projects.filter(p => (p.type || 'design') === projectFilter)} 
                onReorder={(newOrder) => {
                  // Merge the new order of filtered items with the rest of the unfiltered items
                  const otherProjects = projects.filter(p => (p.type || 'design') !== projectFilter);
                  setProjects([...newOrder, ...otherProjects]);
                }} 
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
              >
                {projects.filter(p => (p.type || 'design') === projectFilter).map(p => (
                  <Reorder.Item key={p.id} value={p} className={styles.projectRow} style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee', background: '#fff', cursor: 'grab' }} whileDrag={{ scale: 1.02, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                    <div style={{ width: '40px', color: '#999', cursor: 'grab', display: 'flex', alignItems: 'center' }}>
                      <GripVertical size={20} />
                    </div>
                    <div className={styles.projectTitle} style={{ flex: 1 }}>{p.title}</div>
                    <div className={styles.projectCategory} style={{ flex: 1 }}>{p.category}</div>
                    <div style={{ width: '150px', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => editProject(p)} className={styles.deleteBtn} style={{ color: '#000' }}>
                        Edit
                      </button>
                      <button onClick={() => deleteProject(p.id)} className={styles.deleteBtn}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              {/* PROJECT MODAL */}
              {isModalOpen && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContainer}>
                    <div className={styles.modalHeader}>
                      <h2>{isEditing ? 'Edit project' : 'Add new project'}</h2>
                      <button className={styles.closeBtn} onClick={cancelEdit}>
                        <X size={24} />
                      </button>
                    </div>

                    <form onSubmit={saveProject} className={styles.form}>
                      <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                        <label>Project Type</label>
                        <select 
                          value={newProject.type || 'design'} 
                          onChange={e => setNewProject({...newProject, type: e.target.value})}
                          style={{ padding: '0.8rem 1rem', border: '1px solid #e8e8e8', borderRadius: '2px', background: '#fafafa', fontSize: '1rem', color: '#333', outline: 'none' }}
                        >
                          <option value="design">Design</option>
                          <option value="technology">Technology</option>
                          <option value="work">Work</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Unique identifier</label>
                        <input 
                          placeholder="e.g. project-x" 
                          value={newProject.id} 
                          onChange={e => setNewProject({...newProject, id: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Title</label>
                        <input 
                          placeholder="Project name" 
                          value={newProject.title} 
                          onChange={e => setNewProject({...newProject, title: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Category</label>
                        <input 
                          placeholder="e.g. Branding" 
                          value={newProject.category} 
                          onChange={e => setNewProject({...newProject, category: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>External link</label>
                        <input 
                          placeholder="https://behance.net/..." 
                          value={newProject.behanceUrl} 
                          onChange={e => setNewProject({...newProject, behanceUrl: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label>Description (SEO Friendly)</label>
                        <textarea 
                          className={styles.textarea}
                          placeholder="Describe the project..." 
                          value={newProject.description} 
                          onChange={e => setNewProject({...newProject, description: e.target.value})} 
                        />
                      </div>
                      
                      <div className={styles.uploadGroup}>
                        <label>Project Thumbnail</label>
                        <div 
                          className={styles.uploadArea}
                          onClick={() => document.getElementById('project-upload')?.click()}
                        >
                          <Upload size={24} />
                          <span>{newProject.imageUrl ? 'Image ready' : 'Click to upload photo'}</span>
                          <input 
                            id="project-upload"
                            type="file" 
                            hidden 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await handleFileUpload(file);
                                if (url) setNewProject({...newProject, imageUrl: url});
                              }
                            }}
                          />
                        </div>
                        {newProject.imageUrl && (
                          <div className={styles.imagePreviewContainer}>
                            <img src={newProject.imageUrl} className={styles.imagePreview} alt="Preview" />
                            <button 
                              type="button" 
                              className={styles.removeImageBtn}
                              onClick={() => setNewProject({...newProject, imageUrl: ''})}
                              title="Remove image"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      <button type="submit" className={styles.submitBtn}>
                        {isEditing ? 'Update project' : 'Save project'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* WORKS TAB */}
          {activeTab === 'works' && (
            <section className={styles.section}>
              <div className={styles.tableActions}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Work list</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button 
                    className={styles.submitBtn} 
                    style={{ margin: 0 }} 
                    onClick={saveOrder}
                    disabled={isSavingOrder}
                  >
                    {isSavingOrder ? 'Saving...' : 'Save Order'}
                  </button>
                  <button className={styles.addNewBtn} onClick={() => { setIsEditing(false); setNewProject({ id: '', title: '', category: '', description: '', imageUrl: '', behanceUrl: '', type: 'work' }); setIsModalOpen(true); }}>
                    <Plus size={18} /> Add New Work
                  </button>
                </div>
              </div>

              <div className={styles.projectListHeader} style={{ display: 'flex', padding: '1rem', borderBottom: '2px solid #eee', fontWeight: 'bold' }}>
                <div style={{ width: '40px' }}></div>
                <div style={{ flex: 1 }}>Work Item</div>
                <div style={{ flex: 1 }}>Category</div>
                <div style={{ width: '150px', textAlign: 'right' }}>Actions</div>
              </div>

              <Reorder.Group 
                axis="y" 
                values={projects.filter(p => p.type === 'work')} 
                onReorder={(newOrder) => {
                  const otherProjects = projects.filter(p => p.type !== 'work');
                  setProjects([...newOrder, ...otherProjects]);
                }} 
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
              >
                {projects.filter(p => p.type === 'work').map(p => (
                  <Reorder.Item key={p.id} value={p} className={styles.projectRow} style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee', background: '#fff', cursor: 'grab' }} whileDrag={{ scale: 1.02, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                    <div style={{ width: '40px', color: '#999', cursor: 'grab', display: 'flex', alignItems: 'center' }}>
                      <GripVertical size={20} />
                    </div>
                    <div className={styles.projectTitle} style={{ flex: 1 }}>{p.title}</div>
                    <div className={styles.projectCategory} style={{ flex: 1 }}>{p.category}</div>
                    <div style={{ width: '150px', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => editProject(p)} className={styles.deleteBtn} style={{ color: '#000' }}>
                        Edit
                      </button>
                      <button onClick={() => deleteProject(p.id)} className={styles.deleteBtn}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </section>
          )}

          {/* LOGOS TAB */}
          {activeTab === 'logos' && (
            <>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Add partner logo</h2>
                <form onSubmit={saveLogo} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Partner name</label>
                    <input 
                      placeholder="Company Name" 
                      value={newLogo.name} 
                      onChange={e => setNewLogo({...newLogo, name: e.target.value})} 
                    />
                  </div>
                  <div className={styles.uploadGroup}>
                    <label>Logo File</label>
                    <div 
                      className={styles.uploadArea}
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <Upload size={24} />
                      <span>{newLogo.imageUrl ? 'Logo ready' : 'Click to upload logo'}</span>
                      <input 
                        id="logo-upload"
                        type="file" 
                        hidden 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) setNewLogo({...newLogo, imageUrl: url});
                          }
                        }}
                      />
                    </div>
                    {newLogo.imageUrl && <img src={newLogo.imageUrl} style={{ height: '60px', objectFit: 'contain' }} alt="Preview" />}
                  </div>
                  <button type="submit" className={styles.submitBtn}>Add logo</button>
                </form>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Partner logos</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  {logos.map(l => (
                    <div key={l.id} style={{ background: '#fff', padding: '1rem', border: '1px solid #eee', position: 'relative' }}>
                      <img src={l.imageUrl} style={{ width: '100%', height: '60px', objectFit: 'contain' }} alt={l.name} />
                      <button 
                        onClick={() => deleteLogo(l.id!)} 
                        className={styles.deleteBtn}
                        style={{ position: 'absolute', top: '5px', right: '5px' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* INFO TAB */}
          {activeTab === 'info' && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Site settings & info</h2>
              <div className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Public Email</label>
                  <input 
                    placeholder="email@example.com" 
                    value={settings.email}
                    onChange={e => setSettings({...settings, email: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input 
                    placeholder="+977..." 
                    value={settings.phone}
                    onChange={e => setSettings({...settings, phone: e.target.value})}
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label>Site Tagline (Hero Section)</label>
                  <textarea 
                    className={styles.textarea}
                    value={settings.site_tagline}
                    onChange={e => setSettings({...settings, site_tagline: e.target.value})}
                    placeholder="e.g. Crafting digital experiences at the intersection of design and technology."
                    style={{ minHeight: '80px' }}
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label>Design Section Description</label>
                  <textarea 
                    className={styles.textarea}
                    value={settings.design_description}
                    onChange={e => setSettings({...settings, design_description: e.target.value})}
                    placeholder="Short description for the design portfolio..."
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label>Technology Section Description</label>
                  <textarea 
                    className={styles.textarea}
                    value={settings.tech_description}
                    onChange={e => setSettings({...settings, tech_description: e.target.value})}
                    placeholder="Short description for the technology projects..."
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label>About (Small Text Below Info Title)</label>
                  <textarea 
                    className={styles.textarea}
                    value={settings.info_about}
                    onChange={e => setSettings({...settings, info_about: e.target.value})}
                    placeholder="Short introduction..."
                    style={{ minHeight: '80px' }}
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label>Info Bio (Hero Section)</label>
                  <textarea 
                    className={styles.textarea}
                    value={settings.info_bio}
                    onChange={e => setSettings({...settings, info_bio: e.target.value})}
                  />
                </div>
                
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label>Detailed About Me (Info Page Body)</label>
                  <textarea 
                    className={styles.textarea}
                    value={settings.info_about_me}
                    onChange={e => setSettings({...settings, info_about_me: e.target.value})}
                    placeholder="Write a longer bio about your journey, skills, and vision..."
                  />
                </div>
                
                <div className={styles.fullWidth}>
                  <label style={{ fontSize: '0.8rem', color: '#999', marginBottom: '1rem', display: 'block' }}>Experience List</label>
                  {experience.map((exp, idx) => (
                    <div key={idx} className={styles.experienceRow}>
                      <input 
                        placeholder="Label (e.g. 2020-2022)" 
                        value={exp.label}
                        onChange={e => {
                          const n = [...experience];
                          n[idx].label = e.target.value;
                          setExperience(n);
                        }}
                      />
                      <input 
                        placeholder="Title (e.g. Designer at X)" 
                        value={exp.title}
                        onChange={e => {
                          const n = [...experience];
                          n[idx].title = e.target.value;
                          setExperience(n);
                        }}
                      />
                      <button onClick={() => setExperience(experience.filter((_, i) => i !== idx))} className={styles.deleteBtn}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button className={styles.addBtn} onClick={() => setExperience([...experience, {label: '', title: ''}])}>
                    + Add Experience Row
                  </button>
                </div>

                <div className={styles.uploadGroup} style={{ marginTop: '2rem' }}>
                  <label>Background Designs (Intro Section)</label>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>Manage the 3 floating background images in the intro section.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[0, 1, 2].map(idx => (
                      <div key={idx} className={styles.uploadArea} style={{ minHeight: '120px', padding: '1rem' }} onClick={() => document.getElementById(`intro-upload-${idx}`)?.click()}>
                        {introGallery[idx] ? (
                          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <img src={introGallery[idx]} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }} alt={`Design ${idx + 1}`} />
                            <span style={{ fontSize: '0.7rem', display: 'block', marginTop: '0.5rem' }}>Design {idx + 1}</span>
                          </div>
                        ) : (
                          <>
                            <Upload size={20} />
                            <span style={{ fontSize: '0.7rem' }}>Design {idx + 1}</span>
                          </>
                        )}
                        <input id={`intro-upload-${idx}`} type="file" hidden onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              const newGallery = [...introGallery];
                              while (newGallery.length <= idx) newGallery.push('');
                              newGallery[idx] = url;
                              setIntroGallery(newGallery);
                            }
                          }
                        }} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.uploadGroup} style={{ marginTop: '2rem' }}>
                  <label>Profile Image (Portrait)</label>
                  <div 
                    className={styles.uploadArea}
                    onClick={() => document.getElementById('portrait-upload')?.click()}
                  >
                    <Upload size={24} />
                    <span>{settings.info_portrait ? 'Portrait ready' : 'Click to upload portrait'}</span>
                    <input 
                      id="portrait-upload"
                      type="file" 
                      hidden 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) setSettings({...settings, info_portrait: url});
                        }
                      }}
                    />
                  </div>
                  {settings.info_portrait && <img src={settings.info_portrait} style={{ height: '100px', width: '80px', objectFit: 'cover' }} alt="Portrait Preview" />}
                </div>

                <button onClick={saveSettings} className={styles.submitBtn}>Update site info</button>
              </div>
            </section>
          )}

        </div>
      </main>

      {notification && <div className={styles.notification}>{notification}</div>}
    </div>
  );
}
