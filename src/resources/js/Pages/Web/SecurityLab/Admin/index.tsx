import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import SecurityLabLayout from '@/Layouts/SecurityLabLayout'
import Surface from '@/Components/SecurityLab/Surface'
import JsonPanel from '@/Components/SecurityLab/JsonPanel'
import { AdminLog, AdminScore, LabActionResult, LabUser, Mode, StageOption } from '@/types/securityLab'

type Props = {
    currentUser: LabUser
    isAdmin: boolean
    users: LabUser[]
    scores: AdminScore[]
    logs: AdminLog[]
    stageOptions: StageOption[]
}

export const Admin = React.memo<Props>(function Admin({
    currentUser,
    isAdmin,
    users,
    scores,
    logs,
    stageOptions,
}) {
    const [mode, setMode] = useState<Mode>('vuln')
    const [selectedStage, setSelectedStage] = useState(stageOptions[0]?.code ?? 'stage-1')
    const [latest, setLatest] = useState<LabActionResult | null>(null)
    const [loading, setLoading] = useState(false)

    const runOperation = async (operation: string) => {
        setLoading(true)
        try {
            const response = await window.axios.post(route('lab.api.run', { stageCode: 'stage-3', variant: mode }), {
                action: 'admin_operation',
                payload: {
                    operation,
                    stage_code: selectedStage,
                },
            })

            setLatest(response.data)
            router.reload()
        } catch (error: any) {
            setLatest(error?.response?.data ?? {
                success: false,
                message: '管理操作に失敗しました。',
                request: null,
                serverDecision: null,
                stored: null,
                response: null,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <SecurityLabLayout>
            <Head title="Admin" />

            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <Surface title="教材用管理画面" subtitle="Stage 3 ではこの画面自体が比較対象です。">
                    <div className="grid gap-4 md:grid-cols-[1fr_240px]">
                        <div>
                            <p className="text-sm leading-7 text-slate-600">
                                一般ユーザーにはナビゲーションを出していませんが、脆弱版ではサーバー側チェックが甘く、管理操作が通ってしまいます。
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {(['vuln', 'fixed'] as Mode[]).map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setMode(item)}
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === item
                                            ? item === 'vuln' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                            : 'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {item === 'vuln' ? '脆弱版' : '修正版'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={`rounded-3xl p-5 ${isAdmin ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Current User</p>
                            <p className="mt-3 font-display text-2xl font-semibold text-slate-950">{currentUser.name}</p>
                            <p className="mt-2 text-sm text-slate-600">role: {currentUser.role}</p>
                            <p className="mt-4 text-sm leading-6 text-slate-600">
                                {isAdmin ? 'このアカウントは本来の管理者です。' : '一般ユーザーとして管理操作の差分を確認できます。'}
                            </p>
                        </div>
                    </div>
                </Surface>

                <Surface title="操作パネル" subtitle="教材用なので影響範囲はローカルデータに限定しています。">
                    <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Target Stage</label>
                    <select
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                        className="mt-2 w-full rounded-2xl border-slate-200"
                    >
                        {stageOptions.map((stage) => (
                            <option key={stage.code} value={stage.code}>
                                {stage.label}
                            </option>
                        ))}
                    </select>

                    <div className="mt-5 grid gap-3">
                        <button type="button" disabled={loading} onClick={() => runOperation('list_users')} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
                            ユーザー一覧を取得
                        </button>
                        <button type="button" disabled={loading} onClick={() => runOperation('reset_rankings')} className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-60">
                            ランキングをリセット
                        </button>
                        <button type="button" disabled={loading} onClick={() => runOperation('reseed_dummy_data')} className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:opacity-60">
                            ダミーデータ再投入
                        </button>
                        <button type="button" disabled={loading} onClick={() => runOperation('reset_progress')} className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60">
                            ステージ進捗を初期化
                        </button>
                    </div>
                </Surface>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
                <Surface title="ユーザー一覧" subtitle="管理対象のサンプルアカウントです。">
                    <div className="space-y-3">
                        {users.map((user) => (
                            <div key={user.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-slate-950">{user.name}</p>
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
                                        {user.role}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">{user.email}</p>
                            </div>
                        ))}
                    </div>
                </Surface>

                <Surface title="スコア一覧" subtitle="最近更新された教材データです。">
                    <div className="space-y-3">
                        {scores.map((score) => (
                            <div key={score.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-slate-950">{score.player}</p>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{score.stageCode}</span>
                                </div>
                                <p className="mt-3 font-display text-3xl font-semibold text-slate-950">{score.score}</p>
                                <p className="mt-2 text-sm text-slate-600">{score.comment || 'コメントなし'}</p>
                            </div>
                        ))}
                    </div>
                </Surface>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <JsonPanel title="Latest Operation" value={latest} tone={mode === 'vuln' ? 'warning' : 'safe'} />

                <Surface title="監査ログ" subtitle="教材内で起きた主要イベントだけを簡易的に残しています。">
                    <div className="space-y-3">
                        {logs.map((log) => (
                            <div key={log.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{log.action}</span>
                                    <span className="text-sm text-slate-500">{log.actor}</span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">{log.createdAt}</p>
                                <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                                    {JSON.stringify(log.meta, null, 2)}
                                </pre>
                            </div>
                        ))}
                    </div>
                </Surface>
            </section>
        </SecurityLabLayout>
    )
})

export default Admin
