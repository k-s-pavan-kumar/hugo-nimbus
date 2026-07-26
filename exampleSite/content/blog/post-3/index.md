+++
title = 'Building an Observability Stack with Prometheus and Grafana'
date = 2023-03-15T11:00:00-07:00
draft = false
tags = ['observability', 'monitoring']
description = 'Metrics, alerting rules, and the dashboards that actually get looked at during an incident.'
author = 'Nimbus Team'
+++

Most teams don't have a metrics problem — they have a *too many
dashboards nobody looks at* problem. This is the minimal setup we use to
go from "no visibility" to "useful alerts and three dashboards people
actually open during an incident."

{{< badge "docker" "Prometheus v2.51" >}} {{< badge type="terraform" label="Grafana v10.4" url="https://grafana.com" >}}

![Bryce Canyon National Park](bryce-canyon.jpg)

## Scrape config

Prometheus pulls metrics on an interval rather than receiving pushes,
which keeps the failure mode simple: if a target stops responding, you get
gaps, not silent data loss.

```yaml
scrape_configs:
  - job_name: 'api'
    scrape_interval: 15s
    static_configs:
      - targets: ['api-1:9090', 'api-2:9090']
```

## Querying the same thing two ways

PromQL and Grafana's query builder both end up expressing the same
question — "what's our p99 latency over the last 5 minutes" — just with
different syntax depending on where you're working:

{{< code-tabs tabs="PromQL,Alerting rule" >}}
```promql
histogram_quantile(0.99,
  rate(http_request_duration_seconds_bucket[5m])
)
```
```yaml
- alert: HighP99Latency
  expr: |
    histogram_quantile(0.99,
      rate(http_request_duration_seconds_bucket[5m])
    ) > 0.5
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "p99 latency above 500ms for 10 minutes"
```
{{< /code-tabs >}}

## The three dashboards that earn their keep

Everything else is useful for deep-dives, but these are the ones worth
pulling up during an active incident:

1. **Golden signals** — latency, traffic, errors, saturation, per service.
   If this doesn't tell you where to look next, the next dashboard won't
   either.
2. **Deploy correlation** — a vertical marker on every graph for each
   deploy. Most "mystery regressions" are a deploy that happened 20 minutes
   before someone noticed.
3. **Dependency health** — the two or three external services and
   datastores that, if slow, make everything downstream look broken.

{{< note type="tip" title="Alert on symptoms, not causes" >}}
Alert on "error rate is elevated" and "latency is elevated," not on
"CPU is high." High CPU that isn't affecting users doesn't need a page at
2am — and a service that's failing *without* high CPU still needs one.
{{< /note >}}
