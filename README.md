# toumé · toume.org

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

## Contact delivery

The contact form sends a background JSON request to FormSubmit's AJAX endpoint for delivery to `hello@toume.org`. Visitors stay on toumé and see an inline confirmation only after the service accepts the submission. It includes field validation, a honeypot, duplicate-submit prevention, a 20-second timeout, and a unique enquiry reference. The AJAX flow does not show the provider's hosted CAPTCHA page. The sender's email is included for replies. No mail credentials are stored in the website.

On network errors, timeout, or provider rejection, the form retains the message and offers retry or direct email. The receipt and confirmation support both languages. The standalone thank-you page remains available for older submission links.

**Activation is required before delivery works.** Submit a setup message, then open the activation email sent by FormSubmit and confirm the form. Check spam if necessary. Verify a real submission arrives after activation; a browser redirect alone does not prove inbox delivery.

FormSubmit processes submissions and retains them for 30 days. This is disclosed beside the form with a link to the provider's privacy policy. User input is not persisted by the website; the selected language is stored locally. The direct email link provides another contact route.

Changing the recipient to an address such as `hello@toume.org` requires an existing mailbox/forwarder and reactivation with FormSubmit. A custom domain on GitHub Pages does not create an email mailbox. Manrope is loaded from Google Fonts; no analytics are installed.
