resource "aws_ses_email_identity" "from_addr" {
  email = var.from_email
}

# Domain identity for better reputation
resource "aws_ses_domain_identity" "domain" {
  domain = var.primary_domain
}

# DKIM signing for domain
resource "aws_ses_domain_dkim" "domain" {
  domain = aws_ses_domain_identity.domain.domain
}

# Verify domain identity
resource "aws_ses_domain_identity_verification" "domain" {
  domain     = aws_ses_domain_identity.domain.id
  depends_on = [aws_route53_record.ses_verification]
}

