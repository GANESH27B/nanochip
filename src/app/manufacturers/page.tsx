
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { users } from '@/lib/data';
import type { User } from '@/lib/types';
import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ManufacturersPage() {
  const manufacturers = useMemo(() => {
    return Object.values(users).filter((user) => user.role === 'Manufacturer');
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Manufacturers</CardTitle>
          <CardDescription>
            A list of all registered manufacturers in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manufacturers.map((mfg) => (
                <TableRow key={mfg.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={mfg.avatarUrl} />
                        <AvatarFallback>{mfg.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{mfg.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{mfg.email}</TableCell>
                  <TableCell>{mfg.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

    