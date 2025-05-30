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
    // Rutas para admin - Ajustar según la estructura de tu API
    list: '/admin/tipos-tour',
    getById: (id: number) => `/admin/tipos-tour/${id}`,
    create: '/admin/tipos-tour',
    update: (id: number) => `/admin/tipos-tour/${id}`,
    delete: (id: number) => `/admin/tipos-tour/${id}`,
    // Para el filtro por sede, usa un query parameter en lugar de una ruta anidada
    listBySede: '/admin/tipos-tour',  // Usaremos ?id_sede=X
    listByIdioma: (idIdioma: number) => `/admin/tipos-tour/idioma/${idIdioma}`,
    
    // Rutas para vendedor
    vendedorList: '/vendedor/tipos-tour',
    vendedorGetById: (id: number) => `/vendedor/tipos-tour/${id}`,
    vendedorListBySede: '/vendedor/tipos-tour',  // Usaremos ?id_sede=X
    vendedorListByIdioma: (idIdioma: number) => `/vendedor/tipos-tour/idioma/${idIdioma}`,
  },
  // ... otros endpoints
};