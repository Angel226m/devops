package servicios

import (
	"errors"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
)

// TipoTourGaleriaService maneja la lógica de negocio para la galería de tipos de tour
type TipoTourGaleriaService struct {
	galeriaRepo  *repositorios.TipoTourGaleriaRepository
	tipoTourRepo *repositorios.TipoTourRepository
}

// NewTipoTourGaleriaService crea una nueva instancia de TipoTourGaleriaService
func NewTipoTourGaleriaService(
	galeriaRepo *repositorios.TipoTourGaleriaRepository,
	tipoTourRepo *repositorios.TipoTourRepository,
) *TipoTourGaleriaService {
	return &TipoTourGaleriaService{
		galeriaRepo:  galeriaRepo,
		tipoTourRepo: tipoTourRepo,
	}
}

// Create crea una nueva imagen en la galería
func (s *TipoTourGaleriaService) Create(galeria *entidades.NuevaTipoTourGaleriaRequest) (int, error) {
	// Verificar que el tipo de tour exista
	_, err := s.tipoTourRepo.GetByID(galeria.IDTipoTour)
	if err != nil {
		return 0, errors.New("el tipo de tour especificado no existe")
	}

	// Crear imagen en la galería
	return s.galeriaRepo.Create(galeria)
}

// GetByID obtiene una imagen de la galería por su ID
func (s *TipoTourGaleriaService) GetByID(id int) (*entidades.TipoTourGaleria, error) {
	return s.galeriaRepo.GetByID(id)
}

// Update actualiza una imagen en la galería
func (s *TipoTourGaleriaService) Update(id int, galeria *entidades.ActualizarTipoTourGaleriaRequest) error {
	// Verificar que la imagen exista
	_, err := s.galeriaRepo.GetByID(id)
	if err != nil {
		return err
	}

	// Verificar que el tipo de tour exista
	_, err = s.tipoTourRepo.GetByID(galeria.IDTipoTour)
	if err != nil {
		return errors.New("el tipo de tour especificado no existe")
	}

	// Actualizar imagen en la galería
	return s.galeriaRepo.Update(id, galeria)
}

// Delete elimina una imagen de la galería (borrado lógico)
func (s *TipoTourGaleriaService) Delete(id int) error {
	// Verificar que la imagen exista
	_, err := s.galeriaRepo.GetByID(id)
	if err != nil {
		return err
	}

	// Eliminar imagen de la galería (borrado lógico)
	return s.galeriaRepo.Delete(id)
}

// HardDelete elimina físicamente una imagen de la galería
func (s *TipoTourGaleriaService) HardDelete(id int) error {
	// Verificar que la imagen exista
	_, err := s.galeriaRepo.GetByID(id)
	if err != nil {
		return err
	}

	// Eliminar físicamente la imagen de la galería
	return s.galeriaRepo.HardDelete(id)
}

// List lista todas las imágenes de la galería
func (s *TipoTourGaleriaService) List() ([]*entidades.TipoTourGaleria, error) {
	return s.galeriaRepo.List()
}

// ListByTipoTour lista todas las imágenes de la galería de un tipo de tour específico
func (s *TipoTourGaleriaService) ListByTipoTour(idTipoTour int) ([]*entidades.TipoTourGaleria, error) {
	// Verificar que el tipo de tour exista
	_, err := s.tipoTourRepo.GetByID(idTipoTour)
	if err != nil {
		return nil, errors.New("el tipo de tour especificado no existe")
	}

	// Listar imágenes de la galería del tipo de tour
	return s.galeriaRepo.ListByTipoTour(idTipoTour)
}
