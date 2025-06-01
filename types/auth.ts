export type UserRole = 'admin' | 'ventas' | 'inventario';

export interface RoutePermissions {
  [key: string]: UserRole[];
}

// Definición de rutas permitidas por rol
export const ROUTE_PERMISSIONS: RoutePermissions = {
  '/dashboard': ['admin', 'ventas', 'inventario'],
  '/products': ['admin', 'inventario'],
  '/suppliers': ['admin', 'inventario'],
  '/purchases': ['admin', 'inventario'],
  '/sales': ['admin', 'ventas'],
  '/reports': ['admin', 'ventas', 'inventario']
};

// Definición de items del menú por rol
export const MENU_ITEMS_BY_ROLE: Record<UserRole, string[]> = {
  admin: ['/dashboard', '/products', '/suppliers', '/purchases', '/sales', '/reports'],
  ventas: ['/dashboard', '/sales', '/reports'],
  inventario: ['/dashboard', '/products', '/suppliers', '/purchases', '/reports']
}; 