# SNS Topic for booking notifications
resource "aws_sns_topic" "booking_notifications" {
  name = "${local.name_prefix}-booking-notifications"

  tags = {
    Name        = "${local.name_prefix}-booking-notifications"
    Environment = var.env
    Project     = var.project
    Purpose     = "booking-notifications"
  }
}

# SNS Topic subscription for Brenda's phone (SMS)
resource "aws_sns_topic_subscription" "brenda_sms" {
  topic_arn = aws_sns_topic.booking_notifications.arn
  protocol  = "sms"
  endpoint  = var.brenda_phone
}

# SNS Topic subscription for Brenda's email (backup notification)
resource "aws_sns_topic_subscription" "brenda_email" {
  topic_arn = aws_sns_topic.booking_notifications.arn
  protocol  = "email"
  endpoint  = var.to_email
}
