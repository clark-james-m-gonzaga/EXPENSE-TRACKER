<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Expenses/Index', [
            'expenses' => $request->user()->expenses()->latest('expense_date')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string|max:100',
            'expense_date' => 'required|date',
        ]);

        $request->user()->expenses()->create($data);

        return back();
    }

    public function destroy(Expense $expense)
    {
        abort_if($expense->user_id !== auth()->id(), 403);
        $expense->delete();

        return back();
    }
}