-- ============================================
-- CRM MOANA - SCHEMA DE BASE DE DATOS
-- ============================================
-- Este archivo contiene todas las tablas, constraints, índices y funciones
-- necesarias para el CRM de turismo
-- ============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- Tabla: vendedores
-- Descripción: Gestiona el equipo de ventas de la empresa
CREATE TABLE vendedores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    whatsapp VARCHAR(20),
    sucursal VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para vendedores
CREATE INDEX idx_vendedores_email ON vendedores(email);
CREATE INDEX idx_vendedores_sucursal ON vendedores(sucursal);
CREATE INDEX idx_vendedores_activo ON vendedores(activo);

-- Comentarios
COMMENT ON TABLE vendedores IS 'Tabla de vendedores/agentes de la empresa';
COMMENT ON COLUMN vendedores.activo IS 'Indica si el vendedor está activo en el sistema';

-- ============================================

-- Tabla: paquetes
-- Descripción: Paquetes turísticos disponibles
CREATE TABLE paquetes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    destino VARCHAR(200) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    cupos INTEGER NOT NULL DEFAULT 0,
    cupos_disponibles INTEGER NOT NULL DEFAULT 0,
    precio_adulto DECIMAL(10, 2) NOT NULL,
    precio_menor DECIMAL(10, 2),
    moneda VARCHAR(3) DEFAULT 'USD',
    tarifa VARCHAR(50),
    servicios TEXT,
    politicas TEXT,
    imagen VARCHAR(500),
    notas TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_cupos CHECK (cupos >= 0),
    CONSTRAINT check_cupos_disponibles CHECK (cupos_disponibles >= 0 AND cupos_disponibles <= cupos),
    CONSTRAINT check_precios CHECK (precio_adulto >= 0 AND (precio_menor IS NULL OR precio_menor >= 0)),
    CONSTRAINT check_fechas CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

-- Índices para paquetes
CREATE INDEX idx_paquetes_destino ON paquetes(destino);
CREATE INDEX idx_paquetes_activo ON paquetes(activo);
CREATE INDEX idx_paquetes_fechas ON paquetes(fecha_inicio, fecha_fin);
CREATE INDEX idx_paquetes_cupos ON paquetes(cupos_disponibles) WHERE cupos_disponibles > 0;

-- Comentarios
COMMENT ON TABLE paquetes IS 'Paquetes turísticos ofrecidos por la empresa';
COMMENT ON COLUMN paquetes.cupos_disponibles IS 'Cupos disponibles actuales (se actualiza con reservas)';

-- ============================================

-- Tabla: clientes
-- Descripción: Base de datos de clientes convertidos
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    telefono VARCHAR(20),
    whatsapp VARCHAR(20),
    tipo_cliente VARCHAR(50), -- 'empresa', 'particular', etc.
    documento_id VARCHAR(50),
    tipo_documento VARCHAR(20), -- 'nif', 'dni', 'pasaporte', etc.
    destinos_preferidos TEXT,
    tipo_viajes TEXT[], -- Array de preferencias de viaje
    presupuesto_promedio VARCHAR(50), -- 'bajo', 'medio', 'alto'
    frecuencia_viajes VARCHAR(50), -- 'mensual', 'trimestral', 'anual', etc.
    total_leads INTEGER DEFAULT 0,
    fecha_conversion DATE NOT NULL DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_total_leads CHECK (total_leads >= 0)
);

-- Índices para clientes
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_clientes_pais ON clientes(pais);
CREATE INDEX idx_clientes_ciudad ON clientes(ciudad);
CREATE INDEX idx_clientes_tipo ON clientes(tipo_cliente);
CREATE INDEX idx_clientes_activo ON clientes(activo);

-- Comentarios
COMMENT ON TABLE clientes IS 'Clientes que han sido convertidos desde leads';
COMMENT ON COLUMN clientes.total_leads IS 'Cantidad total de leads asociados a este cliente';

-- ============================================

-- Tabla: leads
-- Descripción: Leads en proceso de gestión
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    pais VARCHAR(100),
    ciudad VARCHAR(100),
    tipo_consulta VARCHAR(100) NOT NULL, -- 'Paquete turístico', 'Hotel', 'Vuelo', etc.
    origen VARCHAR(50) NOT NULL, -- 'Web', 'Instagram', 'WhatsApp', 'Facebook', etc.
    estado VARCHAR(50) DEFAULT 'Nuevo', -- 'Nuevo', 'En gestión', 'Cotizado', 'Cerrado ganado', 'Cerrado perdido'
    vendedor_asignado_id UUID REFERENCES vendedores(id) ON DELETE SET NULL,
    paquete_sugerido_id UUID REFERENCES paquetes(id) ON DELETE SET NULL,
    notas_internas TEXT,
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_ultima_interaccion TIMESTAMP WITH TIME ZONE,
    convertido BOOLEAN DEFAULT false,
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    fecha_conversion TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para leads
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_estado ON leads(estado);
CREATE INDEX idx_leads_origen ON leads(origen);
CREATE INDEX idx_leads_vendedor ON leads(vendedor_asignado_id);
CREATE INDEX idx_leads_convertido ON leads(convertido);
CREATE INDEX idx_leads_cliente ON leads(cliente_id);
CREATE INDEX idx_leads_fecha_ingreso ON leads(fecha_ingreso DESC);
CREATE INDEX idx_leads_nombre_apellido ON leads(nombre, apellido);

-- Comentarios
COMMENT ON TABLE leads IS 'Leads en proceso de gestión y conversión';
COMMENT ON COLUMN leads.convertido IS 'Indica si el lead fue convertido a cliente';
COMMENT ON COLUMN leads.fecha_conversion IS 'Fecha en que el lead fue convertido a cliente';

-- ============================================

-- Tabla: historial_clientes
-- Descripción: Historial de eventos de clientes
CREATE TABLE historial_clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    evento TEXT NOT NULL,
    descripcion TEXT,
    usuario VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para historial_clientes
CREATE INDEX idx_historial_clientes_cliente ON historial_clientes(cliente_id, created_at DESC);

-- Comentarios
COMMENT ON TABLE historial_clientes IS 'Registro de eventos y actividades de clientes';

-- ============================================

-- Tabla: historial_leads
-- Descripción: Historial de interacciones con leads
CREATE TABLE historial_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    accion TEXT NOT NULL,
    descripcion TEXT,
    usuario VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para historial_leads
CREATE INDEX idx_historial_leads_lead ON historial_leads(lead_id, created_at DESC);

-- Comentarios
COMMENT ON TABLE historial_leads IS 'Registro de interacciones y seguimiento de leads';

-- ============================================

-- Tabla: reglas_asignacion
-- Descripción: Reglas automáticas de asignación de leads
CREATE TABLE reglas_asignacion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    condicion_campo VARCHAR(50) NOT NULL, -- 'origen', 'pais', 'tipo_consulta', etc.
    condicion_valor VARCHAR(100) NOT NULL,
    vendedor_id UUID NOT NULL REFERENCES vendedores(id) ON DELETE CASCADE,
    prioridad INTEGER DEFAULT 0,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para reglas_asignacion
CREATE INDEX idx_reglas_activas ON reglas_asignacion(activa, prioridad DESC);
CREATE INDEX idx_reglas_vendedor ON reglas_asignacion(vendedor_id);

-- Comentarios
COMMENT ON TABLE reglas_asignacion IS 'Reglas para asignación automática de leads a vendedores';
COMMENT ON COLUMN reglas_asignacion.prioridad IS 'Mayor número = mayor prioridad';

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función: actualizar updated_at
-- Descripción: Actualiza automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_vendedores_updated_at BEFORE UPDATE ON vendedores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paquetes_updated_at BEFORE UPDATE ON paquetes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reglas_updated_at BEFORE UPDATE ON reglas_asignacion
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================

-- Función: actualizar_total_leads_cliente
-- Descripción: Actualiza el contador de leads cuando se convierte un lead
CREATE OR REPLACE FUNCTION actualizar_total_leads_cliente()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.convertido = true AND NEW.cliente_id IS NOT NULL THEN
        UPDATE clientes
        SET total_leads = total_leads + 1
        WHERE id = NEW.cliente_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_total_leads
    AFTER UPDATE ON leads
    FOR EACH ROW
    WHEN (OLD.convertido = false AND NEW.convertido = true)
    EXECUTE FUNCTION actualizar_total_leads_cliente();

-- ============================================

-- Función: registrar_historial_lead_automatico
-- Descripción: Registra automáticamente eventos importantes en el historial
CREATE OR REPLACE FUNCTION registrar_historial_lead_automatico()
RETURNS TRIGGER AS $$
BEGIN
    -- Registro de creación
    IF TG_OP = 'INSERT' THEN
        INSERT INTO historial_leads (lead_id, accion, usuario)
        VALUES (NEW.id, 'Lead creado desde ' || NEW.origen, 'Sistema');
    END IF;

    -- Registro de cambio de estado
    IF TG_OP = 'UPDATE' AND OLD.estado != NEW.estado THEN
        INSERT INTO historial_leads (lead_id, accion, usuario)
        VALUES (NEW.id, 'Estado cambiado de ' || OLD.estado || ' a ' || NEW.estado, 'Sistema');
    END IF;

    -- Registro de asignación de vendedor
    IF TG_OP = 'UPDATE' AND (OLD.vendedor_asignado_id IS NULL OR OLD.vendedor_asignado_id != NEW.vendedor_asignado_id) AND NEW.vendedor_asignado_id IS NOT NULL THEN
        INSERT INTO historial_leads (lead_id, accion, usuario)
        VALUES (NEW.id, 'Lead asignado a vendedor', 'Sistema');
    END IF;

    -- Registro de conversión
    IF TG_OP = 'UPDATE' AND OLD.convertido = false AND NEW.convertido = true THEN
        INSERT INTO historial_leads (lead_id, accion, usuario)
        VALUES (NEW.id, 'Lead convertido a cliente', 'Sistema');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_historial_lead_auto
    AFTER INSERT OR UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION registrar_historial_lead_automatico();

-- ============================================

-- Función: registrar_historial_cliente_automatico
-- Descripción: Registra automáticamente eventos importantes en el historial de clientes
CREATE OR REPLACE FUNCTION registrar_historial_cliente_automatico()
RETURNS TRIGGER AS $$
BEGIN
    -- Registro de creación
    IF TG_OP = 'INSERT' THEN
        INSERT INTO historial_clientes (cliente_id, evento, usuario)
        VALUES (NEW.id, 'Cliente creado', 'Sistema');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_historial_cliente_auto
    AFTER INSERT ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION registrar_historial_cliente_automatico();

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: leads_con_vendedor
-- Descripción: Leads con información completa del vendedor
CREATE OR REPLACE VIEW leads_con_vendedor AS
SELECT
    l.*,
    v.nombre || ' ' || v.apellido AS vendedor_nombre,
    v.email AS vendedor_email,
    v.sucursal AS vendedor_sucursal
FROM leads l
LEFT JOIN vendedores v ON l.vendedor_asignado_id = v.id;

COMMENT ON VIEW leads_con_vendedor IS 'Vista con leads y datos completos del vendedor asignado';

-- ============================================

-- Vista: estadisticas_vendedores
-- Descripción: Estadísticas de desempeño por vendedor
CREATE OR REPLACE VIEW estadisticas_vendedores AS
SELECT
    v.id,
    v.nombre,
    v.apellido,
    v.sucursal,
    COUNT(l.id) AS total_leads,
    COUNT(CASE WHEN l.estado = 'Nuevo' THEN 1 END) AS leads_nuevos,
    COUNT(CASE WHEN l.estado = 'En gestión' THEN 1 END) AS leads_en_gestion,
    COUNT(CASE WHEN l.estado = 'Cotizado' THEN 1 END) AS leads_cotizados,
    COUNT(CASE WHEN l.convertido = true THEN 1 END) AS leads_convertidos,
    ROUND(
        CASE
            WHEN COUNT(l.id) > 0
            THEN (COUNT(CASE WHEN l.convertido = true THEN 1 END)::DECIMAL / COUNT(l.id) * 100)
            ELSE 0
        END, 2
    ) AS tasa_conversion
FROM vendedores v
LEFT JOIN leads l ON v.id = l.vendedor_asignado_id
WHERE v.activo = true
GROUP BY v.id, v.nombre, v.apellido, v.sucursal;

COMMENT ON VIEW estadisticas_vendedores IS 'Estadísticas de desempeño y conversión por vendedor';

-- ============================================

-- Vista: pipeline_ventas
-- Descripción: Estado del pipeline de ventas
CREATE OR REPLACE VIEW pipeline_ventas AS
SELECT
    estado,
    COUNT(*) AS cantidad,
    COUNT(CASE WHEN fecha_ingreso >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) AS nuevos_esta_semana,
    COUNT(CASE WHEN fecha_ingreso >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS nuevos_este_mes
FROM leads
WHERE convertido = false
GROUP BY estado;

COMMENT ON VIEW pipeline_ventas IS 'Vista consolidada del pipeline de ventas por estado';

-- ============================================
-- DATOS INICIALES (OPCIONAL)
-- ============================================

-- Insertar vendedores de ejemplo (comentado por defecto)
/*
INSERT INTO vendedores (nombre, apellido, email, whatsapp, sucursal) VALUES
('Carlos', 'González', 'carlos@moana.com', '+34612345678', 'Buenos Aires'),
('María', 'López', 'maria@moana.com', '+34623456789', 'Córdoba'),
('Juan', 'Rodríguez', 'juan@moana.com', '+34634567890', 'Rosario');
*/

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS - Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE vendedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE paquetes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reglas_asignacion ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades de autenticación)
-- Por ahora, permitir todo para usuarios autenticados

CREATE POLICY "Permitir lectura a usuarios autenticados" ON vendedores
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir escritura a usuarios autenticados" ON vendedores
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir lectura a usuarios autenticados" ON paquetes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir escritura a usuarios autenticados" ON paquetes
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir lectura a usuarios autenticados" ON clientes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir escritura a usuarios autenticados" ON clientes
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir lectura a usuarios autenticados" ON leads
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir escritura a usuarios autenticados" ON leads
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir lectura a usuarios autenticados" ON historial_clientes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir escritura a usuarios autenticados" ON historial_clientes
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir lectura a usuarios autenticados" ON historial_leads
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir escritura a usuarios autenticados" ON historial_leads
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir lectura a usuarios autenticados" ON reglas_asignacion
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir escritura a usuarios autenticados" ON reglas_asignacion
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- FIN DEL SCHEMA
-- ============================================
