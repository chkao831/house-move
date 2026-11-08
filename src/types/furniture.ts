export interface FurnitureItem {
  _id?: string;
  store: string;
  name: string;
  price: number;
  category: string;
  priority: number;
  status: string;
  orderDate: string;
  deliveryDate?: string;
  link?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIES = [
  'Living Room',
  'Kitchen',
  'Bedroom',
  'Bathroom',
  'Office',
  'Dining',
  'Garden',
  'General',
] as const;

export const STATUSES = [
  'Wishlist',
  'Pending',
  'Ordered',
  'Shipped',
  'Delivered',
  'Purchased',
  'Returned',
  'Cancelled',
] as const;

export const PRIORITIES = [1, 2, 3, 4, 5] as const;
