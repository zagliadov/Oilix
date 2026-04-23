import * as _ from "lodash";
import { DateTime } from "luxon";

import type { CheckoutSubmitPayload } from "@/app/lib/checkout/types";

const formatMoneyUah = (value: number): string => `${value} ₴`;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const deliveryKeyToLabel: Record<CheckoutSubmitPayload["deliveryMethod"], string> = {
  nova_poshta: "Nova Poshta",
  ukrposhta: "Ukrposhta",
  pickup: "Pickup",
};

const paymentKeyToLabel: Record<CheckoutSubmitPayload["paymentMethod"], string> = {
  cash: "Cash on delivery",
  card_on_delivery: "Card on delivery",
  bank_transfer: "Bank transfer",
};

const formatLinesText = (payload: CheckoutSubmitPayload): string => {
  return _.map(payload.lines, (line) => {
    return `• ${line.productName} × ${line.quantity} — ${formatMoneyUah(line.lineTotalUah)}`;
  }).join("\n");
};

const formatLinesHtml = (payload: CheckoutSubmitPayload): string => {
  const rows = _.map(
    payload.lines,
    (line) =>
      `<tr><td>${escapeHtml(line.productName)}</td><td style="text-align:center">${String(line.quantity)}</td><td style="text-align:right">${escapeHtml(
        formatMoneyUah(line.lineTotalUah),
      )}</td></tr>`,
  );
  return `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;max-width:100%"><thead><tr><th>Item</th><th>Qty</th><th>Line</th></tr></thead><tbody>${rows.join(
    "",
  )}</tbody></table>`;
};

const formatNovaText = (payload: CheckoutSubmitPayload): string => {
  if (payload.deliveryMethod !== "nova_poshta" || payload.novaPoshta === undefined) {
    return "";
  }
  const np = payload.novaPoshta;
  if (np.source === "api") {
    return [
      "Nova Poshta (API):",
      `  City: ${np.cityName} (${np.cityRef})`,
      `  Warehouse: ${np.warehouseName} (${np.warehouseRef})`,
    ].join("\n");
  }
  return `Nova Poshta (manual): ${np.branchDescription}`;
};

const formatNovaHtml = (payload: CheckoutSubmitPayload): string => {
  if (payload.deliveryMethod !== "nova_poshta" || payload.novaPoshta === undefined) {
    return "";
  }
  const np = payload.novaPoshta;
  if (np.source === "api") {
    return `<p><strong>Nova Poshta (API)</strong><br/>City: ${escapeHtml(np.cityName)} — ${escapeHtml(
      np.cityRef,
    )}<br/>Warehouse: ${escapeHtml(np.warehouseName)} — ${escapeHtml(
      np.warehouseRef,
    )}</p>`;
  }
  return `<p><strong>Nova Poshta (manual)</strong><br/>${escapeHtml(
    np.branchDescription,
  )}</p>`;
};

export const formatCheckoutOrderEmail = (
  payload: CheckoutSubmitPayload,
): { subject: string; text: string; html: string; replyTo: string } => {
  const when = DateTime.fromISO(payload.clientSubmittedAt, { zone: "utc" });
  const whenText = when.isValid
    ? when.setZone("Europe/Kyiv").toFormat("dd LLL yyyy, HH:mm (Kyiv)")
    : payload.clientSubmittedAt;

  const totalLine = `Total: ${formatMoneyUah(payload.totalUah)}`;
  const { customer } = payload;
  const novaText = formatNovaText(payload);

  const textBody = [
    "New order (Oilix)",
    "",
    "Customer",
    `  Name: ${customer.name}`,
    `  Phone: ${customer.phone}`,
    `  Email: ${customer.email}`,
    `  City: ${customer.city}`,
    "",
    `Delivery: ${deliveryKeyToLabel[payload.deliveryMethod]}`,
    `Payment: ${paymentKeyToLabel[payload.paymentMethod]}`,
    novaText.trim() === "" ? null : `\n${novaText.trim()}`,
    payload.comment ? `\nComment:\n  ${payload.comment}` : null,
    "",
    "Order lines",
    formatLinesText(payload),
    "",
    totalLine,
    `Submitted: ${whenText} (client clock)`,
    "",
    "Cart (ids)",
    ..._.map(
      payload.cartLines,
      (line) => `  ${line.productId} × ${line.quantity}`,
    ),
  ]
    .filter((block) => block !== null)
    .join("\n");

  const subject = `New Oilix order — ${customer.name} — ${formatMoneyUah(
    payload.totalUah,
  )}`;

  const htmlBody = [
    "<h1>New order (Oilix)</h1>",
    "<h2>Customer</h2>",
    "<ul>",
    `<li><strong>Name</strong> ${escapeHtml(customer.name)}</li>`,
    `<li><strong>Phone</strong> ${escapeHtml(customer.phone)}</li>`,
    `<li><strong>Email</strong> <a href="mailto:${encodeURIComponent(
      customer.email,
    )}">${escapeHtml(customer.email)}</a></li>`,
    `<li><strong>City</strong> ${escapeHtml(customer.city)}</li>`,
    "</ul>",
    `<p><strong>Delivery</strong> ${escapeHtml(
      deliveryKeyToLabel[payload.deliveryMethod],
    )} · <strong>Payment</strong> ${escapeHtml(
      paymentKeyToLabel[payload.paymentMethod],
    )}</p>`,
    formatNovaHtml(payload),
    payload.comment
      ? `<h2>Comment</h2><p>${escapeHtml(payload.comment).replace(
          /\n/g,
          "<br/>",
        )}</p>`
      : "",
    "<h2>Order lines</h2>",
    formatLinesHtml(payload),
    `<p><strong>Total: ${escapeHtml(formatMoneyUah(payload.totalUah))}</strong></p>`,
    `<p><small>Submitted: ${escapeHtml(whenText)} (client time)</small></p>`,
    "<h2>Cart product ids</h2><ul>",
    ..._.map(
      payload.cartLines,
      (line) => `<li>${escapeHtml(line.productId)} × ${String(line.quantity)}</li>`,
    ),
    "</ul>",
  ].join("");

  return {
    subject,
    text: textBody,
    html: htmlBody,
    replyTo: customer.email,
  };
};
