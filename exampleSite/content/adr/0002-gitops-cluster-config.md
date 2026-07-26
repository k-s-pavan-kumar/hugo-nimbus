+++
title = 'Adopt GitOps for cluster configuration'
date = 2024-06-01
status = 'proposed'
number = 2
deciders = ['Platform Team', 'SRE']
tags = ['kubernetes', 'ci-cd']
+++

## Context

Cluster configuration changes currently happen via direct `kubectl apply`
from engineer laptops. We have no audit trail and drift between clusters is
common.

## Decision

Adopt a GitOps workflow (Argo CD) where the Git repository is the single
source of truth for cluster state, and all changes go through pull request
review.

## Consequences

- Every config change is reviewable and revertible via Git history.
- Emergency changes need a documented break-glass procedure, since direct
  `kubectl apply` will be restricted in production namespaces.
- Requires migrating ~40 existing manifests into the GitOps repo before
  enforcement can begin.
