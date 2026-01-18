import { resetPasswordAction } from "@/lib/actions/authActions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="p-6 space-y-6 bg-white">
      <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
        Reset Password
      </h1>

      <Card className="bg-gray-50 border-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Update Your Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Please enter and confirm your new password below.
          </p>
          <form className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="New password"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                required
              />
            </div>
            {/* Centered Button */}
            <div className="flex justify-start">
              <SubmitButton
                formAction={resetPasswordAction}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-md"
              >
                Reset Password
              </SubmitButton>
            </div>
          </form>
          <FormMessage message={searchParams} />
        </CardContent>
      </Card>
    </div>
  );
}
