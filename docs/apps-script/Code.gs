/**
 * UofT Boxing Club - order intake for the website store.
 *
 * Deploy this as a Web App (Deploy > New deployment > Web app):
 *   Execute as:       Me
 *   Who has access:   Anyone
 * Then copy the /exec URL into the NEXT_PUBLIC_ORDERS_WEBHOOK_URL repository
 * variable in GitHub (Settings > Secrets and variables > Actions > Variables).
 *
 * Every order is written as ONE ROW PER ITEM so the sheet can be sorted and
 * filtered normally - by name, by item, or by the Paid / Delivered checkboxes.
 */

/** Tab that orders are appended to. Created automatically on first order. */
var ORDERS_SHEET_NAME = 'Orders';

/** Who gets notified when an order comes in. Leave blank to disable emails. */
var NOTIFY_EMAIL = '';

/** Column headers, in order. Changing these changes the sheet layout. */
var HEADERS = [
  'Order ID', 'Placed At', 'Name', 'Email', 'Student #',
  'Item', 'Size', 'Qty', 'Unit Price', 'Line Total',
  'Order Total', 'Notes', 'Paid', 'Delivered',
];

/**
 * Receives an order posted by the website and appends it to the Orders tab.
 *
 * @param {Object} e - The Apps Script POST event; `e.parameter.payload` holds
 *                     the JSON order body sent by the site.
 * @returns {TextOutput} A plain-text acknowledgement.
 */
function doPost(e) {
  try {
    var order = JSON.parse(e.parameter.payload);
    var sheet = getOrdersSheet_();

    var placedAt = new Date(order.placedAt);
    var rows = order.items.map(function (item) {
      return [
        order.orderId,
        placedAt,
        order.customer.name,
        order.customer.email,
        order.customer.studentNumber,
        item.name,
        item.size || '',
        item.quantity,
        item.price,
        item.price * item.quantity,
        order.total,
        order.customer.notes,
        false, // Paid
        false, // Delivered
      ];
    });

    var firstRow = sheet.getLastRow() + 1;
    sheet.getRange(firstRow, 1, rows.length, HEADERS.length).setValues(rows);

    // Real checkboxes, so execs can tick them off as orders are handled.
    sheet.getRange(firstRow, 13, rows.length, 2).insertCheckboxes();

    notify_(order);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    // Logged to Executions in the Apps Script editor; the site sends no-cors
    // requests and cannot read this response.
    console.error('Order failed: ' + err);
    return ContentService.createTextOutput('error');
  }
}

/**
 * Returns the Orders sheet, creating and formatting it on first use.
 *
 * @returns {Sheet} The Orders sheet, guaranteed to have a header row.
 */
function getOrdersSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(ORDERS_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(ORDERS_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    // Turning the header into a filter gives execs sorting for free.
    sheet.getRange(1, 1, 1, HEADERS.length).createFilter();
  }

  return sheet;
}

/**
 * Emails the execs a summary of a new order, if NOTIFY_EMAIL is set.
 *
 * @param {Object} order - The parsed order body.
 */
function notify_(order) {
  if (!NOTIFY_EMAIL) return;

  var lines = order.items.map(function (item) {
    return '  - ' + item.quantity + ' x ' + item.name +
      (item.size ? ' (' + item.size + ')' : '') +
      ' - $' + (item.price * item.quantity);
  });

  MailApp.sendEmail(
    NOTIFY_EMAIL,
    'New store order ' + order.orderId,
    'Order ' + order.orderId + '\n\n' +
    'Name: ' + order.customer.name + '\n' +
    'Email: ' + order.customer.email + '\n' +
    'Student #: ' + order.customer.studentNumber + '\n' +
    (order.customer.notes ? 'Notes: ' + order.customer.notes + '\n' : '') +
    '\nItems:\n' + lines.join('\n') +
    '\n\nTotal: $' + order.total + '\n'
  );
}
