type PublicOfferBlocksProps = {
  text: string;
};

const isAppendixHeading = (block: string) => {
  const firstLine = (block.split("\n")[0] ?? "").trim();
  return (
    /^ДОДАТОК\s*№/i.test(firstLine) ||
    /^ПРИЛОЖЕНИЕ\s*№/i.test(firstLine) ||
    /^APPENDIX\s*(№|#)?\s*\d/i.test(firstLine)
  );
};

const isMajorSectionHeading = (block: string) => {
  const firstLine = (block.split("\n")[0] ?? "").trim();
  return /^\d+\.\s+[А-ЯІЇЄҐA-ZЁ0-9]/.test(firstLine) && firstLine.length < 120;
};

export const PublicOfferBlocks = ({ text }: PublicOfferBlocksProps) => {
  const blocks = text
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <article className="mt-10 text-sm leading-[1.65] text-foreground/95 dark:text-zinc-300">
      {blocks.map((block, index) => {
        if (isAppendixHeading(block)) {
          return (
            <h2
              key={index}
              className="font-display mt-12 border-t border-border pt-10 text-lg font-bold uppercase tracking-wide text-foreground first:mt-0 first:border-t-0 first:pt-0"
            >
              {block}
            </h2>
          );
        }
        if (isMajorSectionHeading(block)) {
          return (
            <h2
              key={index}
              className="font-display mt-10 text-base font-semibold uppercase tracking-wide text-foreground first:mt-0"
            >
              {block}
            </h2>
          );
        }
        return (
          <p key={index} className="mt-4 whitespace-pre-wrap first:mt-0">
            {block}
          </p>
        );
      })}
    </article>
  );
};
