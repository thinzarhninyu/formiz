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
import Image from "next/image"
import { DEFAULT_FORM_IMAGE } from "@/data/constants"

export const ShareCard: React.FC<{ form: Form }> = ({ form }) => {

    const { toast } = useToast()
    const [copied, setCopied] = useState(false)

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
        <Card>
            <CardHeader>
                <Image src={form.image ?? DEFAULT_FORM_IMAGE} alt={form.title} width={300} height={50} className="w-full rounded-lg mb-5" />
                <CardTitle>{form.title}</CardTitle>
                <CardDescription className="overflow-hidden line-clamp-3 ">{form.description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className="w-full" onClick={onShare}>Share</Button>
            </CardFooter>
        </Card>
    )
}