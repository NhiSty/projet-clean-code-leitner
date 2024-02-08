import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";

export function NavBar(): JSX.Element {
  return (
    <NavigationMenu className="border-b max-w-full justify-start">
      <NavigationMenuList className="container py-4">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              "inline-flex items-center gap-1",
              navigationMenuTriggerStyle()
            )}
          >
            <Link to="/">
              <ArrowLeft className="w-6 h-6" />
              Go back
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
