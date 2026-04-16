import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CategoryResponse } from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";
import { categoryFormSchema, type CategoryFormValues } from "./category-schema";

export interface CategoryFormProps {
  initial?: CategoryResponse;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

function valuesFrom(category: CategoryResponse | undefined): CategoryFormValues {
  return { name: category?.name ?? "" };
}

export function CategoryForm({ initial, onSubmit, onCancel, submitLabel }: CategoryFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: valuesFrom(initial),
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    reset(valuesFrom(initial));
  }, [initial, reset]);

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      if (err instanceof ApiError || err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {serverError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Save failed</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <Field data-invalid={errors.name ? "true" : undefined}>
          <FieldLabel htmlFor="category-name">Name</FieldLabel>
          <Input
            id="category-name"
            autoFocus
            placeholder="e.g. Alimentação"
            aria-invalid={errors.name ? "true" : undefined}
            {...register("name")}
          />
          <FieldError
            errors={errors.name ? [{ message: errors.name.message }] : undefined}
          />
        </Field>
      </FieldGroup>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> Saving…
            </>
          ) : (
            (submitLabel ?? "Save")
          )}
        </Button>
      </div>
    </form>
  );
}
