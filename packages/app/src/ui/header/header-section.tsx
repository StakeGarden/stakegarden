import { ButtonLink } from "@/src/ui/buttons";
import { DisplayText, TitleText } from "@/src/ui/text";
import { cx } from "class-variance-authority";

export const HeadingSection = ({
  title,
  buttonText,
  href,
  description,
}: {
  title: string;
  buttonText?: string;
  href?: string;
  description?: string;
}) => (
  <div className="space-y-7">
    <div
      className={cx("flex items-center", {
        "justify-center": !href,
        "justify-between": href,
      })}
    >
      <DisplayText size="0">{title}</DisplayText>
      {href && buttonText && (
        <ButtonLink href={href} width="fit">
          {buttonText}
        </ButtonLink>
      )}
    </div>
    {description && (
      <TitleText
        className={cx("text-em-low", {
          "text-center": !href,
        })}
      >
        {description}
      </TitleText>
    )}
  </div>
);
