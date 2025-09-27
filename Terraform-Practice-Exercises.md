# 🎯 **Terraform Practice Exercises for Junior DevOps**

*Hands-on exercises to master Infrastructure as Code*

---

## 🏋️ **Exercise Difficulty Levels**

- 🟢 **Beginner** - Basic resources and syntax
- 🟡 **Intermediate** - Multiple resources, dependencies  
- 🔴 **Advanced** - Complex scenarios, best practices

---

## 🟢 **Beginner Exercises**

### **Exercise 1: Your First S3 Bucket**
**Goal:** Create an S3 bucket for static website hosting

**Requirements:**
- Create S3 bucket with your name (e.g., "john-terraform-learning")
- Enable versioning
- Add tags: Environment = "learning", Owner = "your-name"

**Solution Template:**
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
  region = "eu-west-2"
}

resource "aws_s3_bucket" "learning" {
  bucket = "YOUR_NAME-terraform-learning"
  
  tags = {
    Environment = "learning"
    Owner       = "YOUR_NAME"
  }
}

# TODO: Add versioning configuration
# TODO: Add output for bucket name
```

**Commands to run:**
```bash
terraform init
terraform validate
terraform plan
terraform apply
terraform show
terraform destroy
```

---

### **Exercise 2: EC2 Instance with Security Group**
**Goal:** Launch a simple web server

**Requirements:**
- Create security group allowing HTTP (port 80) and SSH (port 22)
- Launch t3.micro EC2 instance
- Use Ubuntu AMI
- Install nginx via user_data script

**Hints:**
```hcl
# Use data source to find Ubuntu AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Ubuntu
  
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-20.04-amd64-server-*"]
  }
}

# Security group template
resource "aws_security_group" "web" {
  name_prefix = "web-sg-"
  
  # TODO: Add ingress rules for port 80 and 22
  # TODO: Add egress rule for all outbound traffic
}
```

**Expected Outputs:**
- Instance public IP address
- Security group ID
- AMI ID used

---

### **Exercise 3: Variables and Outputs**
**Goal:** Make your configuration flexible

**Requirements:**
- Convert hardcoded values to variables
- Create variables.tf with descriptions and defaults
- Create outputs.tf showing important information
- Use terraform.tfvars for environment-specific values

**Files to create:**
```bash
variables.tf    # Variable definitions
outputs.tf      # Output values
terraform.tfvars # Variable values (gitignore this!)
```

**Variable examples:**
```hcl
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-west-2"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
  
  validation {
    condition     = contains(["t3.micro", "t3.small", "t3.medium"], var.instance_type)
    error_message = "Instance type must be t3.micro, t3.small, or t3.medium."
  }
}
```

---

## 🟡 **Intermediate Exercises**

### **Exercise 4: Multi-Tier Web Application**
**Goal:** Build a complete web application infrastructure

**Requirements:**
- VPC with public and private subnets
- Internet Gateway and NAT Gateway
- Web server in public subnet
- Database in private subnet
- Application Load Balancer
- Route53 record (if you have a domain)

**Architecture:**
```
Internet → ALB → Web Servers (Public) → Database (Private)
```

**Starter template:**
```hcl
# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "main-vpc"
  }
}

# Public Subnet
resource "aws_subnet" "public" {
  count = 2
  
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "public-subnet-${count.index + 1}"
    Type = "public"
  }
}

# TODO: Add private subnets
# TODO: Add Internet Gateway
# TODO: Add NAT Gateway
# TODO: Add Route Tables
# TODO: Add ALB
# TODO: Add Auto Scaling Group
```

**Bonus challenges:**
- Add CloudWatch alarms for high CPU
- Create custom AMI with your application
- Add SSL certificate for HTTPS

---

### **Exercise 5: Terraform Modules**
**Goal:** Create reusable infrastructure modules

**Requirements:**
- Create a module for networking (VPC, subnets, gateways)
- Create a module for compute (ALB, ASG, Launch Template)
- Create a module for monitoring (CloudWatch, SNS)
- Use modules in main configuration

**Module structure:**
```
modules/
├── networking/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── README.md
├── compute/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── README.md
└── monitoring/
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    └── README.md
```

**Module usage:**
```hcl
module "networking" {
  source = "./modules/networking"
  
  vpc_cidr = "10.0.0.0/16"
  project  = var.project_name
  
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.10.0/24", "10.0.20.0/24"]
}

module "compute" {
  source = "./modules/compute"
  
  vpc_id            = module.networking.vpc_id
  public_subnet_ids = module.networking.public_subnet_ids
  # ... other variables
}
```

---

### **Exercise 6: Remote State and Workspaces**
**Goal:** Set up professional state management

**Requirements:**
- Create S3 bucket for Terraform state
- Create DynamoDB table for state locking
- Configure remote backend
- Create workspaces for dev/staging/prod
- Use different variable files for each workspace

**Backend configuration:**
```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "your-name-terraform-state"
    key            = "webapp/terraform.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

**Workspace workflow:**
```bash
# Create workspaces
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod

# Switch between workspaces
terraform workspace select dev
terraform plan -var-file="dev.tfvars"

terraform workspace select prod
terraform plan -var-file="prod.tfvars"
```

---

## 🔴 **Advanced Exercises**

### **Exercise 7: CI/CD Pipeline Infrastructure**
**Goal:** Build complete CI/CD infrastructure

**Requirements:**
- CodeCommit repository
- CodeBuild project with buildspec.yml
- CodePipeline with Source/Build/Deploy stages
- S3 buckets for artifacts and deployments
- IAM roles and policies for services
- SNS notifications for pipeline events

**Bonus features:**
- Integration with GitHub instead of CodeCommit
- Multiple environments (dev/staging/prod)
- Manual approval step for production
- Slack notifications via Lambda

---

### **Exercise 8: Disaster Recovery Setup**
**Goal:** Create multi-region disaster recovery

**Requirements:**
- Primary infrastructure in eu-west-2
- Backup infrastructure in us-east-1
- RDS with cross-region backup
- S3 cross-region replication
- Route53 health checks with failover
- Lambda functions for failover automation

**Architecture challenges:**
- Database replication strategy
- DNS failover configuration
- Application state synchronization
- Monitoring and alerting for both regions

---

### **Exercise 9: Security and Compliance**
**Goal:** Implement security best practices

**Requirements:**
- VPC with private subnets only
- Bastion host for SSH access
- NAT Gateway for outbound internet
- WAF protection for web applications
- GuardDuty for threat detection
- Config rules for compliance checking
- CloudTrail for audit logging
- Systems Manager Session Manager for shell access

**Security checklist:**
- No public SSH access to application servers
- All S3 buckets encrypted
- All EBS volumes encrypted
- IAM policies follow least privilege
- Security groups have minimal required access
- Regular security group auditing

---

### **Exercise 10: Cost Optimization**
**Goal:** Build cost-effective infrastructure

**Requirements:**
- Spot instances for non-critical workloads
- Reserved instances for predictable workloads
- Auto Scaling based on CloudWatch metrics
- Lambda for serverless components
- S3 lifecycle policies for data archival
- CloudWatch cost anomaly detection
- Budget alerts for cost control

**Cost optimization strategies:**
- Right-sizing instances based on usage
- Schedule start/stop for dev environments
- Use cheaper storage classes where appropriate
- Implement data retention policies
- Regular cost review and optimization

---

## 🛠️ **Debugging Exercises**

### **Exercise 11: Fix the Broken Configuration**
**Goal:** Develop troubleshooting skills

Given this broken configuration, identify and fix all issues:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"  # Issue 1: Old version
    }
  }
}

provider "aws" {
  region = var.region  # Issue 2: Variable not defined
}

resource "aws_instance" "web" {
  ami           = "ami-12345"  # Issue 3: Hardcoded AMI
  instance_type = "t2.micro"   # Issue 4: Old generation
  subnet_id     = aws_subnet.public.id  # Issue 5: Subnet doesn't exist
  
  security_groups = [aws_security_group.web.name]  # Issue 6: Should use IDs in VPC
  
  tags = {
    Name = "${var.project}-web"  # Issue 7: Variable interpolation
  }
}

resource "aws_security_group" "web" {
  name = "web-sg"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Issue 8: Missing egress rules
}

output "public_ip" {
  value = aws_instance.web.public_ip
  # Issue 9: Missing description
}
```

**Issues to find:**
1. Provider version constraint
2. Missing variable definition  
3. Hardcoded AMI instead of data source
4. Old instance type
5. Missing subnet resource
6. Wrong security group reference
7. Incorrect variable interpolation syntax
8. Missing egress rules
9. Missing output description

---

### **Exercise 12: State Management Scenarios**

**Scenario A: Import Existing Resources**
You have manually created resources in AWS. Import them into Terraform:
- EC2 instance i-1234567890abcdef0
- Security group sg-0123456789abcdef0
- S3 bucket existing-bucket-name

```bash
# Commands to practice:
terraform import aws_instance.web i-1234567890abcdef0
terraform import aws_security_group.web sg-0123456789abcdef0
terraform import aws_s3_bucket.existing existing-bucket-name
```

**Scenario B: State Corruption Recovery**
Your state file is corrupted. Practice these recovery steps:
1. Restore from backup
2. Import resources manually
3. Use `terraform refresh` carefully
4. Validate state consistency

**Scenario C: Resource Drift Detection**
Someone manually changed your infrastructure. Practice:
1. Detecting changes with `terraform plan`
2. Updating configuration to match changes
3. Reverting unauthorized changes
4. Preventing future drift

---

## 🎯 **Real-World Scenarios**

### **Exercise 13: Migration Project**
**Goal:** Practice infrastructure migration

**Scenario:** Your company is migrating from manually managed infrastructure to Terraform.

**Current setup:**
- 3 EC2 instances running web servers
- 1 RDS MySQL database
- 1 Application Load Balancer
- Route53 hosted zone with records
- CloudFront distribution

**Your tasks:**
1. **Audit current infrastructure** - document everything
2. **Create Terraform configuration** - match existing setup
3. **Import resources** - bring under Terraform management
4. **Validate configuration** - ensure no changes when applied
5. **Implement improvements** - add missing tags, security groups, etc.

**Migration checklist:**
- [ ] Document all existing resources
- [ ] Create comprehensive Terraform configuration
- [ ] Import all resources successfully
- [ ] `terraform plan` shows no changes
- [ ] Add missing tags and labels
- [ ] Implement security improvements
- [ ] Create backup procedures
- [ ] Document the new infrastructure

---

### **Exercise 14: Multi-Account Setup**
**Goal:** Manage infrastructure across multiple AWS accounts

**Scenario:** Your organization uses separate AWS accounts for dev/staging/prod.

**Requirements:**
- Configure multiple AWS providers
- Share common modules across accounts
- Manage cross-account permissions
- Set up centralized logging and monitoring

```hcl
# Multi-account provider setup
provider "aws" {
  alias  = "dev"
  region = var.region
  
  assume_role {
    role_arn = "arn:aws:iam::111111111111:role/TerraformRole"
  }
}

provider "aws" {
  alias  = "staging"  
  region = var.region
  
  assume_role {
    role_arn = "arn:aws:iam::222222222222:role/TerraformRole"
  }
}

provider "aws" {
  alias  = "prod"
  region = var.region
  
  assume_role {
    role_arn = "arn:aws:iam::333333333333:role/TerraformRole"
  }
}
```

---

## 📊 **Progress Tracking**

### **Beginner Level Checklist**
- [ ] Exercise 1: S3 Bucket
- [ ] Exercise 2: EC2 with Security Group  
- [ ] Exercise 3: Variables and Outputs
- [ ] Can create basic resources
- [ ] Understands plan/apply workflow
- [ ] Uses variables and outputs effectively

### **Intermediate Level Checklist**
- [ ] Exercise 4: Multi-Tier Application
- [ ] Exercise 5: Terraform Modules
- [ ] Exercise 6: Remote State
- [ ] Can design complex architectures
- [ ] Writes reusable modules
- [ ] Manages state professionally

### **Advanced Level Checklist**
- [ ] Exercise 7: CI/CD Pipeline
- [ ] Exercise 8: Disaster Recovery
- [ ] Exercise 9: Security & Compliance
- [ ] Exercise 10: Cost Optimization
- [ ] Can solve real-world problems
- [ ] Implements enterprise best practices

### **Expert Level Skills**
- [ ] Exercise 11-14: All debugging and scenarios
- [ ] Can troubleshoot complex issues
- [ ] Handles migrations and imports
- [ ] Manages multi-account setups
- [ ] Mentors junior team members

---

## 🎓 **Study Tips**

### **Before Each Exercise:**
1. **Read the requirements** carefully
2. **Plan your approach** - what resources do you need?
3. **Start simple** - get basic functionality working first
4. **Iterate and improve** - add features incrementally

### **During Development:**
1. **Use `terraform validate`** frequently
2. **Run `terraform plan`** before every apply
3. **Check AWS console** to verify resources
4. **Document your decisions** - why did you choose this approach?

### **After Completion:**
1. **Test thoroughly** - does everything work as expected?
2. **Clean up resources** - run `terraform destroy`
3. **Review and refine** - how could you improve the code?
4. **Share and get feedback** - learn from others

### **Common Mistakes to Avoid:**
- 🚫 Not reading error messages carefully
- 🚫 Hardcoding values instead of using variables
- 🚫 Forgetting to destroy resources (costs money!)
- 🚫 Not using proper naming conventions
- 🚫 Ignoring security best practices
- 🚫 Not testing in different environments

---

## 🚀 **Next Steps**

After completing these exercises, you'll be ready for:

### **Professional Development:**
1. **Contribute to open source** Terraform modules
2. **Get HashiCorp certified** (Terraform Associate)
3. **Join communities** (Reddit, Discord, forums)
4. **Write blog posts** about your learning journey

### **Advanced Topics:**
1. **Terraform Cloud/Enterprise**
2. **Policy as Code** (Sentinel, OPA)
3. **Testing Terraform** (Terratest, kitchen-terraform)
4. **Advanced state management** at scale

### **Career Opportunities:**
- Junior DevOps Engineer
- Cloud Engineer
- Infrastructure Engineer  
- Platform Engineer
- Site Reliability Engineer

---

**Remember: Practice makes perfect! Start with the basics and gradually work your way up. Each exercise builds on the previous ones. Good luck! 🎯**
