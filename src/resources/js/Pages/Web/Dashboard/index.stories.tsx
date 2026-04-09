import { Meta, StoryObj } from '@storybook/react'
// import { waitFor, within } from '@storybook/testing-library';
import { Dashboard } from '.'

const meta: Meta<typeof Dashboard> = {
  title: 'views/Web/Dashboard',
  component: Dashboard,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Test: Story = {
  play: async ({ canvasElement }) => {
    // const canvas = within(canvasElement)
    // await waitFor(async () => {
    //   canvas.getByText("QuestionListView")
    // })
  },
}
