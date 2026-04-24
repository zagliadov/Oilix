import * as _ from "lodash";
import { DateTime } from "luxon";

import type { CheckoutSubmitPayload } from "@/app/lib/checkout/types";

import { getShopOrderEmailCopy, type ShopOrderEmailCopy } from "./checkout-order-email-messages";
import {
  emailDisplayStack,
  emailFontStack,
  emailTheme,
} from "./email-theme";

const C = emailTheme;
const fontStack = emailFontStack;
const displayStack = emailDisplayStack;

const formatMoneyUah = (value: number): string => `${value} ₴`;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatLinesText = (payload: CheckoutSubmitPayload): string => {
  return _.map(payload.lines, (line) => {
    return `• ${line.productName} × ${line.quantity} — ${formatMoneyUah(line.lineTotalUah)}`;
  }).join("\n");
};

const formatNovaText = (payload: CheckoutSubmitPayload, t: ShopOrderEmailCopy): string => {
  if (payload.deliveryMethod !== "nova_poshta" || payload.novaPoshta === undefined) {
    return "";
  }
  const np = payload.novaPoshta;
  if (np.source === "api") {
    return [
      `${t.textNpBlock}:`,
      `  ${t.textNpCity}: ${np.cityName}`,
      `  ${t.textNpCityRef}: ${np.cityRef}`,
      `  ${t.textNpWarehouse}: ${np.warehouseName}`,
      `  ${t.textNpWarehouseRef}: ${np.warehouseRef}`,
    ].join("\n");
  }
  return `${t.textNpManual}: ${np.branchDescription}`;
};

const formatNpSectionHtml = (payload: CheckoutSubmitPayload, t: ShopOrderEmailCopy): string => {
  if (payload.deliveryMethod !== "nova_poshta" || payload.novaPoshta === undefined) {
    return "";
  }
  const np = payload.novaPoshta;
  if (np.source === "api") {
    return `<tr>
        <td style="padding:0 28px 20px 28px;background-color:${C.card};">
          <p style="margin:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${
            C.muted
          };font-family:${fontStack};">${escapeHtml(t.htmlNpHeader)}</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${
            C.accentSoft
          };border-radius:8px;border:1px solid ${C.border};">
            <tr>
              <td style="padding:16px 18px;font-family:${fontStack};font-size:14px;line-height:1.5;color:${C.text};">
                <p style="margin:0 0 6px 0;"><span style="color:${
                  C.muted
                };font-size:12px;">${escapeHtml(t.htmlLabelCity)}</span><br /><strong style="color:${
      C.text
    };">${escapeHtml(np.cityName)}</strong></p>
                <p style="margin:0;"><span style="color:${
                  C.muted
                };font-size:12px;">${escapeHtml(t.htmlLabelBranch)}</span><br /><span style="color:${
      C.text
    };">${escapeHtml(np.warehouseName)}</span></p>
                <p style="margin:12px 0 0 0;padding-top:10px;border-top:1px solid ${
                  C.border
                };font-size:11px;line-height:1.4;color:${
      C.muted
    };word-break:break-all;">${escapeHtml(
    t.htmlRefLine
      .replace("{cityRef}", np.cityRef)
      .replace("{warehouseRef}", np.warehouseRef),
  )}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  }
  return `<tr>
        <td style="padding:0 28px 20px 28px;background-color:${C.card};">
          <p style="margin:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${
            C.muted
          };font-family:${fontStack};">${escapeHtml(t.htmlNpHeader)}</p>
          <p style="margin:0;padding:14px 18px;background:${
            C.accentSoft
          };border-radius:8px;border:1px solid ${
    C.border
  };font-family:${fontStack};font-size:14px;line-height:1.5;color:${
    C.text
  };">${escapeHtml(np.branchDescription)}</p>
        </td>
      </tr>`;
};

const buildLinesTable = (payload: CheckoutSubmitPayload, t: ShopOrderEmailCopy): string => {
  const { htmlTableItem, htmlTableQty, htmlTableSum, htmlTableTotal } = t;
  const rows = _.map(
    payload.lines,
    (line, index) => `<tr style="background:${index % 2 === 0 ? C.card : C.rowAlt};">
  <td style="padding:12px 16px;font-family:${fontStack};font-size:14px;color:${
    C.text
  };border-bottom:1px solid ${C.border};">${escapeHtml(line.productName)}</td>
  <td style="padding:12px 16px;font-family:${fontStack};font-size:14px;color:${
    C.muted
  };text-align:center;border-bottom:1px solid ${C.border};width:48px;">${String(
    line.quantity,
  )}</td>
  <td style="padding:12px 16px;font-family:${fontStack};font-size:14px;font-weight:600;color:${
    C.text
  };text-align:right;border-bottom:1px solid ${
    C.border
  };white-space:nowrap;">${escapeHtml(formatMoneyUah(line.lineTotalUah))}</td>
</tr>`,
  ).join("");

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid ${
    C.border
  };border-radius:8px;overflow:hidden;">
  <tr style="background:${C.accent};">
    <th align="left" style="padding:10px 16px;font-family:${fontStack};font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#f4f4f5;">${escapeHtml(
      htmlTableItem,
    )}</th>
    <th style="padding:10px 16px;font-family:${fontStack};font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#f4f4f5;">${escapeHtml(
      htmlTableQty,
    )}</th>
    <th align="right" style="padding:10px 16px;font-family:${fontStack};font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#f4f4f5;">${escapeHtml(
      htmlTableSum,
    )}</th>
  </tr>
  ${rows}
  <tr>
    <td colspan="2" style="padding:14px 16px;font-family:${fontStack};font-size:13px;font-weight:600;color:${
      C.muted
    };">${escapeHtml(htmlTableTotal)}</td>
    <td align="right" style="padding:14px 16px;font-family:${fontStack};font-size:18px;font-weight:700;color:${
      C.accent
    };">${escapeHtml(formatMoneyUah(payload.totalUah))}</td>
  </tr>
</table>`;
};

const buildCustomerBlock = (payload: CheckoutSubmitPayload, t: ShopOrderEmailCopy): string => {
  const { customer } = payload;
  const row = (label: string, value: string, isLink = false) => `
  <tr>
    <td style="padding:6px 0;font-family:${fontStack};font-size:12px;color:${C.muted};width:96px;vertical-align:top;">${escapeHtml(
      label,
    )}</td>
    <td style="padding:6px 0;font-family:${fontStack};font-size:14px;color:${C.text};line-height:1.45;">${
      isLink
        ? `<a href="mailto:${encodeURIComponent(
            customer.email,
          )}" style="color:${C.accent};text-decoration:underline;">${escapeHtml(
            customer.email,
          )}</a>`
        : escapeHtml(value)
    }</td>
  </tr>`;
  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    ${row(t.textLabelName, customer.name)}
    ${row(t.textLabelPhone, customer.phone)}
    ${row(t.textLabelEmail, customer.email, true)}
    ${row(t.textLabelCity, customer.city)}
  </table>`;
};

const buildMetaRow = (payload: CheckoutSubmitPayload, t: ShopOrderEmailCopy): string => {
  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:4px;">
    <tr>
      <td style="padding:8px 0 0 0;font-family:${fontStack};font-size:12px;color:${C.muted};">
        <span style="display:inline-block;padding:4px 10px;background:${C.accentSoft};border-radius:9999px;border:1px solid ${C.border};color:${C.text};">
          ${escapeHtml(t.delivery[payload.deliveryMethod])}
        </span>
        <span style="display:inline-block;padding:4px 10px;margin-left:8px;background:${
          C.accentSoft
        };border-radius:9999px;border:1px solid ${C.border};color:${C.text};">
          ${escapeHtml(t.payment[payload.paymentMethod])}
        </span>
      </td>
    </tr>
  </table>`;
};

const buildCommentBlock = (payload: CheckoutSubmitPayload, t: ShopOrderEmailCopy): string => {
  if (payload.comment === null || payload.comment.trim() === "") {
    return "";
  }
  return `<tr>
        <td style="padding:0 28px 20px 28px;background-color:${C.card};">
          <p style="margin:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${
            C.muted
          };font-family:${fontStack};">${escapeHtml(t.htmlOrderComment)}</p>
          <p style="margin:0;padding:14px 18px;background:${C.rowAlt};border-radius:8px;border:1px solid ${
    C.border
  };font-family:${fontStack};font-size:14px;line-height:1.5;color:${
    C.text
  };">${escapeHtml(payload.comment).replace(/\n/g, "<br/>")}</p>
        </td>
      </tr>`;
};

const buildCartIdsBlock = (payload: CheckoutSubmitPayload, t: ShopOrderEmailCopy): string => {
  if (payload.cartLines.length === 0) {
    return "";
  }
  const lineText = _.map(
    payload.cartLines,
    (line) => `${escapeHtml(line.productId)} × ${String(line.quantity)}`,
  ).join(" · ");
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin-top:20px;border-radius:8px;border:1px dashed ${C.border};">
    <tr>
      <td style="background:${C.card};padding:16px 20px;">
        <p style="margin:0 0 6px 0;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${
          C.muted
        };font-family:${fontStack};">${escapeHtml(t.htmlInternalIdsTitle)}</p>
        <p style="margin:0;font-size:12px;font-family:ui-monospace, Menlo, Consolas, monospace;color:${
          C.muted
        };line-height:1.5;word-break:break-all;">${lineText}</p>
      </td>
    </tr>
  </table>`;
};

const buildFullHtml = (
  payload: CheckoutSubmitPayload,
  t: ShopOrderEmailCopy,
  htmlLang: string,
  taglineWithTotal: string,
  submittedWithWhen: string,
): string => {
  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(t.htmlTitle)}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.pageBg};-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${
    C.pageBg
  };padding:32px 16px 48px 16px;">
    <tr>
      <td align="center" style="font-family:${fontStack};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;border-collapse:separate;border-radius:12px;overflow:hidden;border:1px solid ${
          C.border
        };box-shadow:0 4px 24px rgba(24, 24, 27, 0.08);">
          <tr>
            <td style="background:linear-gradient(120deg, #1e293b 0%, #334155 45%, #475569 100%);padding:28px 28px 24px 28px;">
              <p style="margin:0;font-family:${displayStack};font-size:13px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#94a3b8;">Oilix</p>
              <h1 style="margin:8px 0 0 0;font-family:${displayStack};font-size:26px;font-weight:700;line-height:1.2;letter-spacing:0.02em;color:#f8fafc;">${escapeHtml(
                t.htmlNewOrder,
              )}</h1>
              <p style="margin:10px 0 0 0;font-size:14px;line-height:1.45;color:#cbd5e1;font-family:${
                fontStack
              };">${escapeHtml(taglineWithTotal)}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:${C.card};padding:28px 28px 8px 28px;">
              <p style="margin:0 0 12px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${
                C.muted
              };font-family:${fontStack};">${escapeHtml(t.htmlSectionCustomer)}</p>
              ${buildCustomerBlock(payload, t)}
              ${buildMetaRow(payload, t)}
            </td>
          </tr>
          ${formatNpSectionHtml(payload, t)}
          ${buildCommentBlock(payload, t)}
          <tr>
            <td style="background-color:${C.card};padding:8px 28px 16px 28px;">
              <p style="margin:0 0 12px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${
                C.muted
              };font-family:${fontStack};">${escapeHtml(t.htmlSectionOrder)}</p>
              ${buildLinesTable(payload, t)}
            </td>
          </tr>
          <tr>
            <td style="background-color:${C.card};padding:0 28px 24px 28px;">
              <p style="margin:0;font-size:12px;color:${
                C.muted
              };font-family:${fontStack};line-height:1.5;">${escapeHtml(
    submittedWithWhen,
  )}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:${
              C.rowAlt
            };padding:20px 28px;border-top:1px solid ${C.border};">
              <p style="margin:0;font-size:12px;color:${
                C.muted
              };font-family:${fontStack};line-height:1.5;">${escapeHtml(
    t.htmlFooterBefore,
  )}<strong style="color:${
    C.text
  };">${escapeHtml(t.htmlFooterCta)}</strong>${escapeHtml(
    t.htmlFooterAfter,
  )}</p>
            </td>
          </tr>
        </table>
        ${buildCartIdsBlock(payload, t)}
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const formatCheckoutOrderEmail = (
  payload: CheckoutSubmitPayload,
): { subject: string; text: string; html: string; replyTo: string } => {
  const t = getShopOrderEmailCopy(payload.orderConfirmationLocale);
  const when = DateTime.fromISO(payload.clientSubmittedAt, { zone: "utc" });
  const whenText = when.isValid
    ? `${when.setZone("Europe/Kyiv").toFormat("dd.MM.yyyy, HH:mm")} (Europe/Kyiv)`
    : payload.clientSubmittedAt;

  const { customer } = payload;
  const totalFormatted = formatMoneyUah(payload.totalUah);
  const subject = t.subject
    .replace("{name}", customer.name)
    .replace("{total}", totalFormatted);
  const novaText = formatNovaText(payload, t);

  const textBody = [
    t.textHeader,
    "",
    t.textCustomer,
    `  ${t.textLabelName}: ${customer.name}`,
    `  ${t.textLabelPhone}: ${customer.phone}`,
    `  ${t.textLabelEmail}: ${customer.email}`,
    `  ${t.textLabelCity}: ${customer.city}`,
    "",
    `${t.textDelivery}: ${t.delivery[payload.deliveryMethod]}`,
    `${t.textPayment}: ${t.payment[payload.paymentMethod]}`,
    novaText.trim() === "" ? null : `\n${novaText.trim()}`,
    payload.comment ? `\n${t.textComment}:\n${payload.comment}` : null,
    "",
    t.textOrderLines,
    formatLinesText(payload),
    "",
    `${t.textTotal}: ${totalFormatted}`,
    `${t.textSubmitted}: ${whenText}`,
    "",
    t.textCartProductIds,
    ..._.map(
      payload.cartLines,
      (line) => `  ${line.productId} × ${line.quantity}`,
    ),
  ]
    .filter((block) => block !== null)
    .join("\n");

  const taglineWithTotal = t.htmlTagline.replace("{total}", totalFormatted);
  const submittedWithWhen = t.htmlSubmitted.replace("{when}", whenText);
  const html = buildFullHtml(
    payload,
    t,
    payload.orderConfirmationLocale,
    taglineWithTotal,
    submittedWithWhen,
  );

  return {
    subject,
    text: textBody,
    html,
    replyTo: customer.email,
  };
};
