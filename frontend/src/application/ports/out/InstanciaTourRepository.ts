import { 
  InstanciaTour, 
  NuevaInstanciaTourRequest, 
  ActualizarInstanciaTourRequest, 
  FiltrosInstanciaTour 
} from '../../../domain/entities/InstanciaTour';

export interface InstanciaTourRepository {
  create(instanciaTour: NuevaInstanciaTourRequest): Promise<number>;
  getById(id: number): Promise<InstanciaTour>;
  update(id: number, instanciaTour: ActualizarInstanciaTourRequest): Promise<void>;
  delete(id: number): Promise<void>;
  getAll(): Promise<InstanciaTour[]>;
  getByTourProgramado(idTourProgramado: number): Promise<InstanciaTour[]>;
  getByFiltros(filtros: FiltrosInstanciaTour): Promise<InstanciaTour[]>;
  asignarChofer(id: number, idChofer: number): Promise<void>;
  generarInstancias(idTourProgramado: number): Promise<number>;
}