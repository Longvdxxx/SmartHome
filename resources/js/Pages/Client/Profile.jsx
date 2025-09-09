import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Profile() {
  const { customer } = usePage().props;

  const { data, setData, put, processing, errors } = useForm({
    name: customer.name || '',
    email: customer.email || '',
    phone: customer.phone || '',
  });

  const submit = (e) => {
    e.preventDefault();
    put(route('customer.profile.update'));
  };

  return (
    <CustomerLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h1>

        <form
          onSubmit={submit}
          className="space-y-6 max-w-lg bg-white shadow-lg rounded-xl p-6 transition-transform transform hover:scale-[1.01]"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              Save
            </button>

            <Link
              href={route('customer.password.edit')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200"
            >
              Change Password
            </Link>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
}
