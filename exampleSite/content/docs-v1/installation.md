+++
title = 'Installation (v1.0)'
type = 'docs'
weight = 10
date = 2023-11-01
+++

{{< note type="warning" title="This is the v1.0 install method" >}}
Nimbus v2.0 changed the build tooling from Gulp to native Hugo Pipes +
PostCSS. If you're starting a new site, follow the current
[Installation]({{< relref "/docs/installation" >}}) guide instead.
{{< /note >}}

## 1. Add the theme

```bash
git submodule add https://github.com/your-org/hugo-theme-nimbus.git themes/nimbus
```

## 2. Install the v1.0 Gulp toolchain

```bash
npm install -g gulp-cli
npm install
gulp build
```

This workflow is no longer maintained — see the current docs for the
PostCSS-based build.
