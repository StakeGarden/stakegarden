import HamburgerIcon from "../../public/assets/icons/hamburger.svg";
import WarningIcon from "../../public/assets/icons/warning.svg";
import CloseIcon from "../../public/assets/icons/close.svg";

export type IconName = "menu" | "close" | "warning";

export const iconMap: Record<IconName, any> = {
  close: CloseIcon,
  menu: HamburgerIcon,
  warning: WarningIcon,
};

const getIcon = (name: IconName) => iconMap[name];

export const Icon = ({
  name,
  size = 20,
  alt,
  className,
}: {
  name: IconName;
  size?: number;
  alt?: string;
  className?: string;
}) => {
  const IconComponent = getIcon(name);

  return (
    <IconComponent
      width={size}
      height={size}
      className={className}
      title={alt ? alt : name}
    />
  );
};
