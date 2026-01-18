'use client'

import { useEffect, useState } from "react";
import { signUpAction } from "@/lib/actions/authActions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import Link from "next/link";
// import { SmtpMessage } from "../smtp-message";
import { AuthProviders } from "@/components/auth-providers";
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams, setSearchParams] = useState<Message | null>(null);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const response = await props.searchParams;
        setSearchParams(response);
      } catch (error) {
        console.error("Error fetching search params:", error);
      }
    }
    fetchParams();
  }, [props.searchParams]);

  if (searchParams && "message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        Sign Up
      </h1>

      <Card className="w-full border border-border/50 bg-card/60 text-foreground shadow-lg shadow-black/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground/90">
            Create Your Account
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground/80">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  placeholder="John" 
                  required 
                  className="bg-background/60 border-border/60 focus-visible:ring-ring text-foreground" 
                  style={{color: "black"}}
                />              
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground/80">Last Name</Label>
                <Input id="lastName" name="lastName" style={{color: "black"}} placeholder="Doe" required className="bg-background/60 border-border/60 focus-visible:ring-ring text-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input id="email" name="email" type="email" style={{color: "black"}} placeholder="you@example.com" required className="bg-background/60 border-border/60 focus-visible:ring-ring text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Your password"
                  minLength={6}
                  required
                  style={{color: "black"}}
                  className="bg-background/60 border-border/60 focus-visible:ring-ring pr-10 text-foreground"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-foreground/70"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground/80">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  minLength={6}
                  required
                  style={{color: "black"}}
                  className="bg-background/60 border-border/60 focus-visible:ring-ring pr-10 text-foreground"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-foreground/70"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <SubmitButton
              formAction={signUpAction}
              pendingText="Signing up..."
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Sign up
            </SubmitButton>
          </form>
          {searchParams && <FormMessage message={searchParams} />}
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
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