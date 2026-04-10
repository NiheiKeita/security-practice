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

const stageMissionMap: Record<string, Record<Mode, { action: string; learning: string }>> = {
    'stage-1': {
        vuln: {
            action: 'データ送信を調整して、不自然な高得点をそのまま送ってみよう',
            learning: 'クライアントの値を信用しすぎると、ありえないスコアでも保存されます。',
        },
        fixed: {
            action: '同じような値を送って、サーバー側で拒否される様子を見よう',
            learning: '修正版ではサーバーがセッション情報と上限を見て判断します。',
        },
    },
    'stage-2': {
        vuln: {
            action: '自分以外の user_id を指定して、誰のスコアが更新されるか見てみよう',
            learning: 'ログインしていても、所有者確認がないと他人のデータを触れてしまいます。',
        },
        fixed: {
            action: '同じ指定をして、更新対象がログイン中ユーザーに固定されることを見よう',
            learning: '修正版ではリクエスト内の user_id を信用せず、本人のデータだけを更新します。',
        },
    },
    'stage-3': {
        vuln: {
            action: '一般ユーザーのまま管理操作を押して、通ってしまうか確認しよう',
            learning: '画面を隠すだけでは防御にならず、サーバーで拒否しないと危険です。',
        },
        fixed: {
            action: '同じ操作をして、権限エラーになることを確認しよう',
            learning: '修正版では管理者ロールをサーバー側で必ず確認します。',
        },
    },
    'stage-4': {
        vuln: {
            action: 'コメント欄に HTML 風の文字列を入れて、表示がどう変わるか見よう',
            learning: '保存データが同じでも、表示方法が危険だと問題が起きます。',
        },
        fixed: {
            action: '同じコメントを保存して、文字列として安全に表示されることを見よう',
            learning: '修正版では入力を HTML として扱わず、安全にテキスト表示します。',
        },
    },
    'stage-5': {
        vuln: {
            action: '外部サイト風の送信を試して、勝手に状態変更できるか見よう',
            learning: 'ログイン済みでも、状態変更には追加の保護が必要です。',
        },
        fixed: {
            action: '正規画面の更新と外部サイト風の送信を比べてみよう',
            learning: '修正版ではトークン確認が入り、意図しない更新を防ぎます。',
        },
    },
    'stage-6': {
        vuln: {
            action: 'API レスポンスを開いて、不要な項目が返っていないか探してみよう',
            learning: '返しすぎる API は、それだけで情報漏えいの原因になります。',
        },
        fixed: {
            action: '同じ API を見て、必要最小限の項目だけになっているか確認しよう',
            learning: '修正版では公開用のレスポンスだけを返す設計に分けています。',
        },
    },
}

const stageHintMap: Record<string, Record<Mode, string[]>> = {
    'stage-1': {
        vuln: [
            'ゲームを始めたあと、ブラウザの開発者ツールで通信を観察してみよう。',
            '特に Network タブで、どの API にどんなデータが送られているかを見ると手がかりになります。',
            'ランキングが変わるかどうかを見れば、送った値がどう扱われたかを確認できます。',
        ],
        fixed: [
            '脆弱版と同じように通信を観察して、サーバー側の反応の違いを比べてみよう。',
            '修正版では、同じような値でもサーバー側の判断で結果が変わる場合があります。',
            '不自然な値がそのまま保存されないことを、ランキングや挙動の差で確認してみよう。',
        ],
    },
    'stage-2': {
        vuln: [
            '更新対象のユーザーがどこで決まっているかを見てみよう。',
            '画面で選んだ対象と、実際に更新された対象が同じとは限りません。',
        ],
        fixed: [
            '修正版では、更新対象をサーバーがどう決めているかに注目してみよう。',
            '同じ入力でも、誰のデータが変わるかが脆弱版と違うはずです。',
        ],
    },
    'stage-3': {
        vuln: [
            '一般ユーザーのまま管理操作を試してみよう。',
            '画面に管理機能が見えていなくても、本当に使えないとは限りません。',
        ],
        fixed: [
            '同じ操作を修正版でも試してみよう。',
            'サーバー側で権限を見ているなら、操作結果が変わるはずです。',
        ],
    },
    'stage-4': {
        vuln: [
            'コメント欄に、ただの文章以外の文字列を入れて表示の変化を見てみよう。',
            '保存時ではなく、表示時の扱い方に違いがないかを比べると気づきやすいです。',
        ],
        fixed: [
            '同じコメントを修正版でも表示してみよう。',
            '同じ保存データでも、見え方が安全寄りになっているかを確認してみてください。',
        ],
    },
    'stage-5': {
        vuln: [
            '正規画面の更新と、外部サイト風の送信を比べてみよう。',
            'ログイン済みというだけで状態変更が通るかどうかを見るのがポイントです。',
        ],
        fixed: [
            '修正版では、追加の確認材料が必要かどうかを見てみよう。',
            '同じような送信でも、成立する条件が脆弱版と違うはずです。',
        ],
    },
    'stage-6': {
        vuln: [
            'レスポンスの中に、画面に出していない情報が含まれていないか探してみよう。',
            'profile と ranking の両方を見ると違いに気づきやすいです。',
        ],
        fixed: [
            '修正版では、どの項目が消えているかを比べてみよう。',
            '必要最小限だけ返す設計になっているかを見るのがポイントです。',
        ],
    },
}

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
    const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0)

    const mission = useMemo(() => stageMissionMap[stage.code]?.[mode], [mode, stage.code])
    const hints = useMemo(() => stageHintMap[stage.code]?.[mode] ?? [stage.hint], [mode, stage.code, stage.hint])

    useEffect(() => {
        setHintLevel(0)
    }, [mode, stage.code])

    useEffect(() => {
        setView((prev) => ({
            ...prev,
            leaderboard,
            currentBest,
            progress,
        }))
    }, [leaderboard, currentBest, progress])

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

                        <Surface title="Step 3. どう送るか考えてみよう" subtitle="このステージでは送信フォームをあえて出していません。通信を観察して、どんなリクエストが必要か考える課題です。">
                            <div className="space-y-4">
                                <div className="rounded-3xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
                                    local score: <span className="font-semibold text-slate-950">{stage1Score}</span>
                                    <br />
                                    session_id: <span className="font-semibold text-slate-950">{stage1SessionId ?? '未発行'}</span>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => submitAction('submit_score', { session_id: stage1SessionId, client_score: stage1Score })}
                                        disabled={busy || stage1SessionId === null}
                                        className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        今のスコアを登録
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

                        <Surface title="Step 3. どのユーザーが更新されるか確かめよう" subtitle="入力した対象と、実際に更新される対象が同じかを観察する課題です。">
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
                        <Surface title="Step 1. 管理操作を試してみよう" subtitle="一般ユーザーのまま操作したときの違いを観察する課題です。">
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
                        <Surface title="Step 1. コメントを保存して表示の違いを見よう" subtitle="同じデータでも、見え方がどう変わるかを確認する課題です。">
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
                        <Surface title="Step 1. まず正規画面から更新してみよう" subtitle="あとで外部サイト風の送信と比べるための準備です。">
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

                        <Surface title="Step 2. 外部サイト風の送信を試してみよう" subtitle="ログイン済みというだけで状態変更できるかを観察する課題です。" tone="warning">
                            <button type="button" onClick={runCrossSiteDemo} className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600" disabled={busy}>
                                外部サイト風の送信を試す
                            </button>
                        </Surface>
                    </div>
                )

            case 'stage-6':
                return (
                    <div className="space-y-5">
                        <Surface title="Step 1. API レスポンスを観察しよう" subtitle="返ってくる JSON の中身そのものが課題です。">
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

            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <Surface>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Stage {stage.number}</p>
                    <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-950">{stage.title}</h2>
                            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{stage.overview}</p>
                        </div>
                        <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900">
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Best Score</p>
                            <p className="mt-2 font-display text-4xl font-semibold">{view.currentBest ?? '-'}</p>
                        </div>
                    </div>
                </Surface>

                <Surface title="今やること" subtitle={mission?.action ?? stage.objective} tone={statTone(mode)}>
                    <div className="space-y-4">
                        <p className="text-base leading-8 text-slate-700">{mission?.learning ?? stage.objective}</p>
                        <div className="rounded-3xl bg-white px-4 py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Hint</p>
                            <p className="mt-2 text-sm leading-7 text-slate-700">{stage.hint}</p>
                        </div>
                    </div>
                </Surface>
            </section>

            <section className="mt-8">
                <ModeTabs value={mode} onChange={setMode} />
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-6">
                    {renderStageControls()}
                </div>

                <div className="space-y-6">
                    <Surface title="ヒント" subtitle="必要になったら 1 段階ずつ開いてください。">
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setHintLevel((prev) => prev >= 1 ? 0 : 1)}
                                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                                {hintLevel >= 1 ? 'ヒント1を閉じる' : 'ヒント1を見る'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setHintLevel((prev) => prev >= 2 ? 1 : 2)}
                                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                                {hintLevel >= 2 ? 'ヒント2を閉じる' : 'ヒント2を見る'}
                            </button>
                        </div>
                        {hintLevel >= 1 && (
                            <div className="mt-4 rounded-3xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
                                {hints[0]}
                            </div>
                        )}
                        {hintLevel >= 2 && (
                            <div className="mt-3 rounded-3xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
                                {hints[1] ?? hints[hints.length - 1]}
                            </div>
                        )}
                    </Surface>

                    <Surface title="ランキング" subtitle="必要なら更新して最新状態を見てください。">
                        <div className="mb-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => router.reload()}
                                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                                更新
                            </button>
                        </div>
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

                    {view.latest && (
                        <Surface title="実行メモ" subtitle={view.latest.message} tone={statTone(mode)}>
                            <p className="text-sm leading-7 text-slate-700">
                                必要ならブラウザの開発者ツールや画面の変化と合わせて確認してください。
                            </p>
                        </Surface>
                    )}
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
