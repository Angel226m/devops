output "server_ip" {
  description = "IP pública del servidor"
  value       = aws_instance.tours_server.public_ip
}

output "security_group_id" {
  description = "ID del grupo de seguridad"
  value       = aws_security_group.tours_sg.id
}

output "waf_arn" {
  description = "ARN del Web Application Firewall"
  value       = aws_wafv2_web_acl.tours_waf.arn
}