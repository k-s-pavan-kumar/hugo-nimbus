+++
title = 'Terraform State Management: Lessons from Production'
date = 2023-02-15T10:00:00-07:00
draft = false
tags = ['terraform', 'infrastructure']
description = 'Remote state backends, locking, and the drift-detection habits that keep a Terraform-managed fleet honest.'
author = 'Nimbus Team'
+++

Local Terraform state works fine for a weekend project. It falls apart the
moment a second engineer runs `terraform apply` against the same
infrastructure. Here's the setup we settled on after a state file conflict
took down a staging environment for an afternoon.

{{< note type="warning" title="State files contain secrets" >}}
Terraform state can include plaintext values for anything marked `sensitive`
in your provider — database passwords, API keys, TLS private keys. Treat
your state backend's access controls with the same care as a secrets
manager, not like a build artifact.
{{< /note >}}

## Move to a remote backend

A local `terraform.tfstate` file has no locking and no history. The fix is
a remote backend with state locking built in:

```hcl
terraform {
  backend "s3" {
    bucket         = "acme-terraform-state"
    key            = "prod/network/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

The `dynamodb_table` is what gives you locking — without it, two people
running `apply` at the same time will corrupt state, not just conflict.

## Backend configuration reference

{{< config-table >}}
- name: bucket
  type: string
  required: true
  description: S3 bucket that stores the state file. Must already exist.
- name: key
  type: string
  required: true
  description: Path within the bucket for this state file.
- name: dynamodb_table
  type: string
  required: false
  description: DynamoDB table used for state locking. Strongly recommended for any team larger than one.
- name: encrypt
  type: boolean
  default: "false"
  required: false
  description: Enable server-side encryption for the state file at rest.
{{< /config-table >}}

## Catch drift before it catches you

Someone will eventually change something by hand in the console "just this
once." `terraform plan` on a schedule is how you find out before it causes
an incident:

{{< diff title="main.tf" >}}
```diff
 resource "aws_security_group_rule" "allow_https" {
   type              = "ingress"
   from_port         = 443
   to_port           = 443
   protocol          = "tcp"
-  cidr_blocks       = ["10.0.0.0/8"]
+  cidr_blocks       = ["0.0.0.0/0"]
   security_group_id = aws_security_group.web.id
 }
```
{{< /diff >}}

That diff is exactly the kind of thing a scheduled `terraform plan` catches
— someone opened port 443 to the world through the console, and drift
detection is what surfaces it before a security review does.

## What we run in CI

- `terraform fmt -check` and `terraform validate` on every PR
- `terraform plan` posted as a PR comment for review
- A nightly scheduled `plan` against `main` that alerts on any unexpected
  diff — this is the drift check, separate from the PR-triggered one

None of this requires exotic tooling. It's `terraform` in a GitHub Actions
job and a Slack webhook for the nightly drift alert.
