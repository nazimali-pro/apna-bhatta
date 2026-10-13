import { prisma } from '@/lib/db';
import AdminSupportView from './AdminSupportView';

export const dynamic = 'force-dynamic';

export default async function AdminSupportPage() {
    const reports = await prisma.contactReport.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return <AdminSupportView initialReports={JSON.parse(JSON.stringify(reports))} />;
}
