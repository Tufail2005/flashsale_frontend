export interface Product {
  id: number;
  name: string;
}

export interface FlashProduct extends Product {
  liveStock: number;
}

export interface NormalProduct extends Product {
  availableStock: number;
}

export interface OrderMetric {
  status: string;
  count: number;
}

export interface DashboardData {
  timestamp: string;
  orderMetrics: OrderMetric[];
  dlqRescues: number;
  flashSales: FlashProduct[];
  normalProducts: NormalProduct[];
  error?: string;
}
