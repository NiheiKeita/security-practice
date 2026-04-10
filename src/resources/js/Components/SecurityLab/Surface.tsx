import React from 'react'

type Props = {
    children: React.ReactNode
    title?: string
    subtitle?: string
    tone?: 'default' | 'warning' | 'safe' | 'muted'
    className?: string
}

const toneClassMap: Record<NonNullable<Props['tone']>, string> = {
    default: 'border-slate-200 bg-white/90',
    warning: 'border-amber-200 bg-amber-50/90',
    safe: 'border-emerald-200 bg-emerald-50/90',
    muted: 'border-slate-200 bg-slate-50/90',
}

export const Surface = React.memo<Props>(function Surface({
    children,
    title,
    subtitle,
    tone = 'default',
    className = '',
}) {
    return (
        <section className={`relative rounded-3xl border p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur ${toneClassMap[tone]} ${className}`}>
            {(title || subtitle) && (
                <div className="mb-4">
                    {title && <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>}
                    {subtitle && <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p>}
                </div>
            )}
            {children}
        </section>
    )
})

export default Surface
