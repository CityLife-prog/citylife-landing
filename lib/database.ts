import Database from 'better-sqlite3';
import path from 'path';

// Optional bcrypt import - gracefully handle if not installed
let bcrypt: any = null;
try {
  bcrypt = require('bcrypt');
} catch (error) {
  console.warn('⚠️  bcrypt not installed - password hashing disabled');
  console.warn('   Run "npm install" to enable secure authentication');
}

const dbPath = path.join(process.cwd(), 'data', 'citylife.db');
let database: Database.Database;

// Password hashing utilities
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  if (!bcrypt) {
    throw new Error('bcrypt not available - cannot hash password');
  }
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export function hashPasswordSync(password: string): string {
  if (!bcrypt) {
    throw new Error('bcrypt not available - cannot hash password');
  }
  return bcrypt.hashSync(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  if (!bcrypt) {
    throw new Error('bcrypt not available - cannot verify password');
  }
  return await bcrypt.compare(password, hashedPassword);
}

// Helper function to sanitize values for SQLite
function sanitizeValue(value: any): any {
  // Convert booleans to 0/1
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  // Convert undefined to null
  if (value === undefined) {
    return null;
  }
  // Return valid types as-is
  return value;
}

// Helper function to sanitize objects for SQLite
function sanitizeObject(obj: any): any {
  const sanitized: any = {};
  Object.keys(obj).forEach(key => {
    sanitized[key] = sanitizeValue(obj[key]);
  });
  return sanitized;
}

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
      company TEXT,
      phone TEXT,
      website TEXT,
      business_name TEXT,
      address TEXT,
      projects INTEGER DEFAULT 0,
      total_spent INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrate existing clients table to make company optional
  try {
    // Check if company column has NOT NULL constraint
    const tableInfo = db.prepare("PRAGMA table_info(clients)").all() as any[];
    const companyColumn = tableInfo.find(col => col.name === 'company');

    if (companyColumn && companyColumn.notnull === 1) {
      // Need to migrate - SQLite doesn't support ALTER COLUMN
      console.log('Migrating clients table to make company optional...');

      // Rename old table
      db.exec('ALTER TABLE clients RENAME TO clients_old');

      // Create new table with company as optional
      db.exec(`
        CREATE TABLE clients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          company TEXT,
          phone TEXT,
          website TEXT,
          business_name TEXT,
          address TEXT,
          projects INTEGER DEFAULT 0,
          total_spent INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Copy data from old table
      db.exec(`
        INSERT INTO clients (id, name, email, company, phone, website, business_name, address, projects, total_spent, created_at, updated_at)
        SELECT id, name, email, company, phone, website, business_name, address, projects, total_spent, created_at, updated_at
        FROM clients_old
      `);

      // Drop old table
      db.exec('DROP TABLE clients_old');

      console.log('Migration completed successfully');
    }
  } catch (error) {
    console.log('No migration needed or migration failed:', error);
  }

  // Add new columns to existing clients table if they don't exist
  const clientColumns = ['phone', 'website', 'business_name', 'address'];
  clientColumns.forEach(column => {
    try {
      db.exec(`ALTER TABLE clients ADD COLUMN ${column} TEXT`);
    } catch (error) {
      // Column already exists, ignore error
    }
  });

  // Create client_contacts table for managing multiple contacts per client
  db.exec(`
    CREATE TABLE IF NOT EXISTS client_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      role TEXT,
      is_primary BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
    )
  `);

  // Create notifications table for admin alerts
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT,
      read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

  // Create reviews table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      client_title TEXT NOT NULL,
      client_company TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      review_text TEXT NOT NULL,
      project_name TEXT,
      image_url TEXT,
      is_active BOOLEAN DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add new columns to reviews table for enhanced functionality
  const reviewColumns = [
    { name: 'project_id', type: 'INTEGER', default: null },
    { name: 'source', type: 'TEXT', default: "'direct'" },
    { name: 'source_url', type: 'TEXT', default: null },
    { name: 'verified', type: 'BOOLEAN', default: '1' },
    { name: 'featured', type: 'BOOLEAN', default: '0' }
  ];

  reviewColumns.forEach(column => {
    try {
      const defaultClause = column.default ? ` DEFAULT ${column.default}` : '';
      db.exec(`ALTER TABLE reviews ADD COLUMN ${column.name} ${column.type}${defaultClause}`);
    } catch (error) {
      // Column already exists, ignore error
    }
  });

  // Create users table for authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'client')),
      company TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create password reset tokens table
  db.exec(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Check if admin user exists
  const adminExists = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin') as { count: number };

  if (adminExists.count === 0) {
    // Create default admin user with hashed password
    // Default password: "ChangeMe123!" - User should change this via profile page
    const insertAdmin = db.prepare(`
      INSERT INTO users (id, name, email, password, role, company, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    try {
      const hashedPassword = bcrypt ? hashPasswordSync('ChangeMe123!') : 'ChangeMe123!';
      insertAdmin.run(
        'admin-1',
        'Matthew Kenner',
        'citylife32@outlook.com',
        hashedPassword,
        'admin',
        'CityLyfe LLC',
        null
      );
      console.log('✅ Admin user created successfully');
      if (!bcrypt) {
        console.warn('⚠️  Password stored without hashing - run npm install to enable bcrypt');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    }

    console.log('✅ Admin user created: citylife32@outlook.com');
    console.log('⚠️  Default password: ChangeMe123! - CHANGE THIS IMMEDIATELY');
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
    const sanitizedUpdates = sanitizeObject(updates);
    const fields = Object.keys(sanitizedUpdates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(sanitizedUpdates);
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
      INSERT INTO clients (name, email, company, phone, website, business_name, address, projects, total_spent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      client.name,
      client.email,
      client.company || null,
      client.phone || null,
      client.website || null,
      client.business_name || null,
      client.address || null,
      client.projects || 0,
      client.totalSpent || 0
    );
  },

  updateClient: (id: number, updates: any) => {
    const db = getDatabase();
    const sanitizedUpdates = sanitizeObject(updates);
    const fields = Object.keys(sanitizedUpdates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(sanitizedUpdates);
    return db.prepare(`UPDATE clients SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
  },

  deleteClient: (id: number) => {
    const db = getDatabase();
    return db.prepare('DELETE FROM clients WHERE id = ?').run(id);
  },

  // Client Contacts
  getClientContacts: (clientId: number) => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM client_contacts WHERE client_id = ? ORDER BY is_primary DESC, created_at ASC').all(clientId);
  },

  createClientContact: (contact: any) => {
    const db = getDatabase();
    return db.prepare(`
      INSERT INTO client_contacts (client_id, name, email, phone, role, is_primary)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(contact.clientId, contact.name, contact.email, contact.phone || null, contact.role || null, contact.isPrimary ? 1 : 0);
  },

  updateClientContact: (id: number, updates: any) => {
    const db = getDatabase();
    const sanitizedUpdates = sanitizeObject(updates);
    const fields = Object.keys(sanitizedUpdates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(sanitizedUpdates);
    return db.prepare(`UPDATE client_contacts SET ${fields} WHERE id = ?`).run(...values, id);
  },

  deleteClientContact: (id: number) => {
    const db = getDatabase();
    return db.prepare('DELETE FROM client_contacts WHERE id = ?').run(id);
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
  },

  // Reviews
  getReviews: (activeOnly = false) => {
    const db = getDatabase();
    const query = activeOnly
      ? 'SELECT * FROM reviews WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC'
      : 'SELECT * FROM reviews ORDER BY sort_order ASC, created_at DESC';
    return db.prepare(query).all();
  },

  getReview: (id: number) => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  },

  createReview: (review: any) => {
    const db = getDatabase();
    return db.prepare(`
      INSERT INTO reviews (client_name, client_title, client_company, rating, review_text, project_name, image_url, is_active, sort_order, project_id, source, source_url, verified, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      review.clientName || null,
      review.clientTitle || null,
      review.clientCompany || null,
      review.rating || 5,
      review.reviewText || null,
      review.projectName || null,
      review.imageUrl || '/api/placeholder/80/80',
      review.isActive !== undefined ? (review.isActive ? 1 : 0) : 1,
      review.sortOrder !== undefined ? Number(review.sortOrder) : 0,
      review.projectId || null,
      review.source || 'direct',
      review.sourceUrl || null,
      review.verified !== undefined ? (review.verified ? 1 : 0) : 1,
      review.featured !== undefined ? (review.featured ? 1 : 0) : 0
    );
  },

  updateReview: (id: number, updates: any) => {
    const db = getDatabase();
    const sanitizedUpdates = sanitizeObject(updates);
    const fields = Object.keys(sanitizedUpdates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(sanitizedUpdates);
    return db.prepare(`UPDATE reviews SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
  },

  deleteReview: (id: number) => {
    const db = getDatabase();
    return db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
  },

  getReviewsByProject: (projectId: number, activeOnly = true) => {
    const db = getDatabase();
    const query = activeOnly
      ? 'SELECT * FROM reviews WHERE project_id = ? AND is_active = 1 ORDER BY created_at DESC'
      : 'SELECT * FROM reviews WHERE project_id = ? ORDER BY created_at DESC';
    return db.prepare(query).all(projectId);
  },

  getFeaturedReviews: () => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM reviews WHERE featured = 1 AND is_active = 1 ORDER BY sort_order ASC, created_at DESC').all();
  },

  getReviewsBySource: (source: string) => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM reviews WHERE source = ? AND is_active = 1 ORDER BY created_at DESC').all(source);
  },

  // Notifications
  getNotifications: (unreadOnly = false) => {
    const db = getDatabase();
    const query = unreadOnly
      ? 'SELECT * FROM notifications WHERE read = 0 ORDER BY created_at DESC'
      : 'SELECT * FROM notifications ORDER BY created_at DESC';
    return db.prepare(query).all();
  },

  getNotification: (id: number) => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM notifications WHERE id = ?').get(id);
  },

  createNotification: (notification: any) => {
    const db = getDatabase();
    return db.prepare(`
      INSERT INTO notifications (type, title, message, link)
      VALUES (?, ?, ?, ?)
    `).run(
      notification.type,
      notification.title,
      notification.message,
      notification.link || null
    );
  },

  markNotificationRead: (id: number) => {
    const db = getDatabase();
    return db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(id);
  },

  markAllNotificationsRead: () => {
    const db = getDatabase();
    return db.prepare('UPDATE notifications SET read = 1').run();
  },

  deleteNotification: (id: number) => {
    const db = getDatabase();
    return db.prepare('DELETE FROM notifications WHERE id = ?').run(id);
  },

  // Users
  getUsers: () => {
    const db = getDatabase();
    return db.prepare('SELECT id, name, email, role, company, phone, created_at FROM users ORDER BY created_at DESC').all();
  },

  getUser: (id: string) => {
    const db = getDatabase();
    return db.prepare('SELECT id, name, email, role, company, phone, created_at FROM users WHERE id = ?').get(id);
  },

  getUserByEmail: (email: string) => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  createUser: (user: any) => {
    const db = getDatabase();
    return db.prepare(`
      INSERT INTO users (id, name, email, password, role, company, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      user.id || `user-${Date.now()}`,
      user.name,
      user.email,
      user.password, // Should be hashed before calling this
      user.role || 'client',
      user.company || null,
      user.phone || null
    );
  },

  updateUser: (id: string, updates: any) => {
    const db = getDatabase();
    const sanitizedUpdates = sanitizeObject(updates);
    const fields = Object.keys(sanitizedUpdates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(sanitizedUpdates);
    return db.prepare(`UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
  },

  deleteUser: (id: string) => {
    const db = getDatabase();
    return db.prepare('DELETE FROM users WHERE id = ?').run(id);
  },

  // Password Management
  createPasswordResetToken: (userId: string, token: string, expiresAt: string) => {
    const db = getDatabase();
    return db.prepare(`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `).run(userId, token, expiresAt);
  },

  getPasswordResetToken: (token: string) => {
    const db = getDatabase();
    return db.prepare(`
      SELECT * FROM password_reset_tokens
      WHERE token = ? AND used = 0 AND expires_at > datetime('now')
    `).get(token);
  },

  markPasswordResetTokenUsed: (token: string) => {
    const db = getDatabase();
    return db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE token = ?').run(token);
  },

  deleteExpiredPasswordResetTokens: () => {
    const db = getDatabase();
    return db.prepare("DELETE FROM password_reset_tokens WHERE expires_at < datetime('now') OR used = 1").run();
  },

  updateUserPassword: async (userId: string, newPassword: string) => {
    const db = getDatabase();
    const hashedPassword = await hashPassword(newPassword);
    return db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hashedPassword, userId);
  }
};