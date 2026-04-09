import React from 'react'
import { Head, router } from '@inertiajs/react'
import SecurityLabLayout from '@/Layouts/SecurityLabLayout'
import Surface from '@/Components/SecurityLab/Surface'
import JsonPanel from '@/Components/SecurityLab/JsonPanel'
import { LabUser, Mode, RankingEntry, StageOption } from '@/types/securityLab'

type Props = {
    currentUser: LabUser
    selectedStage: string
    selectedVariant: Mode
    stageOptions: StageOption[]
    entries: RankingEntry[]
    ownRank: {
        rank: number | null
        bestScore: number | null
    }
    responseExample: unknown
}

export const Rankings = React.memo<Props>(function Rankings({
    selectedStage,
    selectedVariant,
    stageOptions,
    entries,
    ownRank,
    responseExample,
}) {
    const renderComment = (entry: RankingEntry) => {
        if (selectedStage === 'stage-4' && selectedVariant === 'vuln' && entry.comment) {
            return <div dangerouslySetInnerHTML={{ __html: entry.comment }} />
        }

        return <>{entry.comment || 'コメントなし'}</>
    }

    return (
        <SecurityLabLayout>
            <Head title="Rankings" />

            <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <Surface title="ランキング比較" subtitle="Stage 4 と Stage 6 では表示方法やレスポンスの差も追えます。">
                    <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Stage</label>
                            <select
                                value={selectedStage}
                                onChange={(e) => router.visit(route('lab.rankings.index', { stage: e.target.value, variant: selectedVariant }))}
                                className="mt-2 w-full rounded-2xl border-slate-200"
                            >
                                {stageOptions.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.label} {option.title ? `- ${option.title}` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Variant</label>
                            <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                                {(['vuln', 'fixed'] as Mode[]).map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => router.visit(route('lab.rankings.index', { stage: selectedStage, variant: mode }))}
                                        className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${selectedVariant === mode
                                            ? mode === 'vuln' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                            : 'text-slate-600'
                                            }`}
                                    >
                                        {mode === 'vuln' ? '脆弱版' : '修正版'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Surface>

                <Surface title="自分の順位" subtitle="同じステージ内での現在位置です。" tone="safe">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl bg-slate-950 p-5 text-white">
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Rank</p>
                            <p className="mt-3 font-display text-4xl font-semibold">{ownRank.rank ?? '-'}</p>
                        </div>
                        <div className="rounded-3xl bg-emerald-50 p-5">
                            <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">Best Score</p>
                            <p className="mt-3 font-display text-4xl font-semibold text-slate-950">{ownRank.bestScore ?? '-'}</p>
                        </div>
                    </div>
                </Surface>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <Surface title="Leaderboard" subtitle="同じデータでも、脆弱版と修正版で見せ方が変わります。">
                    <div className="space-y-3">
                        {entries.map((entry) => (
                            <div key={entry.id} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 md:grid-cols-[72px_1.2fr_0.8fr_180px] md:items-center">
                                <div className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-white">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Rank</p>
                                    <p className="mt-1 font-display text-2xl font-semibold">{entry.rank}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-950">{entry.playerName}</p>
                                    <div className="mt-2 text-sm leading-6 text-slate-600">{renderComment(entry)}</div>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Score</p>
                                    <p className="mt-2 font-display text-3xl font-semibold text-slate-950">{entry.score}</p>
                                </div>
                                <div className="text-sm text-slate-500">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Updated</p>
                                    <p className="mt-2">{entry.updatedAt || '-'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Surface>

                <JsonPanel
                    title={selectedStage === 'stage-6' ? 'API Response Example' : 'Response Snapshot'}
                    value={responseExample}
                    tone={selectedVariant === 'vuln' ? 'warning' : 'safe'}
                />
            </section>
        </SecurityLabLayout>
    )
})

export default Rankings
