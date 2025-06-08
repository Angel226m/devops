import { GaleriaTour, GaleriaTourRequest, GaleriaTourUpdateRequest } from "../../../domain/entities/GaleriaTour";

export interface GaleriaTourController {
  create(galeria: GaleriaTourRequest): Promise<number>;
  getById(id: number): Promise<GaleriaTour>;
  listByTipoTour(idTipoTour: number): Promise<GaleriaTour[]>;
  update(id: number, galeria: GaleriaTourUpdateRequest): Promise<void>;
  delete(id: number): Promise<void>;
}