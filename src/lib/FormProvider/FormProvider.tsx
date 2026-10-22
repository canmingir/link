import { FormProvider as Form } from "react-hook-form";

import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { FormEventHandler, ReactNode } from "react";

export default function FormProvider({
  children,
  onSubmit,
  methods,
}: {
  children?: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  methods: UseFormReturn<FieldValues>;
}) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
