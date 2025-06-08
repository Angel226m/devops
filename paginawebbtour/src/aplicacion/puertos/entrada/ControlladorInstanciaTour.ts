import { InstanciaTour, FiltrosInstanciaTour } from "../../../dominio/entidades/InstanciaTour";
import { ListarInstanciasTour } from "../../casos-de-uso/instanciaTour/ListarInstanciasTour";
import { ObtenerInstanciaTourPorId } from "../../casos-de-uso/instanciaTour/obtenerInstanciaTourPorId";
import { ListarInstanciasTourPorFiltros } from "../../casos-de-uso/instanciaTour/ListarInstanciasTourPorFiltros";
import { ListarInstanciasTourDisponibles } from "../../casos-de-uso/instanciaTour/ListarInstanciasTourDisponibles";
import { ListarInstanciasTourPorFecha } from "../../casos-de-uso/instanciaTour/ListarInstanciasTourPorFecha";

export class ControladorInstanciaTour {
  constructor(
    private listarInstanciasTour: ListarInstanciasTour,
    private obtenerInstanciaTourPorId: ObtenerInstanciaTourPorId,
    private listarInstanciasTourPorFiltros: ListarInstanciasTourPorFiltros,
    private listarInstanciasTourDisponibles: ListarInstanciasTourDisponibles,
    private listarInstanciasTourPorFecha: ListarInstanciasTourPorFecha
  ) {}

  async listar(): Promise<InstanciaTour[]> {
    return await this.listarInstanciasTour.ejecutar();
  }

  async obtenerPorId(id: number): Promise<InstanciaTour | null> {
    return await this.obtenerInstanciaTourPorId.ejecutar(id);
  }

  async listarPorFiltros(filtros: FiltrosInstanciaTour): Promise<InstanciaTour[]> {
    return await this.listarInstanciasTourPorFiltros.ejecutar(filtros);
  }

  async listarDisponibles(): Promise<InstanciaTour[]> {
    return await this.listarInstanciasTourDisponibles.ejecutar();
  }

  async listarPorFecha(fecha: string): Promise<InstanciaTour[]> {
    return await this.listarInstanciasTourPorFecha.ejecutar(fecha);
  }
}







