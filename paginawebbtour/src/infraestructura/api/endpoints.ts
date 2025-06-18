export const endpoints = {
  // ... otros endpoints existentes
  
  tipoTour: {
    // Cambiamos estos endpoints para que coincidan con la forma en que están en tu backend
    listar: "/tipos-tour", // Este debería ser el endpoint que planeas agregar al backend
    obtenerPorId: (id: number) => `/tipos-tour/${id}`,
    listarPorSede: (idSede: number) => `/tipos-tour/sede/${idSede}`
  },
  
  /*galeriaTour: {
    listar: "/galerias",
    obtenerPorId: (id: number) => `/galerias/${id}`,
    listarPorTipoTour: (idTipoTour: number) => `/tipo-tours/${idTipoTour}/galerias` // Este endpoint sí existe en tu backend
  },*/

    galeriaTour: {
    listar: "/galerias",
    obtenerPorId: (id: number) => `/galerias/${id}`,
    listarPorTipoTour: (idTipoTour: number) => `/tipo-tours/${idTipoTour}/galerias` // Verificado que coincide con el backend
  },
  instanciaTour: {
    listar: "/instancias-tour",
    obtenerPorId: (id: number) => `/instancias-tour/${id}`,
    listarPorFiltros: "/instancias-tour/filtrar",
    listarDisponibles: "/instancias-tour/disponibles",
    listarPorFecha: (fecha: string) => `/instancias-tour/fecha/${fecha}`,
  },
  
  tipoPasaje: {
    listar: "/tipos-pasaje",
    obtenerPorId: (id: number) => `/tipos-pasaje/${id}`,
    listarPorSede: (idSede: number) => `/tipos-pasaje/sede/${idSede}`,
    listarPorTipoTour: (idTipoTour: number) => `/tipos-pasaje/tipo-tour/${idTipoTour}`
  },
  
  paquetePasajes: {
    listar: "/paquetes-pasajes",
    obtenerPorId: (id: number) => `/paquetes-pasajes/${id}`,
    listarPorSede: (idSede: number) => `/paquetes-pasajes/sede/${idSede}`,
    listarPorTipoTour: (idTipoTour: number) => `/paquetes-pasajes/tipo-tour/${idTipoTour}`
  },
  // ... otros endpoints existentes


   tourProgramado: {
    listar: "/tours-programados",
    obtenerPorId: (id: number) => `/tours-programados/${id}`,
    listarPorFiltros: "/tours-programados/filtrar",
    listarDisponiblesSinDuplicados: "/tours/disponibles-sin-duplicados"
  },
   cliente: {
    registro: "/clientes/registro",
    login: "/clientes/login",
    refrescarToken: "/clientes/refresh",
    cerrarSesion: "/clientes/logout",
    obtenerPorId: (id: number) => `/clientes/${id}`,
    actualizar: (id: number) => `/clientes/${id}`,
    cambiarContrasena: (id: number) => `/clientes/${id}/cambiar-contrasena`,       
    obtenerPerfil: "/cliente/mi-perfil"

  },  reserva: {
    listar: "/reservas",
    obtenerPorId: (id: number) => `/reservas/${id}`,
    crear: "/reservas",
    actualizar: (id: number) => `/reservas/${id}`,
    eliminar: (id: number) => `/reservas/${id}`,
    cambiarEstado: (id: number) => `/reservas/${id}/estado`,
    listarPorCliente: (idCliente: number) => `/reservas/cliente/${idCliente}`,
    listarPorInstancia: (idInstancia: number) => `/reservas/instancia/${idInstancia}`,
    listarPorFecha: (fecha: string) => `/reservas/fecha/${fecha}`,
    listarPorEstado: (estado: string) => `/reservas/estado/${estado}`,
    listarMisReservas: "/cliente/mis-reservas",
    cancelarReserva: (id: number) => `/cliente/mis-reservas/${id}/cancelar`,
    pagarReserva: (id: number) => `/cliente/mis-reservas/${id}/pagar`,
    verificarConfirmarPago: "/reservas/verificar-confirmar-pago"

  },
  
  // Endpoints para Mercado Pago
    mercadoPago: {
    reservar: "/mercadopago/reservar", // Ya tiene el prefijo correcto
    pagarReserva: (id:number) => `/cliente/mis-reservas/${id}/pagar`, 
    webhook: "/webhook/mercadopago",
    publicKey: "/mercadopago/public-key", // Cambiado de "/api/v1/mercadopago/public-key"
    verificarPago: "/mercadopago/verificar-pago" // Nuevo endpoint para verificar pagos
    

  },
  
};