import { getForms } from "@/data/form";
import { currentUser } from "@/lib/auth";
import { FormCard } from "./(protected)/_components/form-card";
import Link from "next/link";
import { Landing } from "@/components/landing";

const Home: React.FC = async () => {

  const user = await currentUser();

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between pt-10 px-10 pb-20 sm:px-20 sm:pb-24">
        <Landing />
      </main>
    );
  }

  const forms = await getForms(user.id!);

  return (
    <main className="min-h-screen flex-col items-center justify-between px-10 pb-20 sm:px-16 sm:pb-24">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-left mt-16">
          <h2 className="mt-6 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl lg:text-2xl text-center">Forms</h2>
        </div>
        <div className="flex flex-wrap mt-5 gap-y-3">
          {forms && forms.length > 0 ? forms.map((form) => (
            <div key={form.id} className="w-full sm:w-full md:w-full lg:w-1/3 px-0 lg:px-2 py-2">
              <FormCard form={form} role={user.id === form.createdById ? "creator" : "user"} />
            </div>
          )) : (
            <div className="flex justify-center items-center mx-auto">
              <Link href="/form/new" className="inline-flex justify-center items-center px-4 py-2 outline outline-offset-2 outline-1 font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:underline">Create New Form</Link>
            </div>
          )}
        </div>
      </div>
    </main >
  );
}

export default Home;