output "api_url" {
  description = "HTTP endpoint for contact form"
  value       = "${aws_apigatewayv2_api.http.api_endpoint}/contact"
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "site_bucket_name" {
  description = "S3 bucket name for static website"
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidation"
  value       = aws_cloudfront_distribution.site.id
}
