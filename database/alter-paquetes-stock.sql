-- Agregar campos de stock a la tabla paquetes
-- stock_vuelos: cantidad de asientos disponibles para vuelos
-- stock_hospedaje: cantidad de camas/habitaciones disponibles para hospedaje

ALTER TABLE paquetes ADD COLUMN IF NOT EXISTS stock_vuelos INTEGER DEFAULT 0;
ALTER TABLE paquetes ADD COLUMN IF NOT EXISTS stock_hospedaje INTEGER DEFAULT 0;

-- Índices para mejorar rendimiento en consultas de stock
CREATE INDEX IF NOT EXISTS idx_paquetes_stock_vuelos ON paquetes(stock_vuelos);
CREATE INDEX IF NOT EXISTS idx_paquetes_stock_hospedaje ON paquetes(stock_hospedaje);

-- Comentarios para documentación
COMMENT ON COLUMN paquetes.stock_vuelos IS 'Cantidad de asientos/pasajes disponibles para vuelos';
COMMENT ON COLUMN paquetes.stock_hospedaje IS 'Cantidad de camas/habitaciones disponibles para hospedaje';
