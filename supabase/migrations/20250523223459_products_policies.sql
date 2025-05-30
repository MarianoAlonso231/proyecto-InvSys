-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Permitir SELECT para usuarios autenticados" ON products;
DROP POLICY IF EXISTS "Permitir INSERT para usuarios autenticados" ON products;
DROP POLICY IF EXISTS "Permitir UPDATE para usuarios autenticados" ON products;
DROP POLICY IF EXISTS "Permitir DELETE para usuarios autenticados" ON products;

-- Crear nuevas políticas
CREATE POLICY "Permitir SELECT para usuarios autenticados"
ON products FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir INSERT para usuarios autenticados"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir UPDATE para usuarios autenticados"
ON products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir DELETE para usuarios autenticados"
ON products FOR DELETE
TO authenticated
USING (true);

-- Asegurarse de que RLS está habilitado
ALTER TABLE products ENABLE ROW LEVEL SECURITY; 