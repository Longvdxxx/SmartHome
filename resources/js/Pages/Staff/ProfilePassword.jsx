import React, { useEffect, useRef } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import EmployeeLayout from '@/Layouts/EmployeeLayout';

export default function ProfilePassword({ employee }) {
  const toast = useRef(null);
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash?.success) toast.current.show({ severity: 'success', summary: 'Success', detail: flash.success });
    if (flash?.error) toast.current.show({ severity: 'error', summary: 'Error', detail: flash.error });
  }, [flash]);

  const { data, setData, put, processing, errors } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    put(route('staff.profile.password.update'));
  };

  return (
    <EmployeeLayout user={employee}>
      <Head title="Change Password" />
      <Toast ref={toast} />
      <Card title="Change Password" className="shadow-2 max-w-lg mx-auto">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label>Current Password</label>
            <InputText type="password" className="w-full" value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} />
            {errors.current_password && <small className="p-error">{errors.current_password}</small>}
          </div>

          <div>
            <label>New Password</label>
            <InputText type="password" className="w-full" value={data.password} onChange={(e) => setData('password', e.target.value)} />
            {errors.password && <small className="p-error">{errors.password}</small>}
          </div>

          <div>
            <label>Confirm Password</label>
            <InputText type="password" className="w-full" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
            {errors.password_confirmation && <small className="p-error">{errors.password_confirmation}</small>}
          </div>

          <div className="flex justify-between items-center">
            <Link href={route('staff.profile.edit')} className="text-blue-500 hover:underline">
              ← Back to Profile
            </Link>
            <Button type="submit" label="Update Password" icon="pi pi-key" loading={processing} />
          </div>
        </form>
      </Card>
    </EmployeeLayout>
  );
}
