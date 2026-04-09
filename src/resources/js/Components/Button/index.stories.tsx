import { Meta, StoryObj } from '@storybook/react'
import { Button } from '.'

const meta: Meta<typeof Button> = {
  title: 'components/Button',
  component: Button,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render() {
    return (
      <Button variant='default'>defaultTitle</Button>
    )
  },
}
export const Blue: Story = {
  render() {
    return (
      <Button variant='blue'>defaultTitle</Button>
    )
  },
}
