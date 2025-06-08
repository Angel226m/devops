import { GaleriaTour } from "../../../dominio/entidades/GaleriaTour";
import { ListarGaleriaTour } from "../../casos-de-uso/galeriaTour/ListarGaleriaTour";
import { ObtenerGaleriaTourPorId } from "../../casos-de-uso/galeriaTour/ObtenerGaleriaTourPorId";
import { ListarGaleriaTourPorTipoTour } from "../../casos-de-uso/galeriaTour/ListarGaleriaTourPorTipoTour";

export class ControladorGaleriaTour {
  constructor(
    private listarGaleriaTour: ListarGaleriaTour,
    private obtenerGaleriaTourPorId: ObtenerGaleriaTourPorId,
    private listarGaleriaTourPorTipoTour: ListarGaleriaTourPorTipoTour
  ) {}

  async listar(): Promise<GaleriaTour[]> {
    return await this.listarGaleriaTour.ejecutar();
  }

  async obtenerPorId(id: number): Promise<GaleriaTour | null> {
    return await this.obtenerGaleriaTourPorId.ejecutar(id);
  }

  async listarPorTipoTour(idTipoTour: number): Promise<GaleriaTour[]> {
    return await this.listarGaleriaTourPorTipoTour.ejecutar(idTipoTour);
  }
}