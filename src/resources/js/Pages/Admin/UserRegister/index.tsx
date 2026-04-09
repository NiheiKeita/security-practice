import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import Button from '@/Components/Button'
import TextInput from '@/Components/TextInput'
import React from 'react'
import BackButtonAndTitle from '@/Components/BackButtonAndTitle'
import AdminLayout from '@/Layouts/AdminLayout'
import { useUserRegister } from './hooks'
import PlanSelector from './components/PlanSelector'

export const UserRegister = React.memo(function UserRegister() {
    const { data, setData, post, processing, errors, reset, submit } = useUserRegister()

    return (
        <AdminLayout>
            <BackButtonAndTitle>ユーザ登録</BackButtonAndTitle>
            <form onSubmit={submit} className='mt-20'>
                <div>
                    <InputLabel htmlFor="name" value="名前" />
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
                    <InputLabel htmlFor="email" value="メールアドレス" />
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
                {/* <div className="mt-4">
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
                </div> */}
                <div className="mt-4">
                    <InputLabel htmlFor="company" value="会社名" />
                    <TextInput
                        id="company"
                        name="company"
                        value={data.company}
                        className="mt-1 block w-full"
                        autoComplete="company"
                        isFocused={true}
                        onChange={(e) => setData('company', e.target.value)}
                        required
                    />
                    <InputError message={errors.company} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="tel" value="tel" />
                    <TextInput
                        id="tel"
                        type="tel"
                        name="tel"
                        value={data.tel}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('tel', e.target.value)}
                        required
                    />
                    <InputError message={errors.tel} className="mt-2" />
                </div>
                {/* <div className="mt-4">
                    <InputLabel value="プラン" />

                    <PlanSelector
                        items={["1", "2"]}
                        id="plan_id"
                        name="plan_id"
                        className="mt-1 block w-full"
                        autoComplete="plan_id"
                        onChange={(e) => setData('plan_id', e)}
                        required
                    />
                    <InputError message={errors.plan_id} className="mt-2" />
                </div> */}
                <Button variant='blue' className="mt-4 w-full" disabled={processing}>
                    ユーザを登録する
                </Button>
            </form>
        </AdminLayout>
    )
})

export default UserRegister
