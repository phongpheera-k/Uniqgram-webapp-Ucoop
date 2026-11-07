"use client";

import { ErrorState } from "@/components/feedback/error-state";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="main" style={{ maxWidth: 720, paddingTop: 80 }}>
      <ErrorState reset={reset} digest={error.digest} />
    </main>
  );
}
