// Role enum mapping
export const Role = {
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

// Category enum mapping
export const Category = {
  FOOD: 'food',
  BEVERAGE: 'beverage',
  DESSERT: 'dessert',
} as const;

export type CategoryType = typeof Category[keyof typeof Category];

// Payment Method enum mapping
export const PaymentMethod = {
  CASH: 'cash',
  TRANSFER: 'transfer',
  QRIS: 'qris',
} as const;

export type PaymentMethodType = typeof PaymentMethod[keyof typeof PaymentMethod];

// Payment Status enum mapping
export const PaymentStatus = {
  PAID: 'paid',
  PENDING: 'pending',
  FAILED: 'failed',
  REFUND: 'refund',
} as const;

export type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];

// Order Type enum mapping
export const OrderType = {
  DINE_IN: 'dine_in',
  TAKEAWAY: 'takeaway',
} as const;

export type OrderTypeType = typeof OrderType[keyof typeof OrderType];

// Human-readable labels
export const RoleLabels: Record<RoleType, string> = {
  [Role.EMPLOYEE]: 'Karyawan',
  [Role.ADMIN]: 'Admin',
};

export const CategoryLabels: Record<CategoryType, string> = {
  [Category.FOOD]: 'Makanan',
  [Category.BEVERAGE]: 'Minuman',
  [Category.DESSERT]: 'Dessert',
};

export const PaymentMethodLabels: Record<PaymentMethodType, string> = {
  [PaymentMethod.CASH]: 'Tunai',
  [PaymentMethod.TRANSFER]: 'Transfer Bank',
  [PaymentMethod.QRIS]: 'QRIS',
};

export const PaymentStatusLabels: Record<PaymentStatusType, string> = {
  [PaymentStatus.PAID]: 'Lunas',
  [PaymentStatus.PENDING]: 'Menunggu',
  [PaymentStatus.FAILED]: 'Gagal',
  [PaymentStatus.REFUND]: 'Dikembalikan',
};

export const OrderTypeLabels: Record<OrderTypeType, string> = {
  [OrderType.DINE_IN]: 'Makan di Tempat',
  [OrderType.TAKEAWAY]: 'Bawa Pulang',
};