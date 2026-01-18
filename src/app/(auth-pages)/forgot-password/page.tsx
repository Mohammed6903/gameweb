import { forgotPasswordAction } from "@/lib/actions/auth-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <>
      <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        Forgot Password
      </h1>

      <Card className="w-full border border-border/50 bg-card/60 text-foreground shadow-lg shadow-black/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground/90">
            Reset Your Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input name="email" placeholder="you@example.com" required style={{color: "black"}} className="bg-background/60 border-border/60 focus-visible:ring-ring" />
            </div>
            <SubmitButton
              formAction={forgotPasswordAction}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Reset Password
            </SubmitButton>
          </form>
          <FormMessage message={searchParams} />
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link className="text-primary hover:text-primary/80 underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
      {/* <SmtpMessage /> */}
    </>
  );
}