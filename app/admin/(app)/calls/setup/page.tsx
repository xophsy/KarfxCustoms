import Link from "next/link";
import CopyButton from "@/components/admin/CopyButton";
import { requireUser } from "@/lib/admin/session";
import { ANALYSIS_FIELDS, buildAgentPrompt } from "@/lib/phone/agent";

const WEBHOOK_URL = "https://karfxcustoms.com/api/phone/retell";
const term = "text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45";

// Everything to paste into Retell, generated from the website's data so it is always current.
export default async function PhoneSetupPage() {
  await requireUser("owner");
  const prompt = buildAgentPrompt();

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <Link href="/admin/calls" className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-gold-500">
          ← Calls
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">AI phone setup</h1>
        <p className="mt-2 max-w-prose text-sm text-white/55">
          What to paste into the Retell agent. Copy it again after changing services on the website.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className={term}>1 · Webhook URL</h2>
        <p className="flex flex-wrap items-center gap-2 text-sm">
          <code className="break-all text-white">{WEBHOOK_URL}</code>
          <CopyButton text={WEBHOOK_URL} />
        </p>
      </section>

      <section className="space-y-2">
        <h2 className={term}>2 · Data storage</h2>
        <p className="text-sm text-white/80">Set data storage to keep everything, and leave secure (expiring) URLs off, so recordings keep playing here.</p>
      </section>

      <section className="space-y-3">
        <h2 className={term}>3 · Post-call fields</h2>
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {ANALYSIS_FIELDS.map((field) => (
            <li key={field.name} className="space-y-1 py-3 text-sm">
              <p>
                <code className="font-semibold text-white">{field.name}</code>
                <span className="ml-2 text-white/45">{field.type}</span>
              </p>
              {field.choices && <p className="text-white/55">Choices: {field.choices.join(", ")}</p>}
              <p className="text-white/70">{field.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className={term}>4 · Agent instructions</h2>
          <CopyButton text={prompt} />
        </div>
        <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap border border-white/10 bg-surface-800 p-4 text-sm leading-relaxed text-white/80">
          {prompt}
        </pre>
      </section>
    </div>
  );
}
