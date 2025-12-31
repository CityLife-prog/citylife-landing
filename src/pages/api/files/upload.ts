import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import { db } from '../../../../lib/database';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Authentication helper
function getUserFromRequest(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const userHeader = req.headers['x-user-data'];
    if (userHeader) {
      try {
        return JSON.parse(userHeader as string);
      } catch {
        return null;
      }
    }
    return null;
  }
  
  try {
    const token = authHeader.replace('Bearer ', '');
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch {
    return null;
  }
}

// Authorization helper
async function canUploadToProject(user: any, projectId: number) {
  if (!user) return false;

  // Admin can upload to any project
  if (user.role === 'admin') return true;

  // Client can only upload to their own projects
  if (user.role === 'client') {
    const project = await db.getProject(projectId) as any;
    return project && project.client_id === user.id;
  }

  return false;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await form.parse(req);
    
    const projectId = Array.isArray(fields.projectId) ? fields.projectId[0] : fields.projectId;
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!projectId || !file) {
      return res.status(400).json({ error: 'Project ID and file are required' });
    }
    
    const projectIdNum = parseInt(projectId as string);
    if (!await canUploadToProject(user, projectIdNum)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.originalFilename || 'unnamed';
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const newFileName = `${baseName}_${timestamp}${extension}`;
    const newFilePath = path.join(uploadDir, newFileName);

    // Move file to final location
    fs.renameSync(file.filepath, newFilePath);

    // Save file info to database
    const fileData = {
      projectId: projectIdNum,
      name: originalName,
      type: getFileType(extension),
      url: `/uploads/${newFileName}`,
      size: file.size || 0
    };

    const result = await db.createFile(fileData);

    res.status(200).json({
      success: true,
      file: {
        id: result.lastInsertRowid,
        ...fileData
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function getFileType(extension: string): string {
  const ext = extension.toLowerCase();
  
  if (['.pdf'].includes(ext)) return 'pdf';
  if (['.doc', '.docx', '.txt', '.rtf'].includes(ext)) return 'document';
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) return 'image';
  if (['.xls', '.xlsx', '.csv'].includes(ext)) return 'spreadsheet';
  if (['.ppt', '.pptx'].includes(ext)) return 'presentation';
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return 'archive';
  if (['.mp4', '.avi', '.mov', '.wmv', '.flv'].includes(ext)) return 'video';
  if (['.mp3', '.wav', '.flac', '.aac'].includes(ext)) return 'audio';
  
  return 'other';
}