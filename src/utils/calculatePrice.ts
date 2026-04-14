/**
 * Calculate subtotal for transaction item
 * @param quantity - Item quantity
 * @param unitPrice - Unit price
 * @returns Subtotal
 */
export const calculateSubtotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

/**
 * Calculate grand total with discount and tax
 * @param totalAmount - Total amount before discount
 * @param discount - Discount amount
 * @param tax - Tax amount
 * @returns Grand total
 */
export const calculateGrandTotal = (totalAmount: number, discount: number, tax: number): number => {
  const afterDiscount = totalAmount - discount;
  return afterDiscount + tax;
};

/**
 * Calculate discount percentage
 * @param total - Total amount
 * @param discountPercent - Discount percentage
 * @returns Discount amount
 */
export const calculateDiscountFromPercent = (total: number, discountPercent: number): number => {
  return (total * discountPercent) / 100;
};

/**
 * Calculate tax from total
 * @param total - Total amount
 * @param taxPercent - Tax percentage
 * @returns Tax amount
 */
export const calculateTaxFromPercent = (total: number, taxPercent: number): number => {
  return (total * taxPercent) / 100;
};