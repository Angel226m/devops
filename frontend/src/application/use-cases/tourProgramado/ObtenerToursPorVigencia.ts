import { TourProgramado, FiltrosTourProgramado } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class ObtenerToursPorVigencia {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(
    vigenciaDesdeIni?: string, 
    vigenciaDesdefin?: string, 
    vigenciaHastaIni?: string, 
    vigenciaHastaFin?: string
  ): Promise<TourProgramado[]> {
    
    const filtros: FiltrosTourProgramado = {};
    
    if (vigenciaDesdeIni) {
      filtros.vigencia_desde_ini = vigenciaDesdeIni;
    }
    
    if (vigenciaDesdefin) {
      filtros.vigencia_desde_fin = vigenciaDesdefin;
    }
    
    if (vigenciaHastaIni) {
      filtros.vigencia_hasta_ini = vigenciaHastaIni;
    }
    
    if (vigenciaHastaFin) {
      filtros.vigencia_hasta_fin = vigenciaHastaFin;
    }
    
    return this.tourProgramadoRepository.listar(filtros);
  }
}