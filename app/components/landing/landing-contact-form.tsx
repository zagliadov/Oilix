"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  storefrontButtonPrimary,
  storefrontButtonPrimaryPaddingCompact,
  storefrontMarketingInput,
  storefrontSurfaceCard,
} from "@/components/ui/storefront";

export const LandingContactForm = () => {
  const landingTranslations = useTranslations("Landing");
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (submitSuccess) {
    return (
      <div
        className={`flex w-full flex-col gap-4 p-6 sm:p-8 ${storefrontSurfaceCard}`}
        role="status"
      >
        <p className="text-base text-foreground">
          {landingTranslations("contact.submitSuccess")}
        </p>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmitError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const payload = {
      name: typeof name === "string" ? name : "",
      email: typeof email === "string" ? email : "",
      phone: typeof phone === "string" ? phone : "",
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/landing/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        form.reset();
        setSubmitSuccess(true);
        return;
      }
      const errorBody = (await response
        .json()
        .catch((): { error?: string } => ({}))) as { error?: string };
      if (errorBody.error === "email_not_configured") {
        setFormSubmitError(landingTranslations("contact.submitErrorService"));
        return;
      }
      if (errorBody.error === "send_failed") {
        setFormSubmitError(landingTranslations("contact.submitErrorSend"));
        return;
      }
      if (errorBody.error === "invalid_payload") {
        setFormSubmitError(landingTranslations("contact.submitErrorInvalid"));
        return;
      }
      setFormSubmitError(landingTranslations("contact.submitErrorInvalid"));
    } catch {
      setFormSubmitError(landingTranslations("contact.submitErrorNetwork"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={`flex w-full flex-col gap-4 p-6 sm:p-8 ${storefrontSurfaceCard}`}
      onSubmit={handleSubmit}
    >
      {formSubmitError !== null ? (
        <p className="text-[0.8125rem] leading-[1.4] text-destructive" role="alert">
          {formSubmitError}
        </p>
      ) : null}
      <label className="flex flex-col gap-2 text-base">
        <span className="text-muted-foreground">{landingTranslations("contact.nameLabel")}</span>
        <input
          name="name"
          type="text"
          required
          maxLength={200}
          autoComplete="name"
          className={storefrontMarketingInput}
          placeholder={landingTranslations("placeholders.name")}
          disabled={isSubmitting}
        />
      </label>
      <label className="flex flex-col gap-2 text-base">
        <span className="text-muted-foreground">{landingTranslations("contact.emailLabel")}</span>
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          className={storefrontMarketingInput}
          placeholder={landingTranslations("placeholders.email")}
          disabled={isSubmitting}
        />
      </label>
      <label className="flex flex-col gap-2 text-base">
        <span className="text-muted-foreground">{landingTranslations("contact.phoneLabel")}</span>
        <input
          name="phone"
          type="tel"
          required
          maxLength={40}
          autoComplete="tel"
          className={storefrontMarketingInput}
          placeholder={landingTranslations("placeholders.phone")}
          disabled={isSubmitting}
        />
      </label>
      <p className="text-[0.8125rem] leading-[1.4] text-muted-foreground">
        {landingTranslations("contact.consent")}
      </p>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-2 w-full ${storefrontButtonPrimary} ${storefrontButtonPrimaryPaddingCompact} disabled:opacity-60`}
      >
        {isSubmitting
          ? landingTranslations("contact.submitSending")
          : landingTranslations("contact.submit")}
      </button>
    </form>
  );
};
