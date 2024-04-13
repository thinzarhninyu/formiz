"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form } from "@prisma/client"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { usePathname, useRouter } from "next/navigation"

export const ShareCard: React.FC<{ form: Form }> = ({ form }) => {

    const { toast } = useToast()
    const [copied, setCopied] = useState(false)
    const pathname = usePathname()
    const router = useRouter();

    const onShare = async () => {
        await navigator.clipboard.writeText(`${window.location.origin}/form/${form.id}?share=true`)
        setCopied(true)

        toast({
            title: "Share Link Copied",
            description: "You can now share the link with others",
        })

        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    return (
        <Card className="w-full min-h-[300px] shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.025] flex flex-col">
            <CardHeader>
                <CardTitle>{form.title}</CardTitle>
                <CardDescription className="overflow-hidden line-clamp-3 ">{form.description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className="w-full" onClick={onShare}>Share</Button>
            </CardFooter>
        </Card>
    )
}