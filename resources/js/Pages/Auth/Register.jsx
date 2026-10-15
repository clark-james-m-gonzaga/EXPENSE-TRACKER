import { Head, Link, useForm } from '@inertiajs/react';

const field =
    'w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 transition focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500';
const label = 'mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300';

const fields = [
    ['name', 'Name', 'text', 'name'],
    ['email', 'Email', 'email', 'username'],
    ['password', 'Password', 'password', 'new-password'],
    ['password_confirmation', 'Confirm password', 'password', 'new-password'],
];

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
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
                        <h1 className="text-xl font-semibold">Create your account</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Start tracking your expenses in a minute.
                        </p>
                    </div>

                    {fields.map(([key, text, type, auto]) => (
                        <div key={key}>
                            <label htmlFor={key} className={label}>
                                {text}
                            </label>
                            <input
                                id={key}
                                type={type}
                                className={field}
                                value={data[key]}
                                autoComplete={auto}
                                autoFocus={key === 'name'}
                                onChange={(e) => setData(key, e.target.value)}
                            />
                            {errors[key] && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[key]}</p>
                            )}
                        </div>
                    ))}

                    <button
                        disabled={processing}
                        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-stone-900"
                    >
                        {processing ? 'Creating account…' : 'Create account'}
                    </button>

                    <p className="text-center text-sm text-stone-600 dark:text-stone-400">
                        Already have an account?{' '}
                        <Link href={route('login')} className="font-medium text-emerald-700 underline dark:text-emerald-400">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}