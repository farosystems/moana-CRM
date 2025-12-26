-- Tabla de Posadas
CREATE TABLE posadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  ubicacion VARCHAR(255),
  estrellas INTEGER CHECK (estrellas >= 1 AND estrellas <= 5),
  telefono VARCHAR(50),
  email VARCHAR(255),
  precio_referencia DECIMAL(10, 2),
  activo BOOLEAN DEFAULT true,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Habitaciones
CREATE TABLE habitaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  tipo_habitacion VARCHAR(100), -- Simple, Doble, Triple, Suite, etc.
  capacidad INTEGER NOT NULL,
  precio_por_noche DECIMAL(10, 2),
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_posadas_nombre ON posadas(nombre);
CREATE INDEX idx_posadas_activo ON posadas(activo);
CREATE INDEX idx_habitaciones_nombre ON habitaciones(nombre);
CREATE INDEX idx_habitaciones_tipo ON habitaciones(tipo_habitacion);
CREATE INDEX idx_habitaciones_activo ON habitaciones(activo);

-- Políticas RLS (Row Level Security)
ALTER TABLE posadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE habitaciones ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos los usuarios autenticados
CREATE POLICY "Allow read access to all authenticated users" ON posadas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to all authenticated users" ON habitaciones
  FOR SELECT TO authenticated USING (true);

-- Política para permitir inserción a usuarios autenticados
CREATE POLICY "Allow insert access to authenticated users" ON posadas
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow insert access to authenticated users" ON habitaciones
  FOR INSERT TO authenticated WITH CHECK (true);

-- Política para permitir actualización a usuarios autenticados
CREATE POLICY "Allow update access to authenticated users" ON posadas
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow update access to authenticated users" ON habitaciones
  FOR UPDATE TO authenticated USING (true);

-- Política para permitir eliminación a usuarios autenticados
CREATE POLICY "Allow delete access to authenticated users" ON posadas
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow delete access to authenticated users" ON habitaciones
  FOR DELETE TO authenticated USING (true);
