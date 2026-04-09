import React from 'react'
import { router, usePage } from '@inertiajs/react'
import { LabUser } from '@/types/securityLab'

type Props = {
    children: React.ReactNode
}

type SharedProps = {
    auth: {
        user?: LabUser | null
    }
}

const navItems = [
    { label: 'Top', href: route('lab.top') },
    { label: 'Stages', href: route('lab.stages.index') },
    { label: 'Rankings', href: route('lab.rankings.index') },
]

export const SecurityLabLayout = React.memo<Props>(function SecurityLabLayout({
    children,
}) {
    const { props, url } = usePage<SharedProps>()
    const user = props.auth.user
    const items = user?.role === 'admin'
        ? [...navItems, { label: 'Admin', href: route('lab.admin.index') }]
        : navItems

    return (
        <div className="min-h-screen bg-lab-base text-slate-900">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f6fbff_45%,#fefdf8_100%)]" />
            <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-5 sm:px-6 lg:px-8">
                <header className="rounded-[32px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <button type="button" onClick={() => router.visit(route('lab.top'))} className="text-left">
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Local Security Lab</p>
                                <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-slate-950">Security Practice Arcade</h1>
                            </button>
                            <div className="hidden rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-600 lg:block">
                                脆弱版と修正版を比較しながら学ぶローカル専用教材
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                            <nav className="flex flex-wrap gap-2">
                                {items.map((item) => {
                                    const active = url.startsWith(new URL(item.href, window.location.origin).pathname)

                                    return (
                                        <button
                                            key={item.href}
                                            type="button"
                                            onClick={() => router.visit(item.href)}
                                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                        >
                                            {item.label}
                                        </button>
                                    )
                                })}
                            </nav>

                            <div className="flex flex-wrap items-center gap-2">
                                {user ? (
                                    <>
                                        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
                                            <span className="font-semibold text-slate-950">{user.name}</span>
                                            <span className="mx-2 text-slate-300">/</span>
                                            <span className="uppercase tracking-[0.2em] text-xs text-slate-500">{user.role}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => router.post(route('user.logout'))}
                                            className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => router.visit(route('user.login'))}
                                        className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mt-8">{children}</main>
            </div>
        </div>
    )
})

export default SecurityLabLayout
