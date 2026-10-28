"use client";

import { useFormStatus } from "react-dom";

// Changes the moment it's tapped, so a save that takes a second never looks like a dead button.
export default function SubmitButton({
  children,
  pendingLabel,
  className,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`${className ?? ""} disabled:opacity-60`}>
      {pending ? pendingLabel : children}
    </button>
  );
}
