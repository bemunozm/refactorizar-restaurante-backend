import { Category } from "../models/Category";
import { Order } from "../models/Order";
export declare class StatisticsService {
    getDashboardStatistics({ startDate, endDate }: {
        startDate: Date;
        endDate: Date;
    }): Promise<{
        comparison: {
            totalOrders: {
                current: number;
                previous: number;
                changePercentage: number;
            };
            confirmedTransactions: {
                current: number;
                previous: number;
                changePercentage: number;
            };
            activeTablesCount: {
                current: number;
                previous: number;
                changePercentage: number;
            };
            sessionsCount: {
                current: number;
                previous: number;
                changePercentage: number;
            };
            occupiedTablesCount: {
                current: number;
                previous: number;
                changePercentage: number;
            };
            mostSoldProduct: {
                current: any;
                previous: any;
            };
        };
        totalOrders: number;
        confirmedTransactions: number;
        activeTablesCount: number;
        occupiedTablesCount: number;
        mostSoldProduct: any;
        orders: any[];
        sessionsCount?: undefined;
    } | {
        comparison: {
            totalOrders: {
                current: number;
                previous: number;
                changePercentage: number;
            };
            confirmedTransactions: {
                current: number;
                previous: number;
                changePercentage: number;
            };
            activeTablesCount: {
                current: number;
                previous: number;
                changePercentage: number;
            };
            sessionsCount: {
                current: number;
                previous: number;
                changePercentage: number;
            };
            occupiedTablesCount: {
                current: number;
                previous: number;
                changePercentage: number;
            };
            mostSoldProduct: {
                current: any;
                previous: any;
            };
        };
        totalOrders: number;
        confirmedTransactions: number;
        activeTablesCount: number;
        occupiedTablesCount: number;
        mostSoldProduct: {
            quantity: any;
            productId?: string;
            name: string;
            price: number;
            about: string;
            image: string;
            category: Category;
            isAvailable: boolean;
        };
        sessionsCount: number;
        orders: Order[];
    }>;
    getPopularProducts({ startDate, endDate }: {
        startDate: Date;
        endDate: Date;
    }): Promise<{
        topProducts: any[];
        categoryDistribution: any[];
        salesByTime: any[];
        paidOrders?: undefined;
    } | {
        topProducts: {
            quantity: number;
            productId?: string;
            name: string;
            price: number;
            about: string;
            image: string;
            category: Category;
            isAvailable: boolean;
        }[];
        categoryDistribution: {
            totalQuantity: number;
            totalSales: number;
            categoryId?: string;
            name: string;
            image?: string;
        }[];
        salesByTime: {
            productId: string;
            productName: string;
            sales: {
                [key: string]: {
                    quantity: number;
                    totalSales: number;
                };
            };
        }[];
        paidOrders: Order[];
    }>;
    getBestHours({ startDate, endDate }: {
        startDate: Date;
        endDate: Date;
    }): Promise<{
        bestHours: {
            date: string;
            hour: number;
            count: number;
            totalSales: number;
            averageSales: number;
        }[];
        bestHoursByDay: {
            day: number;
            hours: {
                hour: number;
                count: number;
                totalSales: number;
                averageSales: number;
            }[];
        }[];
    }>;
    private getPeriodStatistics;
    getEconomyStats({ startDate, endDate }: {
        startDate: Date;
        endDate: Date;
    }): Promise<{
        salesByDay: {
            day: string;
            sales: number;
            averageSales: number;
            orderCount: number;
        }[];
        salesByDate: {
            date: string;
            totalSales: number;
        }[];
    }>;
    getOrderStats({ startDate, endDate }: {
        startDate: Date;
        endDate: Date;
    }): Promise<{
        deliveryStats: {
            totalOrders: number;
            totalEarnings: number;
            paymentMethods: {
                method: string;
                count: number;
                totalEarnings: number;
            }[];
        };
        shippingStats: {
            'Retiro en Tienda': {
                count: number;
                totalEarnings: number;
            };
            Delivery: {
                count: number;
                totalEarnings: number;
            };
            Presencial: {
                count: number;
                totalEarnings: number;
            };
        };
    }>;
}
