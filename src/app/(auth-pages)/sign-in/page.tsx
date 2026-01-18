import { signInAction } from "@/lib/actions/auth-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { AuthProviders } from "@/components/auth-providers";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <>
      <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        Sign In
      </h1>

      <Card className="w-full border border-border/50 bg-card/60 text-foreground shadow-lg shadow-black/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground/90">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AuthProviders />
            <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
              Or continue with
              </span>
            </div>
            </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input name="email" placeholder="you@example.com" required className="bg-background/60 border-border/60 focus-visible:ring-ring" autoComplete="on" style={{color: "black"}}/>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-foreground/80">Password</Label>
                <Link
                  className="text-xs text-primary hover:text-primary/80 underline"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                required
                className="bg-background/60 border-border/60 focus-visible:ring-ring"
                autoComplete="on"
                style={{color: "black"}}
              />
            </div>
            <SubmitButton
              pendingText="Signing In..."
              formAction={signInAction}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Sign in
            </SubmitButton>
          </form>
          <FormMessage message={searchParams} />
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link className="text-primary hover:text-primary/80 underline" href="/sign-up">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </>
  );
}