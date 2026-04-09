
import React from 'react'
import BackButtonAndTitle from '@/Components/BackButtonAndTitle'
import AdminLayout from '@/Layouts/AdminLayout'
import FlashMessage from '@/Components/FlashMessage'

type Props = {
    flash: any,
    users: any,
}
export const AdminUserList = React.memo<Props>(function AdminUserList({
    flash,
    users
}) {

    return (
        <AdminLayout>
            <BackButtonAndTitle>管理ユーザ一覧</BackButtonAndTitle>
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
                                <th className="px-6 py-3 text-left text-sm font-medium">名前</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">メールアドレス</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">作成日</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user: any) => (
                                <tr key={user.id} className="border-t">
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
})
export default AdminUserList
