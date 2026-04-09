import React, { useEffect, useMemo, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import SecurityLabLayout from '@/Layouts/SecurityLabLayout'
import Surface from '@/Components/SecurityLab/Surface'
import JsonPanel from '@/Components/SecurityLab/JsonPanel'
import ModeTabs from '@/Components/SecurityLab/ModeTabs'
import ClickerArena from '@/Components/SecurityLab/ClickerArena'
import {
    LabActionResult,
    LabProgress,
    LabUser,
    Mode,
    RankingEntry,
    StageDefinition,
    StageOption,
} from '@/types/securityLab'

type Props = {
    currentUser: LabUser
    stage: StageDefinition
    stageOptions: StageOption[]
    initialMode: Mode
    progress: LabProgress
    leaderboard: RankingEntry[]
    currentBest: number | null
    users: LabUser[]
    profilePreview: {
        bio: string | null
        stage5Token: string
    }
    adminPreview: {
        userCount: number
        scoreCount: number
        logCount: number
    }
    apiExamples: {
        vulnerable: unknown
        fixed: unknown
    }
}

type ViewState = {
    latest: LabActionResult | null
    leaderboard: RankingEntry[]
    currentBest: number | null
    progress: LabProgress
}

const statTone = (mode: Mode) => (mode === 'vuln' ? 'warning' : 'safe')

export const Stage = React.memo<Props>(function Stage({
    currentUser,
    stage,
    stageOptions,
    initialMode,
    progress,
    leaderboard,
    currentBest,
    users,
    profilePreview,
    adminPreview,
    apiExamples,
}) {
    const [mode, setMode] = useState<Mode>(initialMode)
    const [view, setView] = useState<ViewState>({
        latest: null,
        leaderboard,
        currentBest,
        progress,
    })
    const [stage1SessionId, setStage1SessionId] = useState<number | null>(null)
    const [stage1Score, setStage1Score] = useState(0)
    const [stage2Score, setStage2Score] = useState(0)
    const [stage2TargetUserId, setStage2TargetUserId] = useState<number>(users.find((item) => item.id !== currentUser.id)?.id ?? currentUser.id)
    const [stage2Comment, setStage2Comment] = useState('本人確認を抜けると誰のスコアでも更新できる')
    const [stage4Score, setStage4Score] = useState(45)
    const [stage4Comment, setStage4Comment] = useState('<strong>教材用の強調コメント</strong>')
    const [stage5Bio, setStage5Bio] = useState(profilePreview.bio ?? '')
    const [stage6Kind, setStage6Kind] = useState<'profile' | 'ranking'>('profile')
    const [busy, setBusy] = useState(false)

    const focusDescription = useMemo(() => mode === 'vuln' ? stage.vulnerable.summary : stage.fixed.summary, [mode, stage.fixed.summary, stage.vulnerable.summary])

    useEffect(() => {
        const controller = new AbortController()

        window.axios.post(route('lab.api.view', { stageCode: stage.code }), {
            mode,
        }, {
            signal: controller.signal,
        }).then((response) => {
            setView((prev) => ({
                ...prev,
                progress: response.data.progress,
            }))
        }).catch(() => {
            // 教材ページの補助機能なので失敗時は無視
        })

        return () => {
            controller.abort()
        }
    }, [mode, stage.code])

    const submitAction = async (action: string, payload: Record<string, unknown>) => {
        setBusy(true)
        try {
            const response = await window.axios.post(route('lab.api.run', { stageCode: stage.code, variant: mode }), {
                action,
                payload,
            })

            const result = response.data as LabActionResult
            setView((prev) => ({
                ...prev,
                latest: result,
                leaderboard: Array.isArray((result.response as any)?.leaderboard) ? (result.response as any).leaderboard : prev.leaderboard,
                currentBest: typeof (result.stored as any)?.highScore?.score === 'number' ? (result.stored as any).highScore.score : prev.currentBest,
            }))

            if (typeof (result.stored as any)?.bio === 'string') {
                setStage5Bio((result.stored as any).bio)
            }

            return result
        } catch (error: any) {
            const result = (error?.response?.data ?? {
                success: false,
                message: 'アクションの実行に失敗しました。',
                request: null,
                serverDecision: null,
                stored: null,
                response: null,
            }) as LabActionResult

            setView((prev) => ({
                ...prev,
                latest: result,
            }))

            return result
        } finally {
            setBusy(false)
        }
    }

    const startStage1Round = async () => {
        const result = await submitAction('start_round', {})
        const sessionId = (result.response as any)?.sessionId

        if (typeof sessionId === 'number') {
            setStage1SessionId(sessionId)
        }
    }

    const runCrossSiteDemo = async () => {
        setBusy(true)
        try {
            const response = await fetch(route('lab.api.cross-site', { variant: mode }), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    bio: stage5Bio,
                }),
            })
            const data = await response.json()
            setView((prev) => ({
                ...prev,
                latest: data,
            }))
            if (data?.stored?.bio) {
                setStage5Bio(data.stored.bio)
            }
        } finally {
            setBusy(false)
        }
    }

    const renderStageControls = () => {
        switch (stage.code) {
            case 'stage-1':
                return (
                    <div className="space-y-5">
                        <Surface title="Step 1. サーバーでゲームセッションを開始" tone={statTone(mode)}>
                            <div className="flex flex-wrap items-center gap-3">
                                <button type="button" onClick={startStage1Round} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800" disabled={busy}>
                                    セッション開始
                                </button>
                                <div className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                                    session_id: {stage1SessionId ?? '未発行'}
                                </div>
                            </div>
                        </Surface>

                        <ClickerArena
                            title="Step 2. 8秒クリックゲーム"
                            description="ここで得点を作り、下の送信欄に反映します。"
                            onReady={setStage1Score}
                        />

                        <Surface title="Step 3. スコア送信" subtitle="脆弱版では score を送信前に自由に変えられます。">
                            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">client_score</label>
                                    <input
                                        type="number"
                                        value={stage1Score}
                                        onChange={(e) => setStage1Score(Number(e.target.value))}
                                        className="mt-2 w-full rounded-2xl border-slate-200"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => submitAction('submit_score', { session_id: stage1SessionId, client_score: stage1Score })}
                                        disabled={busy || stage1SessionId === null}
                                        className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        スコア送信
                                    </button>
                                </div>
                            </div>
                        </Surface>
                    </div>
                )

            case 'stage-2':
                return (
                    <div className="space-y-5">
                        <ClickerArena
                            title="クリックでスコア作成"
                            description="終了後の local score を更新 API に送ります。"
                            onReady={setStage2Score}
                        />

                        <Surface title="更新リクエスト" subtitle="誰のスコアを更新するかで、認可差分を観察します。">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">target_user_id</label>
                                    <select
                                        value={stage2TargetUserId}
                                        onChange={(e) => setStage2TargetUserId(Number(e.target.value))}
                                        className="mt-2 w-full rounded-2xl border-slate-200"
                                    >
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">score</label>
                                    <input
                                        type="number"
                                        value={stage2Score}
                                        onChange={(e) => setStage2Score(Number(e.target.value))}
                                        className="mt-2 w-full rounded-2xl border-slate-200"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">comment</label>
                                <textarea
                                    value={stage2Comment}
                                    onChange={(e) => setStage2Comment(e.target.value)}
                                    className="mt-2 min-h-28 w-full rounded-2xl border-slate-200"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => submitAction('update_score', { target_user_id: stage2TargetUserId, score: stage2Score, comment: stage2Comment })}
                                className="mt-4 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                disabled={busy}
                            >
                                更新を送信
                            </button>
                        </Surface>
                    </div>
                )

            case 'stage-3':
                return (
                    <div className="space-y-5">
                        <Surface title="管理機能の確認" subtitle="一般ユーザーでも、脆弱版ではサーバー側が通してしまいます。">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Users</p>
                                    <p className="mt-2 font-display text-3xl font-semibold text-slate-950">{adminPreview.userCount}</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Scores</p>
                                    <p className="mt-2 font-display text-3xl font-semibold text-slate-950">{adminPreview.scoreCount}</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Audit Logs</p>
                                    <p className="mt-2 font-display text-3xl font-semibold text-slate-950">{adminPreview.logCount}</p>
                                </div>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <button type="button" onClick={() => submitAction('admin_operation', { operation: 'list_users' })} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                                    ユーザー一覧を取得
                                </button>
                                <button type="button" onClick={() => submitAction('admin_operation', { operation: 'reset_rankings', stage_code: 'stage-3' })} className="rounded-full bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100">
                                    Stage 3 のランキングを初期化
                                </button>
                                <button type="button" onClick={() => router.visit(route('lab.admin.index'))} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                                    管理画面を開く
                                </button>
                            </div>
                        </Surface>
                    </div>
                )

            case 'stage-4':
                return (
                    <div className="space-y-5">
                        <Surface title="コメント保存" subtitle="保存データは同じでも、描画方法の違いで見え方が変わります。">
                            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">score</label>
                                    <input type="number" value={stage4Score} onChange={(e) => setStage4Score(Number(e.target.value))} className="mt-2 w-full rounded-2xl border-slate-200" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">comment</label>
                                    <textarea value={stage4Comment} onChange={(e) => setStage4Comment(e.target.value)} className="mt-2 min-h-32 w-full rounded-2xl border-slate-200" />
                                </div>
                            </div>
                            <button type="button" onClick={() => submitAction('save_comment', { score: stage4Score, comment: stage4Comment })} className="mt-4 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                                コメントを保存
                            </button>
                        </Surface>
                    </div>
                )

            case 'stage-5':
                return (
                    <div className="space-y-5">
                        <Surface title="正規画面からのプロフィール更新" subtitle="修正版では追加トークンを付けて送ります。">
                            <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">bio</label>
                            <textarea value={stage5Bio} onChange={(e) => setStage5Bio(e.target.value)} className="mt-2 min-h-32 w-full rounded-2xl border-slate-200" />
                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => submitAction('update_profile', { bio: stage5Bio, stage5_token: profilePreview.stage5Token })}
                                    className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    正規画面から更新
                                </button>
                                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-xs tracking-[0.24em] text-slate-500">
                                    stage5_token: {profilePreview.stage5Token}
                                </div>
                            </div>
                        </Surface>

                        <Surface title="外部サイトを模した送信" subtitle="Cookie だけで状態変更が成立するかを観察します。" tone="warning">
                            <button type="button" onClick={runCrossSiteDemo} className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600" disabled={busy}>
                                外部サイト風の送信を試す
                            </button>
                        </Surface>
                    </div>
                )

            case 'stage-6':
                return (
                    <div className="space-y-5">
                        <Surface title="API をのぞく" subtitle="返している JSON 自体が教材です。">
                            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">kind</label>
                                    <select value={stage6Kind} onChange={(e) => setStage6Kind(e.target.value as 'profile' | 'ranking')} className="mt-2 w-full rounded-2xl border-slate-200">
                                        <option value="profile">profile</option>
                                        <option value="ranking">ranking</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => submitAction('inspect_api', { kind: stage6Kind, stage_code: stage.code })}
                                        className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                    >
                                        レスポンス取得
                                    </button>
                                </div>
                            </div>
                        </Surface>
                    </div>
                )

            default:
                return null
        }
    }

    const renderRankingComment = (entry: RankingEntry) => {
        if (stage.code === 'stage-4' && mode === 'vuln' && entry.comment) {
            return <div dangerouslySetInnerHTML={{ __html: entry.comment }} />
        }

        return <>{entry.comment || 'コメントなし'}</>
    }

    return (
        <SecurityLabLayout>
            <Head title={stage.title} />

            <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <Surface>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Stage {stage.number}</p>
                    <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-950">{stage.title}</h2>
                            <p className="mt-4 text-base leading-8 text-slate-600">{stage.overview}</p>
                        </div>
                        <div className="rounded-[28px] bg-slate-950 px-5 py-4 text-white">
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Current Best</p>
                            <p className="mt-2 font-display text-4xl font-semibold">{view.currentBest ?? '-'}</p>
                        </div>
                    </div>
                </Surface>

                <Surface title="学習テーマ" subtitle={stage.objective} tone="safe">
                    <div className="flex flex-wrap gap-2">
                        {stage.focus_points.map((point) => (
                            <span key={point} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700">
                                {point}
                            </span>
                        ))}
                    </div>
                    <p className="mt-5 rounded-3xl bg-slate-950 p-5 text-sm leading-7 text-slate-200">
                        注目ポイント: {stage.hint}
                    </p>
                </Surface>
            </section>

            <section className="mt-8">
                <ModeTabs value={mode} onChange={setMode} />
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-6">
                    <Surface title={mode === 'vuln' ? stage.vulnerable.label : stage.fixed.label} subtitle={focusDescription} tone={statTone(mode)}>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Vuln Viewed</p>
                                <p className="mt-2 text-sm font-semibold text-slate-900">{view.progress.vulnViewed ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="rounded-3xl bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Fixed Viewed</p>
                                <p className="mt-2 text-sm font-semibold text-slate-900">{view.progress.fixedViewed ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="rounded-3xl bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Completed</p>
                                <p className="mt-2 text-sm font-semibold text-slate-900">{view.progress.completed ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    </Surface>

                    {renderStageControls()}
                </div>

                <div className="space-y-6">
                    <Surface title="Leaderboard Preview" subtitle="保存結果の変化をここで追えます。">
                        <div className="space-y-3">
                            {view.leaderboard.map((entry) => (
                                <div key={entry.id} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 md:grid-cols-[60px_1fr_100px] md:items-center">
                                    <div className="rounded-2xl bg-slate-950 px-3 py-3 text-center text-white">
                                        <p className="font-display text-xl font-semibold">{entry.rank}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-950">{entry.playerName}</p>
                                        <div className="mt-2 text-sm leading-6 text-slate-600">{renderRankingComment(entry)}</div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-display text-3xl font-semibold text-slate-950">{entry.score}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Surface>

                    <JsonPanel title="Request Example" value={view.latest?.request ?? { guide: '操作を実行するとここに送信内容が出ます。' }} tone={statTone(mode)} />
                    <JsonPanel title="Server Decision" value={view.latest?.serverDecision ?? { guide: 'サーバーが何を判断したかをここに表示します。' }} tone={statTone(mode)} />
                    <JsonPanel title="Stored / Response" value={{
                        stored: view.latest?.stored ?? null,
                        response: view.latest?.response ?? (mode === 'vuln' ? apiExamples.vulnerable : apiExamples.fixed),
                        message: view.latest?.message ?? 'まだ実行結果はありません。',
                    }} tone={statTone(mode)} />
                </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <Surface title="解説" subtitle="短く読みやすく、差分だけを拾える構成にしています。">
                    <div className="space-y-4 text-sm leading-7 text-slate-700">
                        <div>
                            <p className="font-semibold text-slate-950">何が問題だったか</p>
                            <p className="mt-1">{stage.explanation.problem}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-950">どんな事故につながるか</p>
                            <p className="mt-1">{stage.explanation.impact}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-950">修正版では何を改善したか</p>
                            <p className="mt-1">{stage.explanation.fix}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-950">実務ならどう考えるべきか</p>
                            <p className="mt-1">{stage.explanation.practice}</p>
                        </div>
                    </div>
                </Surface>

                <Surface title="他ステージへ" subtitle="同じ題材で別の失敗パターンも比較できます。">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {stageOptions.map((option) => (
                            <button
                                key={option.code}
                                type="button"
                                onClick={() => router.visit(route('lab.stages.show', { stageCode: option.code }))}
                                className={`rounded-3xl border p-4 text-left transition ${option.code === stage.code ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
                            >
                                <p className="font-display text-lg font-semibold">{option.label}</p>
                                <p className={`mt-2 text-sm ${option.code === stage.code ? 'text-slate-300' : 'text-slate-500'}`}>{option.title}</p>
                            </button>
                        ))}
                    </div>
                </Surface>
            </section>
        </SecurityLabLayout>
    )
})

export default Stage
