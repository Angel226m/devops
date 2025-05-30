import { Sede, SedeCreacion, SedeActualizacion } from '../../../domain/entities/Sede';

export interface SedeRepository {
  listar(): Promise<Sede[]>;
  obtenerPorId(id: number): Promise<Sede | null>;
  obtenerPorCiudad(ciudad: string): Promise<Sede[]>;
  obtenerPorPais(pais: string): Promise<Sede[]>;
  crear(sede: SedeCreacion): Promise<Sede>;
  actualizar(id: number, sede: SedeActualizacion): Promise<Sede>;
  eliminar(id: number): Promise<boolean>;
}