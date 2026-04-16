import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cardFormSchema, type CardFormValues } from "./card-schema";
import { BankCombobox } from "./BankCombobox";

export interface CardFormProps {
  initial?: CardFormValues;
  onSubmit: (values: CardFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
  isPending?: boolean;
  serverError?: string | null;
}

const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => i + 1);

const DEFAULT_VALUES: CardFormValues = {
  alias: "",
  bank: "",
  last_four_digits: "",
  closing_day: 1,
  due_day: 10,
};

function valuesFrom(initial: CardFormValues | undefined): CardFormValues {
  return initial ?? DEFAULT_VALUES;
}

export function CardForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
  isPending,
  serverError,
}: CardFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: valuesFrom(initial),
    mode: "onTouched",
  });

  useEffect(() => {
    reset(valuesFrom(initial));
  }, [initial, reset]);

  const submit = handleSubmit((values) => {
    onSubmit(values);
  });

  const pending = isPending ?? isSubmitting;

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
        {/* Alias */}
        <Field data-invalid={errors.alias ? "true" : undefined}>
          <FieldLabel htmlFor="card-alias">Alias</FieldLabel>
          <Input
            id="card-alias"
            autoFocus
            placeholder="e.g. Nubank Personal"
            aria-invalid={errors.alias ? "true" : undefined}
            {...register("alias")}
          />
          <FieldError
            errors={errors.alias ? [{ message: errors.alias.message }] : undefined}
          />
        </Field>

        {/* Bank */}
        <Field data-invalid={errors.bank ? "true" : undefined}>
          <FieldLabel htmlFor="card-bank">Bank</FieldLabel>
          <Controller
            name="bank"
            control={control}
            render={({ field }) => (
              <BankCombobox
                id="card-bank"
                value={field.value}
                onChange={field.onChange}
                aria-invalid={errors.bank ? "true" : undefined}
              />
            )}
          />
          <FieldError
            errors={errors.bank ? [{ message: errors.bank.message }] : undefined}
          />
        </Field>

        {/* Last 4 digits */}
        <Field data-invalid={errors.last_four_digits ? "true" : undefined}>
          <FieldLabel htmlFor="card-last-four">Last 4 digits</FieldLabel>
          <Input
            id="card-last-four"
            placeholder="1234"
            maxLength={4}
            inputMode="numeric"
            pattern="[0-9]*"
            aria-invalid={errors.last_four_digits ? "true" : undefined}
            {...register("last_four_digits")}
          />
          <FieldError
            errors={
              errors.last_four_digits
                ? [{ message: errors.last_four_digits.message }]
                : undefined
            }
          />
        </Field>

        {/* Closing day + Due day (2-column grid) */}
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={errors.closing_day ? "true" : undefined}>
            <FieldLabel htmlFor="card-closing-day">Closing day</FieldLabel>
            <Controller
              name="closing_day"
              control={control}
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger
                    id="card-closing-day"
                    className="w-full"
                    aria-invalid={errors.closing_day ? "true" : undefined}
                  >
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAY_OPTIONS.map((d) => (
                      <SelectItem key={d} value={String(d)}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError
              errors={
                errors.closing_day ? [{ message: errors.closing_day.message }] : undefined
              }
            />
          </Field>

          <Field data-invalid={errors.due_day ? "true" : undefined}>
            <FieldLabel htmlFor="card-due-day">Due day</FieldLabel>
            <Controller
              name="due_day"
              control={control}
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger
                    id="card-due-day"
                    className="w-full"
                    aria-invalid={errors.due_day ? "true" : undefined}
                  >
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAY_OPTIONS.map((d) => (
                      <SelectItem key={d} value={String(d)}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError
              errors={errors.due_day ? [{ message: errors.due_day.message }] : undefined}
            />
          </Field>
        </div>
      </FieldGroup>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="animate-spin" /> Saving…
            </>
          ) : (
            submitLabel ?? "Save"
          )}
        </Button>
      </div>
    </form>
  );
}
