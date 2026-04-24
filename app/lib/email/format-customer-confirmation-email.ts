import * as _ from "lodash";
import { DateTime } from "luxon";

import type { CheckoutSubmitPayload } from "@/app/lib/checkout/types";

import { getCheckoutOrderEmailCopy } from "./checkout-order-email-messages";
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

const npSectionText = (payload: CheckoutSubmitPayload, npPrefix: string): string => {
  if (payload.deliveryMethod !== "nova_poshta" || payload.novaPoshta === undefined) {
    return "";
  }
  const np = payload.novaPoshta;
  if (np.source === "api") {
    return `${npPrefix} — ${np.cityName}\n${np.warehouseName}`;
  }
  return `${npPrefix} — ${np.branchDescription}`;
};

const npSectionHtml = (
  payload: CheckoutSubmitPayload,
  deliverySectionLabel: string,
): string => {
  if (payload.deliveryMethod !== "nova_poshta" || payload.novaPoshta === undefined) {
    return "";
  }
  const np = payload.novaPoshta;
  if (np.source === "api") {
    return `<tr>
      <td style="padding:0 28px 20px 28px;background-color:${C.card};">
        <p style="margin:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${
          C.muted
        };font-family:${fontStack};">${escapeHtml(deliverySectionLabel)}</p>
        <p style="margin:0;padding:14px 18px;background:${
          C.accentSoft
        };border-radius:8px;border:1px solid ${
      C.border
    };font-family:${fontStack};font-size:14px;line-height:1.55;color:${C.text};">
          <strong>${escapeHtml(np.cityName)}</strong><br/>${escapeHtml(np.warehouseName)}
        </p>
      </td>
    </tr>`;
  }
  return `<tr>
      <td style="padding:0 28px 20px 28px;background-color:${C.card};">
        <p style="margin:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${
          C.muted
        };font-family:${fontStack};">${escapeHtml(deliverySectionLabel)}</p>
        <p style="margin:0;padding:14px 18px;background:${
          C.accentSoft
        };border-radius:8px;border:1px solid ${
    C.border
  };font-family:${fontStack};font-size:14px;line-height:1.5;color:${C.text};">${escapeHtml(
    np.branchDescription,
  )}</p>
      </td>
    </tr>`;
};

const linesTable = (
  payload: CheckoutSubmitPayload,
  tableLabels: Pick<
    ReturnType<typeof getCheckoutOrderEmailCopy>,
    "htmlTableItem" | "htmlTableQty" | "htmlTableSum" | "htmlTableTotal"
  >,
): string => {
  const { htmlTableItem, htmlTableQty, htmlTableSum, htmlTableTotal } = tableLabels;
  const rows = _.map(
    payload.lines,
    (line, index) => `<tr style="background:${index % 2 === 0 ? C.card : C.rowAlt};">
  <td style="padding:10px 14px;font-family:${fontStack};font-size:14px;color:${
    C.text
  };border-bottom:1px solid ${C.border};">${escapeHtml(line.productName)}</td>
  <td style="padding:10px 14px;font-family:${fontStack};font-size:14px;color:${
    C.muted
  };text-align:center;border-bottom:1px solid ${C.border};">${String(line.quantity)}</td>
  <td style="padding:10px 14px;font-family:${fontStack};font-size:14px;font-weight:600;color:${
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
    <th align="left" style="padding:8px 14px;font-family:${fontStack};font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#f4f4f5;">${escapeHtml(
      htmlTableItem,
    )}</th>
    <th style="padding:8px 14px;font-family:${fontStack};font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#f4f4f5;">${escapeHtml(
      htmlTableQty,
    )}</th>
    <th align="right" style="padding:8px 14px;font-family:${fontStack};font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#f4f4f5;">${escapeHtml(
      htmlTableSum,
    )}</th>
  </tr>
  ${rows}
  <tr>
    <td colspan="2" style="padding:12px 14px;font-family:${fontStack};font-size:14px;font-weight:600;color:${
      C.muted
    };">${escapeHtml(htmlTableTotal)}</td>
    <td align="right" style="padding:12px 14px;font-family:${fontStack};font-size:20px;font-weight:700;color:${
      C.accent
    };">${escapeHtml(formatMoneyUah(payload.totalUah))}</td>
  </tr>
</table>`;
};

export const formatCustomerOrderConfirmationEmail = (
  payload: CheckoutSubmitPayload,
): { subject: string; text: string; html: string } => {
  const t = getCheckoutOrderEmailCopy(payload.orderConfirmationLocale);
  const { delivery: deliveryLabels, payment: paymentLabels, ...te } = t;

  const when = DateTime.fromISO(payload.clientSubmittedAt, { zone: "utc" });
  const whenText = when.isValid
    ? `${when.setZone("Europe/Kyiv").toFormat("dd.MM.yyyy, HH:mm")} (Europe/Kyiv)`
    : payload.clientSubmittedAt;

  const { customer } = payload;
  const totalFormatted = formatMoneyUah(payload.totalUah);
  const subject = te.subject.replace("{total}", totalFormatted);

  const deliveryName = deliveryLabels[payload.deliveryMethod];
  const paymentName = paymentLabels[payload.paymentMethod];

  const npText = npSectionText(payload, te.textNpPrefix);
  const textBody = [
    te.textThankYou,
    "",
    te.textGreeting.replace("{name}", customer.name),
    "",
    te.textSummary,
    formatLinesText(payload),
    "",
    `${te.textTotal} ${totalFormatted}`,
    `${te.textDelivery} ${deliveryName}`,
    `${te.textPayment} ${paymentName}`,
    npText === "" ? null : `\n${npText}`,
    payload.comment ? `\n${te.textYourNoteHeading}\n${payload.comment}` : null,
    "",
    `${te.textPlaced} ${whenText}`,
    "",
    te.textClosing,
    "",
    te.textSignature,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const commentBlock =
    payload.comment === null || payload.comment.trim() === ""
      ? ""
      : `<tr>
    <td style="padding:0 28px 20px 28px;background-color:${C.card};">
      <p style="margin:0 0 8px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${
        C.muted
      };font-family:${fontStack};">${escapeHtml(te.htmlYourNote)}</p>
      <p style="margin:0;padding:12px 16px;background:${
        C.rowAlt
      };border-radius:8px;border:1px solid ${
    C.border
  };font-family:${fontStack};font-size:14px;line-height:1.5;color:${C.text};">${escapeHtml(
    payload.comment,
  ).replace(/\n/g, "<br/>")}</p>
    </td>
  </tr>`;

  const htmlLang = payload.orderConfirmationLocale;
  const htmlBody = `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(te.htmlTitle)}</title>
</head>
<body style="margin:0;padding:0;background-color:${
    C.pageBg
  };-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${
    C.pageBg
  };padding:32px 16px 48px 16px;">
    <tr>
      <td align="center" style="font-family:${fontStack};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;border-collapse:separate;border-radius:12px;overflow:hidden;border:1px solid ${
          C.border
        };box-shadow:0 4px 24px rgba(24, 24, 27, 0.08);">
          <tr>
            <td style="background:linear-gradient(120deg, #1e293b 0%, #334155 45%, #475569 100%);padding:28px 28px 22px 28px;">
              <p style="margin:0;font-family:${displayStack};font-size:13px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#94a3b8;">${escapeHtml(
                te.htmlHeroBrand,
              )}</p>
              <h1 style="margin:8px 0 0 0;font-family:${displayStack};font-size:24px;font-weight:700;line-height:1.2;color:#f8fafc;">${escapeHtml(
                te.htmlThankYouTitle,
              )}</h1>
              <p style="margin:10px 0 0 0;font-size:15px;line-height:1.45;color:#e2e8f0;font-family:${
                fontStack
              };">${escapeHtml(te.htmlSublead.replace("{name}", customer.name))}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:${
              C.card
            };padding:24px 28px 6px 28px;font-family:${fontStack};font-size:14px;line-height:1.55;color:${
    C.muted
  };">
              <p style="margin:0 0 16px 0;">${escapeHtml(te.htmlIntro)}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:${
              C.card
            };padding:0 28px 8px 28px;">
              <p style="margin:0 0 10px 0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${
                C.muted
              };font-family:${fontStack};">${escapeHtml(te.htmlOptions)}</p>
              <p style="margin:0 0 6px 0;font-size:14px;color:${
                C.text
              };font-family:${fontStack};">
                <span style="display:inline-block;padding:4px 10px;margin-right:6px;margin-bottom:6px;background:${
                  C.accentSoft
                };border-radius:9999px;border:1px solid ${C.border};">
                  ${escapeHtml(deliveryName)}
                </span>
                <span style="display:inline-block;padding:4px 10px;margin-bottom:6px;background:${
                  C.accentSoft
                };border-radius:9999px;border:1px solid ${
    C.border
  };">
                  ${escapeHtml(paymentName)}
                </span>
              </p>
            </td>
          </tr>
          ${npSectionHtml(payload, te.htmlDeliverySection)}
          ${commentBlock}
          <tr>
            <td style="background-color:${
              C.card
            };padding:6px 28px 20px 28px;">${linesTable(payload, t)}</td>
          </tr>
          <tr>
            <td style="background-color:${
              C.rowAlt
            };padding:16px 28px;border-top:1px solid ${C.border};">
              <p style="margin:0;font-size:12px;color:${
                C.muted
              };font-family:${fontStack};line-height:1.5;">${escapeHtml(
    whenText,
  )} · <span style="color:${
    C.text
  };">${escapeHtml(te.htmlFooterDisclaimer)}</span></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text: textBody, html: htmlBody };
};
