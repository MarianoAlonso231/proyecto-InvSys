-- Eliminar funciones si existen
DROP FUNCTION IF EXISTS get_current_month_sales();
DROP FUNCTION IF EXISTS get_current_month_purchases();
DROP FUNCTION IF EXISTS get_total_inventory_value();
DROP FUNCTION IF EXISTS get_average_daily_sales();

-- Función para obtener las ventas del mes actual
CREATE OR REPLACE FUNCTION get_current_month_sales()
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(total_amount), 0)
    FROM sales
    WHERE DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', CURRENT_DATE)
  );
END;
$$;

-- Función para obtener las compras del mes actual
CREATE OR REPLACE FUNCTION get_current_month_purchases()
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(total_amount), 0)
    FROM purchases
    WHERE DATE_TRUNC('month', purchase_date) = DATE_TRUNC('month', CURRENT_DATE)
  );
END;
$$;

-- Función para obtener el valor total del inventario
CREATE OR REPLACE FUNCTION get_total_inventory_value()
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(current_stock * unit_price), 0)
    FROM products
  );
END;
$$;

-- Función para obtener el promedio de ventas diarias del mes actual
CREATE OR REPLACE FUNCTION get_average_daily_sales()
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_sales DECIMAL;
  days_in_month INTEGER;
BEGIN
  -- Obtener el total de ventas del mes
  SELECT COALESCE(SUM(total_amount), 0)
  INTO total_sales
  FROM sales
  WHERE DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', CURRENT_DATE);
  
  -- Calcular los días transcurridos en el mes actual
  days_in_month := EXTRACT(DAY FROM CURRENT_DATE);
  
  -- Retornar el promedio (evitar división por cero)
  RETURN CASE 
    WHEN days_in_month = 0 THEN 0
    ELSE total_sales / days_in_month
  END;
END;
$$;

-- Otorgar permisos para ejecutar las funciones
GRANT EXECUTE ON FUNCTION get_current_month_sales() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_month_purchases() TO authenticated;
GRANT EXECUTE ON FUNCTION get_total_inventory_value() TO authenticated;
GRANT EXECUTE ON FUNCTION get_average_daily_sales() TO authenticated;

-- Asegurar que las políticas necesarias existen
CREATE POLICY IF NOT EXISTS "Permitir lectura de ventas"
ON sales FOR SELECT
TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Permitir lectura de compras"
ON purchases FOR SELECT
TO authenticated
USING (true); 