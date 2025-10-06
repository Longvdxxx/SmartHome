import React, { useEffect, useRef } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import EmployeeLayout from '@/Layouts/EmployeeLayout';

export default function ProfileEdit({ employee }) {
  const toast = useRef(null);
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash?.success) toast.current.show({ severity: 'success', summary: 'Success', detail: flash.success });
    if (flash?.error) toast.current.show({ severity: 'error', summary: 'Error', detail: flash.error });
  }, [flash]);

  const { data, setData, put, processing, errors } = useForm({
    name: employee.name || '',
    email: employee.email || '',
  });

  const submit = (e) => {
    e.preventDefault();
    put(route('staff.profile.update'));
  };

  return (
    <EmployeeLayout user={employee}>
      <Head title="Edit Profile" />
      <Toast ref={toast} />
      <Card title="Edit Profile" className="shadow-2 max-w-lg mx-auto">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label>Name</label>
            <InputText className="w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            {errors.name && <small className="p-error">{errors.name}</small>}
          </div>

          <div>
            <label>Email</label>
            <InputText type="email" className="w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} />
            {errors.email && <small className="p-error">{errors.email}</small>}
          </div>

          <div className="flex justify-between items-center">
            <Link href={route('staff.profile.password.edit')} className="text-blue-500 hover:underline">
              Change Password
            </Link>
            <Button type="submit" label="Update" icon="pi pi-check" loading={processing} />
          </div>
        </form>
      </Card>
    </EmployeeLayout>
  );
}
