import { 
  getRevenueData, 
  getPeakHours, 
  getAverageProcessTime, 
  getProductMetrics, 
  getGeneralKPIs 
} from "@/app/actions/reports";
import RelatoriosClient from "@/components/admin/RelatoriosClient";

export const dynamic = 'force-dynamic';

export default async function RelatoriosPage({ searchParams }: { searchParams: any }) {
  const params = await Promise.resolve(searchParams);
  const period = params?.period || '30';
  const daysLimit = parseInt(period, 10) || 30;

  const [
    revenueData,
    peakHoursData,
    avgProcessTime,
    productMetrics,
    generalKPIs
  ] = await Promise.all([
    getRevenueData(daysLimit),
    getPeakHours(daysLimit),
    getAverageProcessTime(daysLimit),
    getProductMetrics(daysLimit),
    getGeneralKPIs(daysLimit)
  ]);

  return (
    <RelatoriosClient 
      revenueData={revenueData}
      peakHoursData={peakHoursData}
      avgProcessTime={avgProcessTime}
      productMetrics={productMetrics}
      generalKPIs={generalKPIs}
      currentPeriod={period}
    />
  );
}
