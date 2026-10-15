import { Head, Link } from '@inertiajs/react';

const btnPrimary =
    'rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950';
const btnSecondary =
    'rounded-lg border border-stone-300 px-5 py-2.5 font-semibold text-stone-800 transition hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-stone-700 dark:text-stone-100 dark:hover:bg-stone-800';
const surface =
    'rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900';

const features = [
    {
        title: 'Log every expense',
        text: 'Add what you spent in seconds, with a category and date, and delete mistakes anytime.',
    },
    {
        title: 'Stay within budget',
        text: 'Set a monthly limit and watch the bar change color as you get close to it.',
    },
    {
        title: 'See where it goes',
        text: 'Colored categories and a monthly summary show which habits cost the most.',
    },
];

const sample = [
    ['Food', '#ea580c', 42],
    ['Transport', '#2563eb', 23],
    ['Bills', '#dc2626', 20],
    ['Shopping', '#9333ea', 15],
];

function Logo({ className }) {
    return (
        <img
            src="/logo.webp"
            alt="College of Computer Studies logo"
            className={className}
            onError={(e) => (e.currentTarget.style.display = 'none')}
        />
    );
}

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Expense Tracker" />
            <div className="min-h-screen bg-stone-100 text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
                <header className="border-b border-stone-200 bg-white/80 backdrop-blur dark:border-stone-800 dark:bg-stone-900/80">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-6">
                        <div className="flex items-center gap-2.5">
                            <Logo className="size-9 rounded-full object-cover" />
                            <span className="text-lg font-semibold tracking-tight">Expense Tracker</span>
                        </div>
                        <nav className="flex items-center gap-2">
                            {auth?.user ? (
                                <>
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        Open tracker
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                                    >
                                        Log out
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-5 sm:px-6">
                    {/* Hero */}
                    <section className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
                        <div>
                            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                                Know where your money goes.
                            </h1>
                            <p className="mt-4 max-w-md text-lg text-stone-600 dark:text-stone-400">
                                Track your daily expenses, set a monthly budget, and see your spending by
                                category, all in one simple place.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                {auth?.user ? (
                                    <Link href={route('dashboard')} className={btnPrimary}>
                                        Open your tracker
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('register')} className={btnPrimary}>
                                            Create free account
                                        </Link>
                                        <Link href={route('login')} className={btnSecondary}>
                                            Log in
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Sample preview */}
                        <div className={surface + ' p-6 sm:p-7'} aria-hidden="true">
                            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                Spent this month
                            </p>
                            <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight">₱12,480.00</p>

                            <div className="mt-5 flex h-3 gap-0.5 overflow-hidden rounded-full">
                                {sample.map(([name, color, pct]) => (
                                    <div key={name} style={{ width: `${pct}%`, backgroundColor: color }} />
                                ))}
                            </div>
                            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                {sample.map(([name, color, pct]) => (
                                    <li key={name} className="flex items-center gap-2">
                                        <span
                                            className="size-2 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                        {name}
                                        <span className="text-stone-500 dark:text-stone-400">{pct}%</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6">
                                <div className="h-3 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                                    <div className="h-3 w-[62%] rounded-full bg-emerald-600" />
                                </div>
                                <p className="mt-2 flex justify-between text-sm tabular-nums">
                                    <span className="font-medium">₱7,520.00 left</span>
                                    <span className="text-stone-500 dark:text-stone-400">62% of ₱20,000</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="grid gap-4 pb-16 sm:grid-cols-3">
                        {features.map((f) => (
                            <div key={f.title} className={surface + ' p-6'}>
                                <h2 className="text-base font-semibold">{f.title}</h2>
                                <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                                    {f.text}
                                </p>
                            </div>
                        ))}
                    </section>
                </main>

                <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500 dark:border-stone-800 dark:text-stone-400">
                    College of Computer Studies · Central Philippines State University
                </footer>
            </div>
        </>
    );
}