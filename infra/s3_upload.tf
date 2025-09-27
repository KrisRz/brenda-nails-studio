# Upload frontend files to S3
resource "null_resource" "frontend_build" {
  # Trigger rebuild when frontend files change
  triggers = {
    frontend_hash = filemd5("${path.root}/../apps/frontend/dist/index.html")
  }

  provisioner "local-exec" {
    command = "cd ${path.root}/../apps/frontend && npm run build"
  }
}

# Upload all files from frontend/dist to S3 (static build)
resource "aws_s3_object" "frontend_files" {
  for_each = fileset("${path.root}/../apps/frontend/dist", "**/*")
  
  bucket = aws_s3_bucket.site.id
  key    = each.value
  source = "${path.root}/../apps/frontend/dist/${each.value}"
  
  # Set content type based on file extension
  content_type = lookup({
    "html" = "text/html",
    "css"  = "text/css",
    "js"   = "application/javascript",
    "json" = "application/json",
    "png"  = "image/png",
    "jpg"  = "image/jpeg",
    "jpeg" = "image/jpeg",
    "gif"  = "image/gif",
    "svg"  = "image/svg+xml",
    "ico"  = "image/x-icon",
    "mp4"  = "video/mp4",
    "webm" = "video/webm",
    "pdf"  = "application/pdf",
    "txt"  = "text/plain"
  }, split(".", each.value)[length(split(".", each.value)) - 1], "application/octet-stream")
  
  # Set cache control
  cache_control = lookup({
    "html" = "no-cache",
    "css"  = "max-age=31536000",
    "js"   = "max-age=31536000",
    "png"  = "max-age=31536000",
    "jpg"  = "max-age=31536000",
    "jpeg" = "max-age=31536000",
    "gif"  = "max-age=31536000",
    "svg"  = "max-age=31536000",
    "ico"  = "max-age=31536000",
    "mp4"  = "max-age=31536000",
    "webm" = "max-age=31536000"
  }, split(".", each.value)[length(split(".", each.value)) - 1], "max-age=86400")
  
  etag = filemd5("${path.root}/../apps/frontend/dist/${each.value}")
  
  depends_on = [
    null_resource.frontend_build,
    aws_s3_bucket_policy.site
  ]
}

# Invalidate CloudFront cache after upload
resource "null_resource" "cloudfront_invalidation" {
  triggers = {
    frontend_hash = filemd5("${path.root}/../apps/frontend/dist/index.html")
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.site.id} --paths '/*'"
  }

  depends_on = [aws_s3_object.frontend_files]
}
