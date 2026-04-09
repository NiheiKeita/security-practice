import { Meta, StoryObj } from '@storybook/react'
import { AdminUserList } from '.'
import { users } from './sample'

const meta: Meta<typeof AdminUserList> = {
    title: 'views/Admin/AdminUserList',
    component: AdminUserList,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Test: Story = {
    render() {
        return (
            <AdminUserList flash={undefined} users={users} />
        )
    },
    play: async ({ canvasElement }) => {
        // const canvas = within(canvasElement)
        // await waitFor(async () => {
        //   canvas.getByText("QuestionListView")
        // })
    },
}
