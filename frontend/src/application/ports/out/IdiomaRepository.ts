import { Idioma, NuevoIdiomaRequest, ActualizarIdiomaRequest } from '../../../domain/entities/Idioma';

export interface IdiomaRepository {
  getAll(): Promise<Idioma[]>;
  getById(id: number): Promise<Idioma>;
  create(idioma: NuevoIdiomaRequest): Promise<number>;
  update(id: number, idioma: ActualizarIdiomaRequest): Promise<void>;
  delete(id: number): Promise<void>;
}