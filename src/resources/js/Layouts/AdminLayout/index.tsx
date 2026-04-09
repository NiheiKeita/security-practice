
import React from 'react'

type Props = {
    children: React.ReactNode
}

export const AdminLayout = React.memo<Props>(function AdminLayout({
    children
}) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100">
            <div className="w-full max-w-7xl rounded-lg px-2 pt-6">
                {children}
            </div>
        </div>
    )

})
export default AdminLayout
