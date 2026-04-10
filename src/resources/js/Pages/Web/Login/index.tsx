import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import { useLogin } from './hooks'
import React from 'react'
import SecurityLabLayout from '@/Layouts/SecurityLabLayout'
import Surface from '@/Components/SecurityLab/Surface'
import { DemoAccount } from '@/types/securityLab'
import { Head } from '@inertiajs/react'

export const Login = React.memo(function Login({ demoAccounts }: { status?: string, canResetPassword: boolean, demoAccounts: DemoAccount[] }) {
    const { data, setData, post, processing, errors, reset, submit } = useLogin()

    return (
        <SecurityLabLayout>
            <Head title="Login" />
            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <Surface title="ログイン" subtitle="ローカル教材用のデモアカウントで利用します。" className="h-fit">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-2 block w-full rounded-2xl border-slate-200"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-2 block w-full rounded-2xl border-slate-200"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            ステージ一覧へ進む
                        </button>
                    </form>
                </Surface>

                <Surface title="すぐ試せるデモアカウント" subtitle="クリックすると入力欄にセットされます。">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {demoAccounts.map((account) => (
                            <button
                                key={account.email}
                                type="button"
                                onClick={() => {
                                    setData('email', account.email)
                                    setData('password', account.password)
                                }}
                                className="rounded-3xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-display text-lg font-semibold text-slate-950">{account.name}</p>
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${account.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
                                        {account.role}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm text-slate-600">{account.email}</p>
                                <p className="mt-1 text-sm text-slate-500">password: {account.password}</p>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-sm leading-7 text-slate-200">
                        <p className="font-semibold text-white">学習の見どころ</p>
                        <p className="mt-2">
                            一般ユーザーで Stage 2 と Stage 3 を試したあと、管理者アカウントで同じ画面を見ると、認可差分が分かりやすくなります。
                        </p>
                    </div>
                </Surface>
            </section>
        </SecurityLabLayout>
    )
})

export default Login
