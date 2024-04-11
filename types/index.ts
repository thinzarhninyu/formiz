export type FormResponse = {
    id: string;
    formId: string;
    questionId: string;
    answer: string[];
    createdAt: Date;
    createdById: string;
    createdBy: {
        id: string;
        name: string | null;
        email: string | null;
        emailVerified: Date | null;
        image: string | null;
        password: string | null;
        role: "USER";
        isTwoFactorEnabled: boolean;
        verified: boolean;
    };
};