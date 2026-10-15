import { Head, Link, useForm } from '@inertiajs/react';

const field =
    'w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 transition focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500';
const label = 'mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100 px-5 py-10 text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
                <Link href="/" className="mb-7 flex flex-col items-center gap-3">
                    <img
                        src="/logo.webp"
                        alt="College of Computer Studies logo"
                        className="size-24 rounded-full object-cover shadow-md"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <span className="text-2xl font-bold tracking-tight">Expense Tracker</span>
                </Link>

                <form
                    onSubmit={submit}
                    className="w-full max-w-md space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8"
                >
                    <div>
                        <h1 className="text-xl font-semibold">Welcome back</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Log in to see your expenses.
                        </p>
                    </div>

                    {status && (
                        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            {status}
                        </p>
                    )}

                    <div>
                        <label htmlFor="email" className={label}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={field}
                            value={data.email}
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className={label}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={field}
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="size-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-600"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            Remember me
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-stone-600 underline hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <button
                        disabled={processing}
                        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-stone-900"
                    >
                        {processing ? 'Logging in…' : 'Log in'}
                    </button>

                    <p className="text-center text-sm text-stone-600 dark:text-stone-400">
                        New here?{' '}
                        <Link href={route('register')} className="font-medium text-emerald-700 underline dark:text-emerald-400">
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}