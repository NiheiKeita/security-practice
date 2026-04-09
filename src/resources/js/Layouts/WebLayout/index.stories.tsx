import { Meta, StoryObj } from '@storybook/react'
// import { waitFor, within } from '@storybook/testing-library';
import { WebLayout } from '.'

const meta: Meta<typeof WebLayout> = {
  title: 'layouts/WebLayout',
  component: WebLayout,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Test: Story = {
  render() {
    return (
      <WebLayout >Title</WebLayout>
    )
  },
  play: async ({ canvasElement }) => {
    // const canvas = within(canvasElement)
    // await waitFor(async () => {
    //   canvas.getByText("QuestionListView")
    // })
  },
}
