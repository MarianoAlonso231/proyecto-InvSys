"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  FileText, 
  TrendingUp, 
  BarChart2, 
  PieChart,
  Download
} from "lucide-react";
import SalesReportChart from "./sales-report-chart";
import PurchasesReportChart from "./purchases-report-chart";
import InventoryValueChart from "./inventory-value-chart";
import { Badge } from '@/components/ui/badge'; // Ajusta la ruta según tu estructura


export default function ReportsOverview() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="sales" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="sales" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Ventas
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              Compras
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center">
              <PieChart className="mr-2 h-4 w-4" />
              Inventario
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
        
        <TabsContent value="sales" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24,389.50</div>
                <p className="text-xs text-green-500 flex items-center">
                  +12.5% from last month
                  <TrendingUp className="ml-1 h-3 w-3" />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Promedio de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,568.30</div>
                <p className="text-xs text-green-500 flex items-center">
                  +3.2% from last month
                  <TrendingUp className="ml-1 h-3 w-3" />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Número de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">324</div>
                <p className="text-xs text-green-500 flex items-center">
                  +7.8% from last month
                  <TrendingUp className="ml-1 h-3 w-3" />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Tasa de Conversión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.7%</div>
                <p className="text-xs text-green-500 flex items-center">
                  +2.4% from last month
                  <TrendingUp className="ml-1 h-3 w-3" />
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <SalesReportChart />
          </div>
          
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos más Vendidos</CardTitle>
                <CardDescription>Productos con mayor volumen de ventas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Office Chair", "Wireless Mouse", "Monitor", "Keyboard", "Desk"].map((product, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">{product}</div>
                      <div className="text-right">
                        <div className="font-medium">${(Math.random() * 1000 + 500).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{Math.floor(Math.random() * 50 + 10)} units</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Método de Pago</CardTitle>
                <CardDescription>Distribución de métodos de pago</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex flex-col justify-center items-center">
                <div className="w-[200px] h-[200px] rounded-full border-8 border-primary relative">
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-3xl font-bold">65%</div>
                    <div className="text-sm text-muted-foreground">Credit Card</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                    <div className="text-sm">Credit Card (65%)</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
                    <div className="text-sm">Bank Transfer (20%)</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-chart-1 rounded-full mr-2"></div>
                    <div className="text-sm">Cash (10%)</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-chart-2 rounded-full mr-2"></div>
                    <div className="text-sm">Other (5%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="purchases" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Purchases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$18,742.25</div>
                <p className="text-xs text-green-500 flex items-center">
                  +8.4% from last month
                  <TrendingUp className="ml-1 h-3 w-3" />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Purchase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,340.50</div>
                <p className="text-xs text-green-500 flex items-center">
                  +5.1% from last month
                  <TrendingUp className="ml-1 h-3 w-3" />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Number of Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">54</div>
                <p className="text-xs text-green-500 flex items-center">
                  +3.7% from last month
                  <TrendingUp className="ml-1 h-3 w-3" />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-red-500 flex items-center">
                  +2 from last month
                  <TrendingUp className="ml-1 h-3 w-3 transform rotate-180" />
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <PurchasesReportChart />
          </div>
          
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Suppliers</CardTitle>
                <CardDescription>Suppliers with highest purchase volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["ABC Office Supplies", "Tech Solutions Inc.", "Global Furniture Co.", "Electronics Wholesale", "Stationery World"].map((supplier, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">{supplier}</div>
                      <div className="text-right">
                        <div className="font-medium">${(Math.random() * 5000 + 1000).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{Math.floor(Math.random() * 20 + 2)} orders</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Most Ordered Products</CardTitle>
                <CardDescription>Products with highest purchase frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Wireless Mouse", "Keyboard", "Notebook", "Office Chair", "Monitor"].map((product, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">{product}</div>
                      <div className="text-right">
                        <div className="font-medium">${(Math.random() * 500 + 100).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{Math.floor(Math.random() * 100 + 20)} units</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-green-500 flex items-center">
                  +24 from last month
                  <TrendingUp className="ml-1 h-3 w-3" />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$87,345.80</div>
                <p className="text-xs text-green-500 flex items-center">
                  +12.3% from last month
                  <TrendingUp className="ml-1 h-3 w-3" />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Low Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-red-500 flex items-center">
                  +3 from last month
                  <TrendingUp className="ml-1 h-3 w-3 transform rotate-180" />
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Out of Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-amber-500 flex items-center">
                  No change from last month
                  <span className="ml-1">―</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <InventoryValueChart />
          </div>
          
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
                <CardDescription>Distribution of products by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Electronics", count: 42, value: 28500 },
                    { name: "Furniture", count: 24, value: 35200 },
                    { name: "Office Supplies", count: 38, value: 12400 },
                    { name: "Stationery", count: 26, value: 4800 },
                    { name: "Lighting", count: 18, value: 6500 }
                  ].map((category, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-right">
                          <div className="font-medium">{category.count} products</div>
                          <div className="text-xs text-muted-foreground">${category.value.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(category.count / 156 * 100).toFixed(0)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>Products requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Desk Lamp", status: "low_stock", count: 3, min: 10 },
                    { name: "Keyboard", status: "low_stock", count: 1, min: 8 },
                    { name: "Whiteboard", status: "low_stock", count: 2, min: 3 },
                    { name: "Wireless Headphones", status: "out_of_stock", count: 0, min: 5 },
                    { name: "USB Cable", status: "out_of_stock", count: 0, min: 15 }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2">
                      <div className="font-medium">{item.name}</div>
                      <div className="flex items-center">
                        {item.status === "low_stock" ? (
                          <Badge variant="outline" className="border-amber-500 text-amber-500">
                            Low Stock ({item.count})
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-red-500 text-red-500">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Full Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}