import React, { useEffect, useState } from 'react';
import { getExpense, deleteExpense } from '../../Services/expenseServices.js';
import { Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExpenseListPage = () => {
  const navigate = useNavigate();
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await getExpense();
      if (res.data && res.data.length > 0) {
        setExpenseList(res.data.reverse());
      } else {
        setExpenseList([]);
      }
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (e) => {
    try {
      if (confirm("Are you really want to delete this?")) {
        const res = await deleteExpense(e._id);
        if (res.status == 200) {
          console.log("Expense deleted successfully")
        }
        fetchExpenses();
      }
    } catch (err) {
      console.error("Error deleting expenses", err);
    }
  }

  return (
    <div className="p-6">
      <div className='flex items-center justify-between mb-2'>
        <h1 className="text-3xl font-bold text-purple-700 text-center">
          Expense List
        </h1>
        <button className='bg-purple-600 hover:bg-purple-700 flex gap-1 items-center text-white rounded-lg px-4 py-1' onClick={()=> navigate('/expenses/new')}>
          <FileText size={20}/> Add Expense
          </button>
      </div>

      {loading ? (
        <p className="text-center text-purple-500">Loading...</p>
      ) : expenseList.length === 0 ? (
        <p className="text-center text-gray-500">No expenses found</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-purple-200">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-purple-600 text-white text-left">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenseList.map((expense, index) => (
                <tr
                  key={expense._id}
                  className="border-b hover:bg-purple-50 transition-colors"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium text-purple-700">{expense.title}</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">
                    Rs {expense.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">{expense.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </td>
                  <td onClick={() => handleDelete(expense)} className="py-3 px-4 text-red-500"><Trash2 size={18} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseListPage;
