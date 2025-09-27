############################################
# GitHub Actions OIDC Provider + CI Role
############################################

resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]

  # Current GitHub Actions OIDC root CA thumbprints
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "a031c46782e6e6c662c2c87c76da9aa62ccabd8e"
  ]
}

data "aws_iam_policy_document" "gha_trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    # Restrict to this repository and branch
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:KrisRz/brenda-nails-studio:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_role" "gha_ci" {
  name               = "${local.name_prefix}-gha-ci"
  assume_role_policy = data.aws_iam_policy_document.gha_trust.json
}

# Initial broad permissions for Terraform-driven deploys
resource "aws_iam_role_policy_attachment" "gha_poweruser" {
  role       = aws_iam_role.gha_ci.name
  policy_arn = "arn:aws:iam::aws:policy/PowerUserAccess"
}


