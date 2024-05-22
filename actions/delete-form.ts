"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const DeleteForm = async (id: string) => {

    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" }
    }

    const form = await db.form.delete({
        where: {
            id,
        },
    });

    if (!form) {
        return { error: "Failed to create form!" };
    }

    return { success: "Form deleted!", id };

};
