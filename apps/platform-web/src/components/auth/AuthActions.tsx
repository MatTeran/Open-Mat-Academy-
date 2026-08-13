import { demoSignIn, liveSignIn, signOut } from '@/lib/auth/actions';

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
        Enter as platform ops (demo)
      </button>
    </form>
  );
}

export function LiveSignInForm({ error }: { error?: string | null }) {
  const message =
    error === 'auth'
      ? 'Email or password is incorrect.'
      : error === 'not_platform_admin'
        ? 'Signed in, but this account is not in platform_admins.'
        : error === 'missing'
          ? 'Email and password are required.'
          : null;

  return (
    <form action={liveSignIn} className="space-y-3">
      <input
        name="email"
        type="email"
        required
        autoComplete="username"
        placeholder="ops@yourdomain.com"
        className="w-full rounded-md border border-line bg-canvas px-3 py-2 text-sm"
      />
      <input
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="Password"
        className="w-full rounded-md border border-line bg-canvas px-3 py-2 text-sm"
      />
      {message ? <p className="text-sm text-danger">{message}</p> : null}
      <button
        type="submit"
        className="w-full rounded-md bg-pine px-4 py-3 text-sm font-semibold text-panel transition hover:bg-moss"
      >
        Sign in to Command Center
      </button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-mute underline-offset-4 hover:text-ink hover:underline"
      >
        Sign out
      </button>
    </form>
  );
}
