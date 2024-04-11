"use server"

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { FormSchema } from "@/schemas";
import { z } from "zod";

export const UpdateForm = async (values: z.infer<typeof FormSchema>) => {

    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" }
    }

    const validatedFields = FormSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { id, title, description, image, fields } = validatedFields.data;

    const form = await db.form.findUnique({
        where: {
            id,
        },
    });

    if (!form) {
        return { error: "Form not found!" };
    }

    if (form.createdById !== user.id) {
        return { error: "Unauthorized" };
    }

    await db.form.update({
        where: {
            id,
        },
        data: {
            title,
            description,
            image,
        },
    });

    await Promise.all(
        fields.map(async (field) => {
            return db.formQuestion.upsert({
                where: {
                    formId_id: {
                        formId: id!,
                        id: field.id!,
                    },
                },
                create: {
                    label: field.label,
                    type: field.type,
                    required: field.required,
                    options: field.options,
                    form: {
                        connect: {
                            id,
                        },
                    },
                },
                update: {
                    label: field.label,
                    type: field.type,
                    required: field.required,
                    options: field.options,
                },
            });
        })
    );

    return { success: "Form updated!", id: id };
}