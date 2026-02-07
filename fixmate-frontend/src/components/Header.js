"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* App Name */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          Fixmate
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4">
          {/* Show user dropdown if authenticated */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={user.profilePicture}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="truncate">{user.name}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.role === "user" && (
                  <DropdownMenuItem
                    onClick={() => router.push("/profile/user")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                )}
                {/* <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      user.role === "user" ? "/dashboard/user" : "/dashboard/worker"
                    )
                  }
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* Show register and login if not authenticated */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/register")}
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                Register
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/login")}
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                Login
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}