import { NextApiRequest, NextApiResponse } from 'next';
import { updateHeatmap } from '@/lib/actions/heatmap/increament.actions'; // Adjust the import path as necessary
import { getHeatmapData } from '@/lib/actions/heatmap/fetchHeatmap.actions'; // Adjust the import path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { clerkId, startDate, endDate } = req.query;

    if (req.method === 'GET') {
        const result = await getHeatmapData(clerkId as string, startDate as string, endDate as string);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}