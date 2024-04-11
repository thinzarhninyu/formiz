"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { FormSchema } from "@/schemas";
import { z } from "zod";

export const CreateForm = async (values: z.infer<typeof FormSchema>) => {

    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" }
    }

    const validatedFields = FormSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { title, description, image, fields } = validatedFields.data;

    const createdForm = await db.form.create({
        data: {
            title,
            description,
            image,
            createdBy: {
                connect: {
                    id: user.id,
                },
            },
        },
    });

    if (!createdForm) {
        return { error: "Failed to create form!" };
    }

    await Promise.all(
        fields.map(async (field) => {
            return db.formQuestion.create({
                data: {
                    label: field.label,
                    type: field.type,
                    required: field.required,
                    options: field.options,
                    form: {
                        connect: {
                            id: createdForm.id,
                        },
                    },
                },
            });
        })
    );

    return { success: "Form created!", id: createdForm.id };

};
