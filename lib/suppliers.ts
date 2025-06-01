import { supabase } from '@/lib/supabase/client';
import { Supplier, CreateSupplierDTO, UpdateSupplierDTO } from '@/types/suppliers';

export type SortOption = 
  | 'name-asc'
  | 'name-desc'
  | 'date-desc'
  | 'date-asc';

export type FilterOption = {
  searchQuery: string;
};

export const sortSuppliers = (suppliers: Supplier[], sortBy: SortOption): Supplier[] => {
  const sortedSuppliers = [...suppliers];

  switch (sortBy) {
    case 'name-asc':
      return sortedSuppliers.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedSuppliers.sort((a, b) => b.name.localeCompare(a.name));
    case 'date-desc':
      return sortedSuppliers.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case 'date-asc':
      return sortedSuppliers.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    default:
      return sortedSuppliers;
  }
};

export const filterSuppliers = (
  suppliers: Supplier[],
  filters: FilterOption
): Supplier[] => {
  const searchQuery = filters.searchQuery.toLowerCase();

  return suppliers.filter((supplier) => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchQuery) ||
      supplier.contact_person.toLowerCase().includes(searchQuery) ||
      supplier.email.toLowerCase().includes(searchQuery) ||
      supplier.phone.toLowerCase().includes(searchQuery) ||
      supplier.address.toLowerCase().includes(searchQuery) ||
      (supplier.notes || '').toLowerCase().includes(searchQuery);

    return matchesSearch;
  });
};

export const getSuppliers = async () => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener proveedores:', error);
    throw error;
  }

  return data as Supplier[];
};

export const getSupplierById = async (id: string) => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Supplier;
};

export const createSupplier = async (supplier: CreateSupplierDTO) => {
  const { data, error } = await supabase
    .from('suppliers')
    .insert(supplier)
    .select()
    .single();

  if (error) throw error;
  return data as Supplier;
};

export const updateSupplier = async (id: string, updates: UpdateSupplierDTO) => {
  const { data, error } = await supabase
    .from('suppliers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Supplier;
};

export const deleteSupplier = async (id: string) => {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}; 