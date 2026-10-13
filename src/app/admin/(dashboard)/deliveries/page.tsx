import { prisma } from '@/lib/db';
import AdminDeliveriesView from './AdminDeliveriesView';

export const dynamic = 'force-dynamic';

export default async function AdminDeliveriesPage() {
    const deliveriesPromise = prisma.delivery.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
            driver: { select: { name: true, phoneNumber: true, city: true } },
            order: {
                select: {
                    id: true,
                    address: true,
                    totalAmount: true,
                    status: true,
                    customer: { select: { name: true, phoneNumber: true } },
                    admin: { select: { name: true, bhattaDetail: { select: { bhattaName: true, address: true } } } }
                }
            }
        }
    });

    const driversPromise = prisma.user.findMany({
        where: { role: 'DRIVER' },
        select: { 
            id: true, 
            name: true,
            driverDetail: { select: { vehicleType: true } }
        },
    });

    const [deliveries, availableDrivers] = await Promise.all([deliveriesPromise, driversPromise]);

    return (
        <AdminDeliveriesView 
            initialDeliveries={JSON.parse(JSON.stringify(deliveries))} 
            availableDrivers={JSON.parse(JSON.stringify(availableDrivers))} 
        />
    );
}

