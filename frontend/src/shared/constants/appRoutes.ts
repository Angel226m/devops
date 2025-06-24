// Definición de rutas para toda la aplicación
export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    SELECT_SEDE: '/seleccionar-sede',
     RECUPERAR_CONTRASENA: '/recuperar-contrasena',
    CAMBIAR_CONTRASENA: '/cambiar-contrasena',
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
      
      // Nuevas rutas para traducciones (idiomas)
   HORARIOS: {
  SELECCION: '/admin/horarios',
  TOUR: {
    LIST: '/admin/horarios-tour',
    NEW: '/admin/horarios-tour/nuevo',
    EDIT: (id: string | number) => `/admin/horarios-tour/editar/${id}`,
    DETAIL: (id: string | number) => `/admin/horarios-tour/${id}`,
  
  
     PASAJES: {
      SELECCION: '/admin/pasajes',
      TIPOS: {
        LIST: '/admin/tipos-pasaje',
        NEW: '/admin/tipos-pasaje/nuevo',
        EDIT: (id: string | number) => `/admin/tipos-pasaje/editar/${id}`,
        DETAIL: (id: string | number) => `/admin/tipos-pasaje/${id}`,
      },
      PAQUETES: {
        LIST: '/admin/paquetes-pasajes',
        NEW: '/admin/paquetes-pasajes/nuevo',
        EDIT: (id: string | number) => `/admin/paquetes-pasajes/editar/${id}`,
        DETAIL: (id: string | number) => `/admin/paquetes-pasajes/${id}`,
      }
    },
    
  
  
  },
  CHOFER: {
    LIST: '/admin/horarios-chofer',
    NEW: '/admin/horarios-chofer/nuevo',
    EDIT: (id: string | number) => `/admin/horarios-chofer/editar/${id}`,
    DETAIL: (id: string | number) => `/admin/horarios-chofer/${id}`,
  }
},

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