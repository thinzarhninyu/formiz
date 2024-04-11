"use client"

import { useState, useTransition } from "react";
import { Form, FormQuestion, QuestionType } from "@prisma/client";
import FormCreator from "./form-creator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CreateForm } from "@/actions/create-form";
import { FileUpload } from "./file-upload";
import { UpdateForm } from "@/actions/update-form";

interface Question {
    id?: string;
    label: string;
    type: QuestionType;
    required: boolean;
    options: string[];
}

export const FormQuestions: React.FC<{ form?: Form, formQuestions?: FormQuestion[] }> = ({ form, formQuestions }) => {

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [image, setImage] = useState<string | undefined>(form?.image ?? undefined);

    const [formTitle, setFormTitle] = useState(form?.title ?? "");
    const [formDescription, setFormDescription] = useState(form?.description ?? "");
    const [questions, setQuestions] = useState<Question[]>(formQuestions ?? [{ label: '', type: QuestionType.TEXT, required: false, options: [''] }]);

    const handleSubmit = () => {
        setError("");
        setSuccess("");

        startTransition(() => {
            if (form) {
                UpdateForm({
                    id: form.id,
                    title: formTitle,
                    description: formDescription,
                    image,
                    fields: questions.map(({ id, label, type, required, options }) => ({
                        id,
                        label,
                        type,
                        required,
                        options: type === QuestionType.MULTIPLE_CHOICE || QuestionType.DROPDOWN ? options : undefined,
                    })),
                })
                    .then((questionData) => {
                        setError(questionData.error);
                        setSuccess(questionData.success);
                    })
                    .catch((error) => {
                        setError(error.message);
                    });
            } else {
                CreateForm({
                    title: formTitle,
                    description: formDescription,
                    image,
                    fields: questions.map(({ label, type, required, options }) => ({
                        label,
                        type,
                        required,
                        options: type === QuestionType.MULTIPLE_CHOICE || QuestionType.DROPDOWN ? options : undefined,
                    })),
                })
                    .then((questionData) => {
                        setError(questionData.error);
                        setSuccess(questionData.success);
                    })
                    .catch((error) => {
                        setError(error.message);
                    });
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <FileUpload
                    endpoint="formImage"
                    onChange={(value) => {
                        setImage(value);
                    }}
                    value={image ?? undefined}
                />
                <CardTitle>
                    <Input type="text" placeholder="Form Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                </CardTitle>
                <CardDescription>
                    <Textarea value={formDescription} placeholder="Form Description" onChange={(e) => setFormDescription(e.target.value)} />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-4">
                        <FormCreator
                            questions={questions}
                            setQuestions={setQuestions}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    disabled={isPending}
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full"
                >
                    Submit
                </Button>
            </CardFooter>
        </Card>
    )
}

export default FormQuestions;