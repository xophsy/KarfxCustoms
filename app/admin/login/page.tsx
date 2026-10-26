import { DEMO } from "@/lib/admin/db";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return <LoginForm demo={DEMO} />;
}
