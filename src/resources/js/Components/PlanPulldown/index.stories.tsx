import { Meta, StoryObj } from '@storybook/react'
import { PlanPulldown } from '.'
import { useCallback, useState } from 'react'

const meta: Meta<typeof PlanPulldown> = {
    title: 'components/PlanPulldown',
    component: PlanPulldown,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

const list = [
    {
        label: 'あああ',
        value: 'あああ',
    },
    {
        label: 'dd',
        value: 'dd',
    },
    {
        label: 'ff',
        value: 'f',
    }
]
const ss = {
    label: 'ff',
    value: 'f',
}
export const Default: Story = {
    render() {
        const [data, setData] = useState("")
        const aaa = useCallback((v: any) => {
            console.log("sss")
        }, [])
        return (
            <PlanPulldown
                items={list}
                selectValue={ss}
                onChange={(v) => setData(v)}
            />
        )
    },
}
