import { Meta, StoryObj } from '@storybook/react'
import { TextArea } from '.'

const meta: Meta<typeof TextArea> = {
    title: 'components/TextArea',
    component: TextArea,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render() {
        return (
            <TextArea >defaultTitle</TextArea>
        )
    },
}
