import React from 'react'
import { Mode } from '@/types/securityLab'

type Props = {
    value: Mode
    onChange: (value: Mode) => void
}

const items: { value: Mode; label: string; description: string }[] = [
    {
        value: 'vuln',
        label: '脆弱版',
        description: '問題が起きる設計を観察',
    },
    {
        value: 'fixed',
        label: '修正版',
        description: '安全な実装との差分を確認',
    },
]

export const ModeTabs = React.memo<Props>(function ModeTabs({
    value,
    onChange,
}) {
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => {
                const active = item.value === value

                return (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => onChange(item.value)}
                        className={`rounded-3xl border px-5 py-4 text-left transition ${active
                            ? item.value === 'vuln'
                                ? 'border-amber-300 bg-amber-50 shadow-[0_20px_40px_-32px_rgba(245,158,11,0.8)]'
                                : 'border-emerald-300 bg-emerald-50 shadow-[0_20px_40px_-32px_rgba(16,185,129,0.8)]'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-display text-base font-semibold text-slate-900">{item.label}</span>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.value === 'vuln'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                {active ? '表示中' : '切替'}
                            </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </button>
                )
            })}
        </div>
    )
})

export default ModeTabs
