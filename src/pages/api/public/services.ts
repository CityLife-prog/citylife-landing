import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all active services
    const allServices = await db.getServices(true);

    // Format for public consumption
    const publicServices = allServices.map((service: any) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      who_for: service.who_for,
      features: service.features, // Already JSONB array
      disclaimer: service.disclaimer,
      price: service.price,
      category: service.category,
      hardware_included: service.hardware_included,
      sort_order: service.sort_order
    }));

    // Separate by category
    const projectServices = publicServices.filter((s: any) => s.category === 'project');
    const monthlyServices = publicServices.filter((s: any) => s.category === 'monthly');

    res.status(200).json({
      success: true,
      services: {
        project: projectServices,
        monthly: monthlyServices
      }
    });

  } catch (error) {
    console.error('Error fetching public services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
