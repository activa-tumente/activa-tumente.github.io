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

// Datos reales de estudiantes
const estudiantesReales = [
  // Grado 6B
  { documento: '1097122645', nombre: 'VICTORIA', apellido: 'AGUILAR BECERRA', edad: 11, grado: '6B' },
  { documento: '1221463877', nombre: 'JUAN JOSÉ', apellido: 'ALVAREZ MANTILLA', edad: 12, grado: '6B' },
  { documento: '1097201651', nombre: 'MARIA PAULA', apellido: 'AMAYA MARTINEZ', edad: 11, grado: '6B' },
  { documento: '1099424867', nombre: 'SAMUEL CAMILO', apellido: 'ARIAS PALOMO', edad: 12, grado: '6B' },
  { documento: '1029523359', nombre: 'JUAN MANUEL', apellido: 'AVENDAÑO CANO', edad: 10, grado: '6B' },
  { documento: '1066883422', nombre: 'THALIANA', apellido: 'BALLESTEROS GARCIA', edad: 12, grado: '6B' },
  { documento: '1097121199', nombre: 'JOSE ALIRIO', apellido: 'CALDERON GRIMALDOS', edad: 11, grado: '6B' },
  { documento: '1097200716', nombre: 'DANIEL FELIPE', apellido: 'CARDONA PATERNINA', edad: 11, grado: '6B' },
  { documento: '1097121229', nombre: 'MIA', apellido: 'CARDOZO FABRE', edad: 11, grado: '6B' },
  { documento: '1096073026', nombre: 'MARIA PAULA', apellido: 'CARVAJAL CASTELLANOS', edad: 10, grado: '6B' },
  { documento: '1097789728', nombre: 'HECTOR MANUEL', apellido: 'FORERO MENESES', edad: 12, grado: '6B' },
  { documento: '1205964055', nombre: 'SANTIAGO ELIAS', apellido: 'GONZALEZ LARIOS', edad: 11, grado: '6B' },
  { documento: '1222118267', nombre: 'LUCIANA', apellido: 'GONZALEZ SILVA', edad: 11, grado: '6B' },
  { documento: '1097789761', nombre: 'ISABELA', apellido: 'LEON DIAZ', edad: 12, grado: '6B' },
  { documento: '1028875934', nombre: 'JUAN JOSE', apellido: 'MARTIN ARAQUE', edad: 11, grado: '6B' },
  { documento: '1097123049', nombre: 'ANNIE SOFIA', apellido: 'MENDEZ LOZADA', edad: 11, grado: '6B' },
  { documento: '1097790737', nombre: 'ISABELLA', apellido: 'MORENO MONTOYA', edad: 11, grado: '6B' },
  { documento: '1098077749', nombre: 'DAGO SAMUEL', apellido: 'NIÑO ORTIZ', edad: 11, grado: '6B' },
  { documento: '1030193561', nombre: 'VALERIA', apellido: 'ORTIZ PEREZ', edad: 11, grado: '6B' },
  { documento: '1014885370', nombre: 'RICARDO', apellido: 'PAEZ VALBUENA', edad: 11, grado: '6B' },
  { documento: '1097122694', nombre: 'JUAN GUILLERMO', apellido: 'RESTREPO VARGAS', edad: 11, grado: '6B' },
  { documento: '1097120696', nombre: 'LUIS ALEJANDRO', apellido: 'RODRIGUEZ PINTO', edad: 12, grado: '6B' },
  { documento: '1020229816', nombre: 'FELIX DAVID', apellido: 'SIERRA MIRANDA', edad: 12, grado: '6B' },
  { documento: '1222303739', nombre: 'MARIA FERNANDA', apellido: 'SUÁREZ AVAUNZA', edad: 11, grado: '6B' },
  { documento: '1097120107', nombre: 'JUAN PABLO', apellido: 'VECINO PEREZ', edad: 12, grado: '6B' },
  
  // Grado 8A
  { documento: '1097113083', nombre: 'THANYA SOPHIE', apellido: 'ACEVEDO GRANADOS', edad: 13, grado: '8A' },
  { documento: '1097197548', nombre: 'MARIA ALEJANDRA', apellido: 'AMAYA MARTINEZ', edad: 13, grado: '8A' },
  { documento: '1124825116', nombre: 'LAUREN SOFIA', apellido: 'ANZOLA GONZALEZ', edad: 13, grado: '8A' },
  { documento: '1097787744', nombre: 'ANDRÉS GUSTAVO', apellido: 'BUSTAMANTE SEPULVEDA', edad: 14, grado: '8A' },
  { documento: '1097505483', nombre: 'MANUELA', apellido: 'CARO BARRERA', edad: 13, grado: '8A' },
  { documento: '1046708952', nombre: 'JUAN ANGEL', apellido: 'CARRASCAL DAZA', edad: 14, grado: '8A' },
  { documento: '1011213038', nombre: 'DANNA', apellido: 'CARVAJAL URIBE', edad: 13, grado: '8A' },
  { documento: '1014879888', nombre: 'JUAN JOSE', apellido: 'CASTAÑEDA PORRAS', edad: 13, grado: '8A' },
  { documento: '1099744366', nombre: 'SOFIA', apellido: 'CASTELLANOS WILCHES', edad: 14, grado: '8A' },
  { documento: '1097504256', nombre: 'MARIA ISABELLA', apellido: 'DAVILA LOPEZ', edad: 14, grado: '8A' },
  { documento: '1097787545', nombre: 'FABIAN EDUARDO', apellido: 'DIAZ BALCARCEL', edad: 14, grado: '8A' },
  { documento: '1097504567', nombre: 'LISETH GABRIELA', apellido: 'DIAZ NIÑO', edad: 13, grado: '8A' },
  { documento: '1098075012', nombre: 'ABIGAIL', apellido: 'GARCIA ALVAREZ', edad: 15, grado: '8A' },
  { documento: '1096703562', nombre: 'JAVIER ALEJANDRO', apellido: 'GOMEZ GONZALEZ', edad: 13, grado: '8A' },
  { documento: '1097505963', nombre: 'ALEJANDRO', apellido: 'GOMEZ TORRES', edad: 12, grado: '8A' },
  { documento: '1101624282', nombre: 'SALOME', apellido: 'HERNANDEZ VARGAS', edad: 13, grado: '8A' },
  { documento: '1022382221', nombre: 'JOSHUA JAVIER', apellido: 'MAYORGA SOPÓ', edad: 14, grado: '8A' },
  { documento: '1097503495', nombre: 'SANTIAGO IMAD', apellido: 'NAJM SASSINE', edad: 14, grado: '8A' },
  { documento: '1011105873', nombre: 'DANA', apellido: 'NAVARRETE LAGOS', edad: 13, grado: '8A' },
  { documento: '1030181390', nombre: 'TOMÁS ALEJANDRO', apellido: 'NOVA BECERRA', edad: 14, grado: '8A' },
  { documento: '1082966320', nombre: 'JUAN PABLO', apellido: 'PARADA ROMERO', edad: 14, grado: '8A' },
  { documento: '1098075935', nombre: 'MARIA JOSE', apellido: 'RIOS CACERES', edad: 14, grado: '8A' },
  { documento: '1098075606', nombre: 'JULIANA DE DIOS', apellido: 'RODRIGUEZ REYES', edad: 14, grado: '8A' },
  { documento: '1097114913', nombre: 'ISABELLA', apellido: 'ROMAN SERRANO', edad: 13, grado: '8A' },
  { documento: '1097504236', nombre: 'JUAN JOSE', apellido: 'SANCHEZ MURILLO', edad: 14, grado: '8A' },
  { documento: '1097112005', nombre: 'LAURA JOHANA', apellido: 'SANDOVAL SEPULVEDA', edad: 14, grado: '8A' },
  { documento: '1042860515', nombre: 'SUSANA ISABEL', apellido: 'SOTO TOVAR', edad: 14, grado: '8A' },
  { documento: '1142719203', nombre: 'LUKAS MATEO', apellido: 'URIBE HIGUITA', edad: 13, grado: '8A' },
  { documento: '1142718531', nombre: 'DANNA GABRIELA', apellido: 'VARGAS JAIMES', edad: 14, grado: '8A' },
  { documento: '1097505378', nombre: 'KEVIN SPENCER', apellido: 'VEGA ALDANA', edad: 13, grado: '8A' },
  
  // Grado 8B
  { documento: '1188214165', nombre: 'DANIEL ESTEBAN', apellido: 'AREVALO BRAVO', edad: 14, grado: '8B' },
  { documento: '1097109535', nombre: 'THOMAS JOSE', apellido: 'BLANCO SAAVEDRA', edad: 14, grado: '8B' },
  { documento: '1096071330', nombre: 'SAUL ANDRES', apellido: 'BOBADILLA SANCHEZ', edad: 13, grado: '8B' },
  { documento: '1010843531', nombre: 'MATILDE ISABEL', apellido: 'BOHÓRQUEZ FORERO', edad: 13, grado: '8B' },
  { documento: '1095313087', nombre: 'SAMUEL ARTURO', apellido: 'CASTRO MARTINEZ', edad: 13, grado: '8B' },
  { documento: '1098750506', nombre: 'MARIA JOSE', apellido: 'DUARTE MORALES', edad: 13, grado: '8B' },
  { documento: '1097109128', nombre: 'SANTIAGO', apellido: 'ESPITIA GALVÁN', edad: 14, grado: '8B' },
  { documento: '1097787577', nombre: 'MARY', apellido: 'FORERO MENESES', edad: 14, grado: '8B' },
  { documento: '1097914859', nombre: 'JUAN JOSE', apellido: 'GOMEZ VEGA', edad: 14, grado: '8B' },
  { documento: '1101692231', nombre: 'ANDRES FELIPE', apellido: 'GONZALEZ ARGUELLO', edad: 13, grado: '8B' },
  { documento: '1027285487', nombre: 'MARIANA', apellido: 'LADINO GIRALDO', edad: 14, grado: '8B' },
  { documento: '1142719351', nombre: 'JOSEPH EMMANUEL', apellido: 'MANTILLA MENDEZ', edad: 13, grado: '8B' },
  { documento: '1097505777', nombre: 'STEBAN', apellido: 'MEJIA CORREDOR', edad: 12, grado: '8B' },
  { documento: '1097113800', nombre: 'DIEGO ALEJANDRO', apellido: 'ORTIZ LANDAZURI', edad: 13, grado: '8B' },
  { documento: '1097788675', nombre: 'ANDRES SEBASTIAN', apellido: 'PARDO ARAQUE', edad: 13, grado: '8B' },
  { documento: '1097114337', nombre: 'JOSE ALEJANDRO', apellido: 'PATIÑO CARDENAS', edad: 13, grado: '8B' },
  { documento: '1096070055', nombre: 'FELIPE', apellido: 'PEDRAZA ZAPATA', edad: 14, grado: '8B' },
  { documento: '1097788294', nombre: 'KIARA ALEJANDRA', apellido: 'PINEDA SANTOS', edad: 13, grado: '8B' },
  { documento: '1097504065', nombre: 'JUAN FELIPE', apellido: 'RANGEL RUEDA', edad: 14, grado: '8B' },
  { documento: '1100962480', nombre: 'MARIA SALOME', apellido: 'REYES ARDILA', edad: 14, grado: '8B' },
  { documento: '1097787185', nombre: 'SAMUEL FELIPE', apellido: 'RUEDA LOZANO', edad: 14, grado: '8B' },
  { documento: '1097503979', nombre: 'JUAN ANDRES', apellido: 'SALAZAR GONZALEZ', edad: 14, grado: '8B' },
  { documento: '1097788874', nombre: 'DAVID ALEJANDRO', apellido: 'SARMIENTO LEON', edad: 13, grado: '8B' },
  { documento: '1097503609', nombre: 'MARIA JOSE', apellido: 'SERRANO FLOREZ', edad: 14, grado: '8B' },
  { documento: '1097505011', nombre: 'RAFAEL SANTIAGO', apellido: 'VALERO RIVEROS', edad: 13, grado: '8B' },
  { documento: '1097787234', nombre: 'SERGIO AUGUSTO', apellido: 'VARGAS ARDILA', edad: 14, grado: '8B' },
  { documento: '1011327088', nombre: 'SAMUEL ALEJANDRO', apellido: 'VILLAMIZAR MARTINEZ', edad: 14, grado: '8B' },
  { documento: '750714', nombre: 'VALENTINA', apellido: 'VIQUEIRA MEJIA', edad: 14, grado: '8B' }
];

async function insertarDatosCompletosSQL() {
  try {
    console.log('🔄 Iniciando inserción completa de datos...');
    
    // 1. Limpiar datos existentes usando SQL directo
    console.log('🗑️ Limpiando datos existentes...');
    
    const limpiarSQL = `
      -- Deshabilitar RLS temporalmente
      ALTER TABLE grupos DISABLE ROW LEVEL SECURITY;
      ALTER TABLE estudiantes DISABLE ROW LEVEL SECURITY;
      
      -- Limpiar datos existentes
      DELETE FROM estudiantes;
      DELETE FROM grupos;
    `;
    
    const { error: limpiarError } = await supabase.rpc('exec_sql', { sql: limpiarSQL });
    if (limpiarError) {
      console.log('⚠️ No se pudo ejecutar SQL directo, intentando método alternativo...');
      
      // Método alternativo: eliminar uno por uno
      await supabase.from('estudiantes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('grupos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }
    
    console.log('✅ Datos existentes eliminados');
    
    // 2. Crear grupos usando SQL directo
    console.log('📝 Creando grupos...');
    
    const crearGruposSQL = `
      INSERT INTO grupos (nombre, grado) VALUES 
      ('6B', '6'),
      ('8A', '8'),
      ('8B', '8')
      ON CONFLICT (nombre) DO NOTHING;
    `;
    
    const { error: gruposError } = await supabase.rpc('exec_sql', { sql: crearGruposSQL });
    if (gruposError) {
      console.log('⚠️ No se pudo crear grupos con SQL, intentando método alternativo...');
      
      // Método alternativo: crear uno por uno
      const grupos = [{ nombre: '6B' }, { nombre: '8A' }, { nombre: '8B' }];
      for (const grupo of grupos) {
        const { error } = await supabase.from('grupos').insert([grupo]);
        if (error && !error.message.includes('duplicate')) {
          console.error(`Error creando grupo ${grupo.nombre}:`, error.message);
        }
      }
    }
    
    // 3. Obtener IDs de grupos
    console.log('📋 Obteniendo IDs de grupos...');
    const { data: grupos, error: selectError } = await supabase
      .from('grupos')
      .select('id, nombre');
    
    if (selectError) {
      console.error('❌ Error obteniendo grupos:', selectError);
      return;
    }
    
    console.log('📋 Grupos disponibles:', grupos);
    
    if (!grupos || grupos.length === 0) {
      console.error('❌ No se encontraron grupos. Creando manualmente...');
      
      // Crear grupos manualmente
      const gruposCrear = ['6B', '8A', '8B'];
      for (const nombreGrupo of gruposCrear) {
        const { data: nuevoGrupo, error } = await supabase
          .from('grupos')
          .insert([{ nombre: nombreGrupo }])
          .select()
          .single();
        
        if (error) {
          console.error(`❌ Error creando grupo ${nombreGrupo}:`, error);
        } else {
          console.log(`✅ Grupo creado: ${nombreGrupo}`);
          grupos.push(nuevoGrupo);
        }
      }
    }
    
    // 4. Crear mapa de grupos
    const grupoMap = {};
    grupos.forEach(grupo => {
      grupoMap[grupo.nombre] = grupo.id;
    });
    
    console.log('🗺️ Mapa de grupos:', grupoMap);
    
    // 5. Insertar estudiantes
    console.log('👥 Insertando estudiantes...');
    
    let insertados = 0;
    let errores = 0;
    
    for (const estudiante of estudiantesReales) {
      const grupoId = grupoMap[estudiante.grado];
      
      if (!grupoId) {
        console.warn(`⚠️ Grupo ${estudiante.grado} no encontrado para ${estudiante.nombre}`);
        errores++;
        continue;
      }
      
      const estudianteData = {
        numero_documento: estudiante.documento,
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        edad: estudiante.edad,
        grupo_id: grupoId,
        password: estudiante.documento
      };
      
      const { error: insertError } = await supabase
        .from('estudiantes')
        .insert([estudianteData]);
      
      if (insertError) {
        console.error(`❌ Error insertando ${estudiante.nombre}:`, insertError.message);
        errores++;
      } else {
        insertados++;
        if (insertados % 10 === 0) {
          console.log(`✅ Insertados ${insertados} estudiantes...`);
        }
      }
    }
    
    // 6. Reactivar RLS
    console.log('🔒 Reactivando RLS...');
    const reactivarSQL = `
      ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
      ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;
    `;
    
    await supabase.rpc('exec_sql', { sql: reactivarSQL });
    
    // 7. Verificar inserción final
    console.log('🔍 Verificando inserción final...');
    const { data: estudiantesFinales, error: finalError } = await supabase
      .from('estudiantes')
      .select('*, grupos(nombre)');
    
    if (finalError) {
      console.error('❌ Error verificando inserción final:', finalError);
    } else {
      console.log(`✅ Total de estudiantes en la base de datos: ${estudiantesFinales.length}`);
      
      // Resumen por grado
      const resumen = {};
      estudiantesFinales.forEach(est => {
        const grado = est.grupos?.nombre || 'Sin grupo';
        resumen[grado] = (resumen[grado] || 0) + 1;
      });
      
      console.log('📊 Resumen final por grado:');
      Object.entries(resumen).forEach(([grado, cantidad]) => {
        console.log(`   ${grado}: ${cantidad} estudiantes`);
      });
    }
    
    console.log(`🎉 Proceso completado! Insertados: ${insertados}, Errores: ${errores}`);
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la función
insertarDatosCompletosSQL();