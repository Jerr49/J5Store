// mockOrdersWithItems.ts
export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  shipping: {
    name: string;
    address: string;
    city: string;
    country: string;
    zip: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

// ✅ Export mock orders
export const orders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-1001",
    date: "2025-09-20",
    status: "Delivered",
    shipping: {
      name: "John Doe",
      address: "123 Main St",
      city: "Lagos",
      country: "Nigeria",
      zip: "100001",
    },
    items: [
      { id: "i1", name: "Red T-shirt", quantity: 2, price: 20, image: "https://via.placeholder.com/150" },
      { id: "i2", name: "Blue Jeans", quantity: 1, price: 40, image: "https://via.placeholder.com/150" },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-1002",
    date: "2025-09-19",
    status: "Shipped",
    shipping: {
      name: "Jane Smith",
      address: "456 Market St",
      city: "Abuja",
      country: "Nigeria",
      zip: "900002",
    },
    items: [
      { id: "i3", name: "Sneakers", quantity: 1, price: 60, image: "https://via.placeholder.com/150" },
    ],
  },
];
