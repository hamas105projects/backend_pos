import { PrismaClient } from '@prisma/client';

/**
 * Generate unique invoice number
 * Format: INV/YYYYMMDD/XXXXX
 * Example: INV/20240101/00001
 */
export const generateInvoiceNumber = async (prisma: PrismaClient): Promise<string> => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Get last transaction today
  const lastTransaction = await prisma.transaction.findFirst({
    where: {
      invoiceNumber: {
        startsWith: `INV/${dateStr}/`,
      },
    },
    orderBy: {
      invoiceNumber: 'desc',
    },
  });
  
  let sequence = 1;
  if (lastTransaction) {
    const lastSeq = parseInt(lastTransaction.invoiceNumber.split('/')[2]);
    sequence = lastSeq + 1;
  }
  
  const seqStr = sequence.toString().padStart(5, '0');
  return `INV/${dateStr}/${seqStr}`;
};