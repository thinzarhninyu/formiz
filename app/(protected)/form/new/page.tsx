import FormQuestions from "@/app/(protected)/_components/form-questions";
import { currentUser } from "@/lib/auth";

const Form: React.FC = async () => {

    const user = await currentUser();

    if (!user) {
        return (
            <main className="w-full min-h-screen items-center justify-center px-10 py-10 sm:px-24 text-center">
                Unauthorized
            </main>
        );
    }

    return (
        <main className="w-full max-w-3xl min-h-screen items-center justify-center px-10 py-10 sm:px-24">
            <FormQuestions />
        </main>
    );
}

export default Form;