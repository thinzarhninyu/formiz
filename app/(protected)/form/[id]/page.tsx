import { FormView } from "@/app/(protected)/_components/form-view";
import { getFormById, getFormQuestions, getFormResponseByUser } from "@/data/form";
import { currentUser } from "@/lib/auth";

const ViewFormPage: React.FC<{ params: { id: string } }> = async ({ params }) => {

    const user = await currentUser();

    if (!user) {
        return (
            <main className="w-full min-h-screen items-center justify-center px-10 py-10 sm:px-24 text-center">
                Unauthorized
            </main>
        );
    }

    const form = await getFormById(params.id);

    if (!form) {
        return <div>Form not found</div>;
    }

    const questions = await getFormQuestions(params.id);

    if (!questions) {
        return <div>Questions not found</div>;
    }

    const responses = await getFormResponseByUser(params.id, user.id!);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between pt-10 px-10 pb-20 sm:px-20 sm:pb-24">
            <FormView form={form} formQuestions={questions} formResponses={responses} type="view" />
        </main>
    )
}

export default ViewFormPage;