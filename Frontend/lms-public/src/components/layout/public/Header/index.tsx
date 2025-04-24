"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { headerData } from "./Navigation/menuData";
import HeaderLink from "./Navigation/HeaderLink";
import MobileHeaderLink from "./Navigation/MobileHeaderLink";
import { useTheme } from "next-themes";
import Logo from "./Logo";
import { LogIn, UserPlus } from "lucide-react";
import { NavigationRoute } from "@/util/navigation";
import { useAuth } from "@/context/auth/Auth.Context";

const Header: React.FC = () => {
  const pathUrl = usePathname();
  const { theme, setTheme } = useTheme();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const { isAuthenticated, authUser, logout } = useAuth();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY >= 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        navbarOpen
      ) {
        setNavbarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navbarOpen]);

  useEffect(() => {
    document.body.style.overflow = navbarOpen ? "hidden" : "";
  }, [navbarOpen]);

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 bg-white ${
        sticky ? "shadow-lg py-5" : "shadow-none py-6"
      }`}
    >
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-grow items-center gap-8 justify-center">
          {headerData.map((item, index) => (
            <HeaderLink key={index} item={item} />
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4 hidden lg:flex">
              <span className="text-gray-700 text-sm">
                Welcome, <strong>{authUser?.name}</strong>
              </span>
              <Link
                href="/profile"
                className="flex items-center gap-2 bg-primary/15 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-full text-sm font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href={NavigationRoute.LOGIN}
                className="hidden lg:flex items-center gap-2 bg-primary text-white hover:bg-primary/15 hover:text-primary px-4 py-2 rounded-full text-lg font-medium"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </Link>

              <Link
                href={NavigationRoute.REGISTER}
                className="hidden lg:flex items-center gap-2 bg-primary/15 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-full text-lg font-medium"
              >
                <UserPlus className="w-5 h-5" />
                Sign Up
              </Link>
            </>
          )}
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="block lg:hidden p-2 rounded-lg"
            aria-label="Toggle mobile menu"
          >
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
            <span className="block w-6 h-0.5 bg-black mt-1.5"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {navbarOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40" />
      )}

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 right-0 h-full w-full bg-darkmode shadow-lg transform transition-transform duration-300 max-w-xs ${
          navbarOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-bold text-midnight_text dark:text-midnight_text">
            <Logo />
          </h2>
          <button
            onClick={() => setNavbarOpen(false)}
            className="bg-[url('/images/closed.svg')] bg-no-repeat bg-contain w-5 h-5 absolute top-0 right-0 mr-8 mt-8 dark:invert"
            aria-label="Close menu Modal"
          ></button>
        </div>
        <nav className="flex flex-col items-start p-4">
          {headerData.map((item, index) => (
            <MobileHeaderLink key={index} item={item} />
          ))}
          {isAuthenticated ? (
            <div className="mt-4 flex flex-col space-y-4 w-full">
              <Link
                href="/profile"
                className="flex items-center justify-between w-full py-2 text-muted focus:outline-none"
                onClick={() => setNavbarOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-col space-y-4 w-full">
              <Link
                href={NavigationRoute.LOGIN}
                className="bg-transparent border border-primary text-primary px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white"
                onClick={() => setNavbarOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href={NavigationRoute.REGISTER}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => setNavbarOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
