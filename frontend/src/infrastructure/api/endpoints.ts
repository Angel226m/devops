 

export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    status: '/auth/status',
    userSedes: '/auth/sedes',
    selectSede: '/auth/select-sede',
     solicitarRecuperacion: '/admin/recuperar-contrasena', // Para usuarios administrativos
    solicitarRecuperacionCliente: '/clientes/recuperar-contrasena', // Para clientes
    validarToken: '/auth/validar-token',
    cambiarContrasena: '/auth/cambiar-contrasena',
  },
  sede: {
    base: '/sedes',
    byId: (id: number) => `/sedes/${id}`,
    byCiudad: (ciudad: string) => `/admin/sedes/ciudad/${ciudad}`,
    byPais: (pais: string) => `/admin/sedes/pais/${pais}`,
    restore: (id: number) => `/admin/sedes/${id}/restore`,
  },
  usuario: {
    base: '/admin/usuarios',
    byId: (id: number) => `/admin/usuarios/${id}`,
    byRol: (rol: string) => `/admin/usuarios/rol/${rol}`,
    idiomas: (userId: number) => `/admin/usuarios/${userId}/idiomas`,
    asignarIdioma: (userId: number) => `/admin/usuarios/${userId}/idiomas`,
    desasignarIdioma: (userId: number, idiomaId: number) => `/admin/usuarios/${userId}/idiomas/${idiomaId}`,
  },
  idioma: {
    base: '/idiomas',
    byId: (id: number) => `/idiomas/${id}`,
    admin: '/admin/idiomas',
    adminById: (id: number) => `/admin/idiomas/${id}`,
    usuarios: (idiomaId: number) => `/admin/idiomas/${idiomaId}/usuarios`,
  },
  embarcaciones: {
    base: '/admin/embarcaciones',
    porId: (id: number) => `/admin/embarcaciones/${id}`,
    porSede: (idSede: number) => `/admin/embarcaciones/sede/${idSede}`,
  },
 
   tiposTour: {
    // Rutas para admin
    list: '/admin/tipos-tour',
    getById: (id: number) => `/admin/tipos-tour/${id}`,
    create: '/admin/tipos-tour',
    update: (id: number) => `/admin/tipos-tour/${id}`,
    delete: (id: number) => `/admin/tipos-tour/${id}`,
    listBySede: (idSede: number) => `/admin/tipos-tour/sede/${idSede}`,
     
    // Rutas para vendedor
    vendedorList: '/vendedor/tipos-tour',
    vendedorGetById: (id: number) => `/vendedor/tipos-tour/${id}`,
     
    // Rutas para chofer
    choferList: '/chofer/tipos-tour',
    
    // Rutas para cliente
    clienteList: '/cliente/tipos-tour',
    clienteGetById: (id: number) => `/cliente/tipos-tour/${id}`,
     
    // Rutas públicas
    publicList: '/tipos-tour',
    publicGetById: (id: number) => `/tipos-tour/${id}`,
    publicListBySede: (idSede: number) => `/tipos-tour/sede/${idSede}`,
  },  horariosTour: {
    // Rutas para admin
    list: '/admin/horarios-tour',
    getById: (id: number) => `/admin/horarios-tour/${id}`,
    create: '/admin/horarios-tour',
    update: (id: number) => `/admin/horarios-tour/${id}`,
    delete: (id: number) => `/admin/horarios-tour/${id}`,
    listByTipoTour: (idTipoTour: number) => `/admin/horarios-tour/tipo/${idTipoTour}`,
    listByDia: (dia: string) => `/admin/horarios-tour/dia/${dia}`,
    
    // Rutas para chofer (solo lectura)
    choferList: '/chofer/horarios-tour',
    choferListByDia: (dia: string) => `/chofer/horarios-tour/dia/${dia}`,
    
    // Rutas para vendedor
    vendedorList: '/vendedor/horarios-tour',
    vendedorListByDia: (dia: string) => `/vendedor/horarios-tour/dia/${dia}`,
  },
  
  horariosChofer: {
    // Rutas para admin
    list: '/admin/horarios-chofer',
    getById: (id: number) => `/admin/horarios-chofer/${id}`,
    create: '/admin/horarios-chofer',
    update: (id: number) => `/admin/horarios-chofer/${id}`,
    delete: (id: number) => `/admin/horarios-chofer/${id}`,
    listByChofer: (idChofer: number) => `/admin/horarios-chofer/chofer/${idChofer}`,
    listActiveByChofer: (idChofer: number) => `/admin/horarios-chofer/chofer/${idChofer}/activos`,
    listByDia: (dia: string) => `/admin/horarios-chofer/dia/${dia}`,
    
    // Rutas para chofer
    misHorarios: '/chofer/mis-horarios',
    todosMisHorarios: '/chofer/todos-mis-horarios',
    
    // Rutas para vendedor
    vendedorListByDia: (dia: string) => `/vendedor/horarios-chofer/dia/${dia}`,
  },
   tipoPasaje: {
    // Rutas para admin
    list: '/admin/tipos-pasaje',
    getById: (id: number) => `/admin/tipos-pasaje/${id}`,
    create: '/admin/tipos-pasaje',
    update: (id: number) => `/admin/tipos-pasaje/${id}`,
    delete: (id: number) => `/admin/tipos-pasaje/${id}`,
    listBySede: (idSede: number) => `/admin/tipos-pasaje/sede/${idSede}`,
    listByTipoTour: (idTipoTour: number) => `/admin/tipos-pasaje/tipo-tour/${idTipoTour}`,
    
    // Rutas para vendedor
    vendedorList: '/vendedor/tipos-pasaje',
    vendedorGetById: (id: number) => `/vendedor/tipos-pasaje/${id}`,
    vendedorListBySede: (idSede: number) => `/vendedor/tipos-pasaje/sede/${idSede}`,
    vendedorListByTipoTour: (idTipoTour: number) => `/vendedor/tipos-pasaje/tipo-tour/${idTipoTour}`,
    
    // Rutas para cliente
    clienteList: '/cliente/tipos-pasaje',
    clienteListBySede: (idSede: number) => `/cliente/tipos-pasaje/sede/${idSede}`,
    clienteListByTipoTour: (idTipoTour: number) => `/cliente/tipos-pasaje/tipo-tour/${idTipoTour}`,
    
    // Rutas públicas
    publicList: '/tipos-pasaje',
    publicListBySede: (idSede: number) => `/tipos-pasaje/sede/${idSede}`,
    publicListByTipoTour: (idTipoTour: number) => `/tipos-pasaje/tipo-tour/${idTipoTour}`,
  },
  
  paquetePasajes: {
    // Rutas para admin
    list: '/admin/paquetes-pasajes',
    getById: (id: number) => `/admin/paquetes-pasajes/${id}`,
    create: '/admin/paquetes-pasajes',
    update: (id: number) => `/admin/paquetes-pasajes/${id}`,
    delete: (id: number) => `/admin/paquetes-pasajes/${id}`,
    listBySede: (idSede: number) => `/admin/paquetes-pasajes/sede/${idSede}`,
    listByTipoTour: (idTipoTour: number) => `/admin/paquetes-pasajes/tipo-tour/${idTipoTour}`,
    
    // Rutas para vendedor
    vendedorList: '/vendedor/paquetes-pasajes',
    vendedorGetById: (id: number) => `/vendedor/paquetes-pasajes/${id}`,
    vendedorListBySede: (idSede: number) => `/vendedor/paquetes-pasajes/sede/${idSede}`,
    vendedorListByTipoTour: (idTipoTour: number) => `/vendedor/paquetes-pasajes/tipo-tour/${idTipoTour}`,
    
    // Rutas para cliente
    clienteList: '/cliente/paquetes-pasajes',
    clienteListBySede: (idSede: number) => `/cliente/paquetes-pasajes/sede/${idSede}`,
    clienteListByTipoTour: (idTipoTour: number) => `/cliente/paquetes-pasajes/tipo-tour/${idTipoTour}`,
    
    // Rutas públicas
    publicList: '/paquetes-pasajes',
    publicListBySede: (idSede: number) => `/paquetes-pasajes/sede/${idSede}`,
    publicListByTipoTour: (idTipoTour: number) => `/paquetes-pasajes/tipo-tour/${idTipoTour}`,
  },


   galeriaTour: {
    // Rutas para admin
    create: '/admin/galerias',
    getById: (id: number) => `/admin/galerias/${id}`,
    update: (id: number) => `/admin/galerias/${id}`,
    delete: (id: number) => `/admin/galerias/${id}`,
    listByTipoTour: (idTipoTour: number) => `/admin/tipo-tours/${idTipoTour}/galerias`,
    
    // Rutas para vendedor (solo lectura)
    vendedorGetById: (id: number) => `/vendedor/galerias/${id}`,
    vendedorListByTipoTour: (idTipoTour: number) => `/vendedor/tipo-tours/${idTipoTour}/galerias`,
    
    // Rutas para cliente (solo lectura)
    clienteGetById: (id: number) => `/cliente/galerias/${id}`,
    clienteListByTipoTour: (idTipoTour: number) => `/cliente/tipo-tours/${idTipoTour}/galerias`,
    
    // Rutas públicas
    publicGetById: (id: number) => `/galerias/${id}`,
    publicListByTipoTour: (idTipoTour: number) => `/tipo-tours/${idTipoTour}/galerias`,
  },



  
// Endpoints de Tour Programado
 tourProgramado: {
    // Rutas para admin
    list: '/admin/tours',
    getById: (id: number) => `/admin/tours/${id}`,
    create: '/admin/tours',
    update: (id: number) => `/admin/tours/${id}`,
    delete: (id: number) => `/admin/tours/${id}`,
    forceDelete: (id: number) => `/admin/tours/${id}/force`,
    cambiarEstado: (id: number) => `/admin/tours/${id}/estado`,
    asignarChofer: (id: number) => `/admin/tours/${id}/chofer`,
    porFecha: (fecha: string) => `/admin/tours/fecha/${fecha}`,
    porRango: '/admin/tours/rango-fechas',
    porEstado: (estado: string) => `/admin/tours/estado/${estado}`,
    porEmbarcacion: (idEmbarcacion: number) => `/admin/tours/embarcacion/${idEmbarcacion}`,
    porChofer: (idChofer: number) => `/admin/tours/chofer/${idChofer}`,
    porTipoTour: (idTipoTour: number) => `/admin/tours/tipo-tour/${idTipoTour}`,
    porSede: (idSede: number) => `/admin/tours/sede/${idSede}`,
    programacionSemanal: '/admin/tours/programacion-semanal',
    programarSemanal: '/admin/tours/programacion-semanal',
    // Nuevos endpoints para vigencia
    porVigencia: '/admin/tours/vigencia',
    vigentes: '/admin/tours/vigentes',
    verificarDisponibilidad: '/admin/tours/verificar-disponibilidad',
    disponiblesEnFecha: (fecha: string) => `/admin/tours/disponibles-en-fecha/${fecha}`,
    disponiblesEnRango: '/admin/tours/disponibles-en-rango',

    // Rutas para vendedor (solo lectura)
    vendedorList: '/vendedor/tours',
    vendedorGetById: (id: number) => `/vendedor/tours/${id}`,
    vendedorPorFecha: (fecha: string) => `/vendedor/tours/fecha/${fecha}`,
    vendedorPorRango: '/vendedor/tours/rango-fechas',
    vendedorPorEstado: (estado: string) => `/vendedor/tours/estado/${estado}`,
    vendedorPorSede: (idSede: number) => `/vendedor/tours/sede/${idSede}`,
    vendedorDisponibles: '/vendedor/tours/disponibles',
    vendedorDisponiblesEnFecha: (fecha: string) => `/vendedor/tours/disponibles-en-fecha/${fecha}`,
    vendedorDisponiblesEnRango: '/vendedor/tours/disponibles-en-rango',

    // Rutas para chofer
    choferMisTours: '/chofer/mis-tours',
    choferGetById: (id: number) => `/chofer/tours/${id}`,
    choferProgramacionSemanal: '/chofer/tours/programacion-semanal',
    choferPorFecha: (fecha: string) => `/chofer/tours/fecha/${fecha}`,

    // Rutas para cliente
    clienteDisponibles: '/cliente/tours/disponibles',
    clienteDisponibilidadDia: (fecha: string) => `/cliente/tours/disponibilidad/${fecha}`,
    clienteGetById: (id: number) => `/cliente/tours/${id}`,
    clienteDisponiblesEnFecha: (fecha: string) => `/cliente/tours/disponibles-en-fecha/${fecha}`,
    clienteDisponiblesEnRango: '/cliente/tours/disponibles-en-rango',
    clienteVerificarDisponibilidad: '/cliente/tours/verificar-disponibilidad',

    // Rutas públicas
    disponibles: '/tours/disponibles',
    disponibilidadDia: (fecha: string) => `/tours/disponibilidad/${fecha}`,
    publicGetById: (id: number) => `/tours/${id}`,
    publicDisponiblesEnFecha: (fecha: string) => `/tours/disponibles-en-fecha/${fecha}`,
    publicDisponiblesEnRango: '/tours/disponibles-en-rango',
    publicVerificarDisponibilidad: '/tours/verificar-disponibilidad',
  },


instanciaTour: {
    // Rutas para admin
    list: '/admin/instancias-tour',
    getById: (id: number) => `/admin/instancias-tour/${id}`,
    create: '/admin/instancias-tour',
    update: (id: number) => `/admin/instancias-tour/${id}`,
    delete: (id: number) => `/admin/instancias-tour/${id}`,
    asignarChofer: (id: number) => `/admin/instancias-tour/${id}/asignar-chofer`,
    listByTourProgramado: (idTourProgramado: number) => `/admin/instancias-tour/tour-programado/${idTourProgramado}`,
    filtrar: '/admin/instancias-tour/filtrar',
    generar: (idTourProgramado: number) => `/admin/instancias-tour/generar/${idTourProgramado}`,
    
    // Rutas para vendedor
    vendedorList: '/vendedor/instancias-tour',
    vendedorGetById: (id: number) => `/vendedor/instancias-tour/${id}`,
    vendedorListByTourProgramado: (idTourProgramado: number) => `/vendedor/instancias-tour/tour-programado/${idTourProgramado}`,
    vendedorFiltrar: '/vendedor/instancias-tour/filtrar',
    
    // Rutas para chofer
    choferMisInstancias: '/chofer/mis-instancias-tour',
    
    // Rutas públicas
    publicDisponibles: '/instancias-tour/disponibles',
    publicByFecha: (fecha: string) => `/instancias-tour/fecha/${fecha}`,
  },
  // ... otros endpoints
};


