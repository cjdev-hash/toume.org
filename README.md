# Toumé · toume.org

A bilingual technology consulting website with a guided, eight-screen introduction, a warm charcoal/terracotta palette, and a separate contact page. Polish introduces Krzysztof; English introduces Chris.

## Local development

Requires Node.js 22 or newer. There are no npm dependencies to install.

```sh
npm run dev
npm run check
npm run build
```

Open http://localhost:3000/alternative.html for the guided site. The earlier design remains available locally at `/index.html` for reference; it is not included in the deployed site.

`npm run build` creates `dist/` from an explicit asset list. The guided design becomes `/index.html`, and contact-page return links point to it. The build excludes local briefs, development scripts, and the earlier design's HTML/CSS. The shared `app.js` still contains the earlier copy alongside the contact form logic.

## Deployment

The public repository is intended for `cjdev-hash/toume.org`. Pushes to `main` run `.github/workflows/pages.yml`, check the scripts, build `dist/`, and deploy that directory using GitHub Pages.

In **Settings → Pages**, use **GitHub Actions** as the publishing source and set the custom domain to **toume.org**. For Actions deployments, the Pages setting is authoritative; the included `CNAME` also records the intended domain.

Configure these records at the DNS provider:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | cjdev-hash.github.io |

Review existing records before changing them. Keep unrelated email records. Once DNS is correct and GitHub provisions the certificate, enable **Enforce HTTPS** in Pages settings. GitHub also supports verifying domain ownership in account settings.

References: [custom domain configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

## Files

- `alternative.html`, `alternative.css`, `alternative.js`: guided site, translations, diagrams, and expandable experience list.
- `contact.html`, `app.js`: bilingual enquiry form. The contact page shares the guided site's stylesheet.
- `ja.png`: supplied portrait.
- `build.mjs`: static production build.
- `server.mjs`: local preview server only; GitHub Pages needs no Node.js server.

## Contact status

The contact form validates input and downloads an enquiry draft with a unique reference. **It does not send messages.** This is stated on the page. Input stays in memory, and only the selected language is stored locally.

To enable delivery, connect a form endpoint or email service, add server-side validation and abuse protection, and update the privacy information. Never put service credentials in browser code. Manrope is loaded from Google Fonts; no analytics are installed.
