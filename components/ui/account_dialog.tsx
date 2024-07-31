import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function UserDialog() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Information</DialogTitle>
          <DialogDescription>
            View your profile information.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Current Email: {user.email}</p>
          <p>Current Name: {user.name}</p>
        </div>
        <div className="py-4">
          <Link href="/account">
            <Button variant="outline">Go to Account Page</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
