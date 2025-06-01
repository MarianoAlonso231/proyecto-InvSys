export type Supplier = {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type CreateSupplierDTO = Omit<Supplier, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSupplierDTO = Partial<CreateSupplierDTO>; 