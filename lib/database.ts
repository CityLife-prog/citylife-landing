import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'citylife.db');
let database: Database.Database;

export function getDatabase() {
  if (!database) {
    database = new Database(dbPath);
    database.pragma('journal_mode = WAL');
    initializeDatabase();
  }
  return database;
}

function initializeDatabase() {
  const db = getDatabase();
  // Create projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      client TEXT NOT NULL,
      client_id TEXT,
      status TEXT NOT NULL DEFAULT 'planning',
      budget INTEGER NOT NULL,
      timeline TEXT NOT NULL,
      progress INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Add client_id column if it doesn't exist (for existing databases)
  try {
    db.exec('ALTER TABLE projects ADD COLUMN client_id TEXT');
  } catch (error) {
    // Column already exists, ignore error
  }
  
  // Update existing projects with client_id if they don't have it
  const projectsWithoutClientId = db.prepare('SELECT id, client FROM projects WHERE client_id IS NULL').all();
  if (projectsWithoutClientId.length > 0) {
    const updateProject = db.prepare('UPDATE projects SET client_id = ? WHERE id = ?');
    for (const project of projectsWithoutClientId as any[]) {
      let clientId = 'admin-1'; // Default to admin
      if (project.client === 'Demo Client') {
        clientId = 'client-1';
      } else if (project.client === 'VSR Snow Removal') {
        clientId = 'client-vsr';
      }
      updateProject.run(clientId, project.id);
    }
  }

  // Create clients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      company TEXT NOT NULL,
      projects INTEGER DEFAULT 0,
      total_spent INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create messages table (update existing structure)
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      sender_email TEXT NOT NULL,
      recipient_id TEXT NOT NULL,
      recipient_name TEXT NOT NULL,
      recipient_email TEXT NOT NULL,
      project_id TEXT NOT NULL,
      project_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create files table
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      url TEXT NOT NULL,
      size INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
    )
  `);

  // Insert sample data if tables are empty
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  
  if (projectCount.count === 0) {
    // Insert sample projects
    const insertProjectWithClient = db.prepare(`
      INSERT INTO projects (name, client, client_id, status, budget, timeline, progress)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertProjectWithClient.run('VSR Snow Removal Website', 'VSR Snow Removal', 'client-vsr', 'completed', 2000, '4 weeks', 100);
    insertProjectWithClient.run('CityLyfe LLC Website', 'CityLyfe LLC', 'admin-1', 'completed', 2500, '2 weeks', 100);
    insertProjectWithClient.run('E-commerce Platform', 'Demo Client', 'client-1', 'in-progress', 3000, '6 weeks', 65);

    // Insert sample clients
    const insertClient = db.prepare(`
      INSERT INTO clients (name, email, company, projects, total_spent)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertClient.run('VSR Team', 'contact@vsrsnow.com', 'VSR Snow Removal', 1, 2000);
    insertClient.run('Demo Client', 'client@demo.com', 'Demo Company', 1, 3000);

    // Insert sample messages
    const insertMessage = db.prepare(`
      INSERT INTO messages (sender_id, sender_name, sender_email, recipient_id, recipient_name, recipient_email, project_id, project_name, subject, message, read)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMessage.run(
      'admin-1', 'Matthew Kenner', 'citylife32@outlook.com',
      'client-1', 'Demo Client', 'client@demo.com',
      '3', 'E-commerce Platform', 'Project Update',
      "Hi! Just wanted to update you on the progress. We've completed the payment integration and are now working on the admin dashboard. Everything is on track for the February deadline.",
      false
    );

    insertMessage.run(
      'client-1', 'Demo Client', 'client@demo.com',
      'admin-1', 'Matthew Kenner', 'citylife32@outlook.com',
      '3', 'E-commerce Platform', 'Re: Project Update',
      "Thanks for the update! That sounds great. When can we schedule a demo of the current progress? Also, I have some feedback on the product page layout.",
      true
    );

    // Insert sample files (use project IDs that actually exist)
    const insertFile = db.prepare(`
      INSERT INTO files (project_id, name, type, url, size)
      VALUES (?, ?, ?, ?, ?)
    `);

    // Add sample files to the E-commerce Platform project (client-1)
    insertFile.run(6, 'Project Proposal.pdf', 'pdf', '/uploads/sample_proposal.pdf', 245760);
    insertFile.run(6, 'Design Mockups.fig', 'image', '/uploads/sample_mockups.fig', 512000);
    insertFile.run(6, 'Technical Specification.docx', 'document', '/uploads/sample_tech_spec.docx', 89600);
    
    // Add sample files to an admin project
    insertFile.run(2, 'Website Screenshots.zip', 'archive', '/uploads/sample_screenshots.zip', 1024000);
    insertFile.run(2, 'Site Map.pdf', 'pdf', '/uploads/sample_sitemap.pdf', 156800);
  }
}

// Export database operations
export const db = {
  // Projects
  getProjects: () => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  },

  getProject: (id: number) => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  },

  createProject: (project: any) => {
    const db = getDatabase();
    return db.prepare(`
      INSERT INTO projects (name, client, client_id, status, budget, timeline, progress)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(project.name, project.client, project.clientId, project.status, project.budget, project.timeline, project.progress);
  },

  updateProject: (id: number, updates: any) => {
    const db = getDatabase();
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    return db.prepare(`UPDATE projects SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
  },

  deleteProject: (id: number) => {
    const db = getDatabase();
    return db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  },

  // Clients
  getClients: () => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all();
  },

  getClient: (id: number) => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
  },

  createClient: (client: any) => {
    const db = getDatabase();
    return db.prepare(`
      INSERT INTO clients (name, email, company, projects, total_spent)
      VALUES (?, ?, ?, ?, ?)
    `).run(client.name, client.email, client.company, client.projects || 0, client.totalSpent || 0);
  },

  updateClient: (id: number, updates: any) => {
    const db = getDatabase();
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    return db.prepare(`UPDATE clients SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
  },

  deleteClient: (id: number) => {
    const db = getDatabase();
    return db.prepare('DELETE FROM clients WHERE id = ?').run(id);
  },

  // Messages
  getMessages: (userId?: string, projectId?: string) => {
    const db = getDatabase();
    let query = 'SELECT * FROM messages';
    const params: any[] = [];

    if (userId) {
      query += ' WHERE (sender_id = ? OR recipient_id = ?)';
      params.push(userId, userId);
    }

    if (projectId) {
      query += userId ? ' AND project_id = ?' : ' WHERE project_id = ?';
      params.push(projectId);
    }

    query += ' ORDER BY created_at ASC';
    return db.prepare(query).all(...params);
  },

  createMessage: (message: any) => {
    const db = getDatabase();
    return db.prepare(`
      INSERT INTO messages (sender_id, sender_name, sender_email, recipient_id, recipient_name, recipient_email, project_id, project_name, subject, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      message.senderId, message.senderName, message.senderEmail,
      message.recipientId, message.recipientName, message.recipientEmail,
      message.projectId, message.projectName, message.subject, message.message
    );
  },

  markMessageRead: (messageId: number, userId: string) => {
    const db = getDatabase();
    return db.prepare('UPDATE messages SET read = TRUE WHERE id = ? AND recipient_id = ?').run(messageId, userId);
  },

  // Files
  getProjectFiles: (projectId: number) => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM files WHERE project_id = ? ORDER BY created_at DESC').all(projectId);
  },

  createFile: (file: any) => {
    const db = getDatabase();
    return db.prepare(`
      INSERT INTO files (project_id, name, type, url, size)
      VALUES (?, ?, ?, ?, ?)
    `).run(file.projectId, file.name, file.type, file.url, file.size);
  },

  deleteFile: (id: number) => {
    const db = getDatabase();
    return db.prepare('DELETE FROM files WHERE id = ?').run(id);
  }
};