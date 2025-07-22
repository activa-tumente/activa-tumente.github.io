# Configuración de GitHub Pages para BULL-S

## 🚀 Pasos para configurar el despliegue automático

### 1. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub: https://github.com/activa-tumente/Bull-S
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, busca **Pages**
4. En **Source**, selecciona **GitHub Actions**

### 2. Agregar Secrets de Supabase

Para que el build funcione en GitHub Actions, necesitas agregar las variables de entorno como secrets:

1. Ve a **Settings** > **Secrets and variables** > **Actions**
2. Haz clic en **New repository secret**
3. Agrega los siguientes secrets:

**VITE_SUPABASE_URL**
```
https://eckuozleqbbcecaycmjt.supabase.co
```

**VITE_SUPABASE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVja3VvemxlcWJiY2VjYXljbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjAwNjEsImV4cCI6MjA1OTI5NjA2MX0.S6KFjF2HYIArDSGeSu_iMXjgtaHivPPJdwRs60xB9_U
```

### 3. Verificar el despliegue

1. Una vez configurados los secrets, ve a la pestaña **Actions**
2. Verás que se ejecuta automáticamente el workflow "Deploy to GitHub Pages"
3. Cuando termine exitosamente, tu sitio estará disponible en:
   **https://activa-tumente.github.io/Bull-S/**

### 4. Configuración automática

El repositorio ya incluye:
- ✅ Workflow de GitHub Actions (`.github/workflows/deploy.yml`)
- ✅ Configuración de Vite para GitHub Pages
- ✅ Manejo de rutas SPA con `404.html`
- ✅ Metadata correcta en `index.html`

### 5. Solución de problemas

Si el sitio no carga correctamente:

1. Verifica que los secrets estén configurados correctamente
2. Revisa los logs en la pestaña **Actions**
3. Asegúrate de que GitHub Pages esté configurado para usar **GitHub Actions**

### 6. Desarrollo local

Para desarrollo local, sigue usando:
```bash
npm run dev
```

Para probar el build de producción localmente:
```bash
npm run build
npm run preview
```
