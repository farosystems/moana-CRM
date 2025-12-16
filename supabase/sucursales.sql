-- ============================================
-- TABLA DE SUCURSALES
-- ============================================
-- Este script crea la tabla de sucursales y actualiza
-- las relaciones con la tabla de vendedores
-- ============================================

-- Tabla: sucursales
-- Descripción: Gestiona las diferentes sucursales/oficinas de la empresa
CREATE TABLE IF NOT EXISTS sucursales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para sucursales
CREATE INDEX idx_sucursales_codigo ON sucursales(codigo);
CREATE INDEX idx_sucursales_ciudad ON sucursales(ciudad);
CREATE INDEX idx_sucursales_pais ON sucursales(pais);
CREATE INDEX idx_sucursales_activo ON sucursales(activo);

-- Comentarios
COMMENT ON TABLE sucursales IS 'Tabla de sucursales/oficinas de la empresa';
COMMENT ON COLUMN sucursales.codigo IS 'Código único de identificación de la sucursal';
COMMENT ON COLUMN sucursales.activo IS 'Indica si la sucursal está activa';

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_sucursales_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sucursales_updated_at
    BEFORE UPDATE ON sucursales
    FOR EACH ROW
    EXECUTE FUNCTION update_sucursales_updated_at();

-- ============================================
-- ACTUALIZAR TABLA DE VENDEDORES
-- ============================================
-- Modificar la columna sucursal para que sea una relación FK

-- 1. Primero, agregar una nueva columna para el ID de sucursal
ALTER TABLE vendedores ADD COLUMN IF NOT EXISTS sucursal_id UUID;

-- 2. Crear FK constraint
ALTER TABLE vendedores
    ADD CONSTRAINT fk_vendedores_sucursal
    FOREIGN KEY (sucursal_id)
    REFERENCES sucursales(id)
    ON DELETE SET NULL;

-- 3. Crear índice para la FK
CREATE INDEX IF NOT EXISTS idx_vendedores_sucursal_id ON vendedores(sucursal_id);

-- Comentario actualizado
COMMENT ON COLUMN vendedores.sucursal_id IS 'ID de la sucursal a la que pertenece el vendedor';

-- ============================================
-- DATOS INICIALES DE EJEMPLO
-- ============================================

INSERT INTO sucursales (nombre, codigo, ciudad, pais, activo) VALUES
    ('Buenos Aires Centro', 'BSAS-CTR', 'Buenos Aires', 'Argentina', true),
    ('Córdoba', 'CBA', 'Córdoba', 'Argentina', true),
    ('Rosario', 'ROS', 'Rosario', 'Argentina', true),
    ('Mendoza', 'MDZ', 'Mendoza', 'Argentina', true),
    ('La Plata', 'LPL', 'La Plata', 'Argentina', true),
    ('Online', 'ONLINE', NULL, NULL, true)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE sucursales ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer sucursales activas
CREATE POLICY "Permitir lectura de sucursales activas" ON sucursales
    FOR SELECT
    USING (activo = true);

-- Política: Solo usuarios autenticados pueden insertar
CREATE POLICY "Permitir inserción de sucursales" ON sucursales
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Política: Solo usuarios autenticados pueden actualizar
CREATE POLICY "Permitir actualización de sucursales" ON sucursales
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Política: Solo usuarios autenticados pueden eliminar (soft delete)
CREATE POLICY "Permitir eliminación de sucursales" ON sucursales
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- ============================================
-- VISTA PARA CONSULTAS
-- ============================================

CREATE OR REPLACE VIEW vista_vendedores_con_sucursal AS
SELECT
    v.id,
    v.nombre,
    v.apellido,
    v.email,
    v.whatsapp,
    v.sucursal as sucursal_nombre_legacy, -- Mantener compatibilidad
    v.sucursal_id,
    s.nombre as sucursal_nombre,
    s.codigo as sucursal_codigo,
    s.ciudad as sucursal_ciudad,
    s.pais as sucursal_pais,
    v.activo,
    v.created_at,
    v.updated_at
FROM vendedores v
LEFT JOIN sucursales s ON v.sucursal_id = s.id
WHERE v.activo = true;

COMMENT ON VIEW vista_vendedores_con_sucursal IS 'Vista de vendedores con información completa de su sucursal';
