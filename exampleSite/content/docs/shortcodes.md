+++
title = 'Shortcodes'
description = 'Every content shortcode Nimbus ships, with live examples.'
weight = 30
date = 2024-04-12
+++

## Note boxes

`type` can be `info` (default), `warning`, `success`, or `error`.

```markdown
{{</* note type="tip" title="Pro tip" */>}}
Your content here.
{{</* /note */>}}
```

{{< note type="tip" title="Pro tip" >}}
`type` can also be passed positionally, but not combined with `title=` in the
same call — Hugo rejects mixing positional and named arguments.
{{< /note >}}

## Terminal

```markdown
{{</* terminal command="bash" user="dev" host="prod-01" path="~/app" */>}}
kubectl get pods
{{</* /terminal */>}}
```

{{< terminal command="bash" user="dev" host="prod-01" path="~/app" >}}
kubectl get pods
NAME                   READY   STATUS    RESTARTS   AGE
api-7d8f9c6b5d-x2k9p   1/1     Running   0          3m
{{< /terminal >}}

## Badges

```markdown
{{</* badge "kubernetes" "Kubernetes v1.28" */>}}
{{</* badge type="terraform" label="Terraform v1.5" url="https://terraform.io" */>}}
```

{{< badge "kubernetes" "Kubernetes v1.28" >}} {{< badge "docker" "Docker" >}} {{< badge type="terraform" label="Terraform v1.5" url="https://terraform.io" >}} {{< badge "aws" "AWS" >}}

## Code tabs

```markdown
{{</* code-tabs tabs="bash,PowerShell" */>}}
​```bash
kubectl get pods
​```
​```powershell
kubectl.exe get pods
​```
{{</* /code-tabs */>}}
```

{{< code-tabs tabs="bash,PowerShell" >}}
```bash
kubectl get pods
```
```powershell
kubectl.exe get pods
```
{{< /code-tabs >}}

## Config reference tables

```markdown
{{</* config-table */>}}
- name: replicas
  type: integer
  default: "3"
  required: false
  description: Number of pod replicas to run.
- name: image
  type: string
  required: true
  description: Container image reference, including tag.
{{</* /config-table */>}}
```

{{< config-table >}}
- name: replicas
  type: integer
  default: "3"
  required: false
  description: Number of pod replicas to run.
- name: image
  type: string
  required: true
  description: Container image reference, including tag.
{{< /config-table >}}

## Diff blocks

```markdown
{{</* diff title="main.tf" */>}}
​```diff
 resource "aws_instance" "web" {
-  instance_type = "t3.small"
+  instance_type = "t3.medium"
   ami           = "ami-0abcdef1234567890"
 }
​```
{{</* /diff */>}}
```

{{< diff title="main.tf" >}}
```diff
 resource "aws_instance" "web" {
-  instance_type = "t3.small"
+  instance_type = "t3.medium"
   ami           = "ami-0abcdef1234567890"
 }
```
{{< /diff >}}

## OpenAPI spec rendering

Drop a spec file into a page bundle and reference it — see the full example
at [API Reference]({{< relref "api-reference" >}}).

```markdown
{{</* openapi src="openapi.yaml" */>}}
```

## Mermaid diagrams

```markdown
{{</* mermaid title="Request flow" */>}}
graph LR
    A[Client] --> B[Service]
{{</* /mermaid */>}}
```

{{< mermaid title="Request flow" >}}
graph LR
    A[Client] --> B[Service]
{{< /mermaid >}}
