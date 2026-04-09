import { Meta, StoryObj } from '@storybook/react'
// import { waitFor, within } from '@storybook/testing-library';
import { AdminLayout } from '.'

const meta: Meta<typeof AdminLayout> = {
  title: 'layouts/AdminLayout',
  component: AdminLayout,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Test: Story = {
  render() {
    return (
      <AdminLayout >Title</AdminLayout>
    )
  },
  play: async ({ canvasElement }) => {
    // const canvas = within(canvasElement)
    // await waitFor(async () => {
    //   canvas.getByText("QuestionListView")
    // })
  },
}
