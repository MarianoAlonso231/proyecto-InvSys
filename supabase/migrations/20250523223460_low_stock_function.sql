-- Eliminar la función si existe
DROP FUNCTION IF EXISTS get_low_stock_products();

-- Crear la función
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

-- Otorgar permisos para ejecutar la función
GRANT EXECUTE ON FUNCTION get_low_stock_products() TO authenticated;

-- Crear una política para permitir el acceso a la función
CREATE POLICY "Permitir acceso a get_low_stock_products"
ON products FOR SELECT
TO authenticated
USING (true); 