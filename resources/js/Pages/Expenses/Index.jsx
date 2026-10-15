import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const CATEGORY_COLORS = {
    Food: '#ea580c',
    Transport: '#2563eb',
    Bills: '#dc2626',
    Shopping: '#9333ea',
    Health: '#0d9488',
    Other: '#78716c',
};
const CATEGORIES = Object.keys(CATEGORY_COLORS);
const BUDGET_KEY = 'expense-monthly-budget';

const today = () => new Date().toISOString().slice(0, 10);
const peso = (n) =>
    '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const input =
    'w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100';
const card = 'rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900';
const muted = 'text-stone-600 dark:text-stone-400';

function Dot({ category }) {
    return (
        <span
            className="inline-block size-2.5 rounded-full"
            style={{ backgroundColor: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other }}
        />
    );
}

export default function Index({ expenses }) {
    const { auth } = usePage().props;
    const [month, setMonth] = useState(today().slice(0, 7));
    const [budget, setBudget] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        amount: '',
        category: 'Food',
        expense_date: today(),
    });

    // Load the saved budget from this browser
    useEffect(() => {
        try {
            const saved = localStorage.getItem(BUDGET_KEY);
            if (saved) setBudget(saved);
        } catch (e) {
            // storage unavailable
        }
    }, []);

    const changeBudget = (value) => {
        setBudget(value);
        try {
            localStorage.setItem(BUDGET_KEY, value);
        } catch (e) {
            // ignore
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post('/expenses', { preserveScroll: true, onSuccess: () => reset('title', 'amount') });
    };

    const remove = (id) => {
        if (confirm('Delete this expense?')) router.delete(`/expenses/${id}`, { preserveScroll: true });
    };

    const visible = useMemo(
        () => expenses.filter((e) => !month || e.expense_date.startsWith(month)),
        [expenses, month],
    );
    const total = visible.reduce((sum, e) => sum + Number(e.amount), 0);
    const average = visible.length ? total / visible.length : 0;

    const byCategory = useMemo(() => {
        const map = {};
        visible.forEach((e) => (map[e.category] = (map[e.category] || 0) + Number(e.amount)));
        return Object.entries(map).sort((a, b) => b[1] - a[1]);
    }, [visible]);

    const topCategory = byCategory[0];

    // Budget numbers
    const budgetNum = parseFloat(budget) || 0;
    const percent = budgetNum > 0 ? (total / budgetNum) * 100 : 0;
    const overBudget = budgetNum > 0 && total > budgetNum;
    const barColor = overBudget ? '#dc2626' : percent >= 75 ? '#d97706' : '#059669';

    return (
        <>
            <Head title="Expense Tracker" />
            <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
                <div className="mx-auto max-w-5xl px-6">
                    <header className="flex items-center justify-between py-6">
                        <span className="text-xl font-bold tracking-tight">Expense Tracker</span>
                        <nav className="flex items-center gap-2">
                            <span className={muted}>Hi, {auth.user.name}</span>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="rounded-md px-3 py-2 text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-white"
                            >
                                Log out
                            </Link>
                        </nav>
                    </header>

                    {/* Total and month filter */}
                    <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className={'text-sm ' + muted}>Spent {month ? 'this month' : 'in total'}</p>
                            <p className="text-5xl font-bold tabular-nums tracking-tight">{peso(total)}</p>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="month"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className={input}
                            />
                            <button
                                type="button"
                                onClick={() => setMonth('')}
                                className="whitespace-nowrap rounded-md border border-stone-300 px-3 dark:border-stone-700"
                            >
                                All time
                            </button>
                        </div>
                    </section>

                    {/* Summary cards */}
                    <section className="mb-6 grid gap-4 sm:grid-cols-3">
                        <div className={card}>
                            <p className={'text-sm ' + muted}>Expenses</p>
                            <p className="mt-1 text-2xl font-semibold tabular-nums">{visible.length}</p>
                        </div>
                        <div className={card}>
                            <p className={'text-sm ' + muted}>Average per expense</p>
                            <p className="mt-1 text-2xl font-semibold tabular-nums">{peso(average)}</p>
                        </div>
                        <div className={card}>
                            <p className={'text-sm ' + muted}>Top category</p>
                            {topCategory ? (
                                <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
                                    <Dot category={topCategory[0]} />
                                    {topCategory[0]}
                                </p>
                            ) : (
                                <p className={'mt-1 text-2xl font-semibold ' + muted}>None yet</p>
                            )}
                        </div>
                    </section>

                    {/* Budget */}
                    <section className={card + ' mb-8'}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold">Monthly budget</h2>
                            <div className="flex items-center gap-2">
                                <label htmlFor="budget" className={'text-sm ' + muted}>
                                    Limit (₱)
                                </label>
                                <input
                                    id="budget"
                                    type="number"
                                    min="0"
                                    step="100"
                                    placeholder="e.g. 10000"
                                    value={budget}
                                    onChange={(e) => changeBudget(e.target.value)}
                                    className={input + ' !w-36'}
                                />
                            </div>
                        </div>

                        {budgetNum > 0 && month ? (
                            <div className="mt-4">
                                <div className="h-3 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                                    <div
                                        className="h-3 rounded-full"
                                        style={{ width: `${Math.min(100, percent)}%`, backgroundColor: barColor }}
                                    />
                                </div>
                                <p className="mt-2 text-sm tabular-nums" style={{ color: overBudget ? barColor : undefined }}>
                                    {overBudget
                                        ? `Over budget by ${peso(total - budgetNum)}`
                                        : `${peso(budgetNum - total)} left of ${peso(budgetNum)} (${Math.round(percent)}% used)`}
                                </p>
                            </div>
                        ) : (
                            <p className={'mt-3 text-sm ' + muted}>
                                {month
                                    ? 'Set a monthly limit to see how much you have left.'
                                    : 'Pick a month above to see your budget progress.'}
                            </p>
                        )}
                    </section>

                    <div className="grid gap-8 pb-16 lg:grid-cols-[320px_1fr]">
                        <div className="space-y-8">
                            <form onSubmit={submit} className={card + ' space-y-3'}>
                                <h2 className="text-lg font-semibold">Add expense</h2>
                                <input
                                    className={input}
                                    placeholder="What did you spend on?"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                                <input
                                    className={input}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Amount (₱)"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                />
                                {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                                <select
                                    className={input}
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                >
                                    {CATEGORIES.map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                                <input
                                    className={input}
                                    type="date"
                                    value={data.expense_date}
                                    onChange={(e) => setData('expense_date', e.target.value)}
                                />
                                <button
                                    disabled={processing}
                                    className="w-full rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                                >
                                    Add expense
                                </button>
                            </form>

                            <div className={card}>
                                <h2 className="mb-3 text-lg font-semibold">By category</h2>
                                {byCategory.length === 0 ? (
                                    <p className={'text-sm ' + muted}>Your category totals show up here.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {byCategory.map(([cat, amt]) => (
                                            <li key={cat}>
                                                <div className="mb-1 flex justify-between text-sm">
                                                    <span className="flex items-center gap-2">
                                                        <Dot category={cat} />
                                                        {cat}
                                                    </span>
                                                    <span className="tabular-nums">{peso(amt)}</span>
                                                </div>
                                                <div className="h-2 rounded bg-stone-200 dark:bg-stone-800">
                                                    <div
                                                        className="h-2 rounded"
                                                        style={{
                                                            width: `${(amt / total) * 100}%`,
                                                            backgroundColor:
                                                                CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other,
                                                        }}
                                                    />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className={card + ' !p-0'}>
                            <h2 className="border-b border-stone-200 p-5 text-lg font-semibold dark:border-stone-800">
                                Expenses
                            </h2>
                            {visible.length === 0 ? (
                                <div className="flex flex-col items-center gap-3 p-10 text-center">
                                    <svg
                                        className="size-10 text-stone-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                                        />
                                    </svg>
                                    <p className="font-medium">No expenses for this period</p>
                                    <p className={'text-sm ' + muted}>Add your first expense using the form.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className={'text-sm ' + muted}>
                                            <tr>
                                                <th className="px-5 py-3 font-medium">Date</th>
                                                <th className="px-5 py-3 font-medium">Title</th>
                                                <th className="px-5 py-3 font-medium">Category</th>
                                                <th className="px-5 py-3 text-right font-medium">Amount</th>
                                                <th className="px-5 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visible.map((e) => (
                                                <tr key={e.id} className="border-t border-stone-100 dark:border-stone-800">
                                                    <td className="whitespace-nowrap px-5 py-3">
                                                        {e.expense_date.slice(0, 10)}
                                                    </td>
                                                    <td className="px-5 py-3">{e.title}</td>
                                                    <td className="px-5 py-3">
                                                        <span className="flex items-center gap-2">
                                                            <Dot category={e.category} />
                                                            {e.category}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums">
                                                        {peso(e.amount)}
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        <button
                                                            onClick={() => remove(e.id)}
                                                            className="text-sm text-red-600 hover:underline dark:text-red-400"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}