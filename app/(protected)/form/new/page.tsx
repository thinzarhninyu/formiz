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
        <main className="flex min-h-screen flex-col items-center justify-between pt-10 px-10 pb-20 sm:px-20 sm:pb-24">
            <FormQuestions />
        </main>
    );
}

export default Form;