'use client';

import { useRouter } from "next/navigation";

import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
  } from "lucide-react"
  
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
  export function AdjustedDropDown() {

    const router = useRouter();

    const handlePreReqGraph = () => {
      router.push('/prereqs');
    }

    const handleRMP = () => {
      router.push('/rmp');
    }

    const handleAvgGPA = () => {
      router.push('/avgGPA');
    }

    const handleClassReviews = () => {
      router.push('/reviews');
    }

    const handleFutureSearch = () => {
      router.push('/futureSearch');
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Other Options</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handlePreReqGraph}>
              <User className="mr-2 h-4 w-4" />
              <span>Prerequisite Graph</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRMP}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Rate my Professor</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAvgGPA}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Average GPA</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleClassReviews}>
              <Keyboard className="mr-2 h-4 w-4" />
              <span>Class Reviews</span>
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleFutureSearch}>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Future Search</span>
              <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

export default AdjustedDropDown;
  