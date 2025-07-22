import { SociogramNode, SociogramEdge, SocialCluster } from './sociometricDataProcessor';

/**
 * Configuración para visualización del sociograma
 */
interface SociogramConfig {
  width: number;
  height: number;
  nodeRadius: number;
  linkDistance: number;
  charge: number;
  colors: {
    popular: string;
    promedio: string;
    aislado: string;
    rechazado: string;
    controvertido: string;
  };
  edgeColors: {
    eleccion: string;
    rechazo: string;
    reciprocaPositiva: string;
    reciprocaNegativa: string;
  };
 lors: {

   ng;
    alto: string;
   ring;
  };
}

/**
 * Datos para exportación del sociograma
 */
i{
];
  e;
  clusters: SocialCluster[];
  l
  config: SociogramConfig;
  metdata: {
    generatedAt: string;
    g;
    totalNodes: nuber;
    totalEdges:number;
  };
}

/**
 * Servicio m
 */
class SociogramVisualizationService {
  
  /**
   * Configuración por defecto mejorada
   */
  private default
    width: 1000,
    height: 700,
    nodeRadius: 25,
    linkDistance: 120,
    c
    colors: {
ante
     
      aislado: '#f59e0b',      // Naranja
     jo
      controvertido:ura
    },
    edgeColors: {
      eleccion: '#22c55e',
      rechazo: '#ef4444',
      reciprocaPositiva: '#1d4ed8',
      recip626'
    },
    Colors: {
      bajo: '#10b981',
      medio: '#f59e0b',
      alto: '#f97316',
      critico: '#dc2626'
    }
  };

  /**
   * Crear visuadas
   */
  createAdvancedSociogram(
    containerId: string,
    nodes: SociogramNode[],
    edges: SociogramEdge[],
    clusters: SocialCluster[],
{}
  ): void {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    // Limpiar contenedor existente
);
    if (!container) {
      console.error(`Contenedor ${containerId}`);
      return;
 }
    container.innerHTML = '';

    // Crear SVG principal
onfig);
    
    // Crear grupos para diferentes elementos
vg);
    
    // Calcular posiciones usando simulación de fuerzas mejorada
;
    
    // Dibujar clusters de fondo
;
    
    // Dibujar aristas con animaciones
;
    
    // Dibujar nodos con información 
;
    
    // Agregar leyenda interactiva
    
 
    /
    this.addInfoPanel(container, finalConfig);
    
    // Configurar simul
    this.configureSimulatio
    
    // Agregar interactividzada
    this.addAdvancedInteractivity(svg, nodeEters);
    
    zación
    this.addVisualizationControls(contaiig);
  }

  /**
   * Crear elemento SVG principal
   */
  priva

    svg.setAttribute('width', config.width.toString());
    svg.setAttribute('height', config.height.toString());
    svg.setAttribute('viewBox', `0 0 ${config.width} ${config.heigh
    sveb';
    svg.style.borderRadius =px';
    svg.style.backgroundColor
    container.appendChild(svg);
    
 filtros
    const defs = document.createElementN);
    
    // Filtro de sombra
    const shadowFilter = document;
    shadowFilter.setAttribute('id);
    shadowFilter.innerHTML = `
      <feDropShadow dx="2" dy="2" stdDeviation=">
    `;
    defs.appendChild(shadowFilter);
    
    // Patrón para nodos de alto riesgo
    const 
    riskPattern.setAttribute('id', 'riskPattern');
    riskPattern.setAttribute('patternUnits', 'use
    riskPattern.setAttribute('width', '4');
    riskPa;
    riskPattern.innerHTML = `
      <rect width="4" height="4" fill="#dc2626"/>
      <rec
    `;
    defs.appendChild(riskP;
    
    svg.appendChild(defs);
    returvg;
  }

  /**
   * Crear grupos SVG organizados
   */
  private createSVGGroups(svg: SVGSVGElement) {
    const clustersGroup = document.createElementNS();
    cluste');
    svg.appendChild(clustersGroup);

    const edgesGroup = document.createElementNS('http://www.wvg', 'g');
    edgesGs');
    svg.appendChild(edgesGroup);

    const nodesGroup = document.createElementNS('h
    nodesG
    svg.appendChild(nodesGroup);

    return;
  }

  /**
   * Crear simulación de f
   */
  privateg) {
emplo
    // En una implementa
    
    const positions = new Map<string, { x: nr }>();
    
    // I
    nodes.forEach((node, index) => {
      const angle = (index / nodath.PI;
      co 0.3;
      positions.set(node.id, {
        x: config.width / 2 + Math.cos(angle) * radius,
        y: config.height / 2 + Math.sin(angle) * radius,
        v
      0

    });


     ({
        ...node,
     
      })),
      edges,
      positions,
      tick: () => {}, // Placeholder para función de tick
      restart: () => {}, //o
      stop:
    };
  }

  /**
   * Dibujar clusters mejorados con informació
   */
  private drawEnhancedClusters(

    clusters: SocialCluster[],
fig
  ): void {
    clusters.forEach((cluster, index) => {
      if (cluster.members.length < 2) return;

      // Crear grupo para el cluster
      const clusterGroup = document.cre 'g');
      clusterGroup.setAttribute('class', `cluster cluster-${cluster.id}`);
      
      // Color basado en tipo de cluster
      const hue = (index * 60) % 360;
      `;
      

      const clusterArea = docse');
      clusterArea.setAttribute('cx', (config.width / 2).toString());
      clusterArea.setAttribute('cy', (config.height / 2).toString());
;
      clusterArea.setAttribute('ry', '80');
      clusterArea.setAttribute('fill', clusterColor);
      clusterArea.setAttribute('fill-opacity', '0.2');
      clusterArea.setAttribute('stroke', clusterCo
      clusterArea.setAttribute('stroke-width '2');
      clusterArea.setAttribute('stroke-dasharray;
      
      clusterGroup.appendChild(clusterArea);

      // Etiqueta del cluster
      c;
    ;
;
     middle');
      label.setAttribute('font-size', '
      'bold');
      label.setAttribute('fill', `hsl(${hue}, 50%, 40%)`);
      label.textContent = `${cluster.name})`;
    
      clusterGroup.appendChild(label);

    uster
      if (cluster.riskFactors.length > 0) {
        const riskIndicator = document.cle');
        riskI;
        risk);
        8');
');
        riskIndicator.setAttribute('stroke', '
        riskIndicator.s;
        
        const riskTitle = document.createElementNS('http://www.;
        riskTitle.textContent = `Factores de riesgo: ${cluster.
        riskIndicator.appendChild(riskTitle);
   
        clus);
      }

      group.appendChild(clurGroup);
    });
  }

*
   * 
   */
  pri
    group: SVGGElement,
    edges: SociogramEdge[],
    mConfig
  ): SVGLineElement[] {
    const linkElements: SVGLineElement[] = []

    e{
      const line 
    
      
    
 '0');
     
      line.setAttrib;
     
      
      // Estilo según t
      let color = config.ed;
      let strokeWidth = '2';
      let strokeDasharray =e';
      let o
      
      switch (edge.type) {
        case 'rechazo':
      ;
          strokeDasharray = '5,5';

        case 'reciproca-positiva':
          color = config.edgeColors.reciprocaPositiva;
          strokeWidth = '3';
          opacity = '0.9';
          break;
      ':
          color = config.edgeColors.rva;
          strokeWidth = '3';
          strokeDasharray = 
          break;
      }
      
      line.setAttributeor);
      line.setAttribute('stroke-width', stro);
      line.setAttribute('opacity',);
      if (stroke') {
        line.setAttribute('stroke-
      }
      
      // Tooltip
      const title = document.creat);
      title.textContent = `${edge.type} (peso: ${edge.d(1)}%)
Contexto: ${edge.context.joi
      line.appendChild(title);
      
      /lación
      ;
      
      group.appendChild(line);
      linkElements.push(line);
    });

    return linkElements;
  }

  /**
   * Dibujar nodos mejorados con información completa
   */
  priv(
    group: SVGGElement,
    nod,
    
{
    c[] = [];

    n
      const 
      nodeGroup.setAttrus}`);
      nodeGroup.setAttributón
      
      // Círculo principal el nodo
      const');
      
      // Tamaño basado en popularidad e iocial
      const baseRadius us;
* 5;
      circle.setAttribute;
      
      // Color basado en estatus social
      const fillColor = config.colors[node.socialStatus];
      llColor);
      circle.setAttribute('stroke', '
      circle.setAttribute('stroke-width', '2');
      
      
      const opacity = Math.max(0.4, 1 -
      circle.setAttribute('opacity', opacity.toString
      
      // Filtro de sombra para nodos importa
      if (node.socialInfluence > 50 || node.riso') {
      )');
      }
      
      nodeGroup.appendChild(circle);

      // Indicadesgo
      if (node.riskLevel === 'alto' || node.riskLevel === 'critico') {
        const riskRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        riskRing.setAttribute('r);
      );
        riskRing.setAttribute('s
;
        riskRing.setAttrib, '3,3');
        
        // Animación para casos críticos
        if (node.riskLevel === 'critico') {
          const animate = document.createElementN
          animate.setAttribute('attributeNa
          animate.setAttribute('values', '1;0.31');
          animate.setAttribute('dur', '2s');
          animate.setAttribute('repeatCount', 'ind);
      e);
        }
        
        nodeGroup.appendChild(riskRing);
      }

n nombre
      const text = document.createEle;
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '0.35em');
      text.setAttribute('font-size', '10');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#333');
      te);
      
      // Nombre abreviado
      const shortName = n'');
      text.textContent = shortName;
      
      nodeGroup.appendChit);

      // Indicadoring
      if (node.bullyingRole !== 'no-
        const roleIndicator = document.;
        roleIndica;
        r);
        );
        
        let indicatorColor = '#666';
        let roleSymbol = '?';
        
        switch (node.bullyingRole) {
          case 'agresor':
            indicatorColor = '#dc2626';
        ;
            break;
       
       
    = 'V';

     r':
            indicato';
     VP';
            break;
          case 'observador':
            indicatorColor = '#6b7280';
            roleSymbol = 'O';
    break;
        }
        
        roleIndicator.setAttribute('fi
        roleIndicator.setAttribute('stfff');
        roleIndicator.setAttribute('stroke-w');
        
        const roleText = document.createElementNS('http://www.w3);
        roleText.setAttribute('x', (radius - 8
        roleText.setAttribute('y', (-ra
        roleText.setAttribute('text-anchiddle');
em');
        roleT');
        roleText.setAttribute('font-weight', 'bold');
        roleText.setAttribute('filf');
        roleText.setAttribute('poine');
        roleText.textContent = roleSymbol;
        
        nodeGroup.appendChild(roleator);
        nodeGroup.appendChild(roleTt);

        const roleTitle;
        roleTitle.textRole}`;
        roleIndicator.appendChild(roleTitle);
      }

      // Tooltip completo
      const tooltip = document.createElementNS('http:/title');
      e.name}
ge}
Estatus Social: ${node.socialStatus}
Rol de Bullying: ${node.bullyinge}
Popula}%
Rechazo: ${node.rejectionScore.toFixed(1)}%
Aislamiento: ${node.isolationIndex.toFd(1)}%
Centralidad: ${node.centralityMeasure.toFixed(
Amistades Recíprocas: ${node.reciproships}
Influencia Social: ${node.socialInfluence.toFixed(1)}%
Nivel de Riesgo: ${node.riskLevel}`;
      nodeGroup.appendChild(tooltip);

      // Agregar datos para la simulación
      (nodeGroup as any).__data__ = 
      
      group.appendChild(nodeGroup);
      nodeElements.push(nodeGroup);
    });


  }

  /**
   * Agregar leyenda interactiva
   */
  private addInteractiveLegend(svg: SVGSVGElement, config:oid {
    const legendGroup = document.createEleg');
    legendGroup.setAttribute('class', 'legend');
    legendGroup.setAttribute('transform', 'translate(20, 20)');
    
    // Fondo de la leyenda
);
    background.setAttribute('x', '0');
    background.setAttribute('y', '0');
    background.setAttribute('width', '250');
    background.setAttribute('height', '280');
    background.setAttribute('fill', 'rgba(2.95)');
    background.setAttribute('stroke', '#d1d');

    legendGroup.appendChild(background);

    // Título
    const title = document.createElementNS(
    title.setAttribute('x', '15');
    title.setAttribute('y', '25');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#374151');
;
    legendGroup.appendChild(title);

    // Estatus sociales
    const statuses = [
      { key: 'popular', label: 'Popular', 
      { key: 'promedio', label: 'Promedio',l' },

      { key: 'rechazado', label: ' },
    o' }
  ];

    statuses.forEach((statu
     dex * 25;
      
      const circle = do
      circle.setAttribute('
      circle.setAttribute('ing());
      circle.setAttribute('r', '8');
      circl]);
      circle.setAttribute('stroke', '#333');
    );

      const label = document.cret');
      ');
      label.setAttribute('y', (y + 4).toString());
      label.setAttribute('font-size',
      label.setAttribute('font-weight', '600');
      lab');
      
      legendGroup.appendChild(label);

      const description = document');
      des);
      ing());
      description.setAttribute('font-size', '10');
      description.setAttribute('fill', '');
      description.textContent = sta
      leg);
    });


    c
    
    c);
    relationTitle.setAttribute('x', '15');
    relationTitle.setAttribute('y', relationY.tong());
    relationTitle.setAttribute('font-size', '14');
    re
    74151');
    relationTitle.textContent = 'Tipos de Rel
    legendGroup.appendChild(relation

    const relations = [
      {,

      { type: 'reciproca-positiva', lae },
      { type: 'reciproca-negativa', label: 'Recíproca -', c
    ];

    relations.forEach((relation, index) => {
      const y = relationY + 20 + index * 15;
      
      cne');
      l5');
    
      line.setAttribute('x2', '35');
      line.setAttribute('y2', y.toStg());
      line.setAttribute('stroke', relation.color);
      line.setAttribute('stroke-width', '2');
      if (rela{
        line.setAttribute('stroke-dasharray', '3,3');
      }
      l);

xt');
     );
      label.setAttribute('y';
     1');
      label.setAttribute('fill', '#374151');
      label.textContent = relation.label;
      legendGroup.appendChild(label);
    ;

    svg.appendChild(legendGroup);
  }

  /**
   * Agregar panel de información
   */
  priva
    

    i
      position: absolute;
     x;
      right: 20px;
      width: 300px;
      background: rgba(255;
      border: 1px solid #d1db;
      border-radius: 8p
      ng: 15px;
      font-family: system-uif;
      font-size: 14px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: none;
    `;
    
    container.style.';
    container.appendChild(infoPanel);
  }

  /**
   * Configurar simulación con elementos
   */
tion(
    sny,
    linkElements: SVGLineElement[],
    n,
    nodes: SociogramNode[],
    edges: SociogramEdge[]
  ): void {

    // En una implementación real con D3.js, co
    
 () => {
      // Actualizar posiciones de aristas
      linkElements.forEach((link, index) => {
        const edge = edges[index];
        const sourceN;
;
        
        if (sourceNode && ta
    ());
          link.setAttrib;
          link.setAttribute('x2ing());
          link.setAttribute('y2',());
        }
      
      
      // Actualizar posiciones odos
      nodeElements.forEach((nodeGroup> {
        const node ex];
      
    
        }
    ;
  };
  }

  /**
   * Agregar interactida
   */
  private addAdvancedIntera
    svg: SVGSVGElement,
    nodeElements: SVGGElement[],
    linkElent[],
    nodes: SociogramNode[],
    edges: S[],
    clusterser[]
  ): void {
    const infoPanel = anel');
    
    no {
ex];
      
      nodeElement.addEventListener('mouseover', () => {
    
        this.highlightNodeConnections(svg, no;
        
        // Mostrar informació
        if (infoPel) {
   );
  ock';
    }
      });
        nodeElement.addEventListener('mouseout', () = };amExportDataiogronfig, SocgramCciope { Sort tye();
expoationServicVisualizw Sociogramt default neexpor }
}

);
 click(
    link. = filename;wnload    link.doaBlob);
atectURL(dreateObjURL.clink.href = 
    t('a');eElemenument.creatt link = doc   cons});
    
 n' on/jso'applicatie:  { typataStr],lob([d = new Bnst dataBlob    co 2);
a, null,rtDatgify(expo.strin= JSONt dataStr   cons };

   }
   h
     .lengtes: edgesotalEdg t
       ngth,des.les: nootalNode   to,
     roupInf
        gSOString(),oIte().tt: new DaneratedA
        geadata: {
      metnfig,Cohis.defaultg: tconfi     orce',
 'f  layout: s,
       clusters,
   
      edge nodes,   Data = {
  ramExportData: Sociogort exp
    const {oid: vs.json'
  )ma-datoiograoc string = 's  filename:o: any,
    groupInfuster[],
  ocialClrs: Sluste c
   e[],SociogramEdg    edges: de[],
ogramNo Soci
    nodes:mData(ortSociograexp
    */ograma
 el socis ddatortar 
   * Expo

  /**
  }.');
    }vonta de nuer, inte favo imagen. Portar laxpor'Error al elert(r);
      aagen:', error im exportar al('Erroole.error
      consr) {catch (erro)));
    } ent(svgDataURIComponscape(encodetoa(unee64,' + b/svg+xml;basa:image= 'dat  img.src    
 };
      ();
      ckli   link.c
     );image/png'aURL('anvas.toDat= cf hre      link.e;
  ad = filenamlo link.down;
       ')nt('aeateElemeument.crdocnk =   const li      carga
nlace de desCrear e    //       
    0);
  ge(img, 0, tx.drawIma       c    
 ght);
    canvas.heias.width, nv callRect(0, 0,  ctx.fi';
      'white= Style  ctx.fillnco
       o bla/ Fond 
        /
       ht;t = img.heigvas.heigh   candth;
     h = img.wias.widt      canv=> {
  nload = ()      img.o 
 );
      new Image( const img =    
 ring(svg);eToStserializalizer().ri XMLSe = new svgData   const
   
rn;!ctx) retuf (    i  '2d');
text(anvas.getCon= ctx  c      constnvas');
'caement(nt.createElvas = documet can consión
     tac la exporanvas parar c    // Crea   try {
  
 eturn;
f (!svg) r
    i'svg');ctor(ySeleer.querainntnst svg = co

    coner) return;(!contaiif d);
    tainerIyId(contB.getElemennter = documest containconid {
    png'): voiograma.ing = 'soctrname: s, filed: stringainerIsImage(contramAciog exportSo  */
 agen
 como imciograma so Exportar *
   *

  /*
  }ular';nitoreo regContinuar mo '- ('\n') :.joinnscommendatio0 ? rength > dations.le recommeneturn  
    r     }
rupal');
 ción gstructuraee rerar- Considpush('ations.  recommend);
    upo'gras del lemáticicas probámdar din('- Abor.pushommendations   rec > 0) {
   lengthskFactors.& cluster.riluster &(c  
    if 
  ');
    }onflictoslución de c en resoaracit.push('- Captionscommenda  res');
    toremas de menr en prograInvolucra- sh('s.puonmmendati
      recovo');positizgo eraar lidech('- Aprovpushons.ecommendati  r  
  > 70) {lInfluence cianode.sopopular' && tatus === 'ialS(node.soc if 
    
    }erca');
   ión de ctuacorear siush('- Monit.pndationsecomme     rento');
  afrontamitegias deestraEnseñar - ush('ions.pcommendat;
      retividad')stima y aserutoer a- Fortaleceh('ions.pusmendatcom   re
   ) {ima'e === 'victyingRol(node.bull   
    if 
    }
 amilia');r a la flucra('- Invo.pushndations  recomme
    ');claroslímites tablecer - Esns.push('ommendatio
      recsividad');de agree manejo rograma dsh('- Pendations.puecomm
      r') {resorle === 'agullyingRof (node.b  
    i   }
  onales');
 erss interplictoediar conf Mh('-ndations.pusmmeeco     r
  sociales');esabilidad hrabajars.push('- Tommendation     recechazo');
 ausas del rr cga- Investitions.push('daommen  rec
    do') {za'rechatus === lSta (node.socia 
    if      }
 ;
 de apoyo')roar compañeush('- Asignndations.pcomme    re);
  s' grupaletividadesción en actar integraFaciliush('- ations.pommend{
      rec 'aislado') Status ===ocialf (node.s i
       }
    ');
 protecciónntar plan de'- Implemeions.push(commendat
      retal');de salud menional  a profesivar- Derpush('ndations. recomme   rida');
  uediata reqmeción inrvennteTE: I('- URGENpushons.commendati {
      recritico')evel === 'de.riskL if (no 
    = [];
   []ions: stringcommendatnst re co  
 : string {uster)?: SocialClode, clusterramNde: Sociognos(ionmmendatentReconerateStude ge
  privatte
   */ un estudiancas paranes específindacioomeecrar rGene  * 

  /**
 
  }nteal más elega modsar un utación real,implemenEn una / ext); /t(analysisT
    aler  
  
    `;er)}udentClusts(node, stmendationtudentRecom.generateS{thisIONES:
$RECOMENDAC}

ficado'enti id clusterningúnpertenece a o  Nype}` : '-ster.tntCluo: ${stude de grup Tipo)}%
-xed(1.toFir.cohesionudentClustestl grupo: ${hesión de- Coer.name}
Clustnt${studece al  Pertene`- ? erClust
${studentL:NENCIA GRUPA}%

PERTEd(1)oFixee.tuencalInflde.soci: ${noa social- Influencis}
dshipenocalFrie.reciprocas: ${nodpres recí Amistadlength}
-Connections.rongtes: ${stes fuer- Conexion.length}
ions: ${connectesexiononl de cLES:
- TotaCIANES SO
CONEXIOkLevel}
de.ris: ${no de Riesgoelle}
- NivyingRollnode.bul: ${ RoLLYING:
-CAS DE BU%

DINÁMIoFixed(1)}re.teasuyMde.centralitad: ${no- Centralid1)}%
toFixed(x.solationInde${node.iiento: %
- Aislamd(1)}ore.toFixeSc.rejectionnodeechazo: ${1)}%
- RFixed(yScore.toritopulad: ${node.prida
- PopulaialStatus}de.socno ${al:status SociICO:
- ESOCIOMÉTR
PERFIL grade}
e.o: ${nod
- Grade.gender}ero: ${nodénaños
- Gge} ${node.a: A:
- EdadIÓN BÁSICRMACINFOe.name}

LLADO: ${nodS DETA= `
ANÁLISIlysisText st ana  
    con= 3);
  .weight >(e => eilternections.fonections = c strongConn;
    constd)== node.i| e.target = node.id |rce ===oue => e.sfilter(s = edges.nnectionconst coxiones
    coneAnalizar / 
    
    /);ode.id)includes(nc.members.ind(c =>  clusters.fentCluster =st studcon
    diantetuter del escontrar clus
    // Enoid {
  ): vuster[]s: SocialCluster    clramEdge[],
ciogs: So   edge,
 mNode[]ogras: SocillNode    a,
deSociogramNo  node: (
  tAnalysisStudene showvat */
  printe
  del estudiallado etaálisis dostrar an M**
   *
  }

  / `;
   iv>>
      </dd(1)}%</divFixeuence.toInflal.socioderong> ${nSocial:</sta ciuenfl>Instrong      <div><>
  </divriendships}eciprocalF ${node.rrong>:</stcasproRecídes istaong>Amiv><str
        <d>th}</diveng.ltionsConnec${negativestrong> egativas:</ones Nexi>Controngiv><s       <dh}</div>
 ns.lengtnectiotiveConrong> ${posiitivas:</stnexiones Posng>Co <div><stro     iv>
  
      <d      </div>div>
d(1)}%</.toFixeyMeasurecentralitong> ${node./str:<idadralCentrong>   <div><st  div>
   )}%</toFixed(1Index.e.isolation${nodg> onnto:</strlamiestrong>Aisv>< <di   
    iv>1)}%</ded(nScore.toFixrejectio ${node.trong>echazo:</s>Rv><strong    <didiv>
    </xed(1)}%tyScore.toFiularie.popng> ${noddad:</strong>Populariro   <div><st">
     ; 15pxbottom:"margin-tyle=<div s        </div>

    /span></div>vel}<e.riskLeodold;">${n-weight: b}; fontiskLevel]e.rColors[nodiskultConfig.r ${this.defale="color: <span stygo:</strong>Riesvel de trong>Niv><s        <didiv>
Role}</ing.bully> ${noderong/stg:< Bullyindel v><strong>Ro  <didiv>
      </pan>us}</ssocialStat${node.d;"> boleight:nt-wtus]}; fosocialStaors[node.ig.coltConfthis.defaul"color: ${an style=sp</strong> < Social:statusv><strong>Edi  <
       15px;">tom:rgin-botstyle="madiv      <iv>
 </d>
      e}</divde.gradng> ${noroado:</st>Griv><strong        <ddiv>
ender}</e.gtrong> ${nodero:</strong>Gén    <div><s   </div>
 ñosode.age} aong> ${n:</strdadrong>E<st    <div>>
    5px;"om: 1bott="margin-<div style    
  /div>}
      <me{node.na      $937;">
  r: #1f2lopx; cotom: 10 margin-botsize: 16px;ont-bold; f-weight: "fontstyle=      <div 
= `rHTML Panel.inneinfo
        egativa');
ciproca-ntype === 're || e.'rechazo' === ype=> e.tfilter(e ions.= connectections gativeConnt ne    consitiva');
iproca-pose === 'recon' || e.typ 'elecci e.type ===er(e =>.filtionsnect = conctionsveConnesitionst poid);
    ce.rget === node.ta || === node.id=> e.source lter(e .fiedgesections = st conn
    convoid {: []
  )ramEdge: Sociog edges[],
   iogramNode: Soc    allNodes
ogramNode,ode: Soci nment,
   EleoPanel: HTMLfo(
    infiledNodeInwDeta sho  private  */
nodo
 el tallada dformación dear intr
   * Mos  }

  /**);
';
    }dth = 'trokeWient.style.sem  linkEl
     = '';.opacityylet.stemeninkEl
      lent => {h(linkElem.forEacnkElements    li

    ;
    });city = ''.opalement.style    nodeE
  lement => {Each(nodeEElements.for    noded {
 ): voient[]
 lemneE SVGLits:Elemen,
    linkt[]mens: SVGGElenodeElement
    lement, SVGSVGE
    svg:t(gh resetHighli
  private
   */ado normaltaurar est*
   * Res /* }

 
    });
 ;
      }ty = '0.2'e.opaciement.stylnkElli      lse {
  
      } e'1';acity = t.style.oplemen   linkE
     dth = '4';yle.strokeWikElement.st
        lin) {== nodeId) =edge.targetnodeId ||  === urcege.soe && (ed     if (edgdex];
 [indgesge = e   const edx) => {
   , indeent((linkElemforEachnts.Eleme
    link });
      }
    '1';
     =itytyle.opacent.s nodeElem       se {

      } elty = '0.3';aci.oplement.style  nodeE   .id)) {
   dehas(noes.tedNod&& !connecode  if (n_;
     y).__data_s aneElement a(nodnode = const      {
  dex) =>ment, inElech((nodents.forEadeEleme
    noconectadosos no element // Atenuar });

   et);
    edge.targadd(s.detedNo     connece);
 e.sourcodes.add(edg connectedN     > {
ge =rEach(ed.fotedEdgesnec;
    conng>()stri= new Set<s ctedNodeconst conne     );
    
eId
   get === nod edge.tarId ||ce === nodeurge.so
      eder(edge => s.filtges = edgeonnectedEdnst c  co {
  ]
  ): voidment[leVGLineE: SkElementslin  ment[],
  leGE SVGdeElements:    nodge[],
ociogramEedges: S
    d: string,,
    nodeIElementGSVG  svg: SV  nections(
ightNodeConivate highl */
  pr un nodo
  deones altar conexi
   * Res/**    }

;
;
    })ontainer.id)ramAsImage(cSociogortthis.exp     
 > {', () =r('clickventListene)?.addEport-image'('exyIdtElementB.geentcum  
    do;
     })sta...');
 do vi('Centran console.logsta
     rado de vientar cent   // Implem) => {
   k', (ner('clictListeaddEvenr-view')?.centetById('getElemenment.  docu
       });
 ;
  .restart()  simulation => {
    click', ()ntListener('addEve')?.onulatit-simById('restargetElementnt. docume
   esos botond a lidacionalAgregar fun
    //   anel);
  sPntrolndChild(copentainer.ap  
    co    `;
  
</button>  n
    Image Exportar ">
       ter;poincursor: : white; kgroundbacius: 4px; der-radbor5db; lid #d1d: 1px soborderpx 10px; adding: 5e="ptyl" sort-image"exp <button id=
     ton>
      </butstatrar Vi
        Ceninter;">sor: po white; curkground:acdius: 4px; ber-rab; bordd #d1d5der: 1px soli0px; bordng: 5px 110px; paddit: "margin-righ style=er-view"="centn idto
      <buttton>bu      </imulación
 S   Reiniciar>
     ter;" poin cursor:hite;d: wckgroun baadius: 4px;r-rdb; borde#d1d5lid so: 1px rder; bo 5px 10pxpx; padding:ght: 10"margin-rile=" styulationsimestart-="rton id  <but</div>
    isualizaciónles de V">Contro; boldt:t-weigh 10px; fonm:margin-botto="div style
      < `rHTML =anel.inne controlsP
    
   `; 0.1);
     0, rgba(0, 0,: 0 4px 6pxowbox-shadx;
      size: 14p     font-f;
 -serisanstem,  -apple-sys: system-ui,familynt-    fo
   15px;ing:addpx;
      ps: 8radiu     border-;
 5db solid #d1dorder: 1px b     0.95);
  255, 255,d: rgba(255,rounkg  bacpx;
        left: 20
  0px;tom: 2  bot    ;
ute absol  position:
    = `yle.cssText sPanel.st control');
   ment('divreateEle.cnt documelsPanel = contro
    const { void
  ):ConfigSociogram   config: ion: any,
  simulatent,
   lemHTMLEainer: cont    ntrols(
ualizationCodVisprivate ad
  
   */alización de visuntrolesar coAgreg/**
   * 

  );
  });
    } }
         };
     = 'grab'cursorle.ement.styeEl       nodalse;
   ing = fagg isDr     ing) {
    isDragg       if (
 p', () => {ouseu('mstenertLi.addEven   document
   );
      }
      }
        lientY;artY = e.c   st      .clientX;
 rtX = esta
          
          }y})`);rrentY + dx},${cuentX + de(${curr', `translatransformbute('tetAttrint.seEleme         nod);
   at(match[2] = parseFlorrentY   const cu         
atch[1]);loat(mntX = parseFurre const c
           h) {f (matc         i\)/);
 ^)]+)\(([^,]+),([ateranslatch(/tnsform.m currentTrat match =cons    ;
      ate(0,0)'|| 'transl) form''transtribute(t.getAteElemen nodTransform =urrent const c         tY;
entY - star.clit dy = e cons
         X;X - start.client dx = eonst       c
   ) {(isDragging     if 
   (e) => {e', er('mousemovstenLiddEvent  document.a
    
      
      });ing';r = 'grabbsont.style.cur  nodeElemetY;
      clientY = e.    star    
ientX;X = e.clstart        e;
g = truaggin     isDr  (e) => {
 own', ener('mousedddEventListement.adeEl  no  
  0;
      = , startY t startX = 0
      le = false;sDragging
      let icada)lifiación simpmentmpleles (irastrabdos ar// Hacer no      );
      
     }rs);
 ges, clustes, edode, nodetAnalysis(nshowStuden      this.
  estudianteo del is detalladnális// Mostrar a {
         =>('click', ()ventListenerlement.addE   nodeE    
      });
  
          }'none';
 ay = .style.displfoPanel          in {
Panel)if (info         
       ments);
ts, linkEle nodeElemenghlight(svg,resetHi this.       do normal
estaar   // Restaur{
      > 
    