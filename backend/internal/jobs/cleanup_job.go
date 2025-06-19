package jobs

import (
	"fmt"
	"sistema-toursseft/internal/servicios"
	"time"
)

// CleanupJob representa un job de limpieza de reservas expiradas
type CleanupJob struct {
	reservaService *servicios.ReservaService
	intervalo      time.Duration
	stopChan       chan bool
}

// NewCleanupJob crea una nueva instancia de CleanupJob
func NewCleanupJob(reservaService *servicios.ReservaService, intervaloHoras int) *CleanupJob {
	return &CleanupJob{
		reservaService: reservaService,
		intervalo:      time.Duration(intervaloHoras) * time.Hour,
		stopChan:       make(chan bool),
	}
}

// Start inicia el job de limpieza
func (j *CleanupJob) Start() {
	go func() {
		ticker := time.NewTicker(j.intervalo)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				j.Run()
			case <-j.stopChan:
				fmt.Println("Job de limpieza detenido")
				return
			}
		}
	}()

	fmt.Printf("Job de limpieza iniciado con intervalo de %v\n", j.intervalo)
}

// Stop detiene el job de limpieza
func (j *CleanupJob) Stop() {
	j.stopChan <- true
}

// Run ejecuta una iteración del job de limpieza
func (j *CleanupJob) Run() {
	fmt.Println("[CleanupJob] Iniciando limpieza de reservas expiradas...")

	count, err := j.reservaService.ProcessExpiredReservations()
	if err != nil {
		fmt.Printf("[CleanupJob] Error al procesar reservas expiradas: %v\n", err)
		return
	}

	fmt.Printf("[CleanupJob] Limpieza completada: %d reservas canceladas\n", count)
}
