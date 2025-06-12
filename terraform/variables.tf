variable "aws_region" {
  description = "AWS region para el despliegue"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Entorno de despliegue"
  type        = string
  default     = "production"
}

variable "ami_id" {
  description = "ID de la AMI a utilizar"
  type        = string
  default     = "ami-0f403e3180720dd7e" # Ubuntu 22.04 LTS en us-east-1
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t2.medium"
}

variable "key_name" {
  description = "Nombre del par de claves para SSH"
  type        = string
  default     = "tours-key"
}

variable "allowed_ssh_ips" {
  description = "Lista de IPs permitidas para SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"] # Cambiar por IPs específicas para producción
}