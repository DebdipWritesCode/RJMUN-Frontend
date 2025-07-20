import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const navItems = [
  { label: "Home", path: "/" },
  { label: "Committees", path: "/committees" },
  { label: "EBs", path: "/ebs" },
  { label: "Teams", path: "/teams" },
  { label: "Sponsors", path: "/sponsors" },
  { label: "FAQ", path: "/faq" },
  { label: "CA Portal", path: "/why-ca" },
  { label: "Register", path: "/register" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const onLogoClick = () => {
    navigate("/");
    setIsOpen(false);
  };

  const closeDialog = () => setIsOpen(false);

  return (
    <nav className="w-full py-6 px-4 bg-primary-background shadow-lg shadow-gray-900">
      {/* Desktop Menu */}
      <div className="hidden md:flex justify-between items-center">
        <div className="bg-green-500 rounded-3xl px-3">
          <img
            onClick={onLogoClick}
            src="./images/event-logo.png"
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
                  <Link className="bg-primary-background" to={path}>
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
        <div onClick={onLogoClick} className="text-xl font-bold cursor-pointer">
          RJMUN
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="focus:outline-none">
            <MenuIcon className="w-6 h-6" />
          </DialogTrigger>
          <DialogContent className="p-6 space-y-4">
            <DialogTitle className="text-xl font-semibold mb-2">
              Menu
            </DialogTitle>
            {navItems.map(({ label, path }) => (
              <Link
                to={path}
                key={path}
                onClick={closeDialog}
                className="block text-lg font-medium hover:underline">
                {label}
              </Link>
            ))}
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};

export default Navbar;
