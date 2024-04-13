import { db } from "@/lib/db";
import { FormResponse } from "@/types";

interface GroupedResponses {
    [userId: string]: FormResponse[];
}

export const getForms = async (id: string) => {
    try {
        const forms = await db.form.findMany({ where: { createdById: id } });

        return forms;
    } catch {
        return null;
    }
}

export const getFormById = async (id: string) => {
    try {
        const form = await db.form.findUnique({ where: { id } });

        return form;
    } catch {
        return null;
    }
}

export const getFormQuestions = async (formId: string) => {
    try {
        const questions = await db.formQuestion.findMany({ where: { formId }, orderBy: { order: 'asc' } });

        return questions;
    } catch {
        return null;
    }
}

export const getFormResponses = async (formId: string) => {
    try {
        const responses = await db.formResponse.findMany({ where: { formId }, include: { createdBy: true } });

        const groupedResponses: GroupedResponses = responses.reduce((groups: GroupedResponses, response) => {
            const userId = response.createdBy.id;
            if (!groups[userId]) {
                groups[userId] = [];
            }
            groups[userId].push(response);
            return groups;
        }, {});

        const groupedResponsesArray: FormResponse[][] = Object.values(groupedResponses);

        return groupedResponsesArray;
    } catch {
        return null;
    }
}

export const getFormResponseByUser = async (formId: string, userId: string) => {
    try {
        const response = await db.formResponse.findMany({ where: { formId, createdById: userId } });

        return response;
    } catch {
        return null;
    }
}