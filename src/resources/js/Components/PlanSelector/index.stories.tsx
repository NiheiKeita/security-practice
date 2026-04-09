import { Meta, StoryObj } from '@storybook/react'
import { PlanSelector } from '.'
import { useCallback, useState } from 'react'

const meta: Meta<typeof PlanSelector> = {
    title: 'components/PlanSelector',
    component: PlanSelector,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

const list = [
    'あああ',
    'Vue',
    'Angular',
    'Svelte',
    'Ember',
    'Preact'
]
export const Default: Story = {
    render() {
        const [data, setData] = useState("")
        const aaa = useCallback((v: any) => {
            console.log("sss")
        }, [])
        return (
            <PlanSelector
                items={list}
                value={data}
                onChange={(v) => setData(v)}
            />
        )
    },
}
