import { APP_DESCRIPTION, APP_NAME } from "@/data/constants"
import { LoginButton } from "./auth/login-button"

export const Landing: React.FC = () => {

    return (
        <main className="flex min-h-screen flex-col items-center justify-center pt-10 px-10 pb-20 sm:px-20 sm:pb-24 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Welcome to {APP_NAME}!</h1>
            <p className="my-10">{APP_DESCRIPTION}</p>
            <LoginButton />
        </main>
    )
}