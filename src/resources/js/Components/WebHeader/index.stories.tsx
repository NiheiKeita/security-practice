import { Meta, StoryObj } from '@storybook/react'
import { WebHeader } from '.'

const meta: Meta<typeof WebHeader> = {
    title: 'components/WebHeader',
    component: WebHeader,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render() {
        return (
            <WebHeader />
        )
    },
}
