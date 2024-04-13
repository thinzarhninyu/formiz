import { FormView } from "@/app/(protected)/_components/form-view";
import { getFormById, getFormQuestions, getFormResponseByUser } from "@/data/form";
import { currentUser } from "@/lib/auth";

const ViewFormPage: React.FC<{ params: { id: string } }> = async ({ params }) => {

    const user = await currentUser();

    if (!user) {
        return <div>Unauthorized</div>;
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
        <main className="w-full max-w-3xl min-h-screen items-center justify-center px-10 py-10 sm:px-24">
            <FormView form={form} formQuestions={questions} formResponses={responses} type="view" />
        </main>
    )
}

export default ViewFormPage;