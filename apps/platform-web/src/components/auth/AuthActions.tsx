import { demoSignIn, demoSignOut } from '@/lib/auth/actions';

export function BrandMark() {
  return (
    <div>
      <p className="font-display text-3xl tracking-tight text-pine">My Gi</p>
      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-mute">
        Command Center
      </p>
    </div>
  );
}

export function SignInButton() {
  return (
    <form action={demoSignIn}>
      <button
        type="submit"
        className="w-full rounded-md bg-pine px-4 py-3 text-sm font-semibold text-panel transition hover:bg-moss"
      >
        Enter as platform ops
      </button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form action={demoSignOut}>
      <button
        type="submit"
        className="text-sm text-mute underline-offset-4 hover:text-ink hover:underline"
      >
        Sign out
      </button>
    </form>
  );
}
