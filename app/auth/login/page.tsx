import { CardWrapper } from "@/components/auth/card-wrapper";
import { SocialLogin } from "@/components/auth/social-login"

const Login: React.FC = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-10 pb-20 sm:px-24 sm:pb-24">
            <CardWrapper
                headerLabel="Welcome!"
                showSocial
            >
                <SocialLogin />
            </CardWrapper>
        </main>
    )
}

export default Login;