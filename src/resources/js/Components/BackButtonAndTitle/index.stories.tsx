import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
// import { waitFor, within } from '@storybook/testing-library';
import { BackButtonAndTitle } from '.'

const meta: Meta<typeof BackButtonAndTitle> = {
  title: 'components/BackButtonAndTitle',
  component: BackButtonAndTitle,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Test: Story = {
  render() {
    return (
      <BackButtonAndTitle >Title</BackButtonAndTitle>
    )
  },
  play: async ({ canvasElement }) => {
    // const canvas = within(canvasElement)
    // await waitFor(async () => {
    //   canvas.getByText("QuestionListView")
    // })
  },
}
