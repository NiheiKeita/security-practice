import { useEffect, FormEventHandler } from 'react'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import Button from '@/Components/Button'
import TextInput from '@/Components/TextInput'
import { useForm } from '@inertiajs/react'
import React from 'react'
import BackButtonAndTitle from '@/Components/BackButtonAndTitle'
import AdminLayout from '@/Layouts/AdminLayout'
import { useAdminRegister } from './hooks'

export const AdminRegister = React.memo(function AdminRegister() {
    const { data, setData, post, processing, errors, reset, submit } = useAdminRegister()

    return (
        <AdminLayout>
            <BackButtonAndTitle>管理ユーザ登録</BackButtonAndTitle>
            <form onSubmit={submit} className='mt-20'>
                <div>
                    <InputLabel htmlFor="name" value="管理ユーザ名" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="管理ユーザ メールアドレス" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="パスワード" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="確認用パスワード" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>
                <Button variant='blue' className="mt-4 w-full" disabled={processing}>
                    管理ユーザ登録
                </Button>
            </form>
        </AdminLayout>
    )
})

export default AdminRegister
