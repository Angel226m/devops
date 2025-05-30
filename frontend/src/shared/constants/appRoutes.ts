// Definición de rutas para toda la aplicación
export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    SELECT_SEDE: '/seleccionar-sede',
  },
  
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    
    SEDES: {
      LIST: '/admin/sedes',
      NEW: '/admin/sedes/nueva',
      EDIT: (id: string | number) => `/admin/sedes/editar/${id}`,
      DETAIL: (id: string | number) => `/admin/sedes/${id}`,
    },
    
     
    
    USUARIOS: {
      LIST: '/admin/usuarios',
      NEW: '/admin/usuarios/nuevo',
      EDIT: (id: string | number) => `/admin/usuarios/editar/${id}`,
      DETAIL: (id: string | number) => `/admin/usuarios/${id}`,
    },
       IDIOMAS: {
      LIST: '/admin/idiomas',
      NEW: '/admin/idiomas/nuevo',
      EDIT: (id: string | number) => `/admin/idiomas/editar/${id}`,
    },
   GESTION_SEDES: {
      LIST: '/admin/gestion-sedes',
      NEW: '/admin/gestion-sedes/nueva',
      EDIT: (id: string | number) => `/admin/gestion-sedes/editar/${id}`,
      DETAIL: (id: string | number) => `/admin/gestion-sedes/${id}`,
    },

    EMBARCACIONES: {
      LIST: '/admin/embarcaciones',
      NEW: '/admin/embarcaciones/nueva',
      EDIT: (id: string | number) => `/admin/embarcaciones/editar/${id}`,
      DETAIL: (id: string | number) => `/admin/embarcaciones/${id}`,
    },
     TIPOS_TOUR: {
      LIST: '/admin/tipos-tour',
      NEW: '/admin/tipos-tour/nuevo',
      EDIT: (id: string | number) => `/admin/tipos-tour/editar/${id}`,
      DETAIL: (id: string | number) => `/admin/tipos-tour/${id}`,
    },
    TOURS_PROGRAMADOS: {
      LIST: '/admin/tours',
      NEW: '/admin/tours/nuevo',
      EDIT: (id: string | number) => `/admin/tours/editar/${id}`,
      DETAIL: (id: string | number) => `/admin/tours/${id}`,
    },
    // Otras rutas de administración...
  },
  
  VENDEDOR: {
    DASHBOARD: '/vendedor/dashboard',
    RESERVAS: '/vendedor/reservas',
    // Otras rutas de vendedor...
  },
  
  CHOFER: {
    DASHBOARD: '/chofer/dashboard',
    MIS_EMBARCACIONES: '/chofer/mis-embarcaciones',
    TOURS_ASIGNADOS: '/chofer/tours-asignados',
    // Otras rutas de chofer...
  },
  
  COMMON: {
    NOT_FOUND: '/404',
    ERROR: '/error',
  }
};

// Exportar también una versión simplificada para uso común
export default ROUTES;