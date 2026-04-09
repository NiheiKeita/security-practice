import { useEffect, FormEventHandler } from 'react'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import Button from '@/Components/Button'
import TextInput from '@/Components/TextInput'
import React from 'react'
import BackButtonAndTitle from '@/Components/BackButtonAndTitle'
import AdminLayout from '@/Layouts/AdminLayout'
import { usePasswordEdit } from './hooks'

type Props = {
    user?: any
}

export const PasswordEdit = React.memo<Props>(function PasswordEdit({
    user
}) {
    const { data, setData, post, processing, errors, reset, submit } = usePasswordEdit(user)

    return (
        <AdminLayout>
            <BackButtonAndTitle>パスワード変更</BackButtonAndTitle>
            <form onSubmit={submit} className='mt-20'>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="新パスワード" />
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
                    <InputLabel htmlFor="password_confirmation" value="確認用新パスワード" />
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
                    パスワードを変更する
                </Button>
            </form>
        </AdminLayout>
    )
})

export default PasswordEdit
