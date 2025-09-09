import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function ChangePassword() {
  const { data, setData, put, processing, errors } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    put(route('customer.password.update'));
  };

  return (
    <CustomerLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Change Password</h1>

        <form
          onSubmit={submit}
          className="space-y-6 max-w-lg bg-white shadow-lg rounded-xl p-6 transition-transform transform hover:scale-[1.01]"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={data.current_password}
              onChange={(e) => setData('current_password', e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.current_password && (
              <div className="text-red-500 text-sm">{errors.current_password}</div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">New Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.password_confirmation && (
              <div className="text-red-500 text-sm">{errors.password_confirmation}</div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              Change Password
            </button>

            <Link
              href={route('customer.profile.edit')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200"
            >
              Back to Profile
            </Link>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
}
