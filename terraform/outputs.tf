output "dns_domain" {
  value = aws_route53_zone.primary.name
}

output "dns_name_servers" {
  value = aws_route53_zone.primary.name_servers
}
