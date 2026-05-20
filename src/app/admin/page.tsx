'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';

type Tab = 'overview' | 'pages' | 'content' | 'initiatives' | 'gallery' | 'events' | 'awards' | 'associations' | 'faqs' | 'inbox';

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [tablesExist, setTablesExist] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Database Data States
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [associations, setAssociations] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any[]>([]);
  const [contentSaving, setContentSaving] = useState<string | null>(null);
  const [contentSaved, setContentSaved] = useState<string | null>(null);

  // Form / Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [formLoading, setFormLoading] = useState(false);

  // Check Authentication & Load Data
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
      } else {
        setUser(user);
        await loadAllData();
      }
    };
    checkAuth();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Check if table initiatives exists
      const { error: checkError } = await supabase.from('initiatives').select('id').limit(1);
      if (checkError && checkError.message.includes('does not exist')) {
        setTablesExist(false);
        setLoading(false);
        return;
      }

      setTablesExist(true);

      // Parallel data fetching
      const [
        { data: initData },
        { data: galData },
        { data: evtData },
        { data: awdData },
        { data: ascData },
        { data: faqData },
        { data: msgData },
      ] = await Promise.all([
        supabase.from('initiatives').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*').order('event_date', { ascending: false }),
        supabase.from('awards').select('*').order('year', { ascending: false }),
        supabase.from('associations').select('*').order('order_index', { ascending: true }),
        supabase.from('faqs').select('*').order('order_index', { ascending: true }),
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
      ]);

      // Load site content separately (table may not exist yet)
      const { data: scData } = await supabase.from('site_content').select('*').order('page');

      setInitiatives(initData || []);
      setGalleryItems(galData || []);
      setEvents(evtData || []);
      setAwards(awdData || []);
      setAssociations(ascData || []);
      setFaqs(faqData || []);
      setMessages(msgData || []);
      setSiteContent(scData || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while loading data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  // Open creation modal
  const openCreateModal = () => {
    setModalType('create');
    setEditingItem(null);
    
    // Initialize default fields based on active tab
    const initialData: any = {};
    if (activeTab === 'initiatives') {
      initialData.title = '';
      initialData.category = 'Education';
      initialData.description = '';
      initialData.image_url = '';
    } else if (activeTab === 'gallery') {
      initialData.title = '';
      initialData.caption = '';
      initialData.image_url = '';
      initialData.category = 'events';
    } else if (activeTab === 'events') {
      initialData.title = '';
      initialData.category = 'Event';
      initialData.description = '';
      initialData.event_date = new Date().toISOString().split('T')[0];
      initialData.image_url = '';
      initialData.external_link = '';
    } else if (activeTab === 'awards') {
      initialData.year = new Date().getFullYear();
      initialData.title = '';
      initialData.description = '';
      initialData.image_url = '';
    } else if (activeTab === 'associations') {
      initialData.name = '';
      initialData.role = '';
      initialData.description = '';
      initialData.logo_url = '';
      initialData.order_index = 0;
    } else if (activeTab === 'faqs') {
      initialData.question = '';
      initialData.answer = '';
      initialData.order_index = 0;
    }

    setFormData(initialData);
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (item: any) => {
    setModalType('edit');
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Handle Form Submit (Insert / Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMsg(null);

    const tableName = activeTab;

    try {
      if (modalType === 'create') {
        const { error } = await supabase.from(tableName).insert(formData);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(tableName).update(formData).eq('id', editingItem.id);
        if (error) throw error;
      }

      setIsModalOpen(false);
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save item.');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Item
  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setErrorMsg(null);

    try {
      const { error } = await supabase.from(activeTab).delete().eq('id', id);
      if (error) throw error;
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete item.');
    }
  };

  // Mark message as read / unread
  const toggleMessageRead = async (msg: any) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: !msg.is_read })
        .eq('id', msg.id);
      if (error) throw error;
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update message status.');
    }
  };

  // Render Forms based on activeTab
  const renderFormFields = () => {
    if (activeTab === 'initiatives') {
      return (
        <>
          <label>Initiative Title</label>
          <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required />

          <label>Category</label>
          <select name="category" value={formData.category || 'Education'} onChange={handleInputChange}>
            <option value="Education">Education</option>
            <option value="Social Service">Social Service</option>
            <option value="Media & Culture">Media & Culture</option>
            <option value="Interfaith">Interfaith</option>
          </select>

          <label>Short Description</label>
          <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} required />

          <ImageUploader
            label="Image"
            value={formData.image_url || ''}
            onChange={(url) => setFormData((prev: any) => ({ ...prev, image_url: url }))}
          />
        </>
      );
    }

    if (activeTab === 'gallery') {
      return (
        <>
          <label>Title / Alt text</label>
          <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required />

          <label>Caption</label>
          <input type="text" name="caption" value={formData.caption || ''} onChange={handleInputChange} />

          <ImageUploader
            label="Image"
            value={formData.image_url || ''}
            onChange={(url) => setFormData((prev: any) => ({ ...prev, image_url: url }))}
          />

          <label>Category Tag</label>
          <select name="category" value={formData.category || 'events'} onChange={handleInputChange}>
            <option value="events">Events</option>
            <option value="awards">Awards</option>
            <option value="international">International</option>
            <option value="community">Community/Research</option>
          </select>
        </>
      );
    }

    if (activeTab === 'events') {
      return (
        <>
          <label>Event Title</label>
          <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required />

          <label>Category</label>
          <input type="text" name="category" value={formData.category || 'Event'} onChange={handleInputChange} placeholder="e.g. Summit, Celebration" />

          <label>Event Date</label>
          <input type="date" name="event_date" value={formData.event_date || ''} onChange={handleInputChange} required />

          <label>Description</label>
          <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} required />

          <ImageUploader
            label="Image"
            value={formData.image_url || ''}
            onChange={(url) => setFormData((prev: any) => ({ ...prev, image_url: url }))}
          />

          <label>External Link</label>
          <input type="text" name="external_link" value={formData.external_link || ''} onChange={handleInputChange} placeholder="https://..." />
        </>
      );
    }

    if (activeTab === 'awards') {
      return (
        <>
          <label>Year</label>
          <input type="number" name="year" value={formData.year || ''} onChange={handleInputChange} required />

          <label>Award Title</label>
          <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required />

          <label>Description</label>
          <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} required />

          <ImageUploader
            label="Image"
            value={formData.image_url || ''}
            onChange={(url) => setFormData((prev: any) => ({ ...prev, image_url: url }))}
          />
        </>
      );
    }

    if (activeTab === 'associations') {
      return (
        <>
          <label>Organization Name</label>
          <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} required />

          <label>Role / Position</label>
          <input type="text" name="role" value={formData.role || ''} onChange={handleInputChange} required />

          <label>Description</label>
          <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} />

          <ImageUploader
            label="Logo"
            value={formData.logo_url || ''}
            onChange={(url) => setFormData((prev: any) => ({ ...prev, logo_url: url }))}
          />

          <label>Order Index</label>
          <input type="number" name="order_index" value={formData.order_index || 0} onChange={handleInputChange} />
        </>
      );
    }

    if (activeTab === 'faqs') {
      return (
        <>
          <label>Question</label>
          <textarea name="question" value={formData.question || ''} onChange={handleInputChange} rows={2} required />

          <label>Answer</label>
          <textarea name="answer" value={formData.answer || ''} onChange={handleInputChange} rows={4} required />

          <label>Order Index</label>
          <input type="number" name="order_index" value={formData.order_index || 0} onChange={handleInputChange} />
        </>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading Dashboard Panel...</p>
        <style dangerouslySetInnerHTML={{ __html: `
          .admin-loading { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0d1527; color: var(--white); }
          .spinner { width: 40px; height: 40px; border: 3px solid rgba(212,175,55,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-dashboard {
          min-height: 90vh;
          background: #f8f9fa;
          display: flex;
          font-family: 'Inter', sans-serif;
          color: var(--navy);
        }
        .admin-sidebar {
          width: 260px;
          background: #0d1527;
          color: var(--white);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(212, 175, 55, 0.1);
        }
        .admin-sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .admin-sidebar-header img {
          max-height: 18px;
          filter: brightness(0) invert(1);
        }
        .admin-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .admin-nav-item {
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.2s ease;
          color: rgba(255, 255, 255, 0.7);
        }
        .admin-nav-item:hover, .admin-nav-item.active {
          background: rgba(212, 175, 55, 0.15);
          color: var(--gold);
        }
        .admin-sidebar-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .signout-btn {
          width: 100%;
          padding: 10px;
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #ef4444;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }
        .signout-btn:hover {
          background: #ef4444;
          color: var(--white);
        }
        .admin-content-area {
          flex: 1;
          padding: 2.5rem;
          overflow-y: auto;
        }
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .admin-page-header h1 {
          font-family: var(--font-playfair);
          font-size: 2rem;
          color: var(--navy);
          margin: 0;
        }
        .btn-create {
          padding: 10px 20px;
          background: var(--gold);
          border: none;
          color: var(--navy);
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.88rem;
          transition: all 0.2s ease;
        }
        .btn-create:hover {
          background: #b8860b;
        }
        .warning-banner {
          background: #fff3cd;
          border: 1px solid #ffeeba;
          color: #856404;
          padding: 1.25rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .warning-banner h3 {
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .stat-card {
          background: var(--white);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid var(--border);
        }
        .stat-card h3 {
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--text-muted);
          margin: 0 0 0.5rem 0;
          letter-spacing: 0.05em;
        }
        .stat-card p {
          font-size: 2rem;
          font-weight: 700;
          color: var(--navy);
          margin: 0;
        }
        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--white);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid var(--border);
        }
        .dashboard-table th, .dashboard-table td {
          padding: 14px 20px;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }
        .dashboard-table th {
          background: #f1f3f5;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .dashboard-table td {
          font-size: 0.9rem;
        }
        .btn-action {
          padding: 5px 10px;
          font-size: 0.8rem;
          border: 1px solid var(--border);
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 0.5rem;
          transition: all 0.2s ease;
        }
        .btn-action.edit:hover {
          background: var(--gold);
          color: var(--navy);
          border-color: var(--gold);
        }
        .btn-action.delete:hover {
          background: #ef4444;
          color: var(--white);
          border-color: #ef4444;
        }
        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(13, 21, 39, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }
        .modal-container {
          background: var(--white);
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h2 {
          font-family: var(--font-playfair);
          font-size: 1.5rem;
          margin: 0;
          color: var(--navy);
        }
        .modal-close {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-muted);
        }
        .modal-body {
          padding: 2rem;
          max-height: 70vh;
          overflow-y: auto;
        }
        .modal-body label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: var(--navy);
        }
        .modal-body input, .modal-body textarea, .modal-body select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: 6px;
          margin-bottom: 1.25rem;
          font-size: 0.95rem;
          font-family: inherit;
        }
        .modal-footer {
          padding: 1.25rem 2rem;
          border-top: 1px solid var(--border);
          background: #f8f9fa;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
        .btn-cancel {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-save {
          padding: 10px 20px;
          background: var(--navy);
          color: var(--white);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-save:hover {
          background: #1a2744;
        }
      `}} />

      <div className="admin-dashboard">
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <img src="/assets/images/logo.webp" alt="Fr. Roby CMI Logo" />
          </div>
          <ul className="admin-nav-list">
            <li
              className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'inbox' ? 'active' : ''}`}
              onClick={() => setActiveTab('inbox')}
            >
              ✉️ Inbox Messages
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'pages' ? 'active' : ''}`}
              onClick={() => setActiveTab('pages')}
            >
              🗂️ Pages
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              ✏️ Site Content
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'initiatives' ? 'active' : ''}`}
              onClick={() => setActiveTab('initiatives')}
            >
              💡 Initiatives
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              🖼️ Gallery Items
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              📅 Events &amp; News
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'awards' ? 'active' : ''}`}
              onClick={() => setActiveTab('awards')}
            >
              🏆 Awards
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'associations' ? 'active' : ''}`}
              onClick={() => setActiveTab('associations')}
            >
              🏛️ Associations
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'faqs' ? 'active' : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              ❓ FAQs
            </li>
          </ul>

          <div className="admin-sidebar-footer">
            <button className="signout-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="admin-content-area">
          {errorMsg && (
            <div style={{ background: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem' }}>
              {errorMsg}
            </div>
          )}

          {!tablesExist && (
            <div className="warning-banner">
              <h3>⚠️ Database Tables Not Configured</h3>
              <p>
                The required database tables (initiatives, gallery, events, awards, associations, faqs, messages) are not found in the public schema of your Supabase project.
              </p>
              <p>
                Please copy the contents of the <code>supabase/schema.sql</code> file, navigate to the <strong>SQL Editor</strong> in the Supabase Dashboard, and execute it to set up the tables and secure RLS policies.
              </p>
            </div>
          )}

          {/* TAB: PAGES */}
          {activeTab === 'pages' && (
            <div>
              <div className="admin-page-header">
                <h1>Website Pages</h1>
              </div>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Page Name</th>
                    <th>URL</th>
                    <th>Content Managed By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    { name: 'Home',                    url: '/',             manager: 'Site Content + Awards + Events', editTab: 'content' as Tab },
                    { name: 'About',                   url: '/about',        manager: 'Site Content',         editTab: 'content' as Tab },
                    { name: 'Initiatives & Contributions', url: '/initiatives', manager: 'Site Content + Initiatives (DB)', editTab: 'content' as Tab },
                    { name: 'Gallery',                 url: '/gallery',      manager: 'Site Content + Gallery Items (DB)',   editTab: 'content' as Tab },
                    { name: 'Associations',            url: '/associations', manager: 'Site Content + Associations (DB)',         editTab: 'content' as Tab },
                    { name: 'Contact',                 url: '/contact',      manager: 'Site Content + Inbox', editTab: 'content' as Tab },
                    { name: 'Privacy Policy',          url: '/privacy',      manager: 'Static (code only)',   editTab: null },
                    { name: 'Terms of Use',            url: '/terms',        manager: 'Static (code only)',   editTab: null },
                  ] as { name: string; url: string; manager: string; editTab: Tab | null }[]).map((page) => (
                    <tr key={page.url}>
                      <td style={{ fontWeight: 600 }}>{page.name}</td>
                      <td>
                        <code style={{ background: '#f1f3f5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                          {page.url}
                        </code>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{page.manager}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {/* View Live */}
                        <a
                          href={page.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-action edit"
                          style={{ textDecoration: 'none', display: 'inline-block' }}
                        >
                          View Page
                        </a>

                        {/* Edit Page — jumps to CMS tab if DB-driven, shows tooltip if static */}
                        {page.editTab ? (
                          <button
                            className="btn-action edit"
                            onClick={() => setActiveTab(page.editTab as Tab)}
                            title={`Go to ${page.manager}`}
                          >
                            ✏️ Edit Page
                          </button>
                        ) : (
                          <span
                            className="btn-action"
                            title="This page has static content. Edit the .tsx source file to change it."
                            style={{ opacity: 0.45, cursor: 'not-allowed' }}
                          >
                            ✏️ Edit Page
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ background: 'var(--white)', borderRadius: '12px', padding: '1.5rem 2rem', marginTop: '2rem', border: '1px solid var(--border)' }}>
                <h3 style={{ marginBottom: '0.75rem', color: 'var(--navy)' }}>💡 How page content works</h3>
                <ul style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '2', paddingLeft: '1.25rem' }}>
                  <li><strong>Home</strong> — Awards &amp; News sections pull from the database. Add items via the Awards or Events tabs.</li>
                  <li><strong>Gallery</strong> — All photos come from the Gallery Items tab in this panel.</li>
                  <li><strong>Initiatives</strong> — The page content is managed in Site Content, and the initiatives grid pulls from the Initiatives tab.</li>
                  <li><strong>Contact</strong> — Content managed in Site Content. Form submissions appear in the Inbox Messages tab.</li>
                  <li><strong>Associations</strong> — Page content managed in Site Content, items from Associations tab.</li>
                  <li><strong>Footer</strong> — Footer text is managed in the Site Content tab.</li>
                  <li><strong>Privacy, Terms</strong> — Content is static (Edit Page button is disabled).</li>
                </ul>
              </div>
            </div>
          )}


          {/* TAB: SITE CONTENT */}
          {activeTab === 'content' && (() => {
            const grouped = siteContent.reduce((acc: any, item: any) => {
              const page = item.page || 'Other';
              if (!acc[page]) acc[page] = [];
              acc[page].push(item);
              return acc;
            }, {} as Record<string, any[]>);

            const pageOrder = ['home', 'about', 'initiatives', 'gallery', 'associations', 'contact', 'footer'];
            const sortedPages = Object.keys(grouped).sort((a, b) => {
              const ia = pageOrder.indexOf(a);
              const ib = pageOrder.indexOf(b);
              return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
            });

            const handleContentSave = async (item: any, newValue: string) => {
              setContentSaving(item.content_key);
              setContentSaved(null);
              setErrorMsg(null);
              try {
                const { error } = await supabase
                  .from('site_content')
                  .update({ content_value: newValue, updated_at: new Date().toISOString() })
                  .eq('id', item.id);
                if (error) throw error;
                setSiteContent(prev =>
                  prev.map(sc => sc.id === item.id ? { ...sc, content_value: newValue } : sc)
                );
                setContentSaved(item.content_key);
                setTimeout(() => setContentSaved(null), 3000);
              } catch (err: any) {
                setErrorMsg(err.message || 'Failed to save.');
              } finally {
                setContentSaving(null);
              }
            };

            return (
              <div>
                <div className="admin-page-header">
                  <h1>Site Content</h1>
                </div>

                {siteContent.length === 0 ? (
                  <div className="warning-banner">
                    <h3>⚠️ Site Content Table Empty</h3>
                    <p>
                      Run the site_content seed SQL in your Supabase SQL Editor to pre-load all website content.
                      Once seeded, all text and images will appear here for inline editing.
                    </p>
                  </div>
                ) : (
                  sortedPages.map(pageName => (
                    <div key={pageName} style={{ marginBottom: '2.5rem' }}>
                      <h2 style={{
                        fontSize: '1.2rem',
                        textTransform: 'capitalize',
                        color: 'var(--navy)',
                        marginBottom: '1rem',
                        paddingBottom: '0.5rem',
                        borderBottom: '2px solid var(--gold)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}>
                        📄 {pageName} Page
                      </h2>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {grouped[pageName].map((item: any) => (
                          <div
                            key={item.id}
                            style={{
                              background: 'var(--white)',
                              border: '1px solid var(--border)',
                              borderRadius: '10px',
                              padding: '1.25rem',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                              <div>
                                <strong style={{ fontSize: '0.9rem', color: 'var(--navy)' }}>
                                  {item.label || item.content_key}
                                </strong>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                                  {item.section && `${item.section} · `}{item.content_type}
                                </span>
                              </div>
                              <span style={{ 
                                fontSize: '0.8rem', 
                                color: contentSaved === item.content_key ? '#10b981' : 'var(--text-muted)',
                                fontWeight: contentSaved === item.content_key ? '600' : 'normal'
                              }}>
                                {contentSaving === item.content_key ? '💾 Saving...' : contentSaved === item.content_key ? '✅ Saved!' : ''}
                              </span>
                            </div>

                            {item.content_type === 'image' ? (
                              <ImageUploader
                                label=""
                                value={item.content_value}
                                onChange={(url) => handleContentSave(item, url)}
                              />
                            ) : (
                              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <textarea
                                  defaultValue={item.content_value}
                                  rows={item.content_value.length > 150 ? 4 : 2}
                                  style={{
                                    flex: 1,
                                    padding: '10px 12px',
                                    border: '1px solid var(--border)',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value !== item.content_value) {
                                      handleContentSave(item, e.target.value);
                                    }
                                  }}
                                />
                                <button
                                  className="btn-action edit"
                                  onClick={(e) => {
                                    const textarea = (e.target as HTMLElement).parentElement?.querySelector('textarea');
                                    if (textarea && textarea.value !== item.content_value) {
                                      handleContentSave(item, textarea.value);
                                    }
                                  }}
                                  style={{ flexShrink: 0, padding: '8px 14px' }}
                                >
                                  {contentSaving === item.content_key ? 'Saving' : contentSaved === item.content_key ? 'Saved' : 'Save'}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })()}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div className="admin-page-header">
                <h1>Dashboard Overview</h1>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Inbox Messages</h3>
                  <p>{messages.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Initiatives</h3>
                  <p>{initiatives.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Gallery Photos</h3>
                  <p>{galleryItems.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Events &amp; News</h3>
                  <p>{events.length}</p>
                </div>
              </div>

              <div className="contact-card" style={{ background: 'var(--white)', padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--navy)' }}>Quick CMS Links</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Use the sidebar menu to navigate through various categories. Add, modify or delete content in real time to update the main website dynamically.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn-create" onClick={() => { setActiveTab('inbox') }}>View Messages</button>
                  <Link href="/" target="_blank" className="btn-cancel" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    View Live Site →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INBOX */}
          {activeTab === 'inbox' && (
            <div>
              <div className="admin-page-header">
                <h1>Inbox Messages</h1>
              </div>

              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Sender Name</th>
                    <th>Email Address</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No messages found in database.
                      </td>
                    </tr>
                  ) : (
                    messages.map((msg) => (
                      <tr key={msg.id} style={{ fontWeight: msg.is_read ? 'normal' : '600' }}>
                        <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                        <td>{msg.name}</td>
                        <td>{msg.email}</td>
                        <td>{msg.subject}</td>
                        <td>
                          <span style={{ color: msg.is_read ? 'var(--text-muted)' : 'var(--gold)' }}>
                            {msg.is_read ? 'Read' : 'New'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-action edit"
                            onClick={() => toggleMessageRead(msg)}
                          >
                            {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => handleDeleteItem(msg.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: INITIATIVES */}
          {activeTab === 'initiatives' && (
            <div>
              <div className="admin-page-header">
                <h1>Initiatives</h1>
                <button className="btn-create" onClick={openCreateModal} disabled={!tablesExist}>
                  + New Initiative
                </button>
              </div>

              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {initiatives.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No initiatives found.
                      </td>
                    </tr>
                  ) : (
                    initiatives.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.image_url ? (
                            <img src={item.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          ) : (
                            'No image'
                          )}
                        </td>
                        <td style={{ fontWeight: '600' }}>{item.title}</td>
                        <td>{item.category}</td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.description}
                        </td>
                        <td>
                          <button className="btn-action edit" onClick={() => openEditModal(item)}>Edit</button>
                          <button className="btn-action delete" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: GALLERY */}
          {activeTab === 'gallery' && (
            <div>
              <div className="admin-page-header">
                <h1>Gallery Items</h1>
                <button className="btn-create" onClick={openCreateModal} disabled={!tablesExist}>
                  + New Image
                </button>
              </div>

              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title/Alt</th>
                    <th>Caption</th>
                    <th>Category Tag</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {galleryItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No gallery photos found.
                      </td>
                    </tr>
                  ) : (
                    galleryItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img src={item.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        </td>
                        <td style={{ fontWeight: '600' }}>{item.title}</td>
                        <td>{item.caption}</td>
                        <td>{item.category}</td>
                        <td>
                          <button className="btn-action edit" onClick={() => openEditModal(item)}>Edit</button>
                          <button className="btn-action delete" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: EVENTS */}
          {activeTab === 'events' && (
            <div>
              <div className="admin-page-header">
                <h1>Events &amp; News</h1>
                <button className="btn-create" onClick={openCreateModal} disabled={!tablesExist}>
                  + New Event
                </button>
              </div>

              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No events found.
                      </td>
                    </tr>
                  ) : (
                    events.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.image_url ? (
                            <img src={item.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          ) : (
                            'No image'
                          )}
                        </td>
                        <td>{item.event_date}</td>
                        <td style={{ fontWeight: '600' }}>{item.title}</td>
                        <td>{item.category}</td>
                        <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.description}
                        </td>
                        <td>
                          <button className="btn-action edit" onClick={() => openEditModal(item)}>Edit</button>
                          <button className="btn-action delete" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: AWARDS */}
          {activeTab === 'awards' && (
            <div>
              <div className="admin-page-header">
                <h1>Awards &amp; Recognitions</h1>
                <button className="btn-create" onClick={openCreateModal} disabled={!tablesExist}>
                  + New Award
                </button>
              </div>

              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Year</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No awards found.
                      </td>
                    </tr>
                  ) : (
                    awards.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.image_url ? (
                            <img src={item.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          ) : (
                            'No image'
                          )}
                        </td>
                        <td>{item.year}</td>
                        <td style={{ fontWeight: '600' }}>{item.title}</td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.description}
                        </td>
                        <td>
                          <button className="btn-action edit" onClick={() => openEditModal(item)}>Edit</button>
                          <button className="btn-action delete" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 7: ASSOCIATIONS */}
          {activeTab === 'associations' && (
            <div>
              <div className="admin-page-header">
                <h1>Associations</h1>
                <button className="btn-create" onClick={openCreateModal} disabled={!tablesExist}>
                  + New Association
                </button>
              </div>

              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Organization Name</th>
                    <th>Role</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {associations.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No associations found.
                      </td>
                    </tr>
                  ) : (
                    associations.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.logo_url ? (
                            <img src={item.logo_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }} />
                          ) : (
                            'No logo'
                          )}
                        </td>
                        <td style={{ fontWeight: '600' }}>{item.name}</td>
                        <td>{item.role}</td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.description}
                        </td>
                        <td>
                          <button className="btn-action edit" onClick={() => openEditModal(item)}>Edit</button>
                          <button className="btn-action delete" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 8: FAQS */}
          {activeTab === 'faqs' && (
            <div>
              <div className="admin-page-header">
                <h1>Frequently Asked Questions</h1>
                <button className="btn-create" onClick={openCreateModal} disabled={!tablesExist}>
                  + New FAQ
                </button>
              </div>

              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No FAQs found.
                      </td>
                    </tr>
                  ) : (
                    faqs.map((item) => (
                      <tr key={item.id}>
                        <td>{item.order_index}</td>
                        <td style={{ fontWeight: '600' }}>{item.question}</td>
                        <td style={{ maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.answer}
                        </td>
                        <td>
                          <button className="btn-action edit" onClick={() => openEditModal(item)}>Edit</button>
                          <button className="btn-action delete" onClick={() => handleDeleteItem(item.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{modalType === 'create' ? 'Add New Item' : 'Edit Item'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {renderFormFields()}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
