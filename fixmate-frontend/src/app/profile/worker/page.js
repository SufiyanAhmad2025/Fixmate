"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export default function WorkerProfile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/me");
        setProfile(data);
      } catch (error) {
        toast({
          message: "Failed to load profile",
        });
      }
    };
    if (user) fetchProfile();
  }, [user]);

  if (!profile) return <ProfileSkeleton />;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium">Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
            <p>Address: {profile.address || "Not specified"}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/profile/user/edit">
              <Button variant="outline">Edit Profile</Button>
            </Link>

            <Button onClick={logout} variant="destructive">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const ProfileSkeleton = () => (
  <div className="container mx-auto p-4 max-w-2xl">
    <Skeleton className="h-[200px] w-full rounded-xl" />
  </div>
);
