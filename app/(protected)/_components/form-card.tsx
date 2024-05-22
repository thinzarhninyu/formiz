"use client"

import { Form } from "@prisma/client";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_FORM_IMAGE } from "@/data/constants";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState, startTransition } from "react";
import { DeleteForm } from "@/actions/delete-form";
import { useRouter } from "next/navigation";

export const FormCard: React.FC<{ form: Form, role: "creator" | "user" }> = ({ form, role }) => {

    const router = useRouter();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const deleteForm = (id: string) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            DeleteForm(id)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
                    if (data.success) {
                        router.refresh();
                    }
                })
                .catch((error) => {
                    setError(error.message);
                });
        });
    }

    return (
        <Card className="w-full min-h-[250px] shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.025] flex flex-col">
            <div className="flex justify-center items-center w-full p-3 h-60">
                <Image src={form.image ?? DEFAULT_FORM_IMAGE} alt={form.title} width={300} height={200} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="flex flex-row justify-between items-center">
                <Link href={role === "user" ? `/form/${form.id}` : `/form/${form.id}/manage`}>
                    <CardHeader>
                        <CardTitle>{form.title}</CardTitle>
                        <CardDescription className="overflow-hidden line-clamp-3 ">{form.description}</CardDescription>
                    </CardHeader>
                </Link>
                <CardFooter>
                    <div className="flex justify-between items-center">
                        <Button onClick={() => deleteForm(form.id)} variant={"destructive"}>
                            <Trash size={18} />
                        </Button>
                    </div>
                </CardFooter>
            </div>
        </Card>
    )
}