
import React, { useState } from 'react'
import BackButtonAndTitle from '@/Components/BackButtonAndTitle'
import AdminLayout from '@/Layouts/AdminLayout'
import FlashMessage from '@/Components/FlashMessage'
import Button from '@/Components/Button'
import { router } from '@inertiajs/react'

type Props = {
    flash?: any,
    users?: any,
}
export const UserList = React.memo<Props>(function UserList({
    flash,
    users
}) {
    const [searchTerm, setSearchTerm] = useState('')

    const formatCreatedAt = (value: string): string => {
        if (!value) return 'N/A'
        const date = new Date(value)
        if (isNaN(date.getTime())) return 'N/A'
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }
    return (
        <AdminLayout>
            <BackButtonAndTitle>ユーザ一覧</BackButtonAndTitle>
            {flash?.message &&
                <div className='mt-5'>
                    <FlashMessage>{flash.message}</FlashMessage>
                </div>
            }
            <div className="flex overflow-x-auto">
                <div className="min-w-full flex-none">
                    <table className="mt-2 min-w-full table-auto bg-white shadow-md">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="px-6 py-3 text-left text-sm font-medium">詳細</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">名前</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">メールアドレス</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">電話番号</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">作成日</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user: any) => (
                                <tr key={user?.id} className="border-t">
                                    <td>
                                        <div className='px-4 py-2'>
                                            <Button
                                                onClick={() => router.visit(route("user.edit", user?.id))}
                                            >
                                                詳細
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user?.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user?.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user?.tel}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{formatCreatedAt(user?.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
})
export default UserList
