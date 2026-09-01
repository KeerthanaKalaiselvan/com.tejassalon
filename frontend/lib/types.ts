export type Service = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceFrom: number;
  durationMin: number;
  image: string;
  keywords: string;
  featured: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
};

export type User = {
  id: string;
  mobile: string;
  name: string | null;
  onboarded: boolean;
  isAdmin?: boolean;
  serviceInterests?: Service[];
};

export type AppointmentSlotInput = {
  date: string;
  time: string;
};

export type Appointment = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes: string | null;
  createdAt: string;
  services: Service[];
  slots: { rank: number; date: string; time: string }[];
};

export type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

export type Order = {
  id: string;
  status: "PLACED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  total: number;
  createdAt: string;
  items: { quantity: number; priceAtOrder: number; product: Product }[];
};

export type Feedback = {
  id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: string;
};
