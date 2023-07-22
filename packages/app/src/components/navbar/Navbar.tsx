"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import { ButtonLink } from "@/src/ui";
import { ConnectButton } from "@/src/components";

export function Navbar() {
  return (
    <header className="top-0 flex flex-col w-full px-12 border-b border-solid h-nav-height bg-surface-25 border-b-surface-75">
      <nav className="flex items-center w-full h-full">
        <div>
          <Link
            tabIndex={0}
            href="/"
            title="Stake Gardens Home"
            className="flex items-center w-20 outline-none md:w-48"
          >
            <Logo />
          </Link>
        </div>
        <Divider />
        <div className="items-center justify-end hidden w-full gap-4 md:flex">
          <ButtonLink action="quaternary" size="sm" href="/gardens/my-gardens">
            My gardens
          </ButtonLink>
          <Divider />
          {/* <SelectNetwork /> */}
          <ConnectButton />
        </div>
        <MobileMenu />
      </nav>
    </header>
  );
}

const Divider = () => (
  <div className="h-8 border-r border-solid border-b-gray-100"></div>
);
