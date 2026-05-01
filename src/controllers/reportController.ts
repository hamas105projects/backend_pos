import { Request, Response } from 'express';
import { reportService } from '../services/reportService';

export const reportController = {
  async getMonthlyReport(req: Request, res: Response) {
    try {
      const { month } = req.query;
      
      let year: number;
      let monthNum: number;
      
      if (month && typeof month === 'string') {
        const [y, m] = month.split('-');
        year = parseInt(y);
        monthNum = parseInt(m);
      } else {
        const now = new Date();
        year = now.getFullYear();
        monthNum = now.getMonth() + 1;
      }
      
      const result = await reportService.getMonthlyReport(year, monthNum);
      
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get monthly report',
      });
    }
  },

  // DAILY REPORT (yang baru)
 async getDailyReport(req: Request, res: Response) {
  try {
    let { startDate, endDate } = req.query;
    
    // Validasi dan set default
    let start: Date;
    let end: Date;
    
    if (startDate && typeof startDate === 'string') {
      start = new Date(startDate);
      // Cek valid date
      if (isNaN(start.getTime())) {
        start = new Date();
        start.setDate(start.getDate() - 30);
      }
    } else {
      start = new Date();
      start.setDate(start.getDate() - 30);
    }
    
    if (endDate && typeof endDate === 'string') {
      end = new Date(endDate);
      // Cek valid date
      if (isNaN(end.getTime())) {
        end = new Date();
      }
    } else {
      end = new Date();
    }
    
    // Pastikan start tidak lebih besar dari end
    if (start > end) {
      [start, end] = [end, start];
    }
    
    // Reset waktu ke awal dan akhir hari
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    const result = await reportService.getDailyReport(start, end);
    
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    console.error('Error in getDailyReport:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get daily report',
    });
  }
},
};