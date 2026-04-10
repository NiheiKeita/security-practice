import React from 'react'
import { Head, router } from '@inertiajs/react'
import SecurityLabLayout from '@/Layouts/SecurityLabLayout'
import Surface from '@/Components/SecurityLab/Surface'
import { DemoAccount, LabUser } from '@/types/securityLab'

type Props = {
    serviceName: string
    stageCount: number
    demoAccounts: DemoAccount[]
    currentUser: LabUser | null
}

export const Top = React.memo<Props>(function Top({
    serviceName,
    stageCount,
    demoAccounts,
    currentUser,
}) {
    return (
        <SecurityLabLayout>
            <Head title="Security Practice Arcade" />

            <section className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
                <Surface className="overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-36 rounded-t-3xl bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(16,185,129,0.1),rgba(250,204,21,0.14))]" />
                    <div className="relative">
                        <div className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                            Security Learning Service
                        </div>
                        <h2 className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                            {serviceName}
                        </h2>
                        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                            ローカルまたは閉じた検証環境で、脆弱な設計だと何が起きるかを安全に観察し、その直後に修正版との差分を学ぶための体験型教材です。
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl bg-slate-950 p-5 text-white">
                                <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Stages</p>
                                <p className="mt-3 font-display text-4xl font-semibold">{stageCount}</p>
                                <p className="mt-2 text-sm text-slate-300">比較しながら学べるセキュリティテーマ</p>
                            </div>
                            <div className="rounded-3xl bg-amber-50 p-5">
                                <p className="text-xs uppercase tracking-[0.28em] text-amber-700">Scope</p>
                                <p className="mt-3 font-display text-4xl font-semibold text-slate-950">Local</p>
                                <p className="mt-2 text-sm text-slate-600">本番公開は想定せず、副作用を限定</p>
                            </div>
                            <div className="rounded-3xl bg-emerald-50 p-5">
                                <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">Flow</p>
                                <p className="mt-3 font-display text-2xl font-semibold text-slate-950">Observe → Compare → Fix</p>
                                <p className="mt-2 text-sm text-slate-600">画面・通信・保存結果を教材化</p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => router.visit(currentUser ? route('lab.stages.index') : route('user.login'))}
                                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                {currentUser ? 'ステージ一覧へ' : 'ログインして始める'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.visit(route('lab.rankings.index'))}
                                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                                ランキングを見る
                            </button>
                        </div>
                    </div>
                </Surface>

                <div className="grid gap-6">
                    <Surface title="注意事項" subtitle="教材の意図を外さないための前提です。" tone="warning">
                        <ul className="space-y-3 text-sm leading-7 text-slate-700">
                            <li>学習目的のローカルサンプルです。実在の個人情報や秘密情報は入力しないでください。</li>
                            <li>一般公開や本番運用を想定した実装ではありません。比較学習を優先しています。</li>
                            <li>危険な外部副作用は持たせず、画面・通信・保存結果の観察に絞っています。</li>
                        </ul>
                    </Surface>

                    <Surface title="学習の進め方" subtitle="初学者でも差分を追いやすい構成です。" tone="safe">
                        <ol className="space-y-3 text-sm leading-7 text-slate-700">
                            <li>1. ステージを選び、脆弱版の挙動を先に確認する</li>
                            <li>2. 同じ画面で修正版に切り替え、どこで防いでいるかを見る</li>
                            <li>3. 送信内容、保存結果、API レスポンスを見比べる</li>
                        </ol>
                    </Surface>
                </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
                <Surface title="教材として入っているテーマ" subtitle="ランキングとプロフィール更新を題材に、6 つの代表的な失敗パターンを比較できます。">
                    <div className="grid gap-3">
                        {[
                            'Stage 1: クライアント値の信頼',
                            'Stage 2: 認可不備',
                            'Stage 3: 管理機能の権限不備',
                            'Stage 4: 危険な出力',
                            'Stage 5: 状態変更保護の欠如',
                            'Stage 6: API の返しすぎ',
                        ].map((item) => (
                            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                {item}
                            </div>
                        ))}
                    </div>
                </Surface>

                <Surface title="デモアカウント" subtitle="シーダー投入後はこのアカウントですぐ触れます。">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {demoAccounts.map((account) => (
                            <div key={account.email} className="rounded-3xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-display text-lg font-semibold text-slate-950">{account.name}</p>
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${account.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
                                        {account.role}
                                    </span>
                                </div>
                                <dl className="mt-4 space-y-2 text-sm text-slate-600">
                                    <div>
                                        <dt className="text-slate-400">Email</dt>
                                        <dd className="font-medium text-slate-800">{account.email}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400">Password</dt>
                                        <dd className="font-medium text-slate-800">{account.password}</dd>
                                    </div>
                                </dl>
                            </div>
                        ))}
                    </div>
                </Surface>
            </section>
        </SecurityLabLayout>
    )
})

export default Top
