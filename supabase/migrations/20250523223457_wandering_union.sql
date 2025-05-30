-- PRODUCTS
-- ========================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  category TEXT, -- opcional: podrías usar tabla categories
  unit_price DECIMAL(10, 2) NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SUPPLIERS
-- ========================================
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- PURCHASES
-- ========================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  reference_number TEXT,
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid', -- opcional: tabla payment_status
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- PURCHASE ITEMS
-- ========================================
CREATE TABLE IF NOT EXISTS purchase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SALES
-- ========================================
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  reference_number TEXT,
  sale_date TIMESTAMPTZ DEFAULT NOW(),
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'cash', -- opcional: tabla payment_methods
  status TEXT DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SALE ITEMS
-- ========================================
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- FUNCTIONS PARA ACTUALIZAR STOCK
-- ========================================
CREATE OR REPLACE FUNCTION update_stock_on_purchase() RETURNS TRIGGER AS $$
BEGIN
  UPDATE products 
  SET 
    current_stock = current_stock + NEW.quantity,
    updated_at = NOW()
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_stock_on_sale() RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT current_stock FROM products WHERE id = NEW.product_id) < NEW.quantity THEN
    RAISE EXCEPTION 'Stock insuficiente para el producto %', NEW.product_id;
  END IF;

  UPDATE products 
  SET 
    current_stock = current_stock - NEW.quantity,
    updated_at = NOW()
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- TRIGGERS DE STOCK
-- ========================================
CREATE TRIGGER after_purchase_item_insert
AFTER INSERT ON purchase_items
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_purchase();

CREATE TRIGGER after_sale_item_insert
AFTER INSERT ON sale_items
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_sale();

-- ========================================
-- TRIGGER DE UPDATED_AT GENÉRICO
-- ========================================
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Agregar trigger de actualización en las tablas principales:
CREATE TRIGGER set_updated_at_products
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_suppliers
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_purchases
BEFORE UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_sales
BEFORE UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ========================================
-- RLS + POLÍTICAS MÁS SEGURAS
-- ========================================
-- Activar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS por acción

-- PRODUCTS
CREATE POLICY select_products ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_products ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY update_products ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY delete_products ON products FOR DELETE TO authenticated USING (false); -- opcional

-- SUPPLIERS
CREATE POLICY select_suppliers ON suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_suppliers ON suppliers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY update_suppliers ON suppliers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY delete_suppliers ON suppliers FOR DELETE TO authenticated USING (false);

-- PURCHASES
CREATE POLICY select_purchases ON purchases FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_purchases ON purchases FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY update_purchases ON purchases FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY delete_purchases ON purchases FOR DELETE TO authenticated USING (false);

-- PURCHASE ITEMS
CREATE POLICY select_purchase_items ON purchase_items FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_purchase_items ON purchase_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY update_purchase_items ON purchase_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY delete_purchase_items ON purchase_items FOR DELETE TO authenticated USING (false);

-- SALES
CREATE POLICY select_sales ON sales FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_sales ON sales FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY update_sales ON sales FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY delete_sales ON sales FOR DELETE TO authenticated USING (false);

-- SALE ITEMS
CREATE POLICY select_sale_items ON sale_items FOR SELECT TO authenticated USING (true);
CREATE POLICY insert_sale_items ON sale_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY update_sale_items ON sale_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY delete_sale_items ON sale_items FOR DELETE TO authenticated USING (false);

-- ========================================
-- FUNCIÓN PARA OBTENER PRODUCTOS CON BAJO STOCK
-- ========================================
CREATE OR REPLACE FUNCTION get_low_stock_products()
RETURNS TABLE (
  id UUID,
  name TEXT,
  current_stock INTEGER,
  min_stock_level INTEGER,
  unit_price DECIMAL,
  total_value DECIMAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.current_stock,
    p.min_stock_level,
    p.unit_price,
    (p.current_stock * p.unit_price)::DECIMAL AS total_value
  FROM products p
  WHERE p.current_stock <= p.min_stock_level
  ORDER BY (p.current_stock::FLOAT / NULLIF(p.min_stock_level, 0)) ASC;
END;
$$;