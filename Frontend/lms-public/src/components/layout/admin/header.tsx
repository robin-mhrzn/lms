"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { AuthHelper } from "@/util/authHelper";
import { getInitials } from "@/util/sharedHelper";
import { AuthUserModel } from "@/util/types/authModel";
import { NavigationRoute } from "@/util/navigation";
import { useRouter } from "next/navigation";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
}

const Header = ({ className, fixed, children, ...props }: HeaderProps) => {
  const [authUser, setAuthUser] = useState<AuthUserModel | null>(null);
  const [offset, setOffset] = useState(0);
  const router = useRouter();

  // Handle scroll and authentication
  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY || 0);
    };

    const userAuthModel = new AuthHelper().getAuthUser();
    if (userAuthModel?.token) {
      setAuthUser(userAuthModel);
    } else {
      router.push(NavigationRoute.LOGIN);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  return (
    <header
      className={cn(
        "bg-background flex h-16 items-center gap-3 p-4 sm:gap-4",
        fixed && "header-fixed peer/header fixed z-50 w-[inherit] rounded-md",
        offset > 10 && fixed ? "shadow-sm" : "shadow-none",
        className
      )}
      {...props}
    >
      {/* Sidebar Trigger */}
      <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
      <Separator orientation="vertical" className="h-6" />

      {/* Header Title */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <h1 className="text-lg font-semibold">Learning Management System</h1>
      </div>

      {/* User Dropdown */}
      <div className="ml-auto flex items-center space-x-4">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={authUser?.avatar}
                  alt={authUser?.name || ""}
                />
                <AvatarFallback>
                  {getInitials(authUser?.name ?? "")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {authUser?.name}
                </p>
                <p className="text-xs text-muted-foreground leading-none">
                  {authUser?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/">Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                new AuthHelper().logout();
                router.push(NavigationRoute.LOGIN);
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
