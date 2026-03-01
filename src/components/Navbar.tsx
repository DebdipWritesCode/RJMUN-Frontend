import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MenuIcon } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { EVENT_LOGO_PATH } from "@/utils/constants";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Committees", path: "/committees" },
  { label: "EBs", path: "/ebs" },
  { label: "Teams", path: "/teams" },
  { label: "Sponsors", path: "/sponsors" },
  { label: "FAQ", path: "/faq" },
  { label: "Fest Days", path: "/fest-days" },
  { label: "CA Portal", path: "/why-ca" },
  { label: "Register", path: "/register" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(path + "/");

  const onLogoClick = () => {
    navigate("/");
    setIsOpen(false);
  };

  const closeDialog = () => setIsOpen(false);

  return (
    <nav className="w-full py-6 px-4 bg-background shadow-lg shadow-background/30">
      {/* Desktop Menu */}
      <div className="hidden md:flex justify-between items-center">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl px-3 py-3">
          <img
            onClick={onLogoClick}
            src={EVENT_LOGO_PATH}
            className="h-[60px] w-[90px] cursor-pointer"
            alt="RJMUN Logo"
          />
        </div>
        <NavigationMenu className="w-full max-w-none">
          <NavigationMenuList className="flex justify-between flex-wrap w-full max-w-none">
            {navItems.map(({ label, path }) => (
              <NavigationMenuItem key={path}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}>
                  <Link
                    to={path}
                    className={`bg-background text-primary ${isActive(path) ? "bg-accent text-accent-foreground" : ""}`}>
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Menu */}
      <div className="flex justify-between items-center md:hidden">
        <div onClick={onLogoClick} className="text-xl text-primary font-bold cursor-pointer">
          RJMUN
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="focus:outline-none">
            <MenuIcon className="w-6 h-6 text-primary" />
          </DialogTrigger>
          <DialogContent className="!bg-white dark:!bg-zinc-900 p-6 space-y-4 border border-border/50 shadow-xl max-w-[min(calc(100%-2rem),20rem)] left-4 right-auto translate-x-0 translate-y-[-50%] top-[50%]">
            <DialogTitle className="text-xl font-semibold mb-2 text-foreground">
              Menu
            </DialogTitle>
            <nav className="flex flex-col gap-2">
              {navItems.map(({ label, path }) => (
                <Link
                  to={path}
                  key={path}
                  onClick={closeDialog}
                  className={`block rounded-lg border px-4 py-3 text-base font-medium transition-colors hover:bg-muted hover:border-primary/30 active:bg-muted/80 ${
                    isActive(path)
                      ? "border-primary/30 bg-accent text-accent-foreground"
                      : "border-border bg-muted/40 text-foreground"
                  }`}>
                  {label}
                </Link>
              ))}
            </nav>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};

export default Navbar;
