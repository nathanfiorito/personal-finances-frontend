import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/use-auth";
import { ApiError } from "@/lib/api/types";
import { loginSchema, type LoginFormValues } from "./login-schema";

export interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await login(values);
      if (onSuccess) {
        onSuccess();
      } else {
        const next = searchParams.get("next");
        navigate(next ?? "/", { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {serverError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Sign in failed</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <Field data-invalid={errors.email ? "true" : undefined}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? "true" : undefined}
            {...register("email")}
          />
          <FieldError errors={errors.email ? [{ message: errors.email.message }] : undefined} />
        </Field>

        <Field data-invalid={errors.password ? "true" : undefined}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? "true" : undefined}
            {...register("password")}
          />
          <FieldDescription>
            Forgot your password?{" "}
            <Link to="#" className="text-primary underline-offset-4 hover:underline">
              Reset it
            </Link>
          </FieldDescription>
          <FieldError
            errors={errors.password ? [{ message: errors.password.message }] : undefined}
          />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" /> Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
