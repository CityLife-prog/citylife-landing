import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

// Optional bcrypt import - gracefully handle if not installed
let bcrypt: any = null;
try {
  bcrypt = require('bcrypt');
} catch (error) {
  console.warn('⚠️  bcrypt not installed - password hashing disabled');
  console.warn('   Run "npm install" to enable secure authentication');
}

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

// Initialize database with schema
export async function initializeDatabase() {
  try {
    // Run migrations
    const migrationPath = path.join(process.cwd(), 'lib', 'migrations', '001_initial_schema.sql');

    if (fs.existsSync(migrationPath)) {
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

      // Replace placeholder password with actual hashed password
      const hashedPassword = bcrypt ? hashPasswordSync('ChangeMe123!') : 'ChangeMe123!';
      const sqlWithPassword = migrationSQL.replace('$2b$10$placeholder', hashedPassword);

      // Execute migration (Postgres will handle each statement)
      await sql.query(sqlWithPassword);

      console.log('✅ Database initialized successfully');
      if (!bcrypt) {
        console.warn('⚠️  Password stored without hashing - run npm install to enable bcrypt');
      }
    } else {
      console.warn('⚠️  Migration file not found, skipping initialization');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't throw - allow app to continue
  }
}

// Export database operations
export const db = {
  // Projects
  getProjects: async () => {
    const { rows } = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    return rows;
  },

  getProject: async (id: number) => {
    const { rows } = await sql`SELECT * FROM projects WHERE id = ${id}`;
    return rows[0];
  },

  createProject: async (project: any) => {
    const { rows } = await sql`
      INSERT INTO projects (name, client, client_id, status, budget, timeline, progress)
      VALUES (${project.name}, ${project.client}, ${project.clientId}, ${project.status}, ${project.budget}, ${project.timeline}, ${project.progress})
      RETURNING id
    `;
    return { lastInsertRowid: rows[0].id };
  },

  updateProject: async (id: number, updates: any) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const query = `UPDATE projects SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} RETURNING *`;

    const { rows } = await sql.query(query, [...values, id]);
    return rows[0];
  },

  deleteProject: async (id: number) => {
    await sql`DELETE FROM projects WHERE id = ${id}`;
    return { changes: 1 };
  },

  // Clients
  getClients: async () => {
    const { rows } = await sql`SELECT * FROM clients ORDER BY created_at DESC`;
    return rows;
  },

  getClient: async (id: number) => {
    const { rows } = await sql`SELECT * FROM clients WHERE id = ${id}`;
    return rows[0];
  },

  createClient: async (client: any) => {
    const { rows } = await sql`
      INSERT INTO clients (name, email, company, phone, website, business_name, address, projects, total_spent)
      VALUES (${client.name}, ${client.email}, ${client.company}, ${client.phone}, ${client.website}, ${client.business_name}, ${client.address}, ${client.projects || 0}, ${client.totalSpent || 0})
      RETURNING id
    `;
    return { lastInsertRowid: rows[0].id };
  },

  updateClient: async (id: number, updates: any) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const query = `UPDATE clients SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} RETURNING *`;

    const { rows } = await sql.query(query, [...values, id]);
    return rows[0];
  },

  deleteClient: async (id: number) => {
    await sql`DELETE FROM clients WHERE id = ${id}`;
    return { changes: 1 };
  },

  // Client Contacts
  getClientContacts: async (clientId: number) => {
    const { rows } = await sql`SELECT * FROM client_contacts WHERE client_id = ${clientId} ORDER BY is_primary DESC, created_at DESC`;
    return rows;
  },

  createClientContact: async (contact: any) => {
    const { rows } = await sql`
      INSERT INTO client_contacts (client_id, name, email, phone, role, is_primary)
      VALUES (${contact.clientId}, ${contact.name}, ${contact.email}, ${contact.phone}, ${contact.role}, ${contact.isPrimary || false})
      RETURNING id
    `;
    return { lastInsertRowid: rows[0].id };
  },

  updateClientContact: async (id: number, updates: any) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const query = `UPDATE client_contacts SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} RETURNING *`;

    const { rows } = await sql.query(query, [...values, id]);
    return rows[0];
  },

  deleteClientContact: async (id: number) => {
    await sql`DELETE FROM client_contacts WHERE id = ${id}`;
    return { changes: 1 };
  },

  // Reviews
  getReviews: async (activeOnly = true) => {
    if (activeOnly) {
      const { rows } = await sql`SELECT * FROM reviews WHERE is_active = true ORDER BY sort_order ASC, created_at DESC`;
      return rows;
    } else {
      const { rows } = await sql`SELECT * FROM reviews ORDER BY created_at DESC`;
      return rows;
    }
  },

  getReview: async (id: number) => {
    const { rows } = await sql`SELECT * FROM reviews WHERE id = ${id}`;
    return rows[0];
  },

  createReview: async (review: any) => {
    const { rows } = await sql`
      INSERT INTO reviews (
        client_name, client_title, client_company, rating, review_text,
        project_name, image_url, is_active, sort_order, project_id,
        source, source_url, verified, featured
      )
      VALUES (
        ${review.clientName}, ${review.clientTitle}, ${review.clientCompany},
        ${review.rating}, ${review.reviewText}, ${review.projectName},
        ${review.imageUrl || '/api/placeholder/80/80'},
        ${review.isActive !== undefined ? review.isActive : true},
        ${review.sortOrder || 0}, ${review.projectId},
        ${review.source || 'direct'}, ${review.sourceUrl},
        ${review.verified !== undefined ? review.verified : true},
        ${review.featured !== undefined ? review.featured : false}
      )
      RETURNING id
    `;
    return { lastInsertRowid: rows[0].id };
  },

  updateReview: async (id: number, updates: any) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const query = `UPDATE reviews SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} RETURNING *`;

    const { rows } = await sql.query(query, [...values, id]);
    return rows[0];
  },

  deleteReview: async (id: number) => {
    await sql`DELETE FROM reviews WHERE id = ${id}`;
    return { changes: 1 };
  },

  getReviewsByProject: async (projectId: number, activeOnly = true) => {
    if (activeOnly) {
      const { rows } = await sql`SELECT * FROM reviews WHERE project_id = ${projectId} AND is_active = true ORDER BY created_at DESC`;
      return rows;
    } else {
      const { rows } = await sql`SELECT * FROM reviews WHERE project_id = ${projectId} ORDER BY created_at DESC`;
      return rows;
    }
  },

  getFeaturedReviews: async () => {
    const { rows } = await sql`SELECT * FROM reviews WHERE featured = true AND is_active = true ORDER BY sort_order ASC, created_at DESC`;
    return rows;
  },

  getReviewsBySource: async (source: string) => {
    const { rows } = await sql`SELECT * FROM reviews WHERE source = ${source} AND is_active = true ORDER BY created_at DESC`;
    return rows;
  },

  // Notifications
  getNotifications: async (unreadOnly = false) => {
    if (unreadOnly) {
      const { rows } = await sql`SELECT * FROM notifications WHERE read = false ORDER BY created_at DESC`;
      return rows;
    } else {
      const { rows } = await sql`SELECT * FROM notifications ORDER BY created_at DESC`;
      return rows;
    }
  },

  getNotification: async (id: number) => {
    const { rows } = await sql`SELECT * FROM notifications WHERE id = ${id}`;
    return rows[0];
  },

  createNotification: async (notification: any) => {
    const { rows } = await sql`
      INSERT INTO notifications (type, title, message, link)
      VALUES (${notification.type}, ${notification.title}, ${notification.message}, ${notification.link})
      RETURNING id
    `;
    return { lastInsertRowid: rows[0].id };
  },

  markNotificationRead: async (id: number) => {
    await sql`UPDATE notifications SET read = true WHERE id = ${id}`;
    return { changes: 1 };
  },

  markAllNotificationsRead: async () => {
    await sql`UPDATE notifications SET read = true`;
    return { changes: 1 };
  },

  deleteNotification: async (id: number) => {
    await sql`DELETE FROM notifications WHERE id = ${id}`;
    return { changes: 1 };
  },

  // Users
  getUsers: async () => {
    const { rows } = await sql`SELECT id, name, email, role, company, phone, created_at FROM users ORDER BY created_at DESC`;
    return rows;
  },

  getUser: async (id: string) => {
    const { rows } = await sql`SELECT id, name, email, role, company, phone, created_at FROM users WHERE id = ${id}`;
    return rows[0];
  },

  getUserByEmail: async (email: string) => {
    const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
    return rows[0];
  },

  createUser: async (user: any) => {
    const { rows } = await sql`
      INSERT INTO users (id, name, email, password, role, company, phone)
      VALUES (
        ${user.id || `user-${Date.now()}`},
        ${user.name}, ${user.email}, ${user.password},
        ${user.role || 'client'}, ${user.company}, ${user.phone}
      )
      RETURNING id
    `;
    return { lastInsertRowid: rows[0].id };
  },

  updateUser: async (id: string, updates: any) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const query = `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} RETURNING *`;

    const { rows } = await sql.query(query, [...values, id]);
    return rows[0];
  },

  deleteUser: async (id: string) => {
    await sql`DELETE FROM users WHERE id = ${id}`;
    return { changes: 1 };
  },

  // Password Management
  createPasswordResetToken: async (userId: string, token: string, expiresAt: string) => {
    const { rows } = await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (${userId}, ${token}, ${expiresAt})
      RETURNING id
    `;
    return { lastInsertRowid: rows[0].id };
  },

  getPasswordResetToken: async (token: string) => {
    const { rows } = await sql`
      SELECT * FROM password_reset_tokens
      WHERE token = ${token} AND used = false AND expires_at > NOW()
    `;
    return rows[0];
  },

  markPasswordResetTokenUsed: async (token: string) => {
    await sql`UPDATE password_reset_tokens SET used = true WHERE token = ${token}`;
    return { changes: 1 };
  },

  deleteExpiredPasswordResetTokens: async () => {
    await sql`DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = true`;
    return { changes: 1 };
  },

  updateUserPassword: async (userId: string, newPassword: string) => {
    const hashedPassword = await hashPassword(newPassword);
    await sql`UPDATE users SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP WHERE id = ${userId}`;
    return { changes: 1 };
  },

  // Files
  getProjectFiles: async (projectId: number) => {
    const { rows } = await sql`SELECT * FROM files WHERE project_id = ${projectId} ORDER BY created_at DESC`;
    return rows;
  },

  createFile: async (file: any) => {
    const { rows } = await sql`
      INSERT INTO files (project_id, name, type, url, size, uploaded_by)
      VALUES (${file.projectId}, ${file.name}, ${file.type}, ${file.url}, ${file.size || 0}, ${file.uploadedBy || null})
      RETURNING id
    `;
    return { lastInsertRowid: rows[0].id };
  },

  deleteFile: async (id: number) => {
    await sql`DELETE FROM files WHERE id = ${id}`;
    return { changes: 1 };
  },

  // Messages
  getMessages: async (userId: string, projectId?: string) => {
    if (projectId) {
      const { rows } = await sql`
        SELECT * FROM messages
        WHERE (sender_id = ${userId} OR recipient_id = ${userId})
          AND project_id = ${parseInt(projectId)}
        ORDER BY created_at DESC
      `;
      return rows;
    } else {
      const { rows } = await sql`
        SELECT * FROM messages
        WHERE sender_id = ${userId} OR recipient_id = ${userId}
        ORDER BY created_at DESC
      `;
      return rows;
    }
  }
};
