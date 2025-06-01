import { Database } from '@/types/supabase';

type Product = Database['public']['Tables']['products']['Row'];

export const STOCK_THRESHOLD = 10; // Umbral para considerar bajo stock

export type SortOption = 
  | 'name-asc' 
  | 'name-desc' 
  | 'price-asc' 
  | 'price-desc' 
  | 'stock-asc' 
  | 'stock-desc';

export type FilterOption = 'all' | 'low-stock' | 'out-of-stock';

export const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
  const sortedProducts = [...products];

  switch (sortBy) {
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':
      return sortedProducts.sort((a, b) => a.unit_price - b.unit_price);
    case 'price-desc':
      return sortedProducts.sort((a, b) => b.unit_price - a.unit_price);
    case 'stock-asc':
      return sortedProducts.sort((a, b) => a.current_stock - b.current_stock);
    case 'stock-desc':
      return sortedProducts.sort((a, b) => b.current_stock - a.current_stock);
    default:
      return sortedProducts;
  }
};

export const filterProducts = (
  products: Product[],
  searchQuery: string,
  filterBy: FilterOption,
  category: string | null
): Product[] => {
  return products.filter((product) => {
    // Aplicar filtro de búsqueda
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category || "").toLowerCase().includes(searchQuery.toLowerCase());

    // Aplicar filtro de categoría
    const matchesCategory = !category || product.category === category;

    // Aplicar filtro de stock
    let matchesStockFilter = true;
    switch (filterBy) {
      case 'low-stock':
        matchesStockFilter = product.current_stock > 0 && product.current_stock <= STOCK_THRESHOLD;
        break;
      case 'out-of-stock':
        matchesStockFilter = product.current_stock === 0;
        break;
      default:
        matchesStockFilter = true;
    }

    return matchesSearch && matchesCategory && matchesStockFilter;
  });
}; 