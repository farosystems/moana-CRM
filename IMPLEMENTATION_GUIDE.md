# Gu

ía de Implementación - Migración a Supabase

## ✅ Completado

### 1. Módulo de Vendedores
- ✅ Refactorizado para usar `vendedoresQueries`
- ✅ Estados de loading y error implementados
- ✅ CRUD completo funcional (Create, Read, Update, Delete)
- ✅ Tipos TypeScript correctos
- ✅ Manejo de campos opcionales

### 2. Módulo de Paquetes
- ✅ Refactorizado para usar `paquetesQueries`
- ✅ Estados de loading y error implementados
- ✅ CRUD completo funcional
- ✅ Compatibilidad con campos legacy (camelCase y snake_case)
- ✅ Tipos TypeScript correctos

## 🔄 Pendiente

### 3. Módulo de Clientes

**Archivo**: `components/modules/clientes/clientes-module.tsx`

**Cambios necesarios**:

1. Agregar imports:
```typescript
import { useEffect } from "react"
import { clientesQueries } from "@/lib/supabase/queries"
import type { Cliente } from "@/types"
```

2. Reemplazar el estado de clientes:
```typescript
// ANTES:
const [clientes, setClientes] = useState([{ id: "1", nombre: "Hotel Las Playas", ... }])

// DESPUÉS:
const [clientes, setClientes] = useState<Cliente[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

3. Agregar useEffect para cargar datos:
```typescript
useEffect(() => {
  fetchClientes()
}, [])

const fetchClientes = async () => {
  try {
    setLoading(true)
    setError(null)
    const data = await clientesQueries.getAll()
    setClientes(data)
  } catch (err) {
    console.error("Error al cargar clientes:", err)
    setError("No se pudieron cargar los clientes")
  } finally {
    setLoading(false)
  }
}
```

4. Actualizar `handleAddCliente`:
```typescript
const handleAddCliente = async (data: any) => {
  try {
    const newCliente = await clientesQueries.create(data)
    setClientes([...clientes, newCliente])
    setIsModalOpen(false)
  } catch (err) {
    console.error("Error al crear cliente:", err)
    alert("Error al crear el cliente. Por favor, intenta de nuevo.")
  }
}
```

5. Actualizar `handleImportClientes`:
```typescript
const handleImportClientes = async (importedClientes: any[]) => {
  try {
    const promises = importedClientes.map((cliente) => clientesQueries.create(cliente))
    const newClientes = await Promise.all(promises)
    setClientes([...clientes, ...newClientes])
    setIsImportOpen(false)
  } catch (err) {
    console.error("Error al importar clientes:", err)
    alert("Error al importar clientes. Por favor, intenta de nuevo.")
  }
}
```

6. Actualizar `handleDeleteCliente`:
```typescript
const handleDeleteCliente = async (id: string) => {
  if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
    try {
      await clientesQueries.delete(id)
      setClientes(clientes.filter((c) => c.id !== id))
    } catch (err) {
      console.error("Error al eliminar cliente:", err)
      alert("Error al eliminar el cliente. Por favor, intenta de nuevo.")
    }
  }
}
```

7. Agregar estados de loading y error al JSX (similar a vendedores y paquetes)

### 4. Módulo de Leads

**Archivo**: `components/modules/leads/leads-module.tsx`

**Cambios necesarios**:

1. Agregar imports:
```typescript
import { useEffect } from "react"
import { leadsQueries, clientesQueries } from "@/lib/supabase/queries"
import type { Lead, Cliente } from "@/types"
```

2. Reemplazar estados:
```typescript
const [leads, setLeads] = useState<Lead[]>([])
const [clientes, setClientes] = useState<Cliente[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

3. Agregar useEffect:
```typescript
useEffect(() => {
  fetchData()
}, [])

const fetchData = async () => {
  try {
    setLoading(true)
    setError(null)
    const [leadsData, clientesData] = await Promise.all([
      leadsQueries.getAll(),
      clientesQueries.getAll()
    ])
    setLeads(leadsData)
    setClientes(clientesData)
  } catch (err) {
    console.error("Error al cargar datos:", err)
    setError("No se pudieron cargar los datos")
  } finally {
    setLoading(false)
  }
}
```

4. Actualizar funciones CRUD:
```typescript
const handleAddLead = async (data: any) => {
  try {
    const newLead = await leadsQueries.create(data)
    setLeads([...leads, newLead])
    setIsModalOpen(false)
  } catch (err) {
    console.error("Error al crear lead:", err)
    alert("Error al crear el lead.")
  }
}

const handleDeleteLead = async (id: string) => {
  try {
    await leadsQueries.delete(id)
    setLeads(leads.filter((l) => l.id !== id))
  } catch (err) {
    console.error("Error al eliminar lead:", err)
    alert("Error al eliminar el lead.")
  }
}

const handleUpdateLead = async (id: string, updates: any) => {
  try {
    const updated = await leadsQueries.update(id, updates)
    setLeads(leads.map((l) => (l.id === id ? updated : l)))
  } catch (err) {
    console.error("Error al actualizar lead:", err)
    alert("Error al actualizar el lead.")
  }
}

const handleConvertLead = async (leadId: string, clienteId: string) => {
  try {
    // Convertir el lead
    await leadsQueries.convertir(leadId, clienteId)

    // Agregar al historial del cliente
    const lead = leads.find((l) => l.id === leadId)
    if (lead) {
      await clientesQueries.addHistorial(
        clienteId,
        `Lead convertido: ${lead.nombre} ${lead.apellido}`
      )
    }

    // Refrescar datos
    await fetchData()

    setIsConvertModalOpen(false)
    setSelectedLeadForConversion(null)
  } catch (err) {
    console.error("Error al convertir lead:", err)
    alert("Error al convertir el lead.")
  }
}
```

## 📋 Checklist de Implementación

### Clientes Module
- [ ] Agregar imports de Supabase
- [ ] Agregar estados de loading/error
- [ ] Implementar fetchClientes
- [ ] Actualizar handleAddCliente
- [ ] Actualizar handleImportClientes
- [ ] Actualizar handleDeleteCliente
- [ ] Agregar UI de loading/error

### Leads Module
- [ ] Agregar imports de Supabase
- [ ] Agregar estados de loading/error
- [ ] Implementar fetchData (leads + clientes)
- [ ] Actualizar handleAddLead
- [ ] Actualizar handleDeleteLead
- [ ] Actualizar handleUpdateLead
- [ ] Actualizar handleConvertLead
- [ ] Agregar UI de loading/error

### Historial
- [ ] Actualizar ClienteDetailModal para cargar historial desde Supabase
- [ ] Actualizar LeadHistory para cargar historial desde Supabase

## 🔧 Pasos para Completar la Migración

1. **Completar Clientes Module** (15-20 min)
   - Seguir los cambios detallados arriba
   - Probar CRUD completo
   - Verificar que el historial se carga correctamente

2. **Completar Leads Module** (20-25 min)
   - Seguir los cambios detallados arriba
   - Probar creación, edición, eliminación
   - Probar conversión de lead a cliente
   - Verificar que se actualiza el historial

3. **Probar Integración Completa** (10-15 min)
   - Crear un vendedor
   - Crear un paquete
   - Crear un lead
   - Asignar el lead al vendedor
   - Sugerir el paquete al lead
   - Convertir el lead a cliente
   - Verificar que todo el historial se registra correctamente

## ⚠️ Consideraciones Importantes

1. **Manejo de Errores**: Todos los métodos async deben tener try/catch
2. **Loading States**: Mostrar indicadores de carga para mejor UX
3. **Confirmaciones**: Usar confirm() antes de eliminaciones
4. **Actualización de Estado**: Refrescar datos locales después de operaciones exitosas
5. **Tipos**: Usar los tipos de `/types` en lugar de `any` cuando sea posible

## 🎯 Resultado Esperado

Después de completar estos cambios:
- ✅ Todos los módulos usan Supabase
- ✅ No hay datos hardcodeados
- ✅ CRUD completo funciona en todas las tablas
- ✅ Historial se registra automáticamente (via triggers)
- ✅ Conversión de leads funciona correctamente
- ✅ La aplicación es totalmente funcional con datos reales
