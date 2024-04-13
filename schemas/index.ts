import { QuestionType } from "@prisma/client";
import * as z from "zod";

export const FormSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    fields: z.array(
        z.object({
            id: z.string().optional(),
            label: z.string(),
            type: z.nativeEnum(QuestionType),
            required: z.boolean(),
            order: z.number(),
            options: z.array(z.string()).optional(),
        })
    ),
});

export const ResponseSchema = z.object({
    id: z.string().optional(),
    formId: z.string(),
    responses: z.array(
        z.object({
            questionId: z.string(),
            response: z.array(z.string()),
        })
    ),
});