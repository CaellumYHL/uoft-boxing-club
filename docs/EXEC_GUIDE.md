# Running the UofT Boxing Club website

You do not need to touch any code to run this site. Almost everything you will
ever want to change lives in **one Google Sheet**. Edit the sheet, and the
website updates within about a minute - no rebuild, no developer needed.

This guide covers the one-time setup, then the day-to-day editing.

---

## Part 1 - One-time setup

Do this once. It takes about 30 minutes.

### 1. Create the content spreadsheet

Make a new Google Sheet called **UofT Boxing Club - Website Content**, with
five tabs named exactly:

`Config`, `Team`, `Events`, `Products`, `Orders`

The `Orders` tab creates itself once the first order comes in, so you only need
to make the first four by hand.

Put the headers below in **row 1** of each tab. Column order does not matter -
the site matches on the header name - but the spelling does.

**Config** (two columns, no header needed)

| key | value |
| --- | --- |
| `clubName` | UofT Boxing Club |
| `contactEmail` | uoftboxingclub@gmail.com |
| `instagramUrl` | https://www.instagram.com/uoftboxingclub/ |
| `locationName` | St. Michaels College Wellness Studio |
| `locationAddress` | 81 Mary Street |
| `logoUrl` | *(a Google Drive share link - see below)* |
| `classSignupUrl` | *(Google Form link for class sign-ups)* |
| `waiverUrl` | *(Google Form link for the safety waiver)* |
| `eventSignupUrl` | *(default Google Form link for events)* |
| `freeClassLabel` | Free Classes |
| `paidClassLabel` | Paid Classes |

Leave any row blank and the site quietly uses its built-in default.

**Team**

| name | role | bio | image |
| --- | --- | --- | --- |

**Events**

| title | when | location | description | image | emoji | signupurl |
| --- | --- | --- | --- | --- | --- | --- |

`when` is free text - write it however you like, e.g. `Sept 20 (6 PM to 8 PM)`.
`signupurl` is optional; without it the event uses `eventSignupUrl` from Config.

**Products**

| id | name | price | description | image | sizes | category |
| --- | --- | --- | --- | --- | --- | --- |

- `category` must be `membership` or `merch` (anything else counts as merch).
- `sizes` is a comma-separated list, e.g. `S, M, L, XL`. Leave it blank for
  items that have no size - the size picker disappears.
- `id` is optional. Leave it blank and it is generated from the name.
  **If you set one, don't change it later** - it is part of the item's web address.

### 2. Make the sheet readable by the website

**Share > General access > Anyone with the link > Viewer.**

The site reads the sheet with a read-only API key, so it can only ever read.
Never put anything private in this spreadsheet - treat everything in it as
public. Orders are the exception and are written by the script in step 4, which
runs as you and is not readable by the website.

### 3. Create a Google API key

1. Go to <https://console.cloud.google.com/> and create a project.
2. **APIs & Services > Library** - enable **Google Sheets API** and
   **Google Calendar API**.
3. **APIs & Services > Credentials > Create credentials > API key**.
4. Click **Edit API key** and restrict it:
   - *Application restrictions*: **Websites**, allowed referrer
     `https://caellumyhl.github.io/*` (add your custom domain too, once you have one).
   - *API restrictions*: **Google Sheets API** and **Google Calendar API** only.

Restricting the key matters: an unrestricted key can be copied off the site and
used by anyone against your quota.

### 4. Set up order taking

1. In the spreadsheet: **Extensions > Apps Script**.
2. Delete the placeholder code and paste in the contents of
   [`docs/apps-script/Code.gs`](apps-script/Code.gs) from this repository.
3. Set `NOTIFY_EMAIL` at the top to the address that should be emailed for each
   new order (leave it blank for no emails).
4. **Deploy > New deployment > Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
5. Copy the deployment URL - it ends in `/exec`.

Orders arrive on the `Orders` tab, one row per item, with **Paid** and
**Delivered** checkboxes and a filter on the header row so you can sort by
whatever you need.

### 5. Make the class calendar

Create a Google Calendar for classes and make it public
(**Settings > Access permissions > Make available to public**). Copy its
**Calendar ID** from *Integrate calendar*.

How the site reads your entries:

- Put **`drop`** anywhere in the title of a free drop-in session (e.g.
  `Drop-in Boxing`) and it shows in the *Free Classes* colour. Everything else
  shows as a paid class.
- Start the title with **`Event:`** (e.g. `Event: Sparring Night`) for one-off
  events, which get their own colour on the schedule and the home page.

### 6. Tell the website about all of it

In GitHub, go to the repository > **Settings** > **Secrets and variables** >
**Actions** > **Variables** tab, and add:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY` | the API key from step 3 |
| `NEXT_PUBLIC_GOOGLE_SHEETS_ID` | the long id in the sheet's URL |
| `NEXT_PUBLIC_GOOGLE_API_KEY` | the same API key from step 3 |
| `NEXT_PUBLIC_GOOGLE_CALENDAR_ID` | the Calendar ID from step 5 |
| `NEXT_PUBLIC_ORDERS_WEBHOOK_URL` | the `/exec` URL from step 4 |

Then go to the **Actions** tab, pick **Deploy Next.js site to Pages**, and click
**Run workflow**. After about two minutes the site is live with your content.

> These are build-time settings, so **changing one of these needs a redeploy**
> (Actions > Run workflow). Changing the *spreadsheet* does not.

---

## Part 2 - Day-to-day editing

### Changing the logo

Upload the logo to Google Drive, right-click it > **Share** > *Anyone with the
link*, then **Copy link** and paste that link into the `logoUrl` row of the
**Config** tab. The usual Drive sharing link works as-is - the site converts it
to a direct image link for you. The same applies to team photos, event images
and product photos.

### Adding a team member

Add a row to the **Team** tab. Only `name` or `role` is required.

### Adding an event

Add a row to the **Events** tab. Delete the row when the event has passed.

### Adding or repricing a store item

Add or edit a row on the **Products** tab. Prices, names, descriptions and
photos all update on the live site within a minute.

To **remove** an item, delete its row. If you had shared a direct link to that
item, the link will show "Product Not Found" afterwards - that is expected.

### Changing class times

Edit the Google Calendar. The website's schedule follows it automatically, and
so does the "Upcoming Classes" strip on the home page.

### Handling orders

Watch the **Orders** tab (and the notification emails, if you set them up).
Tick **Paid** and **Delivered** as you go. Use the filter arrows on the header
row to sort - for example, filter *Delivered* to `FALSE` to see what still owes
a hand-off.

---

## Troubleshooting

**The site shows old content.** Content is cached briefly by the browser. Hard
refresh (Cmd/Ctrl + Shift + R). If it persists, check the sheet is still shared
as *Anyone with the link - Viewer*.

**The team/store/events section is empty.** Check the tab name and the header
spelling in row 1. The site matches columns by header name.

**"Google Sheets configuration missing."** The repository variables in step 6
aren't set, or the site hasn't been redeployed since they were added.

**Orders aren't arriving.** Re-deploy the Apps Script (**Deploy > Manage
deployments > edit > Version: New version**). Apps Script keeps serving the old
code until you publish a new version.

**Nothing on the schedule.** Confirm the calendar is public and the Calendar ID
is right, and that there are events in the week being viewed.
