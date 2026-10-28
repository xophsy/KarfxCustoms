import { Loader2 } from "lucide-react";

// Shows the moment an admin link is tapped, while the page loads from the server.
export default function AdminLoading() {
  return (
    <div role="status" className="flex items-center gap-3 py-10 text-sm text-white/50">
      <Loader2 size={18} className="animate-spin text-gold-500" aria-hidden="true" />
      Loading…
    </div>
  );
}
