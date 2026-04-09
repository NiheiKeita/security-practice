import { Meta, StoryObj } from '@storybook/react'
import { PlanSelector } from '.'

const meta: Meta<typeof PlanSelector> = {
    title: 'components/UserRegister/components/PlanSelector',
    component: PlanSelector,
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
            <PlanSelector
                items={data}
                title="場所"
                onChange={() => console.log("ssw")}
            />
        )
    },
}
