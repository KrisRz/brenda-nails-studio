# Minimal DynamoDB table for PHASE 2 - Single table design for cost optimization

resource "aws_dynamodb_table" "data" {
  name         = "${local.name_prefix}-data"
  billing_mode = "PAY_PER_REQUEST" # Pay only for what we use
  hash_key     = "entityType"
  range_key    = "entityId"

  attribute {
    name = "entityType"
    type = "S"
  }

  attribute {
    name = "entityId"
    type = "S"
  }

  attribute {
    name = "date"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  # GSI for querying bookings by date
  global_secondary_index {
    name            = "DateIndex"
    hash_key        = "date"
    range_key       = "entityType"
    projection_type = "ALL"
  }

  # GSI for querying customers by email
  global_secondary_index {
    name            = "EmailIndex"
    hash_key        = "email"
    range_key       = "entityType"
    projection_type = "ALL"
  }

  tags = {
    Name        = "${local.name_prefix}-data"
    Environment = var.env
    Project     = var.project
    Purpose     = "chatbot-backend"
  }
}

# Populate initial business configuration
resource "aws_dynamodb_table_item" "business_hours" {
  table_name = aws_dynamodb_table.data.name
  hash_key   = aws_dynamodb_table.data.hash_key
  range_key  = aws_dynamodb_table.data.range_key

  item = jsonencode({
    entityType = { S = "CONFIG" }
    entityId   = { S = "business_hours" }
    config = {
      M = {
        monday = {
          M = {
            open    = { S = "10:00" }
            close   = { S = "17:00" }
            enabled = { BOOL = true }
          }
        }
        tuesday = {
          M = {
            open    = { S = "10:00" }
            close   = { S = "17:00" }
            enabled = { BOOL = true }
          }
        }
        wednesday = {
          M = {
            open    = { S = "10:00" }
            close   = { S = "17:00" }
            enabled = { BOOL = true }
          }
        }
        thursday = {
          M = {
            open    = { S = "10:00" }
            close   = { S = "17:00" }
            enabled = { BOOL = true }
          }
        }
        friday = {
          M = {
            open    = { S = "10:00" }
            close   = { S = "17:00" }
            enabled = { BOOL = true }
          }
        }
        saturday = {
          M = {
            open    = { S = "10:00" }
            close   = { S = "16:00" }
            enabled = { BOOL = false }
            note    = { S = "By appointment only" }
          }
        }
        sunday = {
          M = {
            open    = { S = "10:00" }
            close   = { S = "16:00" }
            enabled = { BOOL = false }
            note    = { S = "By appointment only" }
          }
        }
      }
    }
    updatedAt = { S = timestamp() }
  })
}

# Services configuration
resource "aws_dynamodb_table_item" "services_config" {
  table_name = aws_dynamodb_table.data.name
  hash_key   = aws_dynamodb_table.data.hash_key
  range_key  = aws_dynamodb_table.data.range_key

  item = jsonencode({
    entityType = { S = "CONFIG" }
    entityId   = { S = "services" }
    config = {
      M = {
        gel_manicure = {
          M = {
            name        = { S = "Gel Manicure" }
            price       = { N = "30" }
            duration    = { N = "70" }
            description = { S = "Professional gel manicure with long-lasting shine and durability" }
          }
        }
        gel_acrylic = {
          M = {
            name        = { S = "Gel Acrylic Nails" }
            price       = { N = "45" }
            duration    = { N = "120" }
            description = { S = "Extension on form with gel acrylic for strength and custom shapes" }
          }
        }
        french_manicure = {
          M = {
            name        = { S = "French Manicure" }
            price       = { N = "30" }
            duration    = { N = "50" }
            description = { S = "Timeless elegant French tips with perfect precision" }
          }
        }
        gel_infill_early = {
          M = {
            name        = { S = "Gel Infill (≤3 weeks)" }
            price       = { N = "30" }
            duration    = { N = "60" }
            description = { S = "Maintenance and refresh for existing gel manicure" }
          }
        }
        gel_infill_late = {
          M = {
            name        = { S = "Gel Infill (>3 weeks)" }
            price       = { N = "35" }
            duration    = { N = "90" }
            description = { S = "Extended maintenance for gel manicures requiring more work" }
          }
        }
        cartoon_art = {
          M = {
            name        = { S = "Cartoon Art (per nail)" }
            price       = { N = "5" }
            duration    = { N = "20" }
            description = { S = "Custom cartoon designs and artistic elements on individual nails" }
          }
        }
        nail_repair = {
          M = {
            name        = { S = "Nail Repair (per nail)" }
            price       = { N = "5" }
            duration    = { N = "15" }
            description = { S = "Professional repair for damaged or broken nails" }
          }
        }
        removal_only = {
          M = {
            name        = { S = "Removal Only" }
            price       = { N = "10" }
            duration    = { N = "30" }
            description = { S = "Professional nail polish or gel removal service" }
          }
        }
      }
    }
    updatedAt = { S = timestamp() }
  })
}
