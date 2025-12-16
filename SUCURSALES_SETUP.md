# Implementación de Sistema de Sucursales

## Resumen
Se ha creado una tabla de **sucursales** en Supabase para gestionar las diferentes oficinas/sucursales de la empresa. La tabla de vendedores ahora se relaciona con sucursales mediante una clave foránea.

---

## 📋 Archivos Creados/Modificados

### 1. **Script SQL de Sucursales**
- **Archivo**: `supabase/sucursales.sql`
- **Descripción**: Contiene el CREATE completo de la tabla sucursales, índices, triggers, RLS policies y datos iniciales

### 2. **Tipos TypeScript**
- **Archivo**: `types/index.ts`
- **Nuevo tipo**: `Sucursal`
- **Modificado**: Interface `Vendedor` (agregado campo `sucursal_id`)

### 3. **Queries de Supabase**
- **Archivo**: `lib/supabase/queries.ts`
- **Nuevo export**: `sucursalesQueries` con todas las operaciones CRUD

---

## 🗄️ Estructura de la Tabla Sucursales

```sql
CREATE TABLE sucursales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Campos:
- **id**: UUID único generado automáticamente
- **nombre**: Nombre de la sucursal (ej: "Buenos Aires Centro")
- **codigo**: Código único (ej: "BSAS-CTR")
- **direccion**: Dirección física (opcional)
- **ciudad**: Ciudad donde está ubicada
- **pais**: País donde está ubicada
- **telefono**: Teléfono de contacto
- **email**: Email de contacto
- **activo**: Flag para soft delete
- **created_at**: Fecha de creación automática
- **updated_at**: Fecha de última actualización automática

---

## 🔗 Relación con Vendedores

La tabla `vendedores` ahora tiene:
- **Nueva columna**: `sucursal_id UUID`
- **Foreign Key**: Apunta a `sucursales(id)`
- **ON DELETE**: SET NULL (si se borra una sucursal, el vendedor queda sin sucursal)
- **Columna legacy**: `sucursal VARCHAR(100)` (se mantiene para compatibilidad)

---

## 📊 Datos Iniciales

El script incluye 6 sucursales de ejemplo:

1. **Buenos Aires Centro** (BSAS-CTR)
2. **Córdoba** (CBA)
3. **Rosario** (ROS)
4. **Mendoza** (MDZ)
5. **La Plata** (LPL)
6. **Online** (ONLINE)

---

## 🚀 Pasos para Implementar en Supabase

### 1. Ejecutar el Script SQL

Opción A - Desde Supabase Dashboard:
```bash
1. Ve a tu proyecto en Supabase
2. Navega a: SQL Editor > New Query
3. Copia y pega el contenido de: supabase/sucursales.sql
4. Ejecuta el script (botón "Run" o F5)
```

Opción B - Desde CLI de Supabase:
```bash
supabase db push --file supabase/sucursales.sql
```

### 2. Verificar la Creación

Ejecuta este query para verificar:
```sql
-- Ver todas las sucursales
SELECT * FROM sucursales;

-- Ver estructura de la tabla vendedores actualizada
\d vendedores;
```

---

## 💻 Uso en el Código

### Importar Queries

```typescript
import { sucursalesQueries } from '@/lib/supabase/queries'
import type { Sucursal } from '@/types'
```

### Operaciones Disponibles

```typescript
// Obtener todas las sucursales activas
const sucursales = await sucursalesQueries.getAll()

// Obtener una sucursal por ID
const sucursal = await sucursalesQueries.getById(id)

// Crear nueva sucursal
const newSucursal = await sucursalesQueries.create({
  nombre: "Nueva Sucursal",
  codigo: "NVA",
  ciudad: "Salta",
  pais: "Argentina"
})

// Actualizar sucursal
const updated = await sucursalesQueries.update(id, {
  telefono: "+54 387 123 4567"
})

// Eliminar sucursal (soft delete)
await sucursalesQueries.delete(id)
```

---

## 🔄 Próximos Pasos - Integración con el Modal de Vendedores

Para reemplazar el campo hardcodeado de sucursales en el modal de vendedores:

### 1. Cargar Sucursales en el Módulo

```typescript
// En vendedores-module.tsx
import { sucursalesQueries } from '@/lib/supabase/queries'

const [sucursales, setSucursales] = useState<Sucursal[]>([])

const fetchData = async () => {
  const [vendedoresData, sucursalesData] = await Promise.all([
    vendedoresQueries.getAll(),
    sucursalesQueries.getAll(),
  ])
  setVendedores(vendedoresData)
  setSucursales(sucursalesData)
}
```

### 2. Pasar Sucursales al Modal

```typescript
<VendedorModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleAddVendedor}
  vendedor={editingVendedor}
  sucursales={sucursales}  // <- Agregar esta prop
/>
```

### 3. Actualizar la Interfaz del Modal

```typescript
// En vendedor-modal.tsx
interface VendedorModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  vendedor?: any
  sucursales?: Sucursal[]  // <- Agregar esta prop
}
```

### 4. Reemplazar el Select Hardcodeado

```typescript
// Reemplazar esto:
<select value={formData.sucursal}>
  <option value="">Seleccionar sucursal</option>
  <option value="Buenos Aires">Buenos Aires</option>
  <option value="Córdoba">Córdoba</option>
  // ...
</select>

// Por esto:
<select value={formData.sucursal_id}>
  <option value="">Seleccionar sucursal</option>
  {sucursales.map((sucursal) => (
    <option key={sucursal.id} value={sucursal.id}>
      {sucursal.nombre}
    </option>
  ))}
</select>
```

### 5. Actualizar el FormData

```typescript
const [formData, setFormData] = useState({
  nombre: "",
  apellido: "",
  whatsapp: "",
  email: "",
  sucursal_id: "",  // <- Cambiar de 'sucursal' a 'sucursal_id'
})
```

---

## 📝 Vista Adicional Creada

Se creó una vista SQL para consultas completas:

```sql
-- Vista: vista_vendedores_con_sucursal
-- Combina información de vendedores con sus sucursales

SELECT * FROM vista_vendedores_con_sucursal;
```

Esta vista incluye:
- Todos los campos del vendedor
- Información completa de la sucursal (nombre, código, ciudad, país)
- Compatible con el campo legacy `sucursal`

---

## 🔒 Seguridad (RLS Policies)

Se implementaron las siguientes políticas:

1. **Lectura**: Todos pueden leer sucursales activas
2. **Inserción**: Solo usuarios autenticados
3. **Actualización**: Solo usuarios autenticados
4. **Eliminación**: Solo usuarios autenticados

---

## ⚠️ Notas Importantes

1. **Compatibilidad**: El campo legacy `sucursal` (VARCHAR) se mantiene en la tabla vendedores para no romper código existente
2. **Migración**: Los vendedores existentes mantendrán su valor en `sucursal` pero tendrán `sucursal_id` NULL hasta que se actualicen
3. **Soft Delete**: Las sucursales no se eliminan físicamente, solo se marca `activo = false`
4. **Códigos únicos**: Cada sucursal debe tener un código único (ej: BSAS-CTR, CBA, ROS)

---

## ✅ Checklist de Implementación

- [x] Crear script SQL de sucursales
- [x] Crear tipos TypeScript (Sucursal)
- [x] Actualizar tipos de Vendedor
- [x] Crear queries de Supabase (sucursalesQueries)
- [ ] Ejecutar script SQL en Supabase
- [ ] Actualizar modal de vendedores para usar sucursales dinámicas
- [ ] Cargar sucursales en vendedores-module
- [ ] Actualizar formData para usar sucursal_id
- [ ] Probar CRUD de vendedores con sucursales
- [ ] Verificar que se guarde correctamente la relación

---

## 🆘 Troubleshooting

### Error: "relation sucursales does not exist"
**Solución**: Ejecuta el script SQL `supabase/sucursales.sql` en tu base de datos

### Error: "column sucursal_id does not exist in vendedores"
**Solución**: El script SQL agrega automáticamente esta columna. Verifica que se ejecutó correctamente.

### Los vendedores no muestran la sucursal
**Solución**: Asegúrate de actualizar el campo `sucursal_id` al crear/editar vendedores, no solo `sucursal`

---

## 📧 Contacto

Si tienes dudas sobre la implementación, revisa:
- Script SQL: `supabase/sucursales.sql`
- Tipos: `types/index.ts`
- Queries: `lib/supabase/queries.ts`
