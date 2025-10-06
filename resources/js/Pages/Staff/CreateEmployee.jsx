import { useRef, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import EmployeeLayout from '@/Layouts/EmployeeLayout';

export default function CreateEmployee({ auth, stores = [] }) {
    const toast = useRef(null);
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.current.show({ severity: 'success', summary: 'Success', detail: flash.success });
        if (flash?.error) toast.current.show({ severity: 'error', summary: 'Error', detail: flash.error });
    }, [flash]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        store_id: stores[0]?.id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.manage.store'), {
            onSuccess: () => reset(),
        });
    };

    const roleOptions = [
        { label: 'Cashier', value: 'cashier' },
        { label: 'Stock', value: 'stock' },
    ];

    return (
        <EmployeeLayout user={auth.user}>
            <Head title="Create Employee" />
            <Toast ref={toast} />
            <Card title="Add Employee" className="shadow-2 max-w-2xl mx-auto">
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label>Name</label>
                        <InputText className="w-full" value={data.name} onChange={e => setData('name', e.target.value)} />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>

                    <div>
                        <label>Email</label>
                        <InputText type="email" className="w-full" value={data.email} onChange={e => setData('email', e.target.value)} />
                        {errors.email && <small className="p-error">{errors.email}</small>}
                    </div>

                    <div>
                        <label>Password</label>
                        <InputText type="password" className="w-full" value={data.password} onChange={e => setData('password', e.target.value)} />
                        {errors.password && <small className="p-error">{errors.password}</small>}
                    </div>

                    <div>
                        <label>Confirm Password</label>
                        <InputText type="password" className="w-full" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                        {errors.password_confirmation && <small className="p-error">{errors.password_confirmation}</small>}
                    </div>

                    <div>
                        <label>Role</label>
                        <Dropdown options={roleOptions} value={data.role} onChange={e => setData('role', e.value)} placeholder="Select role" className="w-full" />
                        {errors.role && <small className="p-error">{errors.role}</small>}
                    </div>

                    <div>
                        <label>Store</label>
                        <InputText className="w-full" value={stores[0]?.name || ''} disabled />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" label="Back" onClick={() => window.history.back()} className="p-button-outlined" />
                        <Button type="submit" label="Create" icon="pi pi-check" loading={processing} />
                    </div>
                </form>
            </Card>
        </EmployeeLayout>
    );
}
