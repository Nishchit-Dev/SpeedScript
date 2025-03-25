import { useEffect, useState } from 'react';

export function useHeatmapData(clerkId: string | undefined, startDate: string, endDate: string) {
    const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        async function fetchData() {
            try {
                if (!clerkId) return;

                const response = await fetch(`/api/user/heatmap?clerkId=${clerkId}&startDate=${startDate}&endDate=${endDate}`);
                const data = await response.json();

                if (data.success) {
                    console.log(data.heatmapData); // Debugging line to check the fetched data
                    setHeatmapData(data.heatmapData);
                } else {
                    setError(data.error);
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch heatmap data');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [clerkId, startDate, endDate]);

    return { heatmapData, loading, error };
}