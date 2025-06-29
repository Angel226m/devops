// Definición de rutas para toda la aplicación
/*export const ROUTES = {
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
   /* RESERVAS: '/vendedor/reservas',*/
   /*son para lo de de ptur disponible no tocar s *//*
   RESERVAS: {
      LIST: '/vendedor/reservas',
      NUEVA: '/vendedor/reservas/nueva',
      DETAIL: (id: string | number) => `/vendedor/reservas/${id}`,
      EDIT: (id: string | number) => `/vendedor/reservas/editar/${id}`,
    },
    TOURS: '/vendedor/tours',
       CLIENTES: '/vendedor/clientes', // Simplificado a una sola ruta base

    PAGOS: '/vendedor/pagos',
    SOPORTE: '/vendedor/soporte',
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
export default ROUTES;*/


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
    },
    
    HORARIOS: {
      SELECCION: '/admin/horarios',
      TOUR: {
        LIST: '/admin/horarios-tour',
        NEW: '/admin/horarios-tour/nuevo',
        EDIT: (id: string | number) => `/admin/horarios-tour/editar/${id}`,
        DETAIL: (id: string | number) => `/admin/horarios-tour/${id}`,
      },
      CHOFER: {
        LIST: '/admin/horarios-chofer',
        NEW: '/admin/horarios-chofer/nuevo',
        EDIT: (id: string | number) => `/admin/horarios-chofer/editar/${id}`,
        DETAIL: (id: string | number) => `/admin/horarios-chofer/${id}`,
      }
    },
    
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
    
    TOURS_PROGRAMADOS: {
      LIST: '/admin/tours',
      NEW: '/admin/tours/nuevo',
      EDIT: (id: string | number) => `/admin/tours/editar/${id}`,
      DETAIL: (id: string | number) => `/admin/tours/${id}`,
    },
  },
  
  VENDEDOR: {
    DASHBOARD: '/vendedor/dashboard',
    
    // Rutas de reservas mejoradas
    RESERVAS: {
      LIST: '/vendedor/reservas',
      // Funciones específicas para manejar parámetros de consulta
      NUEVA: '/vendedor/reservas/nueva',
      NUEVA_CON_INSTANCIA: (instanciaId: string | number) => 
        `/vendedor/reservas/nueva?instanciaId=${instanciaId}`,
      NUEVA_CON_CLIENTE: (clienteId: string | number) => 
        `/vendedor/reservas/nueva?clienteId=${clienteId}`,
      NUEVA_COMPLETA: (instanciaId: string | number, clienteId: string | number) => 
        `/vendedor/reservas/nueva?instanciaId=${instanciaId}&clienteId=${clienteId}`,
      DETAIL: (id: string | number) => `/vendedor/reservas/${id}`,
      EDIT: (id: string | number) => `/vendedor/reservas/editar/${id}`,
    },
    
    TOURS: {
      LIST: '/vendedor/tours',
      DETAIL: (id: string | number) => `/vendedor/tours/${id}`,
      RESERVAR: (id: string | number) => `/vendedor/reservas/nueva?instanciaId=${id}`,
    },
    
    CLIENTES: {
      LIST: '/vendedor/clientes',
      NEW: '/vendedor/clientes/nuevo',
      DETAIL: (id: string | number) => `/vendedor/clientes/${id}`,
      EDIT: (id: string | number) => `/vendedor/clientes/editar/${id}`,
      RESERVAR: (id: string | number) => `/vendedor/reservas/nueva?clienteId=${id}`,
    },

    PAGOS: '/vendedor/pagos',
    SOPORTE: '/vendedor/soporte',
  },
  
  CHOFER: {
    DASHBOARD: '/chofer/dashboard',
    MIS_EMBARCACIONES: '/chofer/mis-embarcaciones',
    TOURS_ASIGNADOS: '/chofer/tours-asignados',
  },
  
  COMMON: {
    NOT_FOUND: '/404',
    ERROR: '/error',
  }
};

// Funciones de utilidad para navegación
export const navigateHelpers = {
  // Navegar a nueva reserva con parámetros opcionales
  nuevaReserva: (options?: { instanciaId?: string | number, clienteId?: string | number }) => {
    if (!options) return ROUTES.VENDEDOR.RESERVAS.NUEVA;
    
    const params = new URLSearchParams();
    if (options.instanciaId) params.append('instanciaId', String(options.instanciaId));
    if (options.clienteId) params.append('clienteId', String(options.clienteId));
    
    const queryString = params.toString();
    return queryString ? `${ROUTES.VENDEDOR.RESERVAS.NUEVA}?${queryString}` : ROUTES.VENDEDOR.RESERVAS.NUEVA;
  },
  
  // Extraer parámetros de URL
  extractParams: (locationSearch: string) => {
    const params = new URLSearchParams(locationSearch);
    return {
      instanciaId: params.get('instanciaId'),
      clienteId: params.get('clienteId'),
      // Otros parámetros según necesidad
    };
  }
};

// Exportar también una versión simplificada para uso común
export default ROUTES;