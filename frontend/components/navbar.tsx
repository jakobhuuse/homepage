import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "./ui/separator";

export default function Navbar() {
  return (
    <nav className="w-full px-4 py-2 border-b bg-background">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList className="flex h-5 items-center space-x-4 text-sm">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href={"/"}>Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <Separator orientation="vertical" />
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href={"/games"}>Games</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <Separator orientation="vertical" />
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href={"/about"}>About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </div>
    </nav>
  );
}
