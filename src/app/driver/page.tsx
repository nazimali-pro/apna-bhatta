import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import DriverDashboardClient from './DriverDashboardClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DriverDashboard() {
    const session = await getSession();

    if (!session || session.role !== 'DRIVER') {
        redirect('/login/driver');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { driverDetail: true }
    });

    if (!user) {
        redirect('/login/driver');
    }

    // 1. Fetch available orders (Orders with PENDING or PROCESSING status that have NO Delivery record mapped yet)
    // Actually, in our schema, when an order is created, it might create a Delivery record with NO driverId.
    // Let's look for Deliveries with NO driverId, or Orders with no delivery.
    const availableOrders = await prisma.order.findMany({
        where: {
            status: { in: ['PENDING', 'PROCESSING'] },
            delivery: { is: null } // Orders that haven't been assigned a delivery record yet
        },
        include: {
            customer: true,
            admin: { include: { bhattaDetail: true } }
        },
        orderBy: { createdAt: 'asc' }
    });

    // Also find existing Delivery records that belong to NO driver (unassigned)
    const unassignedDeliveriesDb = await prisma.delivery.findMany({
        where: { driverId: null },
        include: {
            order: {
                include: { customer: true, admin: { include: { bhattaDetail: true } } }
            }
        }
    });

    // Combine both pools into a unified "Available" list
    const availablePool = [
        ...availableOrders.map(o => ({
            id: o.id,
            orderId: o.id,
            status: o.status,
            totalAmount: o.totalAmount,
            paymentMethod: o.paymentMethod,
            bhattaName: o.admin.bhattaDetail?.bhattaName || o.admin.name,
            pickupAddress: o.admin.bhattaDetail?.address || 'Unknown pickup',
            pickupPhone: o.admin.bhattaDetail?.phoneNumber || o.admin.phoneNumber || '',
            customerName: o.customer.name,
            dropoffAddress: o.address,
            customerPhone: o.customer.phoneNumber || '',
            customerLat: o.latitude,
            customerLng: o.longitude,
        })),
        ...unassignedDeliveriesDb.map(d => ({
            id: d.id,
            orderId: d.orderId,
            status: d.order.status,
            totalAmount: d.order.totalAmount,
            paymentMethod: d.order.paymentMethod,
            bhattaName: d.order.admin.bhattaDetail?.bhattaName || d.order.admin.name,
            pickupAddress: d.order.admin.bhattaDetail?.address || 'Unknown pickup',
            pickupPhone: d.order.admin.bhattaDetail?.phoneNumber || d.order.admin.phoneNumber || '',
            customerName: d.order.customer.name,
            dropoffAddress: d.order.address,
            customerPhone: d.order.customer.phoneNumber || '',
            customerLat: d.order.latitude,
            customerLng: d.order.longitude,
        }))
    ];

    // 2. Fetch Active Deliveries for this driver
    const activeDeliveriesDb = await prisma.delivery.findMany({
        where: { 
            driverId: session.userId,
            status: { notIn: ['DELIVERED', 'CANCELLED'] }
        },
        include: {
            order: {
                include: { customer: true, admin: { include: { bhattaDetail: true } } }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    const activeDeliveries = activeDeliveriesDb.map(d => ({
        id: d.id,
        orderId: d.orderId,
        status: d.status,
        totalAmount: d.order.totalAmount,
        paymentMethod: d.order.paymentMethod,
        bhattaName: d.order.admin.bhattaDetail?.bhattaName || d.order.admin.name,
        pickupAddress: d.order.admin.bhattaDetail?.address || 'Unknown pickup',
        pickupPhone: d.order.admin.bhattaDetail?.phoneNumber || d.order.admin.phoneNumber || '',
        customerName: d.order.customer.name,
        dropoffAddress: d.order.address,
        customerPhone: d.order.customer.phoneNumber || '',
        customerLat: d.order.latitude,
        customerLng: d.order.longitude,
    }));

    // 3. Fetch Historical Deliveries for this driver
    const historyDeliveriesDb = await prisma.delivery.findMany({
        where: { 
            driverId: session.userId,
            status: { in: ['DELIVERED', 'CANCELLED'] }
        },
        include: {
            order: {
                include: { customer: true, admin: { include: { bhattaDetail: true } } }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    const historicalDeliveries = historyDeliveriesDb.map(d => ({
        id: d.id,
        orderId: d.orderId,
        status: d.status,
        totalAmount: d.order.totalAmount,
        paymentMethod: d.order.paymentMethod,
        bhattaName: d.order.admin.bhattaDetail?.bhattaName || d.order.admin.name,
        pickupAddress: d.order.admin.bhattaDetail?.address || 'Unknown pickup',
        pickupPhone: d.order.admin.bhattaDetail?.phoneNumber || d.order.admin.phoneNumber || '',
        customerName: d.order.customer.name,
        dropoffAddress: d.order.address,
        customerPhone: d.order.customer.phoneNumber || '',
        customerLat: d.order.latitude,
        customerLng: d.order.longitude,
    }));

    return (
        <DriverDashboardClient 
            driver={user} 
            availableDeliveries={availablePool}
            activeDeliveries={activeDeliveries}
            historicalDeliveries={historicalDeliveries}
        />
    );
}

