export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    status: '/auth/status',
    userSedes: '/auth/sedes',
    selectSede: '/auth/select-sede',
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
  toursProgramados: {
    base: '/admin/tours',
    porId: (id: number) => `/admin/tours/${id}`,
    porFecha: (fecha: string) => `/admin/tours/fecha/${fecha}`,
    porRangoFechas: '/admin/tours/rango',
    porEstado: (estado: string) => `/admin/tours/estado/${estado}`,
    disponibles: '/admin/tours/disponibles',
    porSede: (idSede: number) => `/admin/tours/sede/${idSede}`,
    // Rutas para vendedor
    vendedorBase: '/vendedor/tours',
    vendedorPorId: (id: number) => `/vendedor/tours/${id}`,
    vendedorPorFecha: (fecha: string) => `/vendedor/tours/fecha/${fecha}`,
    vendedorPorRangoFechas: '/vendedor/tours/rango',
    vendedorPorEstado: (estado: string) => `/vendedor/tours/estado/${estado}`,
    vendedorDisponibles: '/vendedor/tours/disponibles',
    vendedorPorSede: (idSede: number) => `/vendedor/tours/sede/${idSede}`,
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
  }

  // ... otros endpoints
};