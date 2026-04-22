/**
 * Map catalog `aspect-*` Tailwind-style hints to a CSS `aspect-ratio` value.
 * Inline `aspectRatio` is used so the frame always gets height if Tailwind omits the utility.
 */
export const frameAspectFromAspectClass = (aspectClassName: string): string => {
  if (aspectClassName.includes("3/4") || aspectClassName.includes("3\\4")) {
    return "3 / 4";
  }
  if (aspectClassName.includes("4/5") || aspectClassName.includes("4\\5")) {
    return "4 / 5";
  }
  if (aspectClassName.includes("16/9")) {
    return "16 / 9";
  }
  return "1 / 1";
};
