import { Meta, StoryObj } from '@storybook/react'
import { Selector } from '.'

const meta: Meta<typeof Selector> = {
  title: 'components/Selector',
  component: Selector,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

const data = [
  'React',
  'Vue',
  'Angular',
  'Svelte',
  'Ember',
  'Preact'
]
export const Default: Story = {
  render() {
    return (
      <Selector
        items={data}
        title="場所"
      />
    )
  },
}
