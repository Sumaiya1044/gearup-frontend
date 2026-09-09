export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Gear {
  id: string;
  name: string;
  description?: string;
  pricePerDay: number;
  categoryId: string;
  category?: Category;
  brand?: string;
  imageUrl?: string;
  stock: number;
  available?: boolean;
  providerId: string;
  provider?: User;
  createdAt?: string;
  updatedAt?: string;
}

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

export interface Rental {
  id: string;
  gearId: string;
  gear?: Gear;
  customerId: string;
  customer?: User;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: RentalStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  rentalId: string;
  amount: number;
  status: string;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  gearId: string;
  customerId: string;
  customer?: User;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}