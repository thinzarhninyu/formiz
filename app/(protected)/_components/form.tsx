"use client"

import { Form, FormQuestion, FormResponse, QuestionType } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useState, useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreateResponse } from "@/actions/create-response";
import { CircleAlert } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { DEFAULT_FORM_IMAGE } from "@/data/constants";

export const ViewForm: React.FC<{ form: Form, formQuestions: FormQuestion[], formResponses?: FormResponse[] | null, type: "view" | "manage" }> = ({ form, formQuestions, formResponses, type }) => {

    const router = useRouter();

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const [responses, setResponses] = useState<{ [questionId: string]: string | string[] | boolean }>({});

    const handleChange = (questionId: string, newValue: string | boolean | string[], questionType: QuestionType) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [questionId]: newValue
        }));
    };

    const getPreviousResponse = (questionId: string) => {
        return formResponses?.find(response => response.questionId === questionId)?.answer;
    };

    const handleSubmit = () => {
        setError("");
        setSuccess("");

        startTransition(() => {
            const allRequiredFilled = formQuestions.every((question) => {
                if (question.required) {
                    return responses[question.id] !== undefined && responses[question.id] !== '';
                }
                return true;
            });

            if (allRequiredFilled) {
                CreateResponse({
                    responses: Object.entries(responses).map(([questionId, response]) => ({
                        questionId,
                        response: Array.isArray(response) ? response as string[] : [response as string],
                    })),
                    formId: form.id,
                })
                    .then((responseData) => {
                        setError(responseData.error);
                        setSuccess(responseData.success);
                        router.push(`/form/${form.id}/success`);
                    })
                    .catch((error) => {
                        setError(error.message);
                    });
            } else {
                setError("Please fill in all required questions.");
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <Image src={form.image ?? DEFAULT_FORM_IMAGE} alt={form.title} width={100} height={100} />
                <CardTitle>
                    {form.title}
                </CardTitle>
                <CardDescription>
                    {form.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-4">
                        {formQuestions.map((question) => (
                            <div key={question.id}>
                                <Label htmlFor={question.id} className="flex flex-row gap-x-1 items-center mb-3">
                                    {question.label}
                                    {question.required &&
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-red-500"><CircleAlert size={12} /></span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>This question is required to respond.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>}
                                </Label>
                                {question.type === QuestionType.TEXT && (
                                    <Input
                                        type={question.type}
                                        name={question.id}
                                        disabled={type === "manage" ?? (formResponses && formResponses.length > 0)}
                                        defaultValue={(getPreviousResponse(question.id)?.[0] ?? '')}
                                        value={responses[question.id] as string}
                                        onChange={(e) => handleChange(question.id, e.target.value, QuestionType.TEXT)}
                                    />
                                )}
                                {question.type === QuestionType.TEXTAREA && (
                                    <Textarea
                                        name={question.id}
                                        disabled={type === "manage" ?? (formResponses && formResponses.length > 0)}
                                        defaultValue={(getPreviousResponse(question.id)?.[0] ?? '')}
                                        value={responses[question.id] as string}
                                        onChange={(e) => handleChange(question.id, e.target.value, QuestionType.TEXTAREA)}
                                    />
                                )}
                                {question.type === QuestionType.DROPDOWN && (
                                    <Select name={question.id}
                                        disabled={type === "manage" ?? (formResponses && formResponses.length > 0)}
                                        defaultValue={getPreviousResponse(question.id)?.[0]}
                                        value={responses[question.id] as string}
                                        onValueChange={(e) => handleChange(question.id, e, QuestionType.DROPDOWN)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder={question.label} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {question.options.map((option) => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                {question.type === QuestionType.MULTIPLE_CHOICE && (
                                    <div className="flex flex-col gap-y-3">
                                        {question.options.map((option) => (
                                            <div key={option} className="flex flex-row gap-x-3">
                                                <Checkbox
                                                    name={option}
                                                    disabled={type === "manage" ?? (formResponses && formResponses.length > 0)}
                                                    checked={formResponses && formResponses.length > 0 ? getPreviousResponse(question.id)?.includes(option) : Array.isArray(responses[question.id]) && (responses[question.id] as string[]).includes(option)}
                                                    onCheckedChange={(isChecked) => {
                                                        const currentOptions = Array.isArray(responses[question.id]) ? (responses[question.id] as string[]) : [];
                                                        const newOptions = isChecked
                                                            ? [...currentOptions, option]
                                                            : currentOptions.filter((item) => item !== option);
                                                        handleChange(question.id, newOptions, QuestionType.MULTIPLE_CHOICE);
                                                    }}
                                                />
                                                <Label htmlFor={option}>{option}</Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {question.type === QuestionType.CHECKBOX && (
                                    <Checkbox
                                        name={question.id}
                                        disabled={type === "manage" ?? (formResponses && formResponses.length > 0)}
                                        checked={formResponses && formResponses.length > 0 ? (getPreviousResponse(question.id)?.[0] === "true" ? true : false) : (responses[question.id] === "true" ? true : false)}
                                        onCheckedChange={(e) => {
                                            handleChange(question.id, e === true ? "true" : "false", QuestionType.CHECKBOX)
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />

                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    disabled={type === "manage" || (formResponses && formResponses.length > 0) || isPending}
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full"
                >
                    Submit
                </Button>
            </CardFooter>
        </Card >
    )
}