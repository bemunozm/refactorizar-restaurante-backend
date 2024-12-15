import { Category } from "../models/Category";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { Session } from "../models/Session";
import { Table } from "../models/Table";
import { Transaction } from "../models/Transaction";
import { Assistance } from "../models/Assistance";


export class StatisticsService {
    public async getDashboardStatistics({startDate, endDate}: {startDate: Date, endDate: Date}) {
        
        const currentStartDate = new Date(startDate);
        const currentEndDate = new Date(endDate);
        const timeRange = currentEndDate.getTime() - currentStartDate.getTime();
        const previousStartDate = new Date(currentStartDate.getTime() - timeRange);
        const previousEndDate = new Date(currentEndDate.getTime() - timeRange);
        // Obtener datos del período actual
        const currentPeriod = await this.getPeriodStatistics(startDate, endDate);
        
        // Obtener datos del período anterior
        const previousPeriod = await this.getPeriodStatistics(previousStartDate, previousEndDate);

        // Calcular los porcentajes de cambio
        const calculateChange = (current: number, previous: number): number => {
            if (previous === 0) return 100;
            return Math.round(((current - previous) / previous) * 100);
        };

        console.log('currentPeriod', currentPeriod);
        console.log('previousPeriod', previousPeriod);

        return {
            ...currentPeriod,
            comparison: {
                totalOrders: {
                    current: currentPeriod.totalOrders,
                    previous: previousPeriod.totalOrders,
                    changePercentage: calculateChange(currentPeriod.totalOrders, previousPeriod.totalOrders)
                },
                confirmedTransactions: {
                    current: currentPeriod.confirmedTransactions,
                    previous: previousPeriod.confirmedTransactions,
                    changePercentage: calculateChange(currentPeriod.confirmedTransactions, previousPeriod.confirmedTransactions)
                },
                activeTablesCount: {
                    current: currentPeriod.activeTablesCount,
                    previous: previousPeriod.activeTablesCount,
                    changePercentage: calculateChange(currentPeriod.activeTablesCount, previousPeriod.activeTablesCount)
                },
                sessionsCount: {
                    current: currentPeriod.sessionsCount,
                    previous: previousPeriod.sessionsCount,
                    changePercentage: calculateChange(currentPeriod.sessionsCount, previousPeriod.sessionsCount)
                },
                occupiedTablesCount: {
                    current: currentPeriod.occupiedTablesCount,
                    previous: previousPeriod.occupiedTablesCount,
                    changePercentage: calculateChange(currentPeriod.occupiedTablesCount, previousPeriod.occupiedTablesCount)
                },
                mostSoldProduct: {
                    current: currentPeriod.mostSoldProduct,
                    previous: previousPeriod.mostSoldProduct
                }
            }
        };
    }
    
    public async getPopularProducts({ startDate, endDate }: { startDate: Date, endDate: Date }) {
        const orders = await Order.getOrdersBetweenDates(startDate, endDate);
        const paidOrders = orders.filter(order => order.status === 'Pagado');
        console.log('paidOrders', paidOrders);

        if (!paidOrders || paidOrders.length === 0) {
            return {
                topProducts: [],
                categoryDistribution: [],
                salesByTime: []
            };
        }

        const productMap = new Map<string, { product: Product, sales: { [key: string]: { quantity: number, totalSales: number } } }>();
        const popularProducts = new Map<string, { product: Product, sales: { quantity: number, totalSales: number } }>();
        const categoryMap = new Map<string, { category: Category, totalQuantity: number, totalSales: number }>();
        const timePeriods = {
            'Desayuno': { start: 8, end: 12 },
            'Almuerzo': { start: 13, end: 17 },
            'Merienda': { start: 17, end: 20 },
            'Cena': { start: 21, end: 24 }
        };

        for (const order of paidOrders) {
            const hour = order.createdAt.getHours();
            const orderTotal = order.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

            for (const item of order.items) {
                const productInstance = await new Product({ productId: item.product.productId }).findById();
                if (!productInstance) continue;

                // Actualizar categoría
                const category = productInstance.category;
                if (!categoryMap.has(category.categoryId)) {
                    categoryMap.set(category.categoryId, { category, totalQuantity: 0, totalSales: 0 });
                }
                const categoryData = categoryMap.get(category.categoryId)!;
                categoryData.totalQuantity += item.quantity;
                categoryData.totalSales += orderTotal;

                if (!productMap.has(productInstance.productId)) {
                    productMap.set(productInstance.productId, {
                        product: productInstance,
                        sales: {
                            'Desayuno': { quantity: 0, totalSales: 0 },
                            'Almuerzo': { quantity: 0, totalSales: 0 },
                            'Merienda': { quantity: 0, totalSales: 0 },
                            'Cena': { quantity: 0, totalSales: 0 }
                        }
                    });
                }

                if (!popularProducts.has(productInstance.productId)) {
                    popularProducts.set(productInstance.productId, {
                        product: productInstance,
                        sales: {
                            quantity: 0,
                            totalSales: 0
                        }
                    });
                }

                const productData = productMap.get(productInstance.productId)!;
                const popularProductData = popularProducts.get(productInstance.productId)!;

                // Actualizar ventas por tiempo
                Object.entries(timePeriods).forEach(([period, { start, end }]) => {
                    if (hour >= start && hour < end) {
                        productData.sales[period].quantity += item.quantity;
                        productData.sales[period].totalSales += orderTotal;
                    }
                });

                popularProductData.sales.quantity += item.quantity;
                popularProductData.sales.totalSales += orderTotal;
            }
        }

        // Preparar datos para el gráfico de ventas por tiempo
        const salesByTime = Array.from(productMap.values()).map(({ product, sales }) => ({
            ...product,
            sales
        }));

        // Convertir categoryMap a un formato adecuado para categoryDistribution
        const categoryDistribution = Array.from(categoryMap.entries()).map(([categoryId, { category, totalQuantity, totalSales }]) => ({
            ...category, // Nombre de la categoría
            totalQuantity,   // Cantidad total de productos vendidos
            totalSales,      // Total de ventas
            // Puedes agregar más propiedades aquí si es necesario
        }));

        return {
            topProducts: Array.from(popularProducts.values()).map((item) => ({...item.product, quantity: item.sales.quantity})),
            categoryDistribution, // Ahora incluye un objeto completo de categoría
            salesByTime,
            paidOrders
        };
    }

    public async getBestHours({ startDate, endDate }: { startDate: Date, endDate: Date }) {
        const orders = await Order.getOrdersBetweenDates(startDate, endDate);
        if (!orders || orders.length === 0) {
            throw new Error("No se encontraron órdenes entre las fechas");
        }

        // Inicializar un mapa para almacenar las horas y sus estadísticas agrupadas por día
        const hoursStats: { [key: string]: { count: number; totalSales: number } } = {};
        const weeklyStats: { [key: string]: { [key: number]: { count: number; totalSales: number } } } = {};

        for (const order of orders) {
            if (order.status === 'Pagado') {
                const date = order.createdAt.toISOString().split('T')[0]; // Obtener la fecha en formato ISO
                const hour = order.createdAt.getHours(); // Solo la hora, sin minutos
                const dayOfWeek = order.createdAt.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
                const orderTotal = order.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
                
                const key = `${date}-${hour}`; // Crear una clave única para cada combinación de fecha y hora

                // Actualizar estadísticas generales
                if (!hoursStats[key]) {
                    hoursStats[key] = { count: 0, totalSales: 0 };
                }
                hoursStats[key].count += 1;
                hoursStats[key].totalSales += orderTotal;

                // Actualizar estadísticas semanales
                if (!weeklyStats[dayOfWeek]) {
                    weeklyStats[dayOfWeek] = {};
                }
                if (!weeklyStats[dayOfWeek][hour]) {
                    weeklyStats[dayOfWeek][hour] = { count: 0, totalSales: 0 };
                }
                weeklyStats[dayOfWeek][hour].count += 1;
                weeklyStats[dayOfWeek][hour].totalSales += orderTotal;
            }
        }

        // Convertir el objeto a un arreglo y calcular el promedio de ventas para el período completo
        const bestHours = Object.entries(hoursStats).map(([key, stats]) => {
            const [year, month, day, hour] = key.split('-');
            return {
                date: `${year}-${month}-${day}`,
                hour: parseInt(hour),
                count: stats.count,
                totalSales: stats.totalSales,
                averageSales: stats.totalSales / stats.count // Calcular promedio de ventas por hora
            };
        });

        // Convertir las estadísticas semanales a un formato más útil
        const bestHoursByDay = Object.entries(weeklyStats).map(([day, hours]) => {
            console.log('day', day);
            console.log('hours', hours);
            return {
                day: parseInt(day), // Convertir el día de la semana a número
                hours: Object.entries(hours).map(([hour, stats]) => ({
                    hour: parseInt(hour),
                    count: stats.count,
                    totalSales: stats.totalSales,
                    averageSales: stats.totalSales / stats.count // Calcular promedio de ventas por hora
                }))
            };
        });

        // Ordenar por total de ventas o por cantidad de órdenes, según lo que necesites
        bestHours.sort((a, b) => b.totalSales - a.totalSales); // Ordenar por total de ventas

        return { bestHours, bestHoursByDay };
    }

    // Método auxiliar para obtener estadísticas de un período específico
    private async getPeriodStatistics(startDate: Date, endDate: Date) {
        //1. Obtener las ordenes entre las fechas
        const orders = await Order.getOrdersBetweenDates(startDate, endDate);
        if (!orders) {
            return {
                totalOrders: 0,
                confirmedTransactions: 0,
                activeTablesCount: 0,
                occupiedTablesCount: 0,
                mostSoldProduct: null,
                orders: []
            };
        }

        
        //2. Calcular el total de ordenes
        const totalOrders = orders.length;

        //5. Calcular el total de transacciones
        //const transactions = await Transaction.getTransactionsBetweenDates(startDate, endDate);
        
        //if (!transactions) {
        //    throw new Error("No se encontraron transacciones entre las fechas");
        //}

        //6. Filtrar las transacciones CONFIRMADAS (pagadas)
        //const confirmedTransactions = transactions.filter(transaction => transaction.status === 'CONFIRMADA').reduce((total, transaction) => total + transaction.amount, 0);
        const confirmedTransactions = orders.filter(order => order.status === 'Pagado').reduce((total, order) => total + order.items.reduce((total, item) => total + item.product.price * item.quantity, 0), 0);
        //7. Cantidad de mesas activas y cantidad de mesas ocupadas
        const allTables = await Table.getAll();
        const activeTablesCount = allTables.length;
        const occupiedTablesCount = allTables.filter(table => table.status === 'Ocupada').length;

        //7.1 Obtener la cantidad de sessiones por periodo para calcular la variacion de sesiones
        const sessions = await Session.getSessionsBetweenDates(startDate, endDate);
        const sessionsCount = sessions.length;

        //8. Encontrar el plato mas vendido (considerando item.quantity)
        const productQuantities = {};
        
        // Sumar las cantidades de cada producto
        orders.forEach(order => {
            order.items.forEach(item => {
                const productId = item.product.productId;
                productQuantities[productId] = (productQuantities[productId] || 0) + item.quantity;
            });
        });

        // Encontrar el producto con la mayor cantidad
        const maxProductId = Object.entries(productQuantities)
            .reduce((max, [productId, quantity]) => 
                quantity > max[1] ? [productId, quantity] : max
            , ['', 0])[0];
        const product = maxProductId ? await new Product({ productId: maxProductId }).findById() : null;
        const mostSoldProduct = product ? { ...product, quantity: productQuantities[maxProductId] } : null;

        return {
            totalOrders,
            confirmedTransactions,
            activeTablesCount,
            occupiedTablesCount,
            mostSoldProduct,
            sessionsCount,
            orders
        }
    }

    public async getEconomyStats({ startDate, endDate }: { startDate: Date, endDate: Date }) {
        const orders = await Order.getOrdersBetweenDates(startDate, endDate);
        if (!orders) {
            throw new Error("No se encontraron ordenes entre las fechas");
        }

        const salesByDayMap = new Map<string, { total: number, count: number }>();
        const salesByDateMap = new Map<string, number>(); // Para almacenar el total vendido por fecha
        const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

        // Inicializar el mapa de días con valores en 0
        daysOfWeek.forEach(day => {
            salesByDayMap.set(day, { total: 0, count: 0 });
        });

        // Procesar todas las órdenes pagadas
        orders.forEach(order => {
            if (order.status === 'Pagado') {
                const createdAtDate = order.createdAt.toISOString().split('T')[0]; // Mantener la fecha en formato ISO
                const orderTotal = order.items.reduce((total, item) => 
                    total + (item.product.price * item.quantity), 0);

                // Agrupar por fecha
                salesByDateMap.set(createdAtDate, (salesByDateMap.get(createdAtDate) || 0) + orderTotal);

                // Calcular el día de la semana
                const dayOfWeek = daysOfWeek[order.createdAt.getDay() === 0 ? 6 : order.createdAt.getDay() - 1]; // Ajustar para que el domingo sea el último
                const dayStats = salesByDayMap.get(dayOfWeek)!;

                // Actualizar estadísticas del día
                salesByDayMap.set(dayOfWeek, {
                    total: dayStats.total + orderTotal,
                    count: dayStats.count + 1
                });
            }
        });

        // Convertir las ventas por día a un formato más útil
        const salesByDay = daysOfWeek.map(day => {
            const stats = salesByDayMap.get(day)!;
            return {
                day,
                sales: stats.total,
                averageSales: stats.count > 0 ? stats.total / stats.count : 0,
                orderCount: stats.count
            };
        });

        // Convertir las ventas por fecha a un formato más útil
        const salesByDate = Array.from(salesByDateMap.entries()).map(([date, totalSales]) => ({
            date, // Mantener la fecha en formato ISO
            totalSales
        }));

        return { salesByDay, salesByDate }; // Devolver ambas estructuras
    }

    public async getOrderStats({ startDate, endDate }: { startDate: Date, endDate: Date }) {
        const orders = await Order.getOrdersBetweenDates(startDate, endDate);
        const paidOrders = orders.filter(order => order.status === 'Pagado');

        const deliveryStats = {
            totalOrders: 0,
            totalEarnings: 0,
            paymentMethods: [
                {
                    method: 'Pago con Efectivo',
                    count: 0,
                    totalEarnings: 0
                },
                {
                    method: 'Pago con Tarjeta',
                    count: 0,
                    totalEarnings: 0
                },
                {
                    method: 'Pago con Webpay',
                    count: 0,
                    totalEarnings: 0
                },
            ]
        };

        const shippingStats = {
            'Retiro en Tienda': { count: 0, totalEarnings: 0 },
            'Delivery': { count: 0, totalEarnings: 0 },
            'Presencial': { count: 0, totalEarnings: 0 },
        };

        const assistanceRecords = await Assistance.getAssistancesBetweenDates(startDate, endDate);
        const confirmedTransactions = await Transaction.getTransactionsBetweenDates(startDate, endDate);

        for (const order of paidOrders) {
            deliveryStats.totalOrders += 1;
            const orderTotal = order.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
            deliveryStats.totalEarnings += orderTotal;

            // Contar pedidos por tipo de envío
            if (order.type === 'Retiro en Tienda') {
                shippingStats['Retiro en Tienda'].count += 1;
                shippingStats['Retiro en Tienda'].totalEarnings += orderTotal;
            } else if (order.type === 'Delivery') {
                shippingStats['Delivery'].count += 1;
                shippingStats['Delivery'].totalEarnings += orderTotal;
            } else if (order.type === 'Presencial') {
                shippingStats['Presencial'].count += 1;
                shippingStats['Presencial'].totalEarnings += orderTotal;
            }
        }

        // Contar métodos de pago
        if (assistanceRecords) {
            for (const assistance of assistanceRecords) {
                const transaction = confirmedTransactions.find(t => t.token === assistance.transactionToken && t.status === 'CONFIRMADA');
                if (transaction) {
                    if (assistance.type === 'Pago con Efectivo') {
                        deliveryStats.paymentMethods[0].count += 1;
                        deliveryStats.paymentMethods[0].totalEarnings += transaction.amount;
                    } else if (assistance.type === 'Pago con Tarjeta') {
                        deliveryStats.paymentMethods[1].count += 1;
                        deliveryStats.paymentMethods[1].totalEarnings += transaction.amount;
                    } else {
                        console.log('No se encontró el tipo de pago');
                    }
                }
            }
        }

        // Calcular el conteo de Webpay
        deliveryStats.paymentMethods[2].count = deliveryStats.totalOrders - deliveryStats.paymentMethods[0].count - deliveryStats.paymentMethods[1].count;
        deliveryStats.paymentMethods[2].totalEarnings = deliveryStats.totalEarnings - deliveryStats.paymentMethods[0].totalEarnings - deliveryStats.paymentMethods[1].totalEarnings;

        return {
            deliveryStats,
            shippingStats // Devolver también las estadísticas de envío
        };
    }

    public async getTableStats({ startDate, endDate }: { startDate: Date, endDate: Date }) {
        const tables = await Table.getAll();
        const sessions = await Session.getSessionsBetweenDates(startDate, endDate);
        const orders = await Order.getOrdersBetweenDates(startDate, endDate);
        const paidOrders = orders.filter(order => order.status === 'Pagado');

        const tableStats = {
            totalTables: tables.length,
            occupiedTables: 0,
            availableTables: 0,
            totalSessions: 0,
            totalEarnings: 0,
            averageSessionDuration: 0,
            sessionDurations: [],
            popularTables: new Map<string, { table: Table; sessionCount: number }>(),
            bestHours: new Map<string, { count: number; totalSales: number }>(),
        };

        // Inicializar el mapa de sesiones por mesa
        tables.forEach(table => {
            tableStats.popularTables.set(table.tableId || '', { table: table, sessionCount: 0 });
        });

        // Calcular estadísticas
        sessions.forEach(session => {
            tableStats.totalSessions += 1;
            const tableId = session.table.tableId;

            // Contar mesas ocupadas
            if (session.status === 'Activa' || session.status === 'Pagando') {
                tableStats.occupiedTables += 1;
            }
            const popularTable = tableStats.popularTables.get(tableId);
            if (popularTable) {
                popularTable.sessionCount += 1; // Incrementar el conteo de sesiones
            }

            // Calcular duración de la sesión
            if (session.createdAt && session.updatedAt) {
                const createdAt = new Date(session.createdAt);
                const updatedAt = new Date(session.updatedAt);
                const duration = Math.round((updatedAt.getTime() - createdAt.getTime()) / 60000); // Duración en minutos
                tableStats.sessionDurations.push(duration);

                // Calcular las mejores horas
                const hour = createdAt.getHours();
                const key = `${tableId}-${hour}`;
                const orderTotal = paidOrders
                    .filter(order => order.table && order.table.tableId === tableId)
                    .reduce((total, order) => {
                        const orderTotal = order.items.reduce((itemTotal, item) => {
                            return itemTotal + (item.product?.price || 0) * (item.quantity || 0);
                        }, 0);
                        return total + orderTotal;
                    }, 0);
                    
                if (!tableStats.bestHours.has(key)) {
                    
                    tableStats.bestHours.set(key, { count: 0, totalSales: 0 });
                }
                const hourStats = tableStats.bestHours.get(key)!;
                hourStats.count += 1;
                hourStats.totalSales += orderTotal;
            }
        });


        // Calcular mesas disponibles
        tableStats.availableTables = tableStats.totalTables - tableStats.occupiedTables;

        // Calcular duración promedio de las sesiones
        if (tableStats.sessionDurations.length > 0) {
            const totalDuration = tableStats.sessionDurations.reduce((acc, curr) => acc + curr, 0);
            tableStats.averageSessionDuration = Math.round(totalDuration / tableStats.sessionDurations.length); // Promedio en minutos
        }

        // Convertir las mesas más populares a un formato más útil
        const popularTablesArray = Array.from(tableStats.popularTables.values())
            .sort((a, b) => b.sessionCount - a.sessionCount); // Ordenar por número de sesiones

        // Convertir las mejores horas a un formato más útil
        const bestHoursArray = Array.from(tableStats.bestHours.entries())
            .map(([key, stats]) => {
                const [tableId, hour] = key.split('-');
                return {
                    tableId,
                    hour: parseInt(hour),
                    count: stats.count,
                    totalSales: stats.totalSales,
                    averageSales: stats.totalSales / stats.count // Calcular promedio de ventas por hora
                };
            });

        return {
            ...tableStats,
            popularTables: popularTablesArray, // Devolver las mesas más populares con el objeto completo
            bestHours: bestHoursArray // Devolver las mejores horas
        };
    }
}

