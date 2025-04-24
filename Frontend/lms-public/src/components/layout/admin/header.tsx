"use client";
import React from "react";
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

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

const Header = ({ className, fixed, children, ...props }: HeaderProps) => {
  const authUser = new AuthHelper().getAuthUser();
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    document.addEventListener("scroll", onScroll, { passive: true });

    return () => document.removeEventListener("scroll", onScroll);
  }, []);
  <header
    className={cn(
      "bg-background flex h-16 items-center gap-3 p-4 sm:gap-4",
      fixed && "header-fixed peer/header fixed z-50 w-[inherit] rounded-md",
      offset > 10 && fixed ? "shadow-sm" : "shadow-none",
      className
    )}
    {...props}
  >
    <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
    <Separator orientation="vertical" className="h-6" />
    {children}
  </header>;
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
      <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center space-x-2 sm:space-x-4">
        <h1 className="text-lg font-semibold">Learning Management System</h1>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={authUser?.avatar} alt="@shadcn" />
                <AvatarFallback>
                  {getInitials(authUser?.name ?? "")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">
                  {authUser?.name}
                </p>
                <p className="text-muted-foreground text-xs leading-none">
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
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
export default Header;
