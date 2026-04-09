import React from 'react'
import Surface from './Surface'

type Props = {
    title: string
    value: unknown
    tone?: 'default' | 'warning' | 'safe' | 'muted'
}

export const JsonPanel = React.memo<Props>(function JsonPanel({
    title,
    value,
    tone = 'muted',
}) {
    return (
        <Surface title={title} tone={tone}>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                {JSON.stringify(value, null, 2)}
            </pre>
        </Surface>
    )
})

export default JsonPanel
