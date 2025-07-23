# Guía de Despliegue - BULL-S Analysis Platform

Esta guía te ayudará a desplegar la aplicación BULL-S Analysis Platform en diferentes entornos, con especial énfasis en la solución de problemas comunes de GitHub Pages.

## Tabla de Contenidos
- [Requisitos Previos](#requisitos-previos)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Despliegue en GitHub Pages](#despliegue-en-github-pages)
- [Solución de Problemas 404](#solución-de-problemas-404)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Despliegue Local](#despliegue-local)
- [Verificación del Despliegue](#verificación-del-despliegue)

## Requisitos Previos

Antes de comenzar, asegúrate de tener:

1. **Node.js** (versión 18 o superior)
2. **npm** instalado
3. Una cuenta en **Supabase** con tu proyecto configurado
4. Las credenciales de tu base de datos Supabase

## Configuración de Variables de Entorno

### 1. Crear archivo de variables de entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
copy .env.example .env.local
```

### 2. Configurar las variables

Edita el archivo `.env.local` con tus credenciales de Supabase:

```env
# Supabase Configuration
VITE_SUPABASE_URL=tu_supabase_url_aqui
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui

# Environment
VITE_NODE_ENV=production
```

## Despliegue en GitHub Pages

### ✅ Configuración Automática (Ya Implementada)

El proyecto ya está **completamente configurado** para GitHub Pages:

#### 1. **Configuración de Vite** ✅
- `base: '/Bull-S/'` configurado en `vite.config.ts`
- Rutas relativas correctas para GitHub Pages

#### 2. **Manejo de SPA (Single Page Application)** ✅
- `404.html` configurado para redirigir rutas de React Router
- Script en `index.html` para manejar rutas SPA
- Soporte completo para navegación del lado del cliente

#### 3. **GitHub Actions** ✅
- Workflow automático en `.github/workflows/deploy.yml`
- Build y despliegue automático en cada push a `main`
- Copia automática de `404.html` para rutas SPA

#### 4. **Scripts de Build** ✅
- `npm run build` incluye copia automática de 404.html
- `npm run test-build` para verificar build localmente
- `npm run deploy-preview` para previsualizar antes del despliegue

### 🚀 Pasos para Desplegar

1. **Configurar Secrets en GitHub**:
   - Ve a tu repositorio > Settings > Secrets and variables > Actions
   - Añade estos secrets:
     - `VITE_SUPABASE_URL`: Tu URL de Supabase
     - `VITE_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase

2. **Habilitar GitHub Pages**:
   - Ve a Settings > Pages
   - Source: "GitHub Actions"
   - El workflow se ejecutará automáticamente

3. **Hacer Push**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

### 🧪 Probar Localmente Antes del Despliegue

```bash
# Probar el build completo
npm run test-build

# Previsualizar como se verá en producción
npm run deploy-preview
```

## Solución de Problemas 404

### ❌ Error Común: "404 - Page Not Found"

Si experimentas errores 404 después del despliegue, aquí están las soluciones:

#### **Problema 1: Rutas de Assets Incorrectas**
- **Síntoma**: Los archivos CSS/JS no cargan (404)
- **Causa**: Base path no configurado
- **✅ Solución**: Ya implementada en `vite.config.ts`

#### **Problema 2: Rutas de React Router**
- **Síntoma**: 404 al navegar directamente a `/dashboard`, `/login`, etc.
- **Causa**: GitHub Pages no conoce las rutas de SPA
- **✅ Solución**: Ya implementada con `404.html` y script SPA

#### **Problema 3: Recursos No Encontrados**
- **Síntoma**: Imágenes o assets devuelven 404
- **Causa**: Rutas absolutas en lugar de relativas
- **✅ Solución**: Configuración de `base` en Vite maneja esto automáticamente

### 🔧 Verificación Manual

Si aún tienes problemas, verifica:

1. **URL correcta**: `https://activa-tumente.github.io/Bull-S/`
2. **Archivos generados**: Ejecuta `npm run test-build` para verificar
3. **Secrets configurados**: Revisa que las variables de entorno estén en GitHub
4. **Workflow exitoso**: Ve a Actions tab para ver el estado del despliegue

## Despliegue en Vercel (Alternativa)

### Opción 1: Despliegue Automático desde GitHub

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno en el dashboard de Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Vercel desplegará automáticamente en cada push

### Opción 2: Despliegue Manual con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Hacer login
vercel login

# Desplegar
vercel --prod
```

## Despliegue Local

### Para desarrollo:

```bash
npm run dev
```

### Para probar el build de producción:

```bash
npm run build
npm run preview
```

## Verificación del Despliegue

### Script de verificación automática

```bash
# Verificar que el build funcione correctamente
npm run test-build

# Verificar configuración de despliegue
npm run check-deployment

# Previsualizar como se verá en producción
npm run deploy-preview
```

## Comandos Útiles

```bash
# Desarrollo
npm run dev                 # Servidor de desarrollo
npm run build              # Build de producción + copia 404.html
npm run preview            # Preview del build
npm run test-build         # Verificar build para GitHub Pages
npm run deploy-preview     # Build + preview en un comando

# Verificación
npm run check-deployment   # Verificar configuración completa

# Base de datos
npm run crear-usuarios     # Crear usuarios de prueba
npm run crear-estudiantes-6b # Crear estudiantes para grupo 6B
```

## Estructura de Archivos de Configuración

```
proyecto/
├── .env.example              # Plantilla de variables de entorno
├── .env.local               # Variables de entorno locales (no subir)
├── vite.config.ts           # ✅ Configurado para GitHub Pages
├── package.json             # ✅ Scripts de build actualizados
├── index.html               # ✅ Script SPA incluido
├── public/
│   └── 404.html            # ✅ Manejo de rutas SPA
├── vercel.json             # Configuración de Vercel
└── .github/
    └── workflows/
        └── deploy.yml      # ✅ GitHub Actions configurado
```

## Solución de Problemas Comunes

### Error: "Failed to fetch"
- **Causa**: Variables de entorno no configuradas
- **Solución**: Verifica secrets en GitHub o variables en `.env.local`

### Error: "Invalid API key"
- **Causa**: Clave anónima de Supabase incorrecta
- **Solución**: Copia la clave desde Supabase Dashboard > Settings > API

### Error 404 en GitHub Pages
- **Causa**: Configuración SPA o base path
- **✅ Solución**: Ya implementada - ejecuta `npm run test-build` para verificar

### Problemas de CORS
- **Solución**: 
  1. Ve a Supabase Dashboard > Authentication > Settings
  2. Añade tu dominio a "Site URL": `https://activa-tumente.github.io`
  3. Añade a "Redirect URLs": `https://activa-tumente.github.io/Bull-S/**`

## URLs de Despliegue

- **GitHub Pages**: `https://activa-tumente.github.io/Bull-S/`
- **Vercel**: Se asignará automáticamente al conectar el repositorio

## Notas Importantes

1. **✅ GitHub Pages**: Completamente configurado y listo para usar
2. **Seguridad**: Nunca expongas las claves privadas de Supabase
3. **Performance**: Build optimizado automáticamente
4. **SPA**: Navegación del lado del cliente completamente funcional

---

**Estado**: ✅ Configuración completa para GitHub Pages
**Última actualización**: Enero 2025