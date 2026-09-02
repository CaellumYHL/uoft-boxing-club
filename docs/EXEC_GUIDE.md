# How to update the website

You don't need to touch any code to run this site. Almost everything you'll
want to change lives in one Google Sheet. Edit the sheet, and the website
updates in about a minute.

There are only two places you can change things:

- **The Google Sheet.** Changes show up on the site on their own.
- **GitHub settings.** Changes here need someone to re-run the deploy.

Almost everything is in the sheet.

---

## What's already set up

- **Meet Our Team** works. It reads the `Sheet1` tab.
- **The class schedule** works. It's connected to the club's Google Calendar.
  If it looks empty, there are no classes booked in that week.
- **The store** works, with six built-in items. The cart works.
- **Phones** work on every page.

Three things are left, and they're all in the setup below:

1. Add three tabs to the sheet: `Config`, `Events`, `Products`.
2. Turn on order taking (steps 4-6).
3. Paste your sign-up and waiver form links into the `Config` tab.

Until you do these, the site uses its own defaults. Nothing is broken.

---

## Setup

Do these once, in order. It takes about half an hour.

### 1. Add the three missing tabs

The sheet has one tab of team data right now. Add three more, named exactly:

`Config`, `Events`, `Products`

Put the headers from the [Sheet reference](#sheet-reference) below into row 1 of
each. The order of the columns doesn't matter, but the spelling of the headers
does.

You don't need to make an `Orders` tab. It gets made for you the first time
someone places an order.

### 2. Check the sheet is shared

Under **Share > General access**, it should say *Anyone with the link > Viewer*.
The site only reads from the sheet, never writes to it.

Because of that, treat everything in this sheet as public. Don't put member
contact details or anything private in it. The `Orders` tab is the exception:
it's written by the script in step 4, and the website can't read it.

### 3. Lock down the API key

The club already has a Google API key, so there's nothing new to make. Open it
in the [Google Cloud credentials page](https://console.cloud.google.com/apis/credentials)
and check two settings:

- **Websites**: allow `https://caellumyhl.github.io/*` only.
- **APIs**: Google Sheets API and Google Calendar API only.

This matters. The key is visible in the page source, so if it isn't restricted,
anyone can copy it and use up the club's quota.

### 4. Set up order taking

In the sheet, go to **Extensions > Apps Script**. Delete whatever is there and
paste in the contents of [`apps-script/Code.gs`](apps-script/Code.gs) from this
repository.

At the top of that file, set `NOTIFY_EMAIL` to the address that should get an
email for each new order. Leave it blank if you don't want emails.

Then click **Deploy > New deployment > Web app** and set:

- Execute as: **Me**
- Who has access: **Anyone**

Copy the URL it gives you. It ends in `/exec`.

### 5. Give the site that URL

In GitHub, go to **Settings > Secrets and variables > Actions**, then the
**Variables** tab. Add one variable:

- Name: `NEXT_PUBLIC_ORDERS_WEBHOOK_URL`
- Value: the `/exec` URL from step 4

The other five variables the site needs are already set. This is the only one
to add.

### 6. Re-run the deploy

Go to the **Actions** tab, pick **Deploy Next.js site to Pages**, and click
**Run workflow**. Wait about two minutes.

The store can now take orders.

---

## Everyday changes

None of these need a deploy.

**Change the logo.** Upload it to Google Drive, share it as *anyone with the
link*, copy the link, and paste it into the `logoUrl` row of the `Config` tab.
The normal Drive link works. The site converts it for you. Same goes for team
photos, event photos and product photos.

**Add someone to the team page.** Add a row to `Sheet1`. You only need a name or
a role. Without a photo, you get their first initial in a circle.

**Add an event.** Add a row to the `Events` tab. Delete the row once the event
has passed.

**Add or reprice a store item.** Add or edit a row on the `Products` tab.

**Remove a store item.** Delete its row. If you'd shared a link straight to that
item, that link will now say "Product Not Found". That's normal.

**Change class times.** Edit the Google Calendar. The schedule and the
"Upcoming Classes" box on the home page both follow it.

**Handle an order.** Look at the `Orders` tab. Tick **Paid** and **Delivered** as
you go. Use the filter arrows on the header row to sort. Setting the *Delivered*
filter to `FALSE` shows you what still needs handing over.

---

## Sheet reference

Put these in row 1 of each tab. If you leave a cell blank, the site uses its own
default instead of breaking.

### Config

Two columns. The key goes in column A, the value in column B.

| Key | What it changes |
| --- | --- |
| `logoUrl` | The logo in the top bar |
| `clubName` | The name in the footer |
| `contactEmail` | The email box in the footer |
| `instagramUrl` | The Instagram box in the footer |
| `locationName` | The studio name on the home page |
| `locationAddress` | The street address under it |
| `classSignupUrl` | The "Sign Up for Classes" button under the schedule |
| `waiverUrl` | The "Sign Safety Waiver" button. Hidden until you set it. |
| `eventSignupUrl` | The sign-up link for events that don't have their own |
| `freeClassLabel` | The wording of the first colour in the schedule key |
| `paidClassLabel` | The wording of the second, for example "Members Only" |

### Events

| Column | Notes |
| --- | --- |
| `title` | The only one you have to fill in |
| `when` | Write it however you like, e.g. `Sept 20 (6 PM to 8 PM)` |
| `location` | Shown after the date |
| `description` | A sentence or two |
| `image` | A Drive link. If it's blank, the emoji is used instead. |
| `emoji` | Stands in for a photo |
| `signupurl` | Use this event's own sign-up link instead of the default one |

An empty `Events` tab shows "no events scheduled" rather than old events.

### Products

| Column | Notes |
| --- | --- |
| `name` | The only one you have to fill in |
| `price` | A number. No dollar sign. |
| `description` | Shown on the item's own page |
| `image` | A Drive link |
| `sizes` | Separated by commas: `S, M, L, XL`. Blank hides the size picker. |
| `category` | Either `membership` or `merch` |
| `id` | Optional. Made from the name if you leave it blank. Once it's set, don't change it, because it's part of the item's web address. |

---

## How the site reads your calendar

Two things in the title of a calendar entry decide how it's shown.

- Put **`drop`** anywhere in the title, like `Drop-in Boxing`, and it shows as a
  free class in red.
- Anything else shows as a paid class in blue.
- Start the title with **`Event:`**, like `Event: Sparring Night`, and it shows
  as an event in purple. The `Event:` part is taken off before it's shown, so
  people just see "Sparring Night".

Whatever you write in the calendar entry's description is shown on the site, so
it's worth filling in.

On a phone the weekly grid turns into a day-by-day list, because four columns of
days are too narrow to read on a phone screen.

---

## If something looks wrong

**A section is empty.** Check the tab name and the spelling of the headers in
row 1. The site looks up columns by their header name, so `Titles` won't be
found where it expects `title`.

**The site shows old content.** Hard refresh the page (Cmd+Shift+R on a Mac,
Ctrl+Shift+R on Windows). If that doesn't fix it, check the sheet is still
shared as *Anyone with the link > Viewer*.

**A photo isn't showing.** The Drive file has to be shared as *anyone with the
link*. If a cell isn't a link at all, it's ignored, so notes to yourself in an
image column won't break anything.

**Orders aren't coming through.** Re-deploy the Apps Script: **Deploy > Manage
deployments**, then edit it and set Version to **New version**. Apps Script keeps
running the old code until you do this.

**The schedule is blank.** Check the calendar is public, and that there are
classes in the week you're looking at. Use *Next* to check later weeks.

**A deploy failed.** This is usually GitHub's queue, not anything you did.
Re-run the workflow from the Actions tab.

---

## What still needs a developer

- **A custom domain.** You buy it; the steps to hook it up are in
  [`DOMAIN.md`](DOMAIN.md). Buy it on a club account, not a personal one, so it
  doesn't disappear when this year's execs graduate.
- **Card payments.** Right now orders get written down and paid in person.
  Taking cards online needs Stripe and a proper backend.
- **New kinds of pages**, beyond the home, store, team and cart pages.
- **Changing a GitHub variable**, because someone has to re-run the deploy after.
