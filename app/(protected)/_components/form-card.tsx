import { Form } from "@prisma/client";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import Link from "next/link";

export const FormCard: React.FC<{ form: Form, role: "creator" | "user" }> = ({ form, role }) => {
    return (
        <Card className="w-full min-h-[300px] shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.025] flex flex-col">
            <Link href={role === "user" ? `/form/${form.id}` : `/form/${form.id}/manage`}>
                <div className="flex justify-center items-center w-full p-3 h-60">
                    <Image src={form.image ?? ""} alt={form.title} width={300} height={50} className="w-full h-full object-cover rounded-lg" />
                </div>
                <CardHeader>
                    <CardTitle>{form.title}</CardTitle>
                    <CardDescription className="overflow-hidden line-clamp-3 ">{form.description}</CardDescription>
                </CardHeader>
            </Link>
        </Card>
    )
}