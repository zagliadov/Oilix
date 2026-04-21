type ProductDetailDescriptionSectionProps = {
  title: string;
  text: string;
};

export const ProductDetailDescriptionSection = ({
  title,
  text,
}: ProductDetailDescriptionSectionProps) => {
  return (
    <section aria-labelledby="product-description-heading" className="mt-10">
      <h2
        id="product-description-heading"
        className="font-display text-lg font-semibold text-foreground"
      >
        {title}
      </h2>
      <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
        {text}
      </p>
    </section>
  );
};
