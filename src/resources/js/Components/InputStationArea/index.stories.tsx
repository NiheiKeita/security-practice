import { Meta, StoryObj } from '@storybook/react'
import { InputStationArea } from '.'
import { useState } from 'react'
import { Station } from './types'

const meta: Meta<typeof InputStationArea> = {
    title: 'components/InputStationArea',
    component: InputStationArea,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Test: Story = {
    render() {
        const [stations, setStations] = useState<Station[]>([])
        return (
            <InputStationArea
                stations={stations}
                onStationChange={setStations}
                selectionStations={
                    ["千葉", "東京", "神奈川", "埼玉"]
                } />
        )
    },
}
