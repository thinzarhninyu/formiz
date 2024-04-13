import { ViewForm } from "@/app/(protected)/_components/form";
import { getFormById, getFormQuestions, getFormResponses } from "@/data/form";
import { currentUser } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FormResponses from "@/app/(protected)/_components/form-responses";
import FormQuestions from "@/app/(protected)/_components/form-questions";
import { ShareCard } from "@/app/(protected)/_components/share-card";

const ManageFormPage: React.FC<{ params: { id: string } }> = async ({ params }) => {

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

    if (form.createdById !== user.id) {
        return (
            <main className="w-full min-h-screen items-center justify-center px-10 py-10 sm:px-24 text-center">
                Unauthorized
            </main>
        );
    }

    const questions = await getFormQuestions(params.id);

    if (!questions) {
        return <div>Questions not found</div>;
    }

    const responses = await getFormResponses(params.id);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between pt-10 px-10 pb-20 sm:px-20 sm:pb-24">
            <Tabs defaultValue="edit">
                <TabsList className="flex flex-row justify-center">
                    <TabsTrigger value="edit">Edit Form</TabsTrigger>
                    <TabsTrigger value="view">Preview Form</TabsTrigger>
                    <TabsTrigger value="responses">Responses</TabsTrigger>
                    <TabsTrigger value="share">Share</TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="w-full sm:min-w-[400px]">
                    <FormQuestions form={form} formQuestions={questions} />
                </TabsContent>
                <TabsContent value="view" className="w-full sm:min-w-[400px]">
                    <ViewForm form={form} formQuestions={questions} type="manage" />
                </TabsContent>
                <TabsContent value="responses" className="w-full sm:min-w-[400px]">
                    {responses &&
                        <FormResponses
                            form={form}
                            formQuestions={questions}
                            formResponses={responses}
                        />
                    }
                </TabsContent>
                <TabsContent value="share" className="w-full sm:min-w-[400px]">
                    <ShareCard form={form} />
                </TabsContent>
            </Tabs>
        </main>
    )
}

export default ManageFormPage;