import { prisma } from '../config/database';
import { PaymentStatus } from '../constanta/enum';

// Define type untuk daily data
type DailyData = {
  date: string;
  foods: number;
  beverages: number;
  desserts: number;
  total: number;
};

// Interface untuk monthly report
interface MonthlyReport {
  total_transactions: number;
  total_revenue: number;
  foods_sold: number;
  beverages_sold: number;
  desserts_sold: number;
  total_products_sold: number;
}

export const reportService = {
  // Monthly report
  async getMonthlyReport(year: number, month: number) {
    const result = await prisma.$queryRaw<MonthlyReport[]>`
      SELECT 
        COUNT(DISTINCT t.id)::int AS total_transactions,
        COALESCE(SUM(t.grand_total), 0)::decimal AS total_revenue,
        COALESCE(SUM(CASE WHEN p.category = 'food' THEN ti.quantity ELSE 0 END), 0)::int AS foods_sold,
        COALESCE(SUM(CASE WHEN p.category = 'beverage' THEN ti.quantity ELSE 0 END), 0)::int AS beverages_sold,
        COALESCE(SUM(CASE WHEN p.category = 'dessert' THEN ti.quantity ELSE 0 END), 0)::int AS desserts_sold,
        COALESCE(SUM(ti.quantity), 0)::int AS total_products_sold
      FROM transactions t
      JOIN transaction_items ti ON t.id = ti.transaction_id
      JOIN products p ON ti.product_id = p.id
      WHERE t.payment_status = 'paid'
        AND t.deleted_at IS NULL
        AND ti.deleted_at IS NULL
        AND p.deleted_at IS NULL
        AND EXTRACT(YEAR FROM t.transaction_date) = ${year}
        AND EXTRACT(MONTH FROM t.transaction_date) = ${month}
    `;
    
    const data = result[0];
    
    return {
      period: `${year}-${String(month).padStart(2, '0')}`,
      total_transactions: data.total_transactions,
      total_revenue: Number(data.total_revenue),
      foods_sold: data.foods_sold,
      beverages_sold: data.beverages_sold,
      desserts_sold: data.desserts_sold,
      total_products_sold: data.total_products_sold,
    };
  },

  // Daily report
  async getDailyReport(startDate: Date, endDate: Date) {
    console.log('📅 DAILY REPORT - StartDate param:', startDate);
    console.log('📅 DAILY REPORT - EndDate param:', endDate);
    
    // Buat salinan date untuk menghindari mutasi
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    console.log('📅 DAILY REPORT - Query start:', start);
    console.log('📅 DAILY REPORT - Query end:', end);
    
    // Validasi rentang tanggal
    if (start > end) {
      throw new Error('Start date must be before end date');
    }
    
    const transactions = await prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: start,
          lte: end,
        },
        paymentStatus: PaymentStatus.PAID,
        deletedAt: null,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    console.log('📅 DAILY REPORT - Transactions found:', transactions.length);
    
    // Generate semua tanggal dalam rentang
    const allDates: string[] = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      allDates.push(currentDate.toISOString().slice(0, 10));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Initialize dailyData dengan semua tanggal (default 0)
    const dailyData: Record<string, DailyData> = {};
    for (const date of allDates) {
      dailyData[date] = {
        date: date,
        foods: 0,
        beverages: 0,
        desserts: 0,
        total: 0,
      };
    }
    
    // Isi data dari transaksi
    for (const transaction of transactions) {
      const date = transaction.transactionDate;
      if (!date) continue;
      
      const dateKey = date.toISOString().slice(0, 10);
      
      // Pastikan dateKey ada di dailyData
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: dateKey,
          foods: 0,
          beverages: 0,
          desserts: 0,
          total: 0,
        };
      }
      
      dailyData[dateKey].total += Number(transaction.grandTotal);
      
      // Hitung per kategori berdasarkan subtotal (bukan quantity)
      for (const item of transaction.items) {
        const product = item.product;
        if (!product) continue;
        
        const subtotal = Number(item.subtotal || 0);
        
        if (product.category === 'food') {
          dailyData[dateKey].foods += subtotal;
        } else if (product.category === 'beverage') {
          dailyData[dateKey].beverages += subtotal;
        } else if (product.category === 'dessert') {
          dailyData[dateKey].desserts += subtotal;
        }
      }
    }
    
    // Konversi ke array (sudah terurut karena allDates sudah urut)
    const result: DailyData[] = allDates.map(date => dailyData[date]);
    
    console.log('📅 DAILY REPORT - Result days:', result.length);
    console.log('📅 DAILY REPORT - Date range:', result[0]?.date, 'to', result[result.length-1]?.date);
    
    return result;
  },
};