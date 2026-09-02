# Moving the site to your own domain

The site is at <https://caellumyhl.github.io/uoft-boxing-club/> right now.
Moving it to something like `uoftboxing.ca` takes four steps.

None of this is done yet. The repo is ready for it, and step 2 is the only code
change needed.

## 1. Buy the domain

Any registrar works. A `.ca` costs about $15-20 a year.

Buy it on a club account, not a personal one. Otherwise the club loses the
domain when whoever bought it graduates.

## 2. Tell the build the site is at the root

Every URL currently starts with `/uoft-boxing-club`, because that's the folder
GitHub Pages serves the site from. On your own domain the site sits at the root,
so that part has to go.

In `.github/workflows/nextjs.yml`, change this line:

```yaml
NEXT_PUBLIC_BASE_PATH: ""
```

That's the whole change. `frontend/next.config.ts` already reads that value, so
you don't need to edit it.

## 3. Point the domain at GitHub

At your registrar, add these records:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `caellumyhl.github.io.` |

Then in the repo, go to **Settings > Pages > Custom domain**, type in the domain
and save. GitHub adds a `CNAME` file to the repo for you.

Wait for the **Enforce HTTPS** box to become clickable, then tick it. GitHub has
to issue a certificate first, which usually takes under an hour but can take up
to a day.

## 4. Afterwards

Add the new domain to the API key's allowed websites (step 3 of
[`EXEC_GUIDE.md`](EXEC_GUIDE.md)). If you skip this, the schedule and the store
will stop loading on the new address.

The old `caellumyhl.github.io/uoft-boxing-club` address will redirect to the new
domain on its own.
