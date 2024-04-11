"use client"

import { APP_NAME } from "@/data/constants"
import { useCurrentUser } from "@/hooks/use-current-user"
import { LoginButton } from "./auth/login-button";
import { UserButton } from "./auth/user-button";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Header: React.FC = () => {

    const user = useCurrentUser();
    const router = useRouter();

    return (
        <div className="h-16 flex items-center justify-between">
            <Link href='/'>{APP_NAME}</Link>
            {user ? (
                <div className="flex flex-row items-center gap-x-3">
                    <Button onClick={() => router.push('/form/new')}>Create New Form</Button>
                    <UserButton />
                </div>
            ) : (
                <LoginButton />
            )}
        </div>
    )
}