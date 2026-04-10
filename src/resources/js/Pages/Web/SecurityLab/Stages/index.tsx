import React from 'react'
import { Head, router } from '@inertiajs/react'
import SecurityLabLayout from '@/Layouts/SecurityLabLayout'
import Surface from '@/Components/SecurityLab/Surface'
import { LabProgress, LabUser, StageDefinition } from '@/types/securityLab'

type StageCard = StageDefinition & {
    progress: LabProgress
    bestScore: number | null
}

type Props = {
    currentUser: LabUser
    stages: StageCard[]
}

const progressLabel = (progress: LabProgress) => {
    if (progress.completed) {
        return '両方確認済み'
    }

    if (progress.vulnViewed || progress.fixedViewed) {
        return '片側のみ確認'
    }

    return '未着手'
}

export const Stages = React.memo<Props>(function Stages({
    currentUser,
    stages,
}) {
    return (
        <SecurityLabLayout>
            <Head title="Stages" />

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <Surface>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Stage Dashboard</p>
                            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950">比較しながら学ぶ 6 ステージ</h2>
                            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                                同じテーマを脆弱版と修正版で見比べ、送信内容・保存結果・レスポンスの差まで追える構成です。
                            </p>
                        </div>
                        <div className="rounded-[28px] bg-slate-950 px-5 py-4 text-white">
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Learner</p>
                            <p className="mt-2 font-display text-2xl font-semibold">{currentUser.name}</p>
                            <p className="mt-1 text-sm text-slate-300">{stages.filter((stage) => stage.progress.completed).length} / {stages.length} completed</p>
                        </div>
                    </div>
                </Surface>

                <Surface title="学び方のヒント" subtitle="先に脆弱版、次に修正版がおすすめです。" tone="safe">
                    <ul className="space-y-3 text-sm leading-7 text-slate-700">
                        <li>脆弱版では「なぜ問題が起きるのか」を観察します。</li>
                        <li>修正版では「誰が何を判断して防いでいるのか」を確認します。</li>
                        <li>管理画面やランキングも教材の一部なので、単体ページでも見比べてください。</li>
                    </ul>
                </Surface>
            </section>

            <section className="mt-8 grid gap-5 lg:grid-cols-2">
                {stages.map((stage) => (
                    <Surface key={stage.code} className="flex flex-col">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Stage {stage.number}</p>
                                <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950">{stage.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">{stage.objective}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stage.progress.completed ? 'bg-emerald-100 text-emerald-700' : stage.progress.vulnViewed || stage.progress.fixedViewed ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                {progressLabel(stage.progress)}
                            </span>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Theme</p>
                                <p className="mt-2 font-semibold text-slate-900">{stage.theme}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Best Score</p>
                                <p className="mt-2 font-display text-2xl font-semibold text-slate-950">{stage.bestScore ?? '未記録'}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => router.visit(route('lab.stages.show', { stageCode: stage.code, mode: 'vuln' }))}
                                className="rounded-full bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                            >
                                脆弱版を見る
                            </button>
                            <button
                                type="button"
                                onClick={() => router.visit(route('lab.stages.show', { stageCode: stage.code, mode: 'fixed' }))}
                                className="rounded-full bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                                修正版を見る
                            </button>
                            <button
                                type="button"
                                onClick={() => router.visit(route('lab.rankings.index', { stage: stage.code, variant: 'fixed' }))}
                                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                                ランキング
                            </button>
                        </div>
                    </Surface>
                ))}
            </section>
        </SecurityLabLayout>
    )
})

export default Stages
