import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Grupos que necesitamos
const gruposNecesarios = [
  {
    nombre: '6B',
    grado: '6',
    seccion: 'B',
    ano_escolar: '2024',
    institucion_id: null // Se asignará después
  },
  {
    nombre: '8A',
    grado: '8',
    seccion: 'A',
    ano_escolar: '2024',
    institucion_id: null
  },
  {
    nombre: '8B',
    grado: '8',
    seccion: 'B',
    ano_escolar: '2024',
    institucion_id: null
  }
];

async function verificarYCrearGrupos() {
  try {
    console.log('🔄 Verificando grupos existentes...');
    
    // 1. Verificar grupos existentes
    const { data: gruposExistentes, error: gruposError } = await supabase
      .from('grupos')
      .select('*');
    
    if (gruposError) {
      console.error('❌ Error obteniendo grupos:', gruposError);
      return;
    }
    
    console.log('📋 Grupos existentes:', gruposExistentes);
    
    // 2. Verificar instituciones
    const { data: instituciones, error: instError } = await supabase
      .from('instituciones')
      .select('*');
    
    if (instError) {
      console.error('❌ Error obteniendo instituciones:', instError);
      return;
    }
    
    console.log('🏫 Instituciones existentes:', instituciones);
    
    // 3. Crear institución por defecto si no existe
    let institucionId = null;
    if (instituciones && instituciones.length > 0) {
      institucionId = instituciones[0].id;
      console.log('✅ Usando institución existente:', instituciones[0].nombre);
    } else {
      console.log('🏫 Creando institución por defecto...');
      const { data: nuevaInstitucion, error: instCreateError } = await supabase
        .from('instituciones')
        .insert([{
          nombre: 'Institución Educativa La Salle',
          direccion: 'Bucaramanga, Santander',
          telefono: '123456789',
          email: 'contacto@lasalle.edu.co'
        }])
        .select()
        .single();
      
      if (instCreateError) {
        console.error('❌ Error creando institución:', instCreateError);
        return;
      }
      
      institucionId = nuevaInstitucion.id;
      console.log('✅ Institución creada:', nuevaInstitucion.nombre);
    }
    
    // 4. Verificar y crear grupos faltantes
    for (const grupoNecesario of gruposNecesarios) {
      const grupoExiste = gruposExistentes.find(g => g.nombre === grupoNecesario.nombre);
      
      if (!grupoExiste) {
        console.log(`📝 Creando grupo ${grupoNecesario.nombre}...`);
        
        const grupoData = {
          ...grupoNecesario,
          institucion_id: institucionId
        };
        
        const { data: nuevoGrupo, error: createError } = await supabase
          .from('grupos')
          .insert([grupoData])
          .select()
          .single();
        
        if (createError) {
          console.error(`❌ Error creando grupo ${grupoNecesario.nombre}:`, createError);
        } else {
          console.log(`✅ Grupo creado: ${nuevoGrupo.nombre}`);
        }
      } else {
        console.log(`✅ Grupo ${grupoNecesario.nombre} ya existe`);
      }
    }
    
    // 5. Verificar grupos finales
    console.log('🔍 Verificando grupos finales...');
    const { data: gruposFinales, error: finalError } = await supabase
      .from('grupos')
      .select('*');
    
    if (finalError) {
      console.error('❌ Error verificando grupos finales:', finalError);
      return;
    }
    
    console.log('📋 Grupos finales:');
    gruposFinales.forEach(grupo => {
      console.log(`   - ${grupo.nombre} (ID: ${grupo.id})`);
    });
    
    console.log('🎉 ¡Verificación y creación de grupos completada!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
verificarYCrearGrupos();