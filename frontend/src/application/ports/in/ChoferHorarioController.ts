 
import {
  ChoferHorario,
  NuevoChoferHorarioRequest,
  ActualizarChoferHorarioRequest
} from '../../../domain/entities/ChoferHorario';

export interface ChoferHorarioController {
  crearChoferHorario(request: NuevoChoferHorarioRequest): Promise<number>;
  obtenerChoferHorarioPorId(id: number): Promise<ChoferHorario>;
  actualizarChoferHorario(id: number, request: ActualizarChoferHorarioRequest): Promise<void>;
  eliminarChoferHorario(id: number): Promise<void>;
  listarChoferesHorario(): Promise<ChoferHorario[]>;
  listarChoferesHorarioPorChofer(idChofer: number): Promise<ChoferHorario[]>;
  listarChoferesHorarioActivosPorChofer(idChofer: number): Promise<ChoferHorario[]>;
  listarChoferesHorarioPorDia(dia: string): Promise<ChoferHorario[]>;
  obtenerMisHorariosActivos(): Promise<ChoferHorario[]>;
}