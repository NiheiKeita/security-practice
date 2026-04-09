
import WebHeader from '@/Components/WebHeader'
import React from 'react'

type Props = {
    children: React.ReactNode
    page?: "rental" | "ma",
}
export const WebLayout = React.memo<Props>(function AdminLayout({
    children,
    page
}) {
    return (
        <>
            <WebHeader page={page} />
            <div className="flex min-h-screen flex-col items-center bg-white font-yuGothic">
                <div className="w-full max-w-6xl overflow-hidden p-1">
                    {children}
                </div>
            </div>
        </>
    )

})
export default WebLayout
