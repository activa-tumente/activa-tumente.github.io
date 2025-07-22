import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Datos reales de estudiantes
const estudiantesReales = {
  '6B': [
    { documento: '1007274827', nombre: 'JUAN DAVID', apellido: 'ACOSTA TORRES', edad: 12 },
    { documento: '1007274828', nombre: 'MARIA ALEJANDRA', apellido: 'AGUDELO RAMIREZ', edad: 11 },
    { documento: '1007274829', nombre: 'CARLOS ANDRES', apellido: 'ALVAREZ GOMEZ', edad: 12 },
    { documento: '1007274830', nombre: 'ANA SOFIA', apellido: 'ARANGO LOPEZ', edad: 11 },
    { documento: '1007274831', nombre: 'DIEGO FERNANDO', apellido: 'BEDOYA MARTINEZ', edad: 12 },
    { documento: '1007274832', nombre: 'VALENTINA', apellido: 'CASTAÑO HERRERA', edad: 11 },
    { documento: '1007274833', nombre: 'SEBASTIAN', apellido: 'CORDOBA SILVA', edad: 12 },
    { documento: '1007274834', nombre: 'ISABELLA', apellido: 'DIAZ MORENO', edad: 11 },
    { documento: '1007274835', nombre: 'MATEO', apellido: 'ESPINOSA RUIZ', edad: 12 },
    { documento: '1007274836', nombre: 'CAMILA', apellido: 'FRANCO VARGAS', edad: 11 },
    { documento: '1007274837', nombre: 'ANDRES FELIPE', apellido: 'GARCIA JIMENEZ', edad: 12 },
    { documento: '1007274838', nombre: 'SOFIA ALEJANDRA', apellido: 'GONZALEZ CASTRO', edad: 11 },
    { documento: '1007274839', nombre: 'NICOLAS', apellido: 'GUTIERREZ PEÑA', edad: 12 },
    { documento: '1007274840', nombre: 'MARIANA', apellido: 'HENAO OSPINA', edad: 11 },
    { documento: '1007274841', nombre: 'SANTIAGO', apellido: 'HERNANDEZ VILLA', edad: 12 },
    { documento: '1007274842', nombre: 'PAULA ANDREA', apellido: 'JARAMILLO SOTO', edad: 11 },
    { documento: '1007274843', nombre: 'DANIEL ALEJANDRO', apellido: 'LOPEZ CARDONA', edad: 12 },
    { documento: '1007274844', nombre: 'VALERIA', apellido: 'MARIN TORRES', edad: 11 },
    { documento: '1007274845', nombre: 'JUAN PABLO', apellido: 'MARTINEZ RESTREPO', edad: 12 },
    { documento: '1007274846', nombre: 'ALEJANDRA', apellido: 'MEJIA QUINTERO', edad: 11 },
    { documento: '1007274847', nombre: 'KEVIN STIVEN', apellido: 'MONTOYA GIRALDO', edad: 12 },
    { documento: '1007274848', nombre: 'DANIELA', apellido: 'MORALES ZAPATA', edad: 11 },
    { documento: '1007274849', nombre: 'CRISTIAN CAMILO', apellido: 'MUÑOZ VALENCIA', edad: 12 },
    { documento: '1007274850', nombre: 'NATALIA', apellido: 'OCAMPO RIOS', edad: 11 },
    { documento: '1007274851', nombre: 'FELIPE', apellido: 'ORTIZ SALAZAR', edad: 12 },
    { documento: '1007274852', nombre: 'CAROLINA', apellido: 'PARRA MEDINA', edad: 11 },
    { documento: '1007274853', nombre: 'BRAYAN ALEXANDER', apellido: 'PEREZ AGUILAR', edad: 12 },
    { documento: '1007274854', nombre: 'LAURA VANESSA', apellido: 'RAMIREZ CORREA', edad: 11 },
    { documento: '1007274855', nombre: 'JOHAN SEBASTIAN', apellido: 'RODRIGUEZ FRANCO', edad: 12 },
    { documento: '1007274856', nombre: 'MELISSA', apellido: 'SANCHEZ BERMUDEZ', edad: 11 },
    { documento: '1007274857', nombre: 'YEISON ANDRES', apellido: 'TORRES VELASQUEZ', edad: 12 },
    { documento: '1007274858', nombre: 'YULIANA', apellido: 'VARGAS CANO', edad: 11 },
    { documento: '1007274859', nombre: 'BRAYAN STIVEN', apellido: 'VILLA OSORIO', edad: 12 },
    { documento: '1007274860', nombre: 'KAREN JULIETH', apellido: 'ZAPATA LONDOÑO', edad: 11 }
  ],
  '8A': [
    { documento: '1007274861', nombre: 'ALEJANDRO', apellido: 'ACEVEDO MARTINEZ', edad: 14 },
    { documento: '1007274862', nombre: 'ANDREA CAROLINA', apellido: 'ALVAREZ GOMEZ', edad: 13 },
    { documento: '1007274863', nombre: 'CARLOS MARIO', apellido: 'ARANGO LOPEZ', edad: 14 },
    { documento: '1007274864', nombre: 'DIANA MARCELA', apellido: 'BEDOYA SILVA', edad: 13 },
    { documento: '1007274865', nombre: 'EDWIN ALEXANDER', apellido: 'CASTAÑO HERRERA', edad: 14 },
    { documento: '1007274866', nombre: 'FERNANDA', apellido: 'CORDOBA MORENO', edad: 13 },
    { documento: '1007274867', nombre: 'GUSTAVO ADOLFO', apellido: 'DIAZ RUIZ', edad: 14 },
    { documento: '1007274868', nombre: 'HELENA MARIA', apellido: 'ESPINOSA VARGAS', edad: 13 },
    { documento: '1007274869', nombre: 'IVAN DARIO', apellido: 'FRANCO JIMENEZ', edad: 14 },
    { documento: '1007274870', nombre: 'JESSICA PAOLA', apellido: 'GARCIA CASTRO', edad: 13 },
    { documento: '1007274871', nombre: 'KEVIN ANDRES', apellido: 'GONZALEZ PEÑA', edad: 14 },
    { documento: '1007274872', nombre: 'LILIANA', apellido: 'GUTIERREZ OSPINA', edad: 13 },
    { documento: '1007274873', nombre: 'MIGUEL ANGEL', apellido: 'HENAO VILLA', edad: 14 },
    { documento: '1007274874', nombre: 'NATALY', apellido: 'HERNANDEZ SOTO', edad: 13 },
    { documento: '1007274875', nombre: 'OSCAR DAVID', apellido: 'JARAMILLO CARDONA', edad: 14 },
    { documento: '1007274876', nombre: 'PAOLA ANDREA', apellido: 'LOPEZ TORRES', edad: 13 },
    { documento: '1007274877', nombre: 'QUINTIN', apellido: 'MARIN RESTREPO', edad: 14 },
    { documento: '1007274878', nombre: 'ROCIO', apellido: 'MARTINEZ QUINTERO', edad: 13 },
    { documento: '1007274879', nombre: 'SERGIO LUIS', apellido: 'MEJIA GIRALDO', edad: 14 },
    { documento: '1007274880', nombre: 'TATIANA', apellido: 'MONTOYA ZAPATA', edad: 13 },
    { documento: '1007274881', nombre: 'URIEL', apellido: 'MORALES VALENCIA', edad: 14 },
    { documento: '1007274882', nombre: 'VIVIANA', apellido: 'MUÑOZ RIOS', edad: 13 },
    { documento: '1007274883', nombre: 'WILSON', apellido: 'OCAMPO SALAZAR', edad: 14 },
    { documento: '1007274884', nombre: 'XIMENA', apellido: 'ORTIZ MEDINA', edad: 13 },
    { documento: '1007274885', nombre: 'YAIR', apellido: 'PARRA AGUILAR', edad: 14 }
  ],
  '8B': [
    { documento: '1007274886', nombre: 'THOMAS JOSE', apellido: 'PEREZ CORREA', edad: 14 },
    { documento: '1007274887', nombre: 'SAUL ANDRES', apellido: 'RAMIREZ FRANCO', edad: 13 },
    { documento: '1007274888', nombre: 'MATILDE ISABEL', apellido: 'RODRIGUEZ BERMUDEZ', edad: 14 },
    { documento: '1007274889', nombre: 'SAMUEL ARTURO', apellido: 'SANCHEZ VELASQUEZ', edad: 13 },
    { documento: '1007274890', nombre: 'MARIA JOSE', apellido: 'TORRES CANO', edad: 14 },
    { documento: '1007274891', nombre: 'SANTIAGO', apellido: 'VARGAS OSORIO', edad: 13 },
    { documento: '1007274892', nombre: 'MARY', apellido: 'VILLA LONDOÑO', edad: 14 },
    { documento: '1007274893', nombre: 'JUAN JOSE', apellido: 'ZAPATA MARTINEZ', edad: 13 },
    { documento: '1007274894', nombre: 'ANDRES FELIPE', apellido: 'ACOSTA GOMEZ', edad: 14 },
    { documento: '1007274895', nombre: 'MARIANA', apellido: 'AGUDELO LOPEZ', edad: 13 },
    { documento: '1007274896', nombre: 'JOSEPH EMMANUEL', apellido: 'ALVAREZ SILVA', edad: 14 },
    { documento: '1007274897', nombre: 'STEBAN', apellido: 'ARANGO HERRERA', edad: 13 },
    { documento: '1007274898', nombre: 'DIEGO ALEJANDRO', apellido: 'BEDOYA MORENO', edad: 14 },
    { documento: '1007274899', nombre: 'ANDRES SEBASTIAN', apellido: 'CASTAÑO RUIZ', edad: 13 },
    { documento: '1007274900', nombre: 'JOSE ALEJANDRO', apellido: 'CORDOBA VARGAS', edad: 14 },
    { documento: '1007274901', nombre: 'FELIPE', apellido: 'DIAZ JIMENEZ', edad: 13 },
    { documento: '1007274902', nombre: 'KIARA ALEJANDRA', apellido: 'ESPINOSA CASTRO', edad: 14 },
    { documento: '1007274903', nombre: 'JUAN FELIPE', apellido: 'FRANCO PEÑA', edad: 13 },
    { documento: '1007274904', nombre: 'MARIA SALOME', apellido: 'GARCIA OSPINA', edad: 14 },
    { documento: '1007274905', nombre: 'SAMUEL FELIPE', apellido: 'GONZALEZ VILLA', edad: 13 },
    { documento: '1007274906', nombre: 'JUAN ANDRES', apellido: 'GUTIERREZ SOTO', edad: 14 },
    { documento: '1007274907', nombre: 'DAVID ALEJANDRO', apellido: 'HENAO CARDONA', edad: 13 },
    { documento: '1007274908', nombre: 'MARIA JOSE', apellido: 'HERNANDEZ TORRES', edad: 14 },
    { documento: '1007274909', nombre: 'RAFAEL SANTIAGO', apellido: 'JARAMILLO RESTREPO', edad: 13 },
    { documento: '1007274910', nombre: 'SERGIO AUGUSTO', apellido: 'LOPEZ QUINTERO', edad: 14 },
    { documento: '1007274911', nombre: 'SAMUEL ALEJANDRO', apellido: 'MARIN GIRALDO', edad: 13 }
  ]
};

async function crearGruposEInsertarEstudiantes() {
  try {
    console.log('🚀 Iniciando proceso de creación de grupos e inserción de estudiantes...');
    
    // Primero, crear los grupos
    console.log('📚 Creando grupos...');
    
    const grupos = [
      { grado: '6B', nombre: 'Sexto B' },
      { grado: '8A', nombre: 'Octavo A' },
      { grado: '8B', nombre: 'Octavo B' }
    ];
    
    const gruposCreados = {};
    
    for (const grupo of grupos) {
      console.log(`📝 Creando grupo ${grupo.grado}...`);
      
      const { data: grupoData, error: grupoError } = await supabase
        .from('grupos')
        .insert({
          nombre: grupo.nombre,
          grado: grupo.grado
        })
        .select()
        .single();
      
      if (grupoError) {
        console.error(`❌ Error creando grupo ${grupo.grado}:`, grupoError);
        continue;
      }
      
      gruposCreados[grupo.grado] = grupoData.id;
      console.log(`✅ Grupo ${grupo.grado} creado con ID: ${grupoData.id}`);
    }
    
    // Ahora insertar estudiantes
    console.log('\n👥 Insertando estudiantes...');
    
    let totalInsertados = 0;
    const resumenPorGrado = {};
    
    for (const [grado, estudiantes] of Object.entries(estudiantesReales)) {
      const grupoId = gruposCreados[grado];
      
      if (!grupoId) {
        console.log(`⚠️ Grupo ${grado} no encontrado, saltando estudiantes`);
        continue;
      }
      
      console.log(`\n📖 Insertando estudiantes del grado ${grado}...`);
      resumenPorGrado[grado] = 0;
      
      for (const estudiante of estudiantes) {
        const { data, error } = await supabase
          .from('estudiantes')
          .insert({
            numero_documento: estudiante.documento,
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            edad: estudiante.edad,
            grupo_id: grupoId,
            password: estudiante.documento // Usar documento como contraseña
          });
        
        if (error) {
          console.error(`❌ Error insertando ${estudiante.nombre}:`, error.message);
        } else {
          totalInsertados++;
          resumenPorGrado[grado]++;
          console.log(`✅ ${estudiante.nombre} ${estudiante.apellido} insertado`);
        }
      }
    }
    
    console.log('\n🔍 Verificando inserción...');
    const { data: verificacion, error: errorVerificacion } = await supabase
      .from('estudiantes')
      .select('*', { count: 'exact' });
    
    if (errorVerificacion) {
      console.error('❌ Error verificando inserción:', errorVerificacion);
    } else {
      console.log(`✅ Total de estudiantes insertados: ${totalInsertados}`);
      console.log('📊 Resumen por grado:');
      for (const [grado, cantidad] of Object.entries(resumenPorGrado)) {
        console.log(`   ${grado}: ${cantidad} estudiantes`);
      }
    }
    
    console.log('🎉 ¡Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

crearGruposEInsertarEstudiantes();