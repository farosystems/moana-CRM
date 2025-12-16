# Configuración de Supabase para CRM MOANA

Este documento explica cómo configurar la base de datos de Supabase para el CRM MOANA.

## 📋 Requisitos Previos

1. Una cuenta en [Supabase](https://supabase.com)
2. Un proyecto creado en Supabase
3. Node.js y npm instalados

## 🚀 Configuración Inicial

### 1. Crear Proyecto en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Anota las siguientes credenciales:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon/Public Key**: La clave pública de tu proyecto

### 2. Ejecutar el Schema de Base de Datos

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Abre el archivo `supabase/schema.sql` de este proyecto
3. Copia y pega todo el contenido en el SQL Editor
4. Haz clic en **Run** para ejecutar el script

Esto creará:
- ✅ Todas las tablas necesarias
- ✅ Relaciones y constraints
- ✅ Índices para optimización
- ✅ Triggers automáticos
- ✅ Vistas útiles
- ✅ Políticas de seguridad (RLS)

### 3. Configurar Variables de Entorno

1. Copia el archivo `.env.local.example` a `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edita `.env.local` y agrega tus credenciales:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-publica-aqui
   ```

### 4. Instalar Dependencias de Supabase

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 📊 Estructura de la Base de Datos

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `vendedores` | Equipo de ventas de la empresa |
| `paquetes` | Paquetes turísticos disponibles |
| `clientes` | Clientes convertidos |
| `leads` | Leads en proceso de gestión |
| `historial_clientes` | Eventos y actividades de clientes |
| `historial_leads` | Interacciones con leads |
| `reglas_asignacion` | Reglas de asignación automática de leads |

### Relaciones

```
vendedores
    ↓
  leads ←→ clientes
    ↓
paquetes
```

### Vistas Útiles

- `leads_con_vendedor`: Leads con información completa del vendedor
- `estadisticas_vendedores`: Métricas de desempeño por vendedor
- `pipeline_ventas`: Estado del pipeline de ventas

## 🔒 Seguridad (Row Level Security)

Las políticas RLS están configuradas para:
- ✅ Solo usuarios autenticados pueden acceder a los datos
- ✅ Todas las operaciones CRUD están protegidas
- ⚠️ **IMPORTANTE**: Ajusta las políticas según tus necesidades de negocio

Para modificar las políticas:
1. Ve a **Authentication > Policies** en Supabase
2. Selecciona la tabla que deseas modificar
3. Edita o crea nuevas políticas

## 🔄 Triggers Automáticos

El schema incluye triggers que:

1. **Actualización de timestamps**: Actualiza `updated_at` automáticamente
2. **Contador de leads**: Actualiza `total_leads` en clientes al convertir
3. **Historial automático**: Registra eventos importantes automáticamente
   - Creación de leads
   - Cambios de estado
   - Asignación de vendedor
   - Conversión a cliente

## 📝 Datos de Ejemplo

Para insertar datos de ejemplo (opcional):

```sql
-- Vendedores
INSERT INTO vendedores (nombre, apellido, email, whatsapp, sucursal) VALUES
('Carlos', 'González', 'carlos@moana.com', '+34612345678', 'Buenos Aires'),
('María', 'López', 'maria@moana.com', '+34623456789', 'Córdoba'),
('Juan', 'Rodríguez', 'juan@moana.com', '+34634567890', 'Rosario');

-- Paquetes
INSERT INTO paquetes (nombre, destino, cupos, cupos_disponibles, precio_adulto, precio_menor, moneda) VALUES
('Caribbean Paradise', 'Bahamas', 10, 8, 2500.00, 1800.00, 'USD'),
('European Tour', 'Europa', 12, 12, 3200.00, 2400.00, 'EUR');
```

## 🛠️ Uso en el Código

### Cliente (Browser)

```typescript
import { supabase } from '@/lib/supabase/client'

// Obtener leads
const { data: leads, error } = await supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false })
```

### Servidor (Server Components)

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = createClient()
  const { data: leads } = await supabase.from('leads').select('*')

  return <div>{/* ... */}</div>
}
```

## 📈 Monitoreo

Supabase proporciona herramientas de monitoreo:

1. **Logs**: Ve a **Logs** para ver queries y errores
2. **Database**: Revisa el uso y performance
3. **API**: Monitorea las llamadas a la API

## 🔧 Mantenimiento

### Backup

Supabase hace backups automáticos, pero puedes hacer backups manuales:

1. Ve a **Database > Backups**
2. Haz clic en **Create backup**

### Migraciones

Para cambios en el schema:

1. Crea un archivo de migración en `supabase/migrations/`
2. Aplica la migración en el SQL Editor
3. Documenta los cambios

## ⚡ Optimización

- Los índices ya están creados en las columnas más consultadas
- Usa las vistas para queries complejas
- Considera usar `select()` específico en lugar de `select('*')`

## 🆘 Troubleshooting

### Error: "relation does not exist"
- ✅ Verifica que ejecutaste el schema completo
- ✅ Revisa que estás en el proyecto correcto

### Error: "new row violates row-level security policy"
- ✅ Verifica que el usuario está autenticado
- ✅ Revisa las políticas RLS de la tabla

### Error: "permission denied"
- ✅ Verifica las credenciales en `.env.local`
- ✅ Revisa los permisos del usuario

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
