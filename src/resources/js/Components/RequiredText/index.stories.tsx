import { Meta, StoryObj } from '@storybook/react'
import { RequiredText } from '.'

const meta: Meta<typeof RequiredText> = {
    title: 'components/RequiredText',
    component: RequiredText,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render() {
        return (
            <RequiredText />
        )
    },
}
