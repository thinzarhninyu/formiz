"use client"

import { useRouter } from "next/navigation"
import { Button } from "../ui/button";

export const LoginButton: React.FC = () => {

    const router = useRouter();

    return (
        <Button onClick={() => router.push("/auth/login")}>
            Login
        </Button>
    )
}
