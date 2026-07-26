+++
title = 'Installation'
description = 'Add Nimbus to a new or existing Hugo site, step by step.'
weight = 20
date = 2024-03-05
+++

## 1. Add the theme

As a Git submodule (recommended for most sites):

```bash
git submodule add https://github.com/your-org/hugo-theme-nimbus.git themes/nimbus
```

Or as a Hugo Module:

```bash
hugo mod init github.com/you/your-site
hugo mod get github.com/your-org/hugo-theme-nimbus
```

## 2. Point your site config at it

```toml
theme = "nimbus"
```

## 3. Copy the build tooling

Nimbus's styling is compiled with Tailwind, ahead of time, into a plain
CSS file — Hugo itself never runs Node or PostCSS. Copy these files from
`exampleSite/` into your site root:

- `package.json`
- `postcss.config.js`
- `tailwind.config.js`
- `assets/css/tailwind.built.css` (the pre-compiled output — your site
  works immediately with this even before you run `npm install`)

{{< note type="tip" title="No Node.js required to just run the site" >}}
`hugo server -D` and `hugo --minify` work with zero npm install, because
they only read the already-compiled `tailwind.built.css`. You only need
Node.js when you actually want to change styles or Tailwind content globs.
{{< /note >}}

## 4. When you do change styles

```bash
npm install
npm run watch-css   # recompiles on save; run alongside `hugo server -D`
# or, for a one-off rebuild:
npm run build-css
```

Commit the updated `assets/css/tailwind.built.css` afterward — it's the
actual file Hugo serves.

## 5. Build

```bash
hugo server -D      # local dev
hugo --minify        # production build, output in ./public
```

## Optional: real "last updated" dates + edit links

Every page shows a file-based "last updated" date and an "Edit this page"
link out of the box — no setup needed. Once your site is an actual git
repository (not just unzipped), uncomment `enableGitInfo = true` in
`hugo.toml` to switch the date to the real last-commit date and show the
commit author too.
