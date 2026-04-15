import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  CategoryResponse,
  TransactionCreateRequest,
  TransactionResponse,
  TransactionUpdateRequest,
} from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";
import { todayIso } from "@/lib/format/format-date";
import { CategoryCombobox } from "@/features/categories/CategoryCombobox";
import { AmountInput } from "./AmountInput";
import { transactionFormSchema, type TransactionFormValues } from "./transaction-schema";

export interface TransactionFormProps {
  categories: CategoryResponse[];
  initial?: TransactionResponse;
  onSubmit: (
    values: TransactionCreateRequest | TransactionUpdateRequest
  ) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

function valuesFromTransaction(
  transaction: TransactionResponse | undefined
): TransactionFormValues {
  return {
    amount: transaction?.amount ?? "",
    category_id: transaction?.category_id ?? 0,
    transaction_type: transaction?.transaction_type ?? "expense",
    payment_method: transaction?.payment_method ?? "credit",
    date: transaction?.date ?? todayIso(),
    establishment: transaction?.establishment ?? "",
    description: transaction?.description ?? "",
  };
}

function toPayload(values: TransactionFormValues): TransactionCreateRequest {
  return {
    amount: values.amount,
    category_id: values.category_id,
    transaction_type: values.transaction_type,
    payment_method: values.payment_method,
    date: values.date,
    establishment: values.establishment ? values.establishment : undefined,
    description: values.description ? values.description : undefined,
    entry_type: "manual",
  };
}

export function TransactionForm({
  categories,
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: TransactionFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: valuesFromTransaction(initial),
    mode: "onTouched",
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    reset(valuesFromTransaction(initial));
  }, [initial, reset]);

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await onSubmit(toPayload(values));
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
    <form onSubmit={submit} noValidate className="space-y-5">
      {serverError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Save failed</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={errors.amount ? "true" : undefined}>
            <FieldLabel htmlFor="tx-amount">Amount</FieldLabel>
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <AmountInput
                  id="tx-amount"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="0,00"
                  aria-invalid={errors.amount ? "true" : undefined}
                />
              )}
            />
            <FieldError
              errors={errors.amount ? [{ message: errors.amount.message }] : undefined}
            />
          </Field>

          <Field data-invalid={errors.date ? "true" : undefined}>
            <FieldLabel htmlFor="tx-date">Date</FieldLabel>
            <Input
              id="tx-date"
              type="date"
              aria-invalid={errors.date ? "true" : undefined}
              {...register("date")}
            />
            <FieldError
              errors={errors.date ? [{ message: errors.date.message }] : undefined}
            />
          </Field>
        </div>

        <Field data-invalid={errors.category_id ? "true" : undefined}>
          <FieldLabel htmlFor="tx-category">Category</FieldLabel>
          <Controller
            control={control}
            name="category_id"
            render={({ field }) => (
              <CategoryCombobox
                id="tx-category"
                categories={categories}
                value={field.value || null}
                onChange={(next) => field.onChange(next ?? 0)}
                aria-invalid={errors.category_id ? "true" : undefined}
              />
            )}
          />
          <FieldError
            errors={
              errors.category_id ? [{ message: errors.category_id.message }] : undefined
            }
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="tx-type">Type</FieldLabel>
            <Controller
              control={control}
              name="transaction_type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="tx-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="tx-payment">Payment method</FieldLabel>
            <Controller
              control={control}
              name="payment_method"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="tx-payment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="tx-establishment">Establishment</FieldLabel>
          <Input
            id="tx-establishment"
            placeholder="e.g. Starbucks Paulista"
            {...register("establishment")}
          />
          <FieldDescription>Optional. Used as the row label when set.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="tx-description">Description</FieldLabel>
          <Textarea
            id="tx-description"
            rows={2}
            placeholder="Optional note"
            {...register("description")}
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
