# 🚀 **DevOps Commands Cheat Sheet**
*Quick Reference for GitHub Actions + AWS OIDC Interview*

---

## 🔐 **AWS IAM Commands**

### Check OIDC Provider
```bash
aws iam list-open-id-connect-providers
```

### Check GitHub Actions Role
```bash
aws iam get-role --role-name brenda-nails-prod-gha-ci
```

### List Role Policies
```bash
aws iam list-attached-role-policies --role-name brenda-nails-prod-gha-ci
```

### Check Trust Policy
```bash
aws iam get-role --role-name brenda-nails-prod-gha-ci \
  --query "Role.AssumeRolePolicyDocument" --output json
```

### List All GitHub-related Roles
```bash
aws iam list-roles --query "Roles[?contains(RoleName, 'gha') || contains(RoleName, 'github')]"
```

### Verify AWS Credentials (in CI)
```bash
aws sts get-caller-identity
```

---

## ⚡ **GitHub Actions Commands**

### Trigger Manual Workflow
```bash
# Via GitHub CLI
gh workflow run "Deploy Website"

# Via API
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/KrisRz/brenda-nails-studio/actions/workflows/deploy.yml/dispatches \
  -d '{"ref":"main"}'
```

### Check Workflow Status
```bash
gh run list --workflow="Deploy Website"
```

### Download Workflow Logs
```bash
gh run download RUN_ID
```

---

## 🏗️ **Terraform Commands**

### Initialize with Backend
```bash
cd envs/prod
terraform init
```

### Plan Changes
```bash
terraform plan -out=tfplan
```

### Apply Changes
```bash
terraform apply tfplan
```

### Check State
```bash
terraform state list
terraform show
```

### Import Existing Resource
```bash
terraform import aws_iam_role.gha_ci brenda-nails-prod-gha-ci
```

---

## 📦 **S3 & CloudFront Commands**

### Sync Files to S3
```bash
aws s3 sync dist/ s3://brenda-nails.com/ --delete \
  --cache-control "public,max-age=31536000"
```

### List CloudFront Distributions
```bash
aws cloudfront list-distributions \
  --query "DistributionList.Items[*].{Id:Id,DomainName:DomainName}"
```

### Create CloudFront Invalidation
```bash
aws cloudfront create-invalidation \
  --distribution-id E1234567890 \
  --paths "/*"
```

### Check S3 Bucket Contents
```bash
aws s3 ls s3://brenda-nails.com/ --recursive
```

---

## 🔍 **Debugging Commands**

### Test JWT Token Locally
```bash
# Decode JWT (requires jq)
echo "JWT_TOKEN" | cut -d. -f2 | base64 -d | jq .
```

### Check CloudTrail Logs
```bash
aws logs describe-log-groups --log-group-name-prefix "/aws/cloudtrail"
```

### Verify Route53 Records
```bash
aws route53 list-hosted-zones
aws route53 list-resource-record-sets --hosted-zone-id Z123456789
```

### Test Role Assumption (Local)
```bash
aws sts assume-role-with-web-identity \
  --role-arn arn:aws:iam::ACCOUNT:role/ROLE \
  --role-session-name test-session \
  --web-identity-token $JWT_TOKEN
```

---

## 🐙 **Git Commands**

### Create Feature Branch
```bash
git checkout -b feature/new-deployment
git push -u origin feature/new-deployment
```

### Trigger CI/CD
```bash
git add .
git commit -m "feat: update deployment process"
git push origin main
```

### Check Repository Status
```bash
gh repo view KrisRz/brenda-nails-studio
```

---

## 🚨 **Emergency Commands**

### Rollback S3 Deployment
```bash
# Sync previous version
aws s3 sync s3://backup-bucket/ s3://brenda-nails.com/
aws cloudfront create-invalidation --distribution-id ID --paths "/*"
```

### Disable GitHub Actions
```bash
# Via GitHub CLI
gh api repos/KrisRz/brenda-nails-studio \
  --method PATCH \
  --field actions_enabled=false
```

### Remove IAM Role (Emergency)
```bash
aws iam detach-role-policy \
  --role-name brenda-nails-prod-gha-ci \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

aws iam delete-role --role-name brenda-nails-prod-gha-ci
```

---

## 📊 **Monitoring Commands**

### Check Build Performance
```bash
gh run list --limit 10 \
  --json databaseId,conclusion,startedAt,updatedAt
```

### AWS Cost Explorer (CLI)
```bash
aws ce get-cost-and-usage \
  --time-period Start=2025-09-01,End=2025-09-30 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

### CloudWatch Metrics
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --dimensions Name=DistributionId,Value=E1234567890 \
  --statistics Sum \
  --start-time 2025-09-27T00:00:00Z \
  --end-time 2025-09-27T23:59:59Z \
  --period 3600
```

---

## 🎯 **Quick Interview Demos**

### Show Live Pipeline
1. `gh repo view KrisRz/brenda-nails-studio`
2. `gh run list --workflow="Deploy Website"`
3. Open: https://github.com/KrisRz/brenda-nails-studio/actions

### Show AWS Resources
1. `aws iam get-role --role-name brenda-nails-prod-gha-ci`
2. `aws iam list-open-id-connect-providers`
3. `aws s3 ls s3://brenda-nails.com/`

### Show Live Website
1. `curl -I https://brenda-nails.com`
2. Open: https://brenda-nails.com

### Trigger Live Deployment
1. Make small change: `echo "<!-- $(date) -->" >> apps/frontend/src/pages/index.astro`
2. Commit: `git commit -am "demo: trigger deployment for interview"`
3. Push: `git push origin main`
4. Show: GitHub Actions waiting for approval
5. Approve: Manual approval in GitHub UI
6. Verify: Changes live on website

---

## 🏆 **Interview Success One-Liners**

- **"Zero secrets stored - pure OIDC authentication"**
- **"Short-lived tokens with automatic rotation"**  
- **"Repository-specific access control"**
- **"Manual approval gates for production safety"**
- **"Complete infrastructure as code with Terraform"**
- **"Enterprise-grade monitoring and audit trail"**

---

**Keep this handy during your DevOps interview! 🚀**
