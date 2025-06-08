 
import { TipoPasaje } from "../../../dominio/entidades/TipoPasaje";
import { ListarTiposPasaje } from "../../casos-de-uso/tipoPasaje/ListarTiposPasaje";
import { ObtenerTipoPasajePorId } from "../../casos-de-uso/tipoPasaje/ObtenerTipoPasajePorId";
import { ListarTiposPasajePorSede } from "../../casos-de-uso/tipoPasaje/ListarTiposPasajePorSede";
import { ListarTiposPasajePorTipoTour } from "../../casos-de-uso/tipoPasaje/ListarTiposPasajePorTipoTour";

export class ControladorTipoPasaje {
  constructor(
    private listarTiposPasaje: ListarTiposPasaje,
    private obtenerTipoPasajePorId: ObtenerTipoPasajePorId,
    private listarTiposPasajePorSede: ListarTiposPasajePorSede,
    private listarTiposPasajePorTipoTour: ListarTiposPasajePorTipoTour
  ) {}

  async listar(): Promise<TipoPasaje[]> {
    return await this.listarTiposPasaje.ejecutar();
  }

  async obtenerPorId(id: number): Promise<TipoPasaje | null> {
    return await this.obtenerTipoPasajePorId.ejecutar(id);
  }

  async listarPorSede(idSede: number): Promise<TipoPasaje[]> {
    return await this.listarTiposPasajePorSede.ejecutar(idSede);
  }

  async listarPorTipoTour(idTipoTour: number): Promise<TipoPasaje[]> {
    return await this.listarTiposPasajePorTipoTour.ejecutar(idTipoTour);
  }
}