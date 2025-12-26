-- Agregar nuevos campos a la tabla leads

-- Fecha de alta (fecha de carga del lead)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fecha_alta TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fechas de viaje (entrada y salida)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fecha_viaje_inicio DATE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fecha_viaje_fin DATE;

-- Mes de viaje (generado automáticamente desde fecha_viaje_inicio)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS mes_viaje VARCHAR(20);

-- Número de huéspedes
ALTER TABLE leads ADD COLUMN IF NOT EXISTS numero_huespedes INTEGER DEFAULT 1;

-- Tipo (NOMINA, INDIVIDUAL, HOSPEDAJE)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tipo VARCHAR(50);

-- Pousada (CONCEPT, B&B) - referencia a tabla posadas
ALTER TABLE leads ADD COLUMN IF NOT EXISTS pousada_id UUID REFERENCES posadas(id) ON DELETE SET NULL;

-- Habitación - referencia a tabla habitaciones
ALTER TABLE leads ADD COLUMN IF NOT EXISTS habitacion_id UUID REFERENCES habitaciones(id) ON DELETE SET NULL;

-- Fecha de venta (cierre de venta)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fecha_venta DATE;

-- Campos financieros
ALTER TABLE leads ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sena DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS saldo DECIMAL(10, 2) GENERATED ALWAYS AS (total - sena) STORED;

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_leads_fecha_alta ON leads(fecha_alta);
CREATE INDEX IF NOT EXISTS idx_leads_fecha_viaje_inicio ON leads(fecha_viaje_inicio);
CREATE INDEX IF NOT EXISTS idx_leads_mes_viaje ON leads(mes_viaje);
CREATE INDEX IF NOT EXISTS idx_leads_tipo ON leads(tipo);
CREATE INDEX IF NOT EXISTS idx_leads_pousada_id ON leads(pousada_id);
CREATE INDEX IF NOT EXISTS idx_leads_habitacion_id ON leads(habitacion_id);
CREATE INDEX IF NOT EXISTS idx_leads_fecha_venta ON leads(fecha_venta);

-- Comentarios para documentación
COMMENT ON COLUMN leads.fecha_alta IS 'Fecha de carga del lead (automática)';
COMMENT ON COLUMN leads.fecha_viaje_inicio IS 'Fecha de inicio del viaje (ida)';
COMMENT ON COLUMN leads.fecha_viaje_fin IS 'Fecha de fin del viaje (vuelta)';
COMMENT ON COLUMN leads.mes_viaje IS 'Mes del viaje basado en fecha de inicio';
COMMENT ON COLUMN leads.numero_huespedes IS 'Cantidad de personas que viajan';
COMMENT ON COLUMN leads.tipo IS 'Tipo de lead: NOMINA, INDIVIDUAL, HOSPEDAJE';
COMMENT ON COLUMN leads.pousada_id IS 'Referencia a la posada seleccionada';
COMMENT ON COLUMN leads.habitacion_id IS 'Referencia a la habitación seleccionada';
COMMENT ON COLUMN leads.fecha_venta IS 'Fecha de cierre de venta';
COMMENT ON COLUMN leads.total IS 'Monto total de la venta';
COMMENT ON COLUMN leads.sena IS 'Seña/Anticipo pagado';
COMMENT ON COLUMN leads.saldo IS 'Saldo pendiente (calculado automáticamente: total - seña)';
