# Putting the site on a custom domain

The site currently lives at <https://caellumyhl.github.io/uoft-boxing-club/>.
Moving it to something like `uoftboxing.ca` takes three steps.

Nothing here is done yet - the repository is *prepared* for it, and the code
change in step 2 is the only one needed.

## 1. Buy the domain

Any registrar works (Namecheap, Cloudflare, Google Domains successors, etc.).
A `.ca` costs roughly $15-20/year. Buy it on an account the club will still
control after this year's execs graduate - a club account, not a personal one.

## 2. Tell the build the site is at the domain root

Right now every URL is prefixed with `/uoft-boxing-club` because that is the
GitHub Pages project path. On a custom domain the site sits at the root, so
that prefix has to go.

In `.github/workflows/nextjs.yml`, set the base path to empty:

```yaml
NEXT_PUBLIC_BASE_PATH: ""
```

and in `frontend/next.config.ts`, set:

```ts
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
```

(It already reads that variable - you only need to change the value.)

## 3. Point DNS at GitHub

At your registrar, add these records for the apex domain:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `caellumyhl.github.io.` |

Then in the repository: **Settings > Pages > Custom domain**, enter the domain
and save. GitHub writes a `CNAME` file into the repository automatically.

Wait for the **Enforce HTTPS** checkbox to become available (GitHub has to issue
a certificate first - usually under an hour, occasionally up to 24) and tick it.

## 4. Afterwards

- Add the new domain to the API key's allowed referrers
  (see step 3 of [`EXEC_GUIDE.md`](EXEC_GUIDE.md)), or the schedule and store
  will stop loading on the new address.
- The old `caellumyhl.github.io/uoft-boxing-club` address redirects to the new
  domain automatically.
