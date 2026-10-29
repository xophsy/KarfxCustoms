import { createHmac } from "node:crypto";

// Signs a body the way Retell signs its webhooks, so tests can send "real" requests.
export function signRetell(body: string, apiKey: string, timestamp = Date.now()): string {
  return `v=${timestamp},d=${createHmac("sha256", apiKey).update(body + timestamp).digest("hex")}`;
}

// A full call_analyzed call object; `custom` overrides single post-call fields.
export function retellCall({ custom = {}, ...overrides }: { custom?: Record<string, unknown> } & Record<string, unknown> = {}) {
  return {
    call_id: "call_a",
    from_number: "+19195550142",
    to_number: "+19845550100",
    transcript: "Agent: Hi\nUser: Hi",
    transcript_object: [
      { role: "agent", content: "Hi" },
      { role: "user", content: "Hi" },
    ],
    recording_url: "https://retell.example/rec.wav",
    start_timestamp: 1_800_000_000_000,
    end_timestamp: 1_800_000_090_000,
    call_analysis: {
      call_summary: "Wants PPF.",
      custom_analysis_data: {
        caller_name: "Jordan Pierce",
        callback_number: "",
        vehicle: "2025 Porsche 911",
        service_keys: "protection/ppf",
        timeframe: "Next week",
        call_type: "inquiry",
        urgent: false,
        ...custom,
      },
    },
    ...overrides,
  };
}
