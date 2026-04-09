import React, { useEffect, useState } from 'react'

type Props = {
    title: string
    description: string
    onReady?: (score: number) => void
}

export const ClickerArena = React.memo<Props>(function ClickerArena({
    title,
    description,
    onReady,
}) {
    const duration = 8
    const [running, setRunning] = useState(false)
    const [timeLeft, setTimeLeft] = useState(duration)
    const [score, setScore] = useState(0)

    useEffect(() => {
        if (!running) {
            return
        }

        const intervalId = window.setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    window.clearInterval(intervalId)
                    setRunning(false)
                    onReady?.(score)
                    return 0
                }

                return prev - 1
            })
        }, 1000)

        return () => {
            window.clearInterval(intervalId)
        }
    }, [onReady, running, score])

    const start = () => {
        setScore(0)
        setTimeLeft(duration)
        setRunning(true)
    }

    const press = () => {
        if (!running) {
            return
        }

        setScore((prev) => prev + 1)
    }

    return (
        <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h4 className="font-display text-lg font-semibold">{title}</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{description}</p>
                </div>
                <button
                    type="button"
                    onClick={start}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                    {running ? '再スタート' : '8秒ゲーム開始'}
                </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px]">
                <button
                    type="button"
                    onClick={press}
                    className={`min-h-40 rounded-[24px] border border-white/10 bg-gradient-to-br from-cyan-400 via-sky-400 to-indigo-500 text-2xl font-bold tracking-wide text-white transition ${running ? 'hover:scale-[1.01]' : 'cursor-not-allowed opacity-50'}`}
                    disabled={!running}
                >
                    TAP
                </button>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                    <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Time Left</p>
                        <p className="mt-2 font-display text-3xl font-semibold">{timeLeft}s</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Local Score</p>
                        <p className="mt-2 font-display text-3xl font-semibold">{score}</p>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default ClickerArena
