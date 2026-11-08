"use client";

import { ErrorState } from "@/components/feedback/error-state";
import { MAIN } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className={cn(MAIN, "max-w-[720px] pt-20")}>
      <ErrorState reset={reset} digest={error.digest} />
    </main>
  );
}
