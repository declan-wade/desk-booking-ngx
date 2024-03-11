"use client";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import ModeToggle from "./toggle";

export default function Menu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
    <NavigationMenuItem>
      <Link href="/" legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Home
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem> 
    <NavigationMenuItem>
      <Link href="/book" legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Book
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem> 
    <NavigationMenuItem>
    <ModeToggle />
    </NavigationMenuItem>
    </NavigationMenuList>
    </NavigationMenu>
  );
}
