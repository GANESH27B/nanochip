'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AppHeader from '@/components/app/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Role } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/lib/data';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; role: Role } | null>(null);
  const { toast } = useToast();

  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
      const currentUser = users[role as keyof typeof users] || { name: 'PharmaTrust User', email: 'user@example.com', role: role };
      setUser(currentUser);
      reset({ name: currentUser.name, email: currentUser.email });
    }
  }, [reset]);

  const onSubmit = (data: ProfileFormValues) => {
    console.log(data);
    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved successfully.',
    });
  };

  if (!user) {
    return null; 
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title="My Profile" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your personal and account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userAvatar?.imageUrl} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <p className="text-lg font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={!isDirty}>Save Changes</Button>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  );
}
