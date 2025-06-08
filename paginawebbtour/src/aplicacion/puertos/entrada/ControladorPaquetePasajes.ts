 
import { PaquetePasajes } from "../../../dominio/entidades/PaquetePasajes";
import { ListarPaquetesPasajes } from "../../casos-de-uso/paquetePasajes/ListarPaquetesPasajes";
import { ObtenerPaquetePasajesPorId } from "../../casos-de-uso/paquetePasajes/ObtenerPaquetePasajesPorId";
import { ListarPaquetesPasajesPorSede } from "../../casos-de-uso/paquetePasajes/ListarPaquetesPasajesPorSede";
import { ListarPaquetesPasajesPorTipoTour } from "../../casos-de-uso/paquetePasajes/ListarPaquetesPasajesPorTipoTour";

export class ControladorPaquetePasajes {
  constructor(
    private listarPaquetesPasajes: ListarPaquetesPasajes,
    private obtenerPaquetePasajesPorId: ObtenerPaquetePasajesPorId,
    private listarPaquetesPasajesPorSede: ListarPaquetesPasajesPorSede,
    private listarPaquetesPasajesPorTipoTour: ListarPaquetesPasajesPorTipoTour
  ) {}

  async listar(): Promise<PaquetePasajes[]> {
    return await this.listarPaquetesPasajes.ejecutar();
  }

  async obtenerPorId(id: number): Promise<PaquetePasajes | null> {
    return await this.obtenerPaquetePasajesPorId.ejecutar(id);
  }

  async listarPorSede(idSede: number): Promise<PaquetePasajes[]> {
    return await this.listarPaquetesPasajesPorSede.ejecutar(idSede);
  }

  async listarPorTipoTour(idTipoTour: number): Promise<PaquetePasajes[]> {
    return await this.listarPaquetesPasajesPorTipoTour.ejecutar(idTipoTour);
  }
}