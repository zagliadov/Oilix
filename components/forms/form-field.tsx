"use client";

import type { ReactNode } from "react";

const inputBaseClass =
  "w-full rounded-md border bg-background px-3 py-2.5 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white/3";

const inputNormalClass = `${inputBaseClass} border-border focus-visible:border-brand/40 dark:border-white/12`;
const inputErrorClass = `${inputBaseClass} border-destructive/60 focus-visible:border-destructive focus-visible:ring-destructive/20`;

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: ReactNode;
};

export const FormField = ({
  id,
  label,
  required = false,
  error,
  description,
  children,
}: FormFieldProps) => {
  const errorIdentifier = `${id}-error`;
  const descriptionIdentifier = `${id}-description`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      {description !== undefined && description !== "" ? (
        <p id={descriptionIdentifier} className="text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
      {error !== undefined && error !== "" ? (
        <p id={errorIdentifier} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export const formInputClassName = (hasError: boolean): string =>
  hasError ? inputErrorClass : inputNormalClass;
