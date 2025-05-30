-- Función para obtener el resumen de ventas
CREATE OR REPLACE FUNCTION get_sales_summary(start_date DATE, end_date DATE)
RETURNS TABLE (
  total_sales DECIMAL(10, 2),
  total_items INTEGER,
  average_sale DECIMAL(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(total_amount), 0) as total_sales,
    COALESCE(SUM(si.quantity), 0) as total_items,
    COALESCE(AVG(total_amount), 0) as average_sale
  FROM sales s
  LEFT JOIN sale_items si ON s.id = si.sale_id
  WHERE s.sale_date BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener los productos más vendidos
CREATE OR REPLACE FUNCTION get_top_selling_products(start_date DATE, end_date DATE, limit_count INTEGER)
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  quantity INTEGER,
  total_amount DECIMAL(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    SUM(si.quantity)::INTEGER as quantity,
    SUM(si.total_price) as total_amount
  FROM products p
  JOIN sale_items si ON p.id = si.product_id
  JOIN sales s ON si.sale_id = s.id
  WHERE s.sale_date BETWEEN start_date AND end_date
  GROUP BY p.id, p.name
  ORDER BY quantity DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener el resumen de compras
CREATE OR REPLACE FUNCTION get_purchases_summary(start_date DATE, end_date DATE)
RETURNS TABLE (
  total_purchases DECIMAL(10, 2),
  total_items INTEGER,
  average_purchase DECIMAL(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(total_amount), 0) as total_purchases,
    COALESCE(SUM(pi.quantity), 0) as total_items,
    COALESCE(AVG(total_amount), 0) as average_purchase
  FROM purchases p
  LEFT JOIN purchase_items pi ON p.id = pi.purchase_id
  WHERE p.purchase_date BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener los principales proveedores
CREATE OR REPLACE FUNCTION get_top_suppliers(start_date DATE, end_date DATE, limit_count INTEGER)
RETURNS TABLE (
  supplier_id UUID,
  supplier_name TEXT,
  total_purchases INTEGER,
  total_amount DECIMAL(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    COUNT(DISTINCT p.id)::INTEGER as total_purchases,
    SUM(p.total_amount) as total_amount
  FROM suppliers s
  JOIN purchases p ON s.id = p.supplier_id
  WHERE p.purchase_date BETWEEN start_date AND end_date
  GROUP BY s.id, s.name
  ORDER BY total_amount DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener el resumen del inventario
CREATE OR REPLACE FUNCTION get_inventory_summary()
RETURNS TABLE (
  total_products INTEGER,
  total_value DECIMAL(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_products,
    COALESCE(SUM(current_stock * unit_price), 0) as total_value
  FROM products;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener productos con bajo stock
CREATE OR REPLACE FUNCTION get_low_stock_products()
RETURNS TABLE (
  id UUID,
  name TEXT,
  current_stock INTEGER,
  min_stock_level INTEGER,
  unit_price DECIMAL(10, 2),
  total_value DECIMAL(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.current_stock,
    p.min_stock_level,
    p.unit_price,
    (p.current_stock * p.unit_price) as total_value
  FROM products p
  WHERE p.current_stock <= p.min_stock_level AND p.current_stock > 0
  ORDER BY p.current_stock ASC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener productos sin stock
CREATE OR REPLACE FUNCTION get_out_of_stock_products()
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  min_stock_level INTEGER,
  last_purchase_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.min_stock_level,
    MAX(pu.purchase_date) as last_purchase_date
  FROM products p
  LEFT JOIN purchase_items pi ON p.id = pi.product_id
  LEFT JOIN purchases pu ON pi.purchase_id = pu.id
  WHERE p.current_stock = 0
  GROUP BY p.id, p.name, p.min_stock_level
  ORDER BY last_purchase_date DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener ventas mensuales
CREATE OR REPLACE FUNCTION get_monthly_sales(target_year INTEGER)
RETURNS TABLE (
  month TEXT,
  sales NUMERIC,
  target NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH months AS (
    SELECT TO_CHAR(DATE_TRUNC('month', d), 'Mon') as month,
           DATE_TRUNC('month', d) as date_month
    FROM GENERATE_SERIES(
      DATE_TRUNC('year', MAKE_DATE(target_year, 1, 1)),
      DATE_TRUNC('month', MAKE_DATE(target_year, 12, 1)),
      '1 month'::INTERVAL
    ) d
  )
  SELECT 
    m.month,
    COALESCE(SUM(s.total_amount), 0)::NUMERIC as sales,
    CASE 
      WHEN EXTRACT(MONTH FROM m.date_month) <= 3 THEN 4500
      WHEN EXTRACT(MONTH FROM m.date_month) <= 6 THEN 6000
      WHEN EXTRACT(MONTH FROM m.date_month) <= 9 THEN 7500
      ELSE 9000
    END::NUMERIC as target
  FROM months m
  LEFT JOIN sales s ON 
    DATE_TRUNC('month', s.sale_date) = m.date_month
  GROUP BY m.month, m.date_month
  ORDER BY m.date_month;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener compras mensuales
CREATE OR REPLACE FUNCTION get_monthly_purchases(target_year INTEGER)
RETURNS TABLE (
  month TEXT,
  purchases NUMERIC,
  budget NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH months AS (
    SELECT TO_CHAR(DATE_TRUNC('month', d), 'Mon') as month,
           DATE_TRUNC('month', d) as date_month
    FROM GENERATE_SERIES(
      DATE_TRUNC('year', MAKE_DATE(target_year, 1, 1)),
      DATE_TRUNC('month', MAKE_DATE(target_year, 12, 1)),
      '1 month'::INTERVAL
    ) d
  )
  SELECT 
    m.month,
    COALESCE(SUM(p.total_amount), 0)::NUMERIC as purchases,
    CASE 
      WHEN EXTRACT(MONTH FROM m.date_month) <= 3 THEN 3500
      WHEN EXTRACT(MONTH FROM m.date_month) <= 6 THEN 5000
      WHEN EXTRACT(MONTH FROM m.date_month) <= 9 THEN 6500
      ELSE 8000
    END::NUMERIC as budget
  FROM months m
  LEFT JOIN purchases p ON 
    DATE_TRUNC('month', p.purchase_date) = m.date_month
  GROUP BY m.month, m.date_month
  ORDER BY m.date_month;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener el valor del inventario mensual
CREATE OR REPLACE FUNCTION get_monthly_inventory_value(target_year INTEGER)
RETURNS TABLE (
  month TEXT,
  value NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH months AS (
    SELECT TO_CHAR(DATE_TRUNC('month', d), 'Mon') as month,
           DATE_TRUNC('month', d) as date_month
    FROM GENERATE_SERIES(
      DATE_TRUNC('year', MAKE_DATE(target_year, 1, 1)),
      DATE_TRUNC('month', MAKE_DATE(target_year, 12, 1)),
      '1 month'::INTERVAL
    ) d
  )
  SELECT 
    m.month,
    COALESCE(SUM(p.current_stock * p.unit_price), 0)::NUMERIC as value
  FROM months m
  CROSS JOIN products p
  GROUP BY m.month, m.date_month
  ORDER BY m.date_month;
END;
$$ LANGUAGE plpgsql; 