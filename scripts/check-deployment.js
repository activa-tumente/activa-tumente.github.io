#!/usr/bin/env node

/**
 * Script para verificar el estado del despliegue en GitHub Pages
 */

import https from 'https';

const GITHUB_PAGES_URL = 'https://activa-tumente.github.io/Bull-S/';
const GITHUB_API_URL = 'https://api.github.com/repos/activa-tumente/Bull-S/pages';

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      resolve({
        statusCode: response.statusCode,
        headers: response.headers
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkDeployment() {
  console.log('🔍 Verificando estado del despliegue...\n');

  try {
    // Verificar GitHub Pages API
    console.log('📡 Verificando estado en GitHub API...');
    const apiResponse = await checkUrl(GITHUB_API_URL);
    console.log(`   Status: ${apiResponse.statusCode}`);
    
    // Verificar sitio web
    console.log('\n🌐 Verificando sitio web...');
    const siteResponse = await checkUrl(GITHUB_PAGES_URL);
    console.log(`   Status: ${siteResponse.statusCode}`);
    
    if (siteResponse.statusCode === 200) {
      console.log('\n✅ ¡Sitio web funcionando correctamente!');
      console.log(`🔗 URL: ${GITHUB_PAGES_URL}`);
    } else if (siteResponse.statusCode === 404) {
      console.log('\n⚠️  Sitio no encontrado (404)');
      console.log('   Posibles causas:');
      console.log('   - GitHub Pages aún se está desplegando');
      console.log('   - Configuración de GitHub Pages incorrecta');
      console.log('   - Secrets de Supabase no configurados');
    } else {
      console.log(`\n⚠️  Respuesta inesperada: ${siteResponse.statusCode}`);
    }

  } catch (error) {
    console.log('\n❌ Error al verificar el despliegue:');
    console.log(`   ${error.message}`);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Sugerencias:');
      console.log('   - Verifica tu conexión a internet');
      console.log('   - El sitio puede estar aún desplegándose');
    }
  }

  console.log('\n📋 Pasos para solucionar problemas:');
  console.log('1. Ve a https://github.com/activa-tumente/Bull-S/actions');
  console.log('2. Verifica que el workflow "Deploy to GitHub Pages" se ejecutó exitosamente');
  console.log('3. Ve a Settings > Pages y asegúrate de que esté configurado para usar "GitHub Actions"');
  console.log('4. Verifica que los secrets VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén configurados');
  console.log('\n📖 Ver GITHUB_SETUP.md para instrucciones detalladas');
}

checkDeployment();
