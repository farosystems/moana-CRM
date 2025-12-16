# 🚀 Guía de Configuración de Supabase - CRM MOANA

Esta guía te llevará paso a paso para configurar Supabase en tu proyecto CRM MOANA.

## 📦 Paso 1: Instalar Dependencias

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 🔧 Paso 2: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta
2. Haz clic en "New Project"
3. Completa los datos:
   - **Name**: CRM-MOANA
   - **Database Password**: Elige una contraseña segura (guárdala!)
   - **Region**: Selecciona la región más cercana a tus usuarios
4. Haz clic en "Create new project"
5. Espera 2-3 minutos mientras Supabase configura tu proyecto

## 🔑 Paso 3: Obtener Credenciales

1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** (algo como: `https://xxxxx.supabase.co`)
   - **anon/public key** (una clave larga que empieza con `eyJ...`)

## 📝 Paso 4: Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo llamado `.env.local`
2. Copia y pega lo siguiente, reemplazando con tus valores reales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-publica-aqui
```

⚠️ **IMPORTANTE**: El archivo `.env.local` NO debe subirse a Git. Ya está en `.gitignore`.

## 🗄️ Paso 5: Crear la Base de Datos

1. En Supabase, ve a **SQL Editor** (icono de tabla en el menú lateral)
2. Haz clic en "New query"
3. Abre el archivo `supabase/schema.sql` de este proyecto
4. Copia TODO el contenido del archivo
5. Pégalo en el editor SQL de Supabase
6. Haz clic en **Run** (botón abajo a la derecha)
7. Deberías ver el mensaje: "Success. No rows returned"

### ✅ Verificar que se crearon las tablas

1. Ve a **Table Editor** en Supabase
2. Deberías ver las siguientes tablas:
   - vendedores
   - paquetes
   - clientes
   - leads
   - historial_clientes
   - historial_leads
   - reglas_asignacion

## 🎯 Paso 6: (Opcional) Insertar Datos de Prueba

Si quieres trabajar con datos de ejemplo, ejecuta esto en el SQL Editor:

```sql
-- Insertar vendedores de prueba
INSERT INTO vendedores (nombre, apellido, email, whatsapp, sucursal) VALUES
('Carlos', 'González', 'carlos@moana.com', '+34612345678', 'Buenos Aires'),
('María', 'López', 'maria@moana.com', '+34623456789', 'Córdoba'),
('Juan', 'Rodríguez', 'juan@moana.com', '+34634567890', 'Rosario');

-- Insertar paquetes de prueba
INSERT INTO paquetes (nombre, destino, cupos, cupos_disponibles, precio_adulto, precio_menor, moneda, fecha_inicio, fecha_fin) VALUES
('Caribbean Paradise', 'Bahamas', 10, 8, 2500.00, 1800.00, 'USD', '2025-01-15', '2025-01-25'),
('European Tour', 'Europa', 12, 12, 3200.00, 2400.00, 'EUR', '2025-04-15', '2025-05-30');
```

## 🧪 Paso 7: Probar la Conexión

Crea un archivo de prueba `test-supabase.ts` en la raíz:

```typescript
import { supabase } from './lib/supabase/client'

async function testConnection() {
  const { data, error } = await supabase.from('vendedores').select('*')

  if (error) {
    console.error('❌ Error:', error)
  } else {
    console.log('✅ Conexión exitosa! Vendedores:', data)
  }
}

testConnection()
```

Ejecuta:
```bash
npx tsx test-supabase.ts
```

## 📚 Paso 8: Usar en tu Aplicación

### En Componentes de Cliente:

```typescript
'use client'
import { supabase } from '@/lib/supabase/client'
import { leadsQueries } from '@/lib/supabase/queries'

export function MiComponente() {
  const [leads, setLeads] = useState([])

  useEffect(() => {
    async function fetchLeads() {
      const data = await leadsQueries.getAll()
      setLeads(data)
    }
    fetchLeads()
  }, [])

  return <div>{/* ... */}</div>
}
```

### En Server Components:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = createClient()
  const { data: leads } = await supabase.from('leads').select('*')

  return <div>{/* ... */}</div>
}
```

## 🔒 Paso 9: Configurar Autenticación (Opcional)

Si quieres agregar login de usuarios:

1. En Supabase, ve a **Authentication** → **Providers**
2. Habilita "Email" o cualquier otro proveedor que prefieras
3. Configura las URLs de redirección
4. Implementa el login en tu app con:

```typescript
// Registrar usuario
await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Iniciar sesión
await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Cerrar sesión
await supabase.auth.signOut()
```

## 🎨 Estructura de Archivos Creados

```
CRM-MOANA/
├── .env.local              # Tus credenciales (NO subir a git)
├── .env.local.example      # Ejemplo de variables de entorno
├── supabase/
│   ├── schema.sql          # Schema completo de la BD
│   └── README.md           # Documentación detallada
├── lib/
│   └── supabase/
│       ├── client.ts       # Cliente para navegador
│       ├── server.ts       # Cliente para servidor
│       └── queries.ts      # Funciones helper
└── types/
    ├── database.types.ts   # Tipos generados de Supabase
    └── index.ts            # Tipos de la aplicación
```

## ❓ Troubleshooting

### Error: "relation does not exist"
**Solución**: Ejecuta el schema SQL completo en Supabase

### Error: "Invalid API key"
**Solución**: Verifica que copiaste correctamente las credenciales en `.env.local`

### Error: "Column does not exist"
**Solución**: Asegúrate de usar los nombres de columnas con guión bajo (snake_case):
- ✅ `vendedor_asignado_id`
- ❌ `vendedorAsignadoId`

### Las queries no retornan datos
**Solución**:
1. Verifica que insertaste datos de prueba
2. Revisa las políticas RLS en Supabase
3. Asegúrate de que el usuario está autenticado (si usas auth)

## 📖 Recursos Útiles

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js con Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## ✅ Checklist Final

- [ ] Proyecto creado en Supabase
- [ ] Credenciales copiadas a `.env.local`
- [ ] Dependencias instaladas (`@supabase/supabase-js`, `@supabase/ssr`)
- [ ] Schema SQL ejecutado correctamente
- [ ] Tablas visibles en Table Editor
- [ ] Datos de prueba insertados (opcional)
- [ ] Conexión probada exitosamente

¡Listo! 🎉 Tu CRM MOANA ya está conectado a Supabase.
