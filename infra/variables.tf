variable "region" {
  type    = string
  default = "eu-west-2"
}

variable "project" {
  type    = string
  default = "brenda-nails"
}

variable "env" {
  type    = string
  default = "prod"
}

variable "primary_domain" {
  type = string
}

# np. no-reply@krisgrzepka.com (po weryfikacji)
variable "from_email" {
  type = string
}

# gdzie odbierasz
variable "to_email" {
  type = string
}

# np. https://krisgrzepka.com
variable "allowed_origin" {
  type = string
}

# Brenda's phone number for SMS notifications (format: +44...)
variable "brenda_phone" {
  type = string
}


