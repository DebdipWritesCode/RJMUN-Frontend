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
import { EVENT_LOGO_PATH, NAVBAR_LINE_PATH } from "@/utils/constants";

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
    path === "/"
      ? pathname === "/"
      : pathname === path || pathname.startsWith(path + "/");

  const onLogoClick = () => {
    navigate("/");
    setIsOpen(false);
  };

  const closeDialog = () => setIsOpen(false);

  return (
    <nav className="w-full py-6 px-4 bg-background shadow-lg shadow-background/30">
      {/* Desktop Menu */}
      <div className="hidden md:flex justify-between items-center">
        <div className="rounded-3xl">
          <img
            onClick={onLogoClick}
            src={EVENT_LOGO_PATH}
            className="h-[80px] w-[100px] cursor-pointer"
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
        <img
          src={NAVBAR_LINE_PATH}
          alt="Decorative Line"
          className="absolute h-5 left-1/2 -translate-x-1/2 top-[100px]"
        />
      </div>

      {/* Mobile Menu */}
      <div className="flex justify-between items-center md:hidden">
        <div
          onClick={onLogoClick}
          className="text-xl text-primary font-bold cursor-pointer">
          RJMUN
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="focus:outline-none">
            <MenuIcon className="w-6 h-6 text-primary" />
          </DialogTrigger>
          <DialogContent className="!bg-[#0b1f3a]/95 backdrop-blur-lg p-6 space-y-4 border border-[#f8c94c]/40 shadow-xl max-w-[min(calc(100%-2rem),20rem)] left-4 right-auto translate-x-0 translate-y-[-50%] top-[50%] rounded-xl">
            <DialogTitle className="text-xl font-semibold mb-2 text-[#f8c94c]">
              Menu
            </DialogTitle>

            <nav className="flex flex-col gap-3">
              {navItems.map(({ label, path }) => (
                <Link
                  to={path}
                  key={path}
                  onClick={closeDialog}
                  className={`block rounded-xl border px-4 py-3 text-base font-medium transition-all duration-200
        ${
          isActive(path)
            ? "bg-[#f8c94c] text-[#0b1f3a] border-[#f8c94c] shadow-[0_0_8px_rgba(248,201,76,0.4)]"
            : "bg-[#0b1f3a]/70 text-[#f8c94c] border-[#f8c94c]/30 hover:bg-[#0b1f3a]"
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
