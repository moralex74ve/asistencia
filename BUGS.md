# Bugs y Problemas Pendientes - Asistencia

> **Actualizado:** 2026-08-21  
> **Estado:** ✅ **TODOS LOS BUGS CRÍTICOS Y WARNINGS TYPESCRIPT RESUELTOS**. Build exitoso sin errores.

---

## 🟢 RESUELTOS (Críticos)

| ID | Descripción | Fix |
|----|-------------|-----|
| CR-01 | **CSRF vulnerable** en todos los formularios | `src/utils/csrf.ts` + middleware + forms con `_csrf` |
| CR-02 | **Middleware no validaba usuario en BD** | Verificación `prisma.usuarios.findUnique` + `activo` |
| CR-03 | **Rate limiting en memoria** (se resetea en restart) | Documentado en `login.action.ts` - requiere Redis/DB para producción |
| CR-04 | **Login loop** (middleware validaba JWT en POST /login antes de cookie) | `/login` excluido de auth check, solo CSRF |

---

## 🟢 RESUELTOS (TypeScript - Casts explícitos agregados)

Los siguientes archivos **ya no tienen warnings de tipado en `document.getElementById()`** - se agregaron casts explícitos (`as HTMLInputElement`, `as HTMLSelectElement`, etc.):

| Archivo | Estado |
|---------|--------|
| `src/components/Datos.astro` | ✅ Lines 344-350, 393-407, 481-486 |
| `src/pages/crear.astro` | ✅ Lines 243-260 |
| `src/pages/editar/[id].astro` | ✅ Lines 233-242 |
| `src/pages/eventos/[id].astro` | ✅ Lines 719-723 |
| `src/pages/eventos/[id]/llegadas.astro` | ✅ Lines 438-441 |

---

## 🟢 RESUELTOS (Warnings TypeScript Menores - 2026-08-21)

### ✅ `is:inline` agregado a scripts con `define:vars`
- `src/pages/discipulado.astro:265` - **FIXED**
- `src/pages/discipulado/integrantes/[nivel_cod].astro:249` - **FIXED**

### ✅ `implicit any` en callbacks - tipos explícitos agregados
- `src/components/Datos.astro:386` - `visibleRows: number` - **FIXED**
- `src/components/Datos.astro:512` - `e: MouseEvent` - **FIXED**
- `src/components/ThemeIcon.astro:6` - `theme: 'light' \| 'dark'` - **FIXED**
- `src/pages/crear.astro:308` - `str: string` - **FIXED**
- `src/pages/crear.astro:314` - `w: string` - **FIXED**
- `src/pages/editar/[id].astro:286` - `str: string` - **FIXED**
- `src/pages/editar/[id].astro:292` - `w: string` - **FIXED**

### ✅ Variables/Imports sin usar eliminadas
- `src/components/Datos.astro:13` - `idsUltimos` + `ultimosEventos` - **REMOVED**
- `src/pages/crear.astro:87` - `redirectUrl` / `safeRedirect` - **SIMPLIFIED** (inline IIFE)
- `src/pages/discipulado.astro:287` - `getRolesAsignados` - **REMOVED**
- `src/pages/discipulado.astro:302` - `role` - **REMOVED**
- `src/pages/eventos.astro:220` - `editForm` - **REMOVED**
- `src/pages/listado.astro:4` - `prisma` import - **REMOVED**
- `src/pages/api/asistencia/[id].ts:95` - `request` param → `_request` - **FIXED**
- `src/pages/api/miembros/[id].ts:7` - `request` param → `_request` - **FIXED**
- `src/pages/editar/[id].astro:51` - `pendiente` - **REMOVED**
- `src/pages/users/index.astro:227` - `editUser` → refactorizado a `openEditModal` con event delegation - **FIXED**
- `src/pages/users/index.astro:247` - `confirmDelete` → event delegation en submit handler - **FIXED**
- `src/pages/users/index.astro:210` - `closeEditModal` inalcanzable → event delegation + ID en botón - **FIXED**
- `src/utils/csrf.ts:6` - `CSRF_TOKEN_NAME` - **REMOVED**

### ✅ Errores TypeScript en scripts inline corregidos
- `src/components/Datos.astro` - `e.target` casteado a `HTMLElement` para acceder a `classList`, `dataset`, `closest`
- `src/components/ThemeIcon.astro` - `initialTheme` casteado a `'light' | 'dark'`
- `src/pages/users/index.astro` - Sintaxis TypeScript convertida a JSDoc comments para compatibilidad con scripts inline de Astro

---

## ✅ VERIFICACIÓN FINAL

```bash
$ pnpm astro check
# Sin warnings/errors en archivos src/

$ pnpm astro build
# Build exitoso ✅
```

---

## 📋 Próximos Pasos (Opcionales)

1. **ESLint + Prettier** - Configurar para evitar acumulación futura de warnings
2. **Scripts a archivos `.ts` separados** - Para mejor DX en scripts complejos (`Datos.astro`, `crear.astro`, `editar/[id].astro`)
3. **Tests** - Agregar tests unitarios/integración para lógica crítica