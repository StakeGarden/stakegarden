"use client";

import Link from "next/link";
import { ButtonBaseProps, buttonStyles, getIconSize } from "./base";
import { Icon } from "@/src/ui/Icon";

interface ButtonLinkProps extends ButtonBaseProps {
  href: string;
}

export function ButtonLink({
  children,
  className,
  size,
  action,
  width,
  disabled,
  href,
  active,
  iconLeft,
  iconRight,
  id,
}: ButtonLinkProps) {
  return (
    <Link
      id={id}
      href={href}
      tabIndex={0}
      className={buttonStyles({
        size,
        action,
        width,
        disabled,
        active,
        className,
      })}
    >
      {iconLeft && <Icon size={getIconSize(size)} name={iconLeft} />}
      {children && <div>{children}</div>}
      {iconRight && <Icon size={getIconSize(size)} name={iconRight} />}
    </Link>
  );
}
