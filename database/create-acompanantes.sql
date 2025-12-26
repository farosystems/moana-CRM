-- Tabla de Acompañantes
-- Un lead puede tener hasta 10 acompañantes

CREATE TABLE acompanantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  documento VARCHAR(100),
  email VARCHAR(255),
  telefono VARCHAR(50),
  direccion TEXT,
  edad INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_acompanantes_lead_id ON acompanantes(lead_id);
CREATE INDEX IF NOT EXISTS idx_acompanantes_nombre ON acompanantes(nombre);
CREATE INDEX IF NOT EXISTS idx_acompanantes_apellido ON acompanantes(apellido);

-- Comentarios para documentación
COMMENT ON TABLE acompanantes IS 'Acompañantes de un lead (máximo 10 por lead)';
COMMENT ON COLUMN acompanantes.lead_id IS 'Referencia al lead asociado';
COMMENT ON COLUMN acompanantes.nombre IS 'Nombre del acompañante';
COMMENT ON COLUMN acompanantes.apellido IS 'Apellido del acompañante';
COMMENT ON COLUMN acompanantes.documento IS 'Número de documento (DNI, pasaporte, etc.)';
COMMENT ON COLUMN acompanantes.email IS 'Correo electrónico del acompañante';
COMMENT ON COLUMN acompanantes.telefono IS 'Número de teléfono del acompañante';
COMMENT ON COLUMN acompanantes.direccion IS 'Dirección del acompañante';
COMMENT ON COLUMN acompanantes.edad IS 'Edad del acompañante';
