"use client"

import { Form, FormQuestion, FormResponse } from "@prisma/client";
import { ViewForm } from "./form";
import { useSearchParams } from "next/navigation";

export const FormView: React.FC<{ form: Form; formQuestions: FormQuestion[]; formResponses?: FormResponse[] | null; type: "view" | "manage" }> = ({ form, formQuestions, formResponses, type }) => {

    const params = useSearchParams();
    const share = params.get('share') as unknown as boolean;

    return (
        <>
            {share ? (
                <ViewForm form={form} formQuestions={formQuestions} formResponses={formResponses} type="view" />
            ) : (
                <p className="text-center">Please request the form owner for access.</p>
            )}
        </>
    )
}

