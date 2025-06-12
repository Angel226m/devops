provider "aws" {
  region = var.aws_region
}

# Security group para el servidor (reglas de firewall)
resource "aws_security_group" "tours_sg" {
  name        = "tours-security-group"
  description = "Security group para el sistema de tours"

  # Regla para HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP para acceso web"
  }

  # Regla para HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS para acceso web seguro"
  }

  # Regla para SSH (restringida a IPs específicas para mayor seguridad)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_ips
    description = "SSH para administración (IPs restringidas)"
  }

  # Permitir todo el tráfico saliente
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Permitir todo el tráfico saliente"
  }

  tags = {
    Name = "tours-sg"
    Environment = var.environment
  }
}

# EC2 Instance para el servidor
resource "aws_instance" "tours_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.tours_sg.id]
  
  root_block_device {
    volume_size = 20 # GB
    volume_type = "gp3"
  }

  tags = {
    Name        = "tours-server"
    Environment = var.environment
    Project     = "Sistema-Tours"
  }

  # Script para instalar Docker y otras dependencias
  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y apt-transport-https ca-certificates curl software-properties-common
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
              add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
              apt-get update
              apt-get install -y docker-ce docker-ce-cli containerd.io
              curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              usermod -aG docker ubuntu
              mkdir -p /home/ubuntu/sistema-tours
              EOF
}

# WAF (Web Application Firewall) para protección adicional
resource "aws_wafv2_web_acl" "tours_waf" {
  name        = "tours-waf"
  description = "WAF para Sistema de Tours"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  # Regla para bloquear SQL injection
  rule {
    name     = "SQLiRule"
    priority = 1

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "SQLiRule"
      sampled_requests_enabled   = true
    }

    override_action {
      count {}
    }
  }

  # Regla para bloquear ataques comunes
  rule {
    name     = "CommonAttacksRule"
    priority = 2

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"

        excluded_rule {
          name = "SizeRestrictions_BODY"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonAttacksRule"
      sampled_requests_enabled   = true
    }

    override_action {
      count {}
    }
  }

  # Regla para limitar rate (previene ataques DDoS)
  rule {
    name     = "RateLimitRule"
    priority = 3

    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }

    action {
      block {}
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRule"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "tours-waf"
    sampled_requests_enabled   = true
  }
}

# Alerta de CloudWatch para monitoreo de seguridad
resource "aws_cloudwatch_metric_alarm" "waf_blocked_requests" {
  alarm_name          = "waf-blocked-requests"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "BlockedRequests"
  namespace           = "AWS/WAFV2"
  period              = 300
  statistic           = "Sum"
  threshold           = 100
  alarm_description   = "Esta alarma se activa cuando WAF bloquea más de 100 solicitudes en 5 minutos"
  
  dimensions = {
    WebACL = aws_wafv2_web_acl.tours_waf.name
    Region = var.aws_region
  }
}