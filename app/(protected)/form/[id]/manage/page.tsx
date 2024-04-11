import { ViewForm } from "@/app/(protected)/_components/form";
import { getFormById, getFormQuestions, getFormResponses } from "@/data/form";
import { currentUser } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FormResponses from "@/app/(protected)/_components/form-responses";
import FormQuestions from "@/app/(protected)/_components/form-questions";

const ManageFormPage: React.FC<{ params: { id: string } }> = async ({ params }) => {

    const user = await currentUser();

    if (!user) {
        return <div>Unauthorized</div>;
    }

    const form = await getFormById(params.id);

    if (!form) {
        return <div>Form not found</div>;
    }

    if (form.createdById !== user.id) {
        return <div>Unauthorized</div>;
    }

    const questions = await getFormQuestions(params.id);

    if (!questions) {
        return <div>Questions not found</div>;
    }

    const responses = await getFormResponses(params.id);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between px-10 py-10 sm:px-24">
            <Tabs defaultValue="edit">
                <TabsList className="flex flex-row justify-center">
                    <TabsTrigger value="edit">Edit Form</TabsTrigger>
                    <TabsTrigger value="view">Preview Form</TabsTrigger>
                    <TabsTrigger value="responses">Responses</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                    <FormQuestions form={form} formQuestions={questions} />
                </TabsContent>
                <TabsContent value="view">
                    <ViewForm form={form} formQuestions={questions} type="manage" />
                </TabsContent>
                <TabsContent value="responses">
                    {responses &&
                        <FormResponses
                            form={form}
                            formQuestions={questions}
                            formResponses={responses}
                        />
                    }
                </TabsContent>
            </Tabs>
        </main>
    )
}

export default ManageFormPage;