import { handleAuth } from "@/app/actions/handle-auth";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-2">Login</h1>

      <form action={handleAuth}>
        <button type="submit" className="border p-2 rounded-md">
          Signin with Google
        </button>
      </form>
    </div>
  );
}
