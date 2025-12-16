# 🚀 CRM MOANA - Integración con Supabase

## Estado: ✅ COMPLETADO

Este CRM ahora está completamente integrado con Supabase y listo para usar con datos reales.

## 🎯 ¿Qué se Hizo?

### 1. Base de Datos (PostgreSQL via Supabase)
- ✅ **7 tablas** creadas con todas las relaciones
- ✅ **Triggers automáticos** para historial y contadores
- ✅ **3 vistas** para estadísticas
- ✅ **Seguridad RLS** configurada

### 2. Código Refactorizado
- ✅ **4 módulos** migrados a Supabase:
  - Vendedores
  - Paquetes
  - Clientes
  - Leads
- ✅ **CRUD completo** funcional en todos
- ✅ **Estados de loading/error** en todas las vistas
- ✅ **TypeScript completamente tipado**

### 3. Funcionalidades
- ✅ Crear, editar y eliminar en todas las tablas
- ✅ Convertir leads a clientes
- ✅ Importar clientes desde Excel
- ✅ Historial automático de eventos
- ✅ Búsqueda y filtrado

## 🚀 Inicio Rápido

### Paso 1: Instalar Dependencias
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Paso 2: Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta el schema:
   - Ve a SQL Editor en Supabase
   - Copia y pega el contenido de `supabase/schema.sql`
   - Click en **Run**

### Paso 3: Configurar Variables de Entorno

```bash
# Copia el template
cp .env.local.example .env.local

# Edita .env.local con tus credenciales de Supabase
```

Tu `.env.local` debe contener:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-aqui
```

### Paso 4: Insertar Datos de Prueba (Opcional)

```sql
-- Ejecuta esto en SQL Editor de Supabase

INSERT INTO vendedores (nombre, apellido, email, whatsapp, sucursal) VALUES
('Carlos', 'González', 'carlos@moana.com', '+34612345678', 'Buenos Aires'),
('María', 'López', 'maria@moana.com', '+34623456789', 'Córdoba');

INSERT INTO paquetes (nombre, destino, cupos, cupos_disponibles, precio_adulto, precio_menor, moneda) VALUES
('Caribbean Paradise', 'Bahamas', 10, 8, 2500.00, 1800.00, 'USD'),
('European Tour', 'Europa', 12, 12, 3200.00, 2400.00, 'EUR');
```

### Paso 5: Iniciar la Aplicación

```bash
npm run dev
```

¡Listo! Tu CRM ya está conectado a Supabase 🎉

## 📁 Estructura de Archivos

```
CRM-MOANA/
├── supabase/
│   ├── schema.sql              # Schema completo de la BD
│   └── README.md               # Documentación técnica
├── lib/
│   └── supabase/
│       ├── client.ts           # Cliente Supabase (browser)
│       ├── server.ts           # Cliente Supabase (server)
│       └── queries.ts          # Funciones helper (CRUD)
├── types/
│   ├── database.types.ts       # Tipos de Supabase
│   └── index.ts                # Tipos de la aplicación
├── components/modules/
│   ├── vendedores/
│   │   └── vendedores-module.tsx  # ✅ Usa Supabase
│   ├── paquetes/
│   │   └── paquetes-module.tsx    # ✅ Usa Supabase
│   ├── clientes/
│   │   └── clientes-module.tsx    # ✅ Usa Supabase
│   └── leads/
│       └── leads-module.tsx        # ✅ Usa Supabase
└── .env.local                  # Tus credenciales (crear)
```

## 🛠️ Funciones Disponibles

### Vendedores
```typescript
import { vendedoresQueries } from '@/lib/supabase/queries'

// Obtener todos
const vendedores = await vendedoresQueries.getAll()

// Crear
const nuevo = await vendedoresQueries.create({ nombre, apellido, email, ... })

// Actualizar
const updated = await vendedoresQueries.update(id, { nombre: "Nuevo" })

// Eliminar
await vendedoresQueries.delete(id)

// Estadísticas
const stats = await vendedoresQueries.getEstadisticas()
```

### Paquetes
```typescript
import { paquetesQueries } from '@/lib/supabase/queries'

const paquetes = await paquetesQueries.getAll()
const disponibles = await paquetesQueries.getDisponibles()
```

### Clientes
```typescript
import { clientesQueries } from '@/lib/supabase/queries'

const clientes = await clientesQueries.getAll()
const cliente = await clientesQueries.getById(id) // incluye historial
await clientesQueries.addHistorial(id, "Evento nuevo")
```

### Leads
```typescript
import { leadsQueries } from '@/lib/supabase/queries'

const leads = await leadsQueries.getAll()
const pipeline = await leadsQueries.getPipeline()
await leadsQueries.convertir(leadId, clienteId) // Convertir a cliente
await leadsQueries.addHistorial(leadId, "Acción realizada")
```

## 🎨 Características del Sistema

### Automático (via Triggers de BD)
- ✅ Timestamps se actualizan solos
- ✅ Contador de leads se actualiza al convertir
- ✅ Historial se registra automáticamente

### Manual (via Código)
- ✅ CRUD completo
- ✅ Conversión de leads
- ✅ Importación masiva
- ✅ Búsqueda y filtrado

## 📊 Base de Datos

### Tablas
- `vendedores` - Equipo de ventas
- `paquetes` - Paquetes turísticos
- `clientes` - Clientes convertidos
- `leads` - Leads en proceso
- `historial_clientes` - Eventos de clientes
- `historial_leads` - Eventos de leads
- `reglas_asignacion` - Reglas automáticas

### Vistas
- `leads_con_vendedor` - Leads con info del vendedor
- `estadisticas_vendedores` - Métricas por vendedor
- `pipeline_ventas` - Estado del pipeline

## 🔒 Seguridad

- ✅ Row Level Security habilitado
- ✅ Solo usuarios autenticados acceden
- ✅ Validaciones a nivel de BD

## 📚 Documentación Completa

- `SUPABASE_SETUP.md` - Guía paso a paso detallada
- `supabase/README.md` - Documentación técnica
- `MIGRATION_SUMMARY.md` - Resumen de la migración
- `IMPLEMENTATION_GUIDE.md` - Guía de implementación

## ❓ Problemas Comunes

### "relation does not exist"
➡️ Ejecuta el schema SQL completo en Supabase

### "Invalid API key"
➡️ Verifica las credenciales en `.env.local`

### No se cargan datos
➡️ Inserta datos de prueba con el SQL del Paso 4

### Error de tipos TypeScript
➡️ Los tipos están en `/types`, importa desde ahí

## 🎉 Resultado

Tu CRM ahora:
- ✅ Usa una base de datos real
- ✅ Tiene persistencia de datos
- ✅ Registra todo el historial
- ✅ Está listo para producción

**¡A usar el CRM!** 🚀
