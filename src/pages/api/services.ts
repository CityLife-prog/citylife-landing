import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/database';

// Auth helper
function getUserFromRequest(req: NextApiRequest) {
  try {
    const userDataHeader = req.headers['x-user-data'];
    if (!userDataHeader || typeof userDataHeader !== 'string') {
      return null;
    }
    return JSON.parse(userDataHeader);
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Auth check - admin only
  const user = getUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  if (req.method === 'GET') {
    // Get all services (including inactive ones for admin)
    try {
      const services = await db.getServices(false);
      return res.status(200).json({ success: true, services });
    } catch (error) {
      console.error('Error fetching services:', error);
      return res.status(500).json({ error: 'Failed to fetch services' });
    }
  }

  if (req.method === 'POST') {
    // Create new service
    const { title, description, who_for, features, disclaimer, price, category, hardware_included, is_active, sort_order } = req.body;

    // Validate required fields
    if (!title || !description || !who_for || !price || !category) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['title', 'description', 'who_for', 'price', 'category']
      });
    }

    try {
      const result = await db.createService({
        title,
        description,
        who_for,
        features: features || [],
        disclaimer: disclaimer || null,
        price,
        category,
        hardware_included: hardware_included || false,
        is_active: is_active !== false,
        sort_order: sort_order || 0
      });

      return res.status(201).json({
        success: true,
        message: 'Service created successfully',
        serviceId: result.lastInsertRowid
      });
    } catch (error) {
      console.error('Error creating service:', error);
      return res.status(500).json({ error: 'Failed to create service' });
    }
  }

  if (req.method === 'PUT') {
    // Update service (all fields supported)
    const { id, ...updates } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing service ID' });
    }

    try {
      await db.updateService(id, updates);
      return res.status(200).json({
        success: true,
        message: 'Service updated successfully'
      });
    } catch (error) {
      console.error('Error updating service:', error);
      return res.status(500).json({ error: 'Failed to update service' });
    }
  }

  if (req.method === 'DELETE') {
    // Delete service
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing service ID' });
    }

    try {
      await db.deleteService(id);
      return res.status(200).json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      return res.status(500).json({ error: 'Failed to delete service' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
