import { Meta, StoryObj } from '@storybook/react'
import { Tag } from '.'

const meta: Meta<typeof Tag> = {
  title: 'components/Tag',
  component: Tag,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render() {
    return (
      <Tag variant='default'>defaultTitle</Tag>
    )
  },
}
export const Blue: Story = {
  render() {
    return (
      <Tag variant='blue'>defaultTitle</Tag>
    )
  },
}
