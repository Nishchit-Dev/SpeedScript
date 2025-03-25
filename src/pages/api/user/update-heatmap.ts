import { NextApiRequest, NextApiResponse } from 'next';
import { updateHeatmap } from '@/lib/actions/heatmap/increament.actions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { clerkId, date } = req.body;
  const result = await updateHeatmap(clerkId as string, date as string);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
}