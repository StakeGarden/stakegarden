import { TextProps, boldStyles } from "@/src/ui/text/base";
import { cva, cx } from "class-variance-authority";
import { londrina } from "@/src/app/fonts";

const displayTextStyles = cva([], {
  variants: {
    size: {
      3: ["text-[104px] leading-[120px]"],
      2: ["text-[88px] leading-[96px]"],
      1: ["text-4xl md:text-[74px] md:leading-[88px]"],
      0: ["text-4xl md:text-[58px]"],
    },
  },
  defaultVariants: {
    size: 1,
  },
});

interface DisplayTextProps extends TextProps {
  size?: 0 | 1 | 2 | 3;
}

export const DisplayText = ({
  children,
  size,
  className,
  weight,
  as,
}: DisplayTextProps) => {
  const TextComponent = as || "h2";
  return (
    <TextComponent
      className={cx(
        boldStyles({ weight }),
        displayTextStyles({ size, className }),
        londrina.className
      )}
    >
      {children}
    </TextComponent>
  );
};
