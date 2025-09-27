# 🏗️ **Terraform for Junior DevOps Engineers - Complete Study Guide**

*Infrastructure as Code Fundamentals with Practical Scenarios*

---

## 📚 **Table of Contents**

1. [What is Terraform?](#what-is-terraform)
2. [Core Concepts](#core-concepts)
3. [Basic Syntax](#basic-syntax)
4. [State Management](#state-management)
5. [Best Practices](#best-practices)
6. [Practical Scenarios](#practical-scenarios)
7. [Interview Questions](#interview-questions)
8. [Commands Cheat Sheet](#commands-cheat-sheet)

---

## 🎯 **What is Terraform?** {#what-is-terraform}

### **Definition**
Terraform is an **Infrastructure as Code (IaC)** tool that lets you define and provision infrastructure using declarative configuration files.

### **Key Benefits**
- ✅ **Version Control** - Infrastructure changes tracked in Git
- ✅ **Reproducible** - Same code creates identical infrastructure
- ✅ **Multi-Cloud** - Works with AWS, Azure, GCP, etc.
- ✅ **Plan & Preview** - See changes before applying
- ✅ **Automation** - Integrate with CI/CD pipelines

### **How It Works**
```
Write Code → Plan Changes → Apply Changes → Manage State
```

---

## 🧩 **Core Concepts** {#core-concepts}

### **1. Providers**
Plugins that interact with APIs (AWS, Azure, GCP)
```hcl
provider "aws" {
  region = "eu-west-2"
}
```

### **2. Resources**
Infrastructure components you want to create
```hcl
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-unique-bucket-name"
}
```

### **3. Data Sources**
Read existing infrastructure
```hcl
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Ubuntu
}
```

### **4. Variables**
Input parameters for flexibility
```hcl
variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
  default     = "my-bucket"
}
```

### **5. Outputs**
Return values from your configuration
```hcl
output "bucket_url" {
  value = aws_s3_bucket.my_bucket.website_endpoint
}
```

### **6. Local Values**
Computed values used within configuration
```hcl
locals {
  common_tags = {
    Environment = "dev"
    Project     = "learning"
  }
}
```

---

## 📝 **Basic Syntax** {#basic-syntax}

### **File Structure**
```
project/
├── main.tf          # Main configuration
├── variables.tf     # Input variables
├── outputs.tf       # Output values
├── terraform.tfvars # Variable values (gitignore this!)
└── versions.tf      # Provider requirements
```

### **Basic Resource Syntax**
```hcl
resource "PROVIDER_TYPE" "NAME" {
  argument1 = value1
  argument2 = value2
  
  nested_block {
    setting = "value"
  }
}
```

### **Example: Simple Web Server**
```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Security Group
resource "aws_security_group" "web" {
  name_prefix = "web-sg"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "web-security-group"
  }
}

# EC2 Instance
resource "aws_instance" "web" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  vpc_security_group_ids = [aws_security_group.web.id]
  
  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y nginx
              systemctl start nginx
              systemctl enable nginx
              EOF
  
  tags = {
    Name = "web-server"
  }
}

# Data source for Ubuntu AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
  
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-20.04-amd64-server-*"]
  }
}
```

### **Variables File**
```hcl
# variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-2"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}
```

### **Outputs File**
```hcl
# outputs.tf
output "instance_public_ip" {
  description = "Public IP address of the web server"
  value       = aws_instance.web.public_ip
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.web.id
}
```

---

## 🗄️ **State Management** {#state-management}

### **What is Terraform State?**
Terraform state is a file that maps real-world resources to your configuration and tracks metadata.

### **Local vs Remote State**

#### **Local State (Development)**
```hcl
# terraform.tfstate stored locally
# Good for learning and testing
```

#### **Remote State (Production)**
```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

### **State Commands**
```bash
terraform state list                    # List all resources
terraform state show aws_instance.web   # Show specific resource
terraform state mv SOURCE DEST          # Rename resource in state
terraform state rm aws_instance.web     # Remove from state (not AWS!)
terraform import aws_instance.web i-123 # Import existing resource
```

---

## 🎯 **Best Practices** {#best-practices}

### **1. Project Structure**
```
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── prod/
├── modules/
│   ├── networking/
│   ├── compute/
│   └── storage/
└── README.md
```

### **2. Naming Conventions**
```hcl
# Good
resource "aws_s3_bucket" "user_data_storage" {
  bucket = "company-user-data-prod-eu-west-2"
}

# Bad
resource "aws_s3_bucket" "bucket1" {
  bucket = "mybucket"
}
```

### **3. Use Variables**
```hcl
# Don't hardcode values
resource "aws_instance" "web" {
  instance_type = "t3.micro"  # Bad
}

# Use variables instead
resource "aws_instance" "web" {
  instance_type = var.instance_type  # Good
}
```

### **4. Tag Everything**
```hcl
locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
    Owner       = "DevOps Team"
  }
}

resource "aws_s3_bucket" "example" {
  bucket = var.bucket_name
  tags   = local.common_tags
}
```

### **5. Use Modules**
```hcl
# modules/webserver/main.tf
resource "aws_instance" "web" {
  ami           = var.ami_id
  instance_type = var.instance_type
  
  tags = var.tags
}

# environments/prod/main.tf
module "webserver" {
  source = "../../modules/webserver"
  
  ami_id        = "ami-12345"
  instance_type = "t3.small"
  tags = {
    Environment = "production"
  }
}
```

---

## 💼 **Practical Scenarios** {#practical-scenarios}

### **Scenario 1: Simple Website Hosting**
**Task:** Create S3 bucket for static website hosting

```hcl
# Static website infrastructure
resource "aws_s3_bucket" "website" {
  bucket = var.domain_name
  
  tags = {
    Name        = "Website Bucket"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.bucket
  
  index_document {
    suffix = "index.html"
  }
  
  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id
  
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.website.arn}/*"
      }
    ]
  })
}
```

### **Scenario 2: Load Balanced Web Application**
**Task:** Create EC2 instances behind Application Load Balancer

```hcl
# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = var.public_subnet_ids
  
  enable_deletion_protection = false
  
  tags = {
    Environment = var.environment
  }
}

resource "aws_lb_target_group" "app" {
  name     = "${var.project}-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  
  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "app" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# Auto Scaling Group
resource "aws_launch_template" "app" {
  name_prefix   = "${var.project}-lt"
  image_id      = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  
  vpc_security_group_ids = [aws_security_group.app.id]
  
  user_data = base64encode(<<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y nginx
              systemctl start nginx
              systemctl enable nginx
              EOF
  )
  
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.project}-instance"
    }
  }
}

resource "aws_autoscaling_group" "app" {
  name                = "${var.project}-asg"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = [aws_lb_target_group.app.arn]
  health_check_type   = "ELB"
  
  min_size         = 2
  max_size         = 10
  desired_capacity = 2
  
  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }
  
  tag {
    key                 = "Name"
    value               = "${var.project}-asg"
    propagate_at_launch = false
  }
}
```

### **Scenario 3: Database with Backup**
**Task:** Create RDS database with automated backups

```hcl
# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project}-db-subnet-group"
  subnet_ids = var.private_subnet_ids
  
  tags = {
    Name = "${var.project} DB subnet group"
  }
}

# RDS Parameter Group
resource "aws_db_parameter_group" "main" {
  family = "mysql8.0"
  name   = "${var.project}-db-params"
  
  parameter {
    name  = "innodb_buffer_pool_size"
    value = "{DBInstanceClassMemory*3/4}"
  }
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier = "${var.project}-database"
  
  # Engine
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = var.db_instance_class
  
  # Storage
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp2"
  storage_encrypted     = true
  
  # Database
  db_name  = var.database_name
  username = var.database_username
  password = var.database_password
  
  # Network
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.database.id]
  publicly_accessible    = false
  
  # Backup
  backup_window           = "03:00-04:00"
  backup_retention_period = 7
  maintenance_window      = "sun:04:00-sun:05:00"
  
  # Parameters
  parameter_group_name = aws_db_parameter_group.main.name
  
  # Monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn
  
  # Security
  skip_final_snapshot = false
  final_snapshot_identifier = "${var.project}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  
  tags = {
    Name        = "${var.project} Database"
    Environment = var.environment
  }
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "database_cpu" {
  alarm_name          = "${var.project}-database-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors RDS CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  
  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.id
  }
}
```

### **Scenario 4: CI/CD Pipeline Infrastructure**
**Task:** Create CodePipeline with S3 bucket for artifacts

```hcl
# S3 Bucket for artifacts
resource "aws_s3_bucket" "codepipeline_artifacts" {
  bucket        = "${var.project}-codepipeline-artifacts-${random_string.bucket_suffix.result}"
  force_destroy = true
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket_versioning" "codepipeline_artifacts" {
  bucket = aws_s3_bucket.codepipeline_artifacts.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "codepipeline_artifacts" {
  bucket = aws_s3_bucket.codepipeline_artifacts.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# IAM Role for CodePipeline
resource "aws_iam_role" "codepipeline" {
  name = "${var.project}-codepipeline-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codepipeline.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "codepipeline" {
  name = "${var.project}-codepipeline-policy"
  role = aws_iam_role.codepipeline.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetBucketVersioning",
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:PutObject"
        ]
        Resource = [
          aws_s3_bucket.codepipeline_artifacts.arn,
          "${aws_s3_bucket.codepipeline_artifacts.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "codebuild:BatchGetBuilds",
          "codebuild:StartBuild"
        ]
        Resource = "*"
      }
    ]
  })
}

# CodePipeline
resource "aws_codepipeline" "main" {
  name     = "${var.project}-pipeline"
  role_arn = aws_iam_role.codepipeline.arn
  
  artifact_store {
    location = aws_s3_bucket.codepipeline_artifacts.bucket
    type     = "S3"
  }
  
  stage {
    name = "Source"
    
    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "S3"
      version          = "1"
      output_artifacts = ["source_output"]
      
      configuration = {
        S3Bucket    = var.source_bucket
        S3ObjectKey = var.source_object_key
      }
    }
  }
  
  stage {
    name = "Build"
    
    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["build_output"]
      version          = "1"
      
      configuration = {
        ProjectName = aws_codebuild_project.main.name
      }
    }
  }
}
```

### **Scenario 5: Monitoring and Alerting**
**Task:** Create CloudWatch dashboards and alarms

```hcl
# SNS Topic for alerts
resource "aws_sns_topic" "alerts" {
  name = "${var.project}-alerts"
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project}-dashboard"
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        
        properties = {
          metrics = [
            ["AWS/EC2", "CPUUtilization", "InstanceId", aws_instance.web.id],
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", aws_lb.main.arn_suffix]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "EC2 and ALB Metrics"
          period  = 300
        }
      },
      {
        type   = "log"
        x      = 0
        y      = 6
        width  = 24
        height = 6
        
        properties = {
          query   = "SOURCE '/aws/lambda/${var.project}' | fields @timestamp, @message | sort @timestamp desc | limit 20"
          region  = var.aws_region
          title   = "Recent Lambda Logs"
        }
      }
    ]
  })
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${var.project}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors EC2 CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  
  dimensions = {
    InstanceId = aws_instance.web.id
  }
}

resource "aws_cloudwatch_metric_alarm" "alb_response_time" {
  alarm_name          = "${var.project}-alb-response-time"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "Average"
  threshold           = "1"
  alarm_description   = "This metric monitors ALB response time"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  
  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }
}
```

---

## 🎯 **Interview Questions** {#interview-questions}

### **Basic Questions**

#### **Q: What is Infrastructure as Code?**
**A:** IaC is managing infrastructure through code instead of manual processes. Benefits include version control, reproducibility, automation, and reduced human error.

#### **Q: Explain the difference between Terraform and CloudFormation**
**A:** 
- **Terraform**: Multi-cloud, HCL syntax, community plugins, plan/apply workflow
- **CloudFormation**: AWS-only, JSON/YAML syntax, native AWS integration, stack-based

#### **Q: What is a Terraform provider?**
**A:** A provider is a plugin that enables Terraform to interact with APIs of cloud platforms, SaaS providers, or other services (AWS, Azure, GitHub, etc.).

#### **Q: What happens when you run `terraform apply`?**
**A:** 
1. Creates an execution plan
2. Shows what changes will be made
3. Asks for confirmation (unless `-auto-approve`)
4. Makes the changes to match desired state
5. Updates the state file

### **Intermediate Questions**

#### **Q: Explain Terraform state. Why is it important?**
**A:** State is a mapping between configuration and real-world resources. It:
- Tracks resource metadata
- Enables planning (comparing current vs desired state)
- Improves performance (caching resource attributes)
- Enables team collaboration when stored remotely

#### **Q: What are the benefits of remote state?**
**A:** 
- **Team collaboration** - shared state access
- **Locking** - prevents concurrent modifications
- **Security** - sensitive data encrypted
- **Backup** - state is versioned and backed up

#### **Q: How do you handle secrets in Terraform?**
**A:** 
- Use `sensitive = true` for outputs
- Store secrets in external systems (AWS Parameter Store, Vault)
- Use `.tfvars` files (gitignored) for sensitive inputs
- Never hardcode secrets in `.tf` files

#### **Q: What are Terraform modules and why use them?**
**A:** Modules are containers for multiple resources that are used together. Benefits:
- **Reusability** - write once, use many times
- **Organization** - logical grouping of resources
- **Abstraction** - hide complexity behind simple interfaces
- **Consistency** - standardize configurations across teams

### **Scenario-Based Questions**

#### **Q: Your `terraform apply` fails halfway through. What do you do?**
**A:** 
1. **Check the error message** - identify the root cause
2. **Review state** - `terraform state list` to see what was created
3. **Fix the issue** - update configuration or resolve external dependency
4. **Re-apply** - Terraform will continue from where it failed
5. **Import if needed** - if resources exist but not in state

#### **Q: How would you migrate from one AWS region to another?**
**A:** 
1. **Plan the migration** - identify dependencies
2. **Update configuration** - change provider region
3. **Create new infrastructure** - apply in new region
4. **Migrate data** - copy databases, S3 objects, etc.
5. **Update DNS** - point to new region
6. **Destroy old infrastructure** - after validation

#### **Q: Your team needs separate environments (dev, staging, prod). How do you structure this?**
**A:** 
```
terraform/
├── modules/
│   └── infrastructure/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
```
Each environment uses the same module with different variables and separate state files.

---

## 🚀 **Commands Cheat Sheet** {#commands-cheat-sheet}

### **Basic Commands**
```bash
# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Format code
terraform fmt

# Plan changes
terraform plan
terraform plan -out=tfplan

# Apply changes
terraform apply
terraform apply tfplan
terraform apply -auto-approve

# Destroy infrastructure
terraform destroy
```

### **State Commands**
```bash
# List resources in state
terraform state list

# Show detailed resource information
terraform state show aws_instance.web

# Remove resource from state (doesn't destroy)
terraform state rm aws_instance.web

# Move/rename resource in state
terraform state mv aws_instance.web aws_instance.web_server

# Import existing resource into state
terraform import aws_instance.web i-1234567890abcdef0

# Pull remote state to local
terraform state pull

# Push local state to remote
terraform state push
```

### **Workspace Commands**
```bash
# List workspaces
terraform workspace list

# Create new workspace
terraform workspace new dev

# Switch workspace
terraform workspace select prod

# Delete workspace
terraform workspace delete dev
```

### **Advanced Commands**
```bash
# Show configuration
terraform show

# Show providers
terraform providers

# Refresh state
terraform refresh

# Generate dependency graph
terraform graph | dot -Tsvg > graph.svg

# Check for configuration drift
terraform plan -detailed-exitcode

# Force unlock state (if locked)
terraform force-unlock LOCK_ID
```

### **Debugging**
```bash
# Enable detailed logging
export TF_LOG=DEBUG
terraform apply

# Log to file
export TF_LOG_PATH="terraform.log"

# Validate JSON syntax
terraform validate -json

# Check for unused variables
terraform validate
```

---

## 💡 **Learning Tips for Junior DevOps**

### **1. Start Simple**
- Begin with single-resource configurations
- Practice with local state before remote state
- Use AWS Free Tier for learning

### **2. Read the Docs**
- Terraform official documentation
- Provider documentation (AWS, Azure, etc.)
- Community modules in Terraform Registry

### **3. Practice Scenarios**
- Create and destroy infrastructure repeatedly
- Practice state manipulation commands
- Learn to troubleshoot common errors

### **4. Version Control Everything**
- Always use Git for Terraform code
- Write meaningful commit messages
- Use `.gitignore` for sensitive files

### **5. Learn by Building**
Start with these progressively complex projects:
1. **Static website** (S3 + CloudFront)
2. **Simple web app** (EC2 + Security Groups)
3. **Database application** (RDS + EC2)
4. **Load balanced app** (ALB + Auto Scaling)
5. **CI/CD pipeline** (CodePipeline + CodeBuild)

---

## 🎯 **Next Steps**

### **After mastering basics:**
1. **Advanced Terraform Features**
   - Dynamic blocks
   - For expressions
   - Conditional logic
   - Function usage

2. **Integration with CI/CD**
   - GitHub Actions with Terraform
   - Automated testing (terratest)
   - Policy as code (Sentinel, OPA)

3. **Multi-Cloud and Advanced Patterns**
   - Multiple providers
   - Complex module structures
   - State management at scale

### **Additional Learning Resources**
- 📚 **HashiCorp Learn** - Official tutorials
- 🎥 **YouTube Channels** - TechWorld with Nana, CloudGuru
- 📖 **Books** - "Terraform: Up & Running" by Yevgeniy Brikman
- 🏠 **Practice** - Build personal projects
- 👥 **Community** - HashiCorp forums, Reddit r/Terraform

---

**Remember: Practice is key! Start simple and gradually build more complex infrastructure. Good luck with your Junior DevOps Engineer interview! 🚀**
