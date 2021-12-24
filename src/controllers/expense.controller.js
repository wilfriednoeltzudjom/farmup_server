const buildCreateExpenseUseCase = require('../use_cases/expenses/create-expense.usecase');
const buildUpdateExpenseUseCase = require('../use_cases/expenses/update-expense.usecase');
const buildGetExpensesUseCase = require('../use_cases/expenses/get-expenses.usecase');
const buildGetExpenseUseCase = require('../use_cases/expenses/get-expense.usecase');
const buildDeleteExpenseUseCase = require('../use_cases/expenses/delete-expense.usecase');
const HttpResponse = require('../application/payloads/http-response');
const { expenseMessages } = require('../application/messages');

module.exports = function buildExpenseController(dependencies) {
  const createExpenseUseCase = buildCreateExpenseUseCase(dependencies);
  const updateExpenseUseCase = buildUpdateExpenseUseCase(dependencies);
  const getExpensesUseCase = buildGetExpensesUseCase(dependencies);
  const getExpenseUseCase = buildGetExpenseUseCase(dependencies);
  const deleteExpenseUseCase = buildDeleteExpenseUseCase(dependencies);

  async function createExpense(request) {
    const expense = await createExpenseUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.created({
      message: expenseMessages.EXPENSE_CREATED.FR,
      data: expense,
    });
  }

  async function updateExpense(request) {
    const expense = await updateExpenseUseCase.execute({ ...request.params, ...request.body });

    return HttpResponse.succeeded({
      message: expenseMessages.EXPENSE_UPDATED.FR,
      data: expense,
    });
  }

  async function getExpenses(request) {
    const expenses = await getExpensesUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: expenses,
    });
  }

  async function getExpense(request) {
    const expense = await getExpenseUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: expense,
    });
  }

  async function deleteExpense(request) {
    const expense = await deleteExpenseUseCase.execute(request.params);

    return HttpResponse.succeeded({
      message: expenseMessages.EXPENSE_DELETED(expense).FR,
      data: expense,
    });
  }

  return { createExpense, updateExpense, getExpenses, getExpense, deleteExpense };
};
