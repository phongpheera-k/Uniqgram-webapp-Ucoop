import { MAIN } from "@/components/ui/styles";
import { TopBar } from "@/components/layout/top-bar";
import { requireUser } from "@/lib/auth/session";
import { IdleGuard } from "@/features/auth/components/idle-guard";
import { buildShellModel } from "@/features/shell/server/shell-queries";

/** Authenticated application shell (SHL-01): one frame; only the content area changes. */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const model = buildShellModel(user);
  return (
    <>
      <TopBar model={model} />
      <main className={MAIN} id="main">{children}</main>
      <IdleGuard idleMinutes={model.idleMinutes} />
    </>
  );
}
