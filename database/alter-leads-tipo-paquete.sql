-- Agregar campo tipo_paquete_seleccionado a la tabla leads
-- Almacena qué tipo de paquete eligió el cliente (Solo Vuelo, Solo Hospedaje, o Vuelo + Hospedaje)

ALTER TABLE leads ADD COLUMN IF NOT EXISTS tipo_paquete_seleccionado UUID REFERENCES tipos_de_paquete(id) ON DELETE SET NULL;

-- Índice para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_leads_tipo_paquete ON leads(tipo_paquete_seleccionado);

-- Comentario para documentación
COMMENT ON COLUMN leads.tipo_paquete_seleccionado IS 'Tipo de paquete seleccionado por el cliente (Solo Vuelo, Solo Hospedaje, o Vuelo + Hospedaje)';
