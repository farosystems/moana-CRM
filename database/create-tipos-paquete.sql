-- Tabla de Tipos de Paquete
-- Define los tipos de paquetes turísticos disponibles

CREATE TABLE tipos_de_paquete (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar los 3 tipos predefinidos
INSERT INTO tipos_de_paquete (nombre, descripcion) VALUES
  ('Solo Vuelo', 'Paquete que incluye únicamente el vuelo/pasaje hacia el destino'),
  ('Solo Hospedaje', 'Paquete que incluye únicamente el hospedaje en el hotel, sin vuelo'),
  ('Vuelo + Hospedaje', 'Paquete completo que incluye tanto el vuelo como el hospedaje');

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_tipos_paquete_nombre ON tipos_de_paquete(nombre);

-- Comentarios para documentación
COMMENT ON TABLE tipos_de_paquete IS 'Tipos de paquetes turísticos disponibles (Solo Vuelo, Solo Hospedaje, Vuelo + Hospedaje)';
COMMENT ON COLUMN tipos_de_paquete.nombre IS 'Nombre del tipo de paquete';
COMMENT ON COLUMN tipos_de_paquete.descripcion IS 'Descripción del tipo de paquete';
