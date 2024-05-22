"use server"

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ResponseSchema } from "@/schemas";

export const CreateResponse = async (values: z.infer<typeof ResponseSchema>) => {

    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" }
    }

    const validatedFields = ResponseSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { formId, responses } = validatedFields.data;

    const form = await db.form.findUnique({
        where: {
            id: formId,
        },
    });

    if (!form) {
        return { error: "Form not found!" };
    }

    const formQuestions = await db.formQuestion.findMany({
        where: {
            formId,
        },
    });

    const existingResponse = await db.formResponse.findFirst({
        where: {
            formId,
            createdById: user.id,
        },
    });

    if (existingResponse) {
        return { error: "Response already exists!" };
    }

    await Promise.all(
        responses.map(async (response) => {
            return db.formResponse.create({
                data: {
                    answer: response.response,
                    question: {
                        connect: {
                            id: response.questionId,
                        },
                    },
                    form: {
                        connect: {
                            id: formId,
                        },
                    },
                    createdBy: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            });
        })
    );

    return { success: "Response created!", id: formId };

};
