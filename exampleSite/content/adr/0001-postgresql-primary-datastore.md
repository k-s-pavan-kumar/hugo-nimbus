+++
title = 'Use PostgreSQL as the primary datastore'
date = 2024-02-10
status = 'accepted'
number = 1
deciders = ['Platform Team']
tags = ['database', 'infrastructure']
+++

## Context

We need a primary datastore for the new billing service. The team has
production experience with both PostgreSQL and MongoDB, and the data model
is relational (accounts, invoices, line items with foreign keys).

## Decision

We will use PostgreSQL 16, managed via RDS, as the primary datastore for all
new services unless a specific workload has a strong document-store or
time-series justification.

## Consequences

- Schema migrations require a formal review (see `docs/migrations`).
- We standardize on one connection-pooling strategy (PgBouncer) across
  services, simplifying on-call runbooks.
- Document-shaped data (e.g. audit logs) will need a deliberate exception
  request rather than defaulting to Postgres JSONB columns.
