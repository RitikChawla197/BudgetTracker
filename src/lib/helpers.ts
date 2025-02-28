import { SignUpFormData } from "@/components/SignUpForm";

export async function register({ email, password, username }: SignUpFormData) {
    const body = { username, password, email }
    try {
        const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`;
        const req = await fetch(reqUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if(req.status >= 200 && req.status < 300) {
            return req.json();
        } else {
            const error: { message: string } = await req.json();
            throw new Error(error.message);
        }
    } catch(err) {
        if(err instanceof Error) {
            throw new Error(err.message);
        }
    }
}