import TextInput from '@/Components/TextInput'
import React, { useState } from 'react'
import PlanSelector from '../PlanSelector'
import { Station } from './types'
import { useInputStationArea } from './hooks'
import Button from '@/Components/Button'

type Props = {
    stations: Station[];
    onStationChange: (stations: Station[]) => void;
    selectionStations: string[];
};

export const InputStationArea = React.memo<Props>(function InputStationArea({
    stations,
    onStationChange,
    selectionStations
}) {
    const { handleAddStation, handleRemoveStation, newStation, setNewStation } = useInputStationArea(stations, onStationChange)

    return (
        <div>
            <div className="mt-4 flex">
                <div>
                    <PlanSelector
                        type="text"
                        value={newStation.name}
                        onChange={(value) => setNewStation({ ...newStation, name: value })}
                        placeholder="最寄駅名"
                        className="mr-2 rounded border px-4 py-2"
                        items={selectionStations}
                    />
                </div>
                <TextInput
                    type="number"
                    value={newStation.walkingDistance}
                    onChange={(e) => setNewStation({ ...newStation, walkingDistance: e.target.value })}
                    placeholder="徒歩分数"
                    className="mr-2 rounded border px-4 py-2"
                />
                <Button
                    variant='blue'
                    type="button"
                    onClick={handleAddStation}
                >
                    追加
                </Button>
                {/* <button
                        type="button"
                        onClick={handleAddStation}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        追加
                    </button> */}
            </div>

            <div className="mt-4">
                {stations.length > 0 ? (
                    stations.map((station: Station) => (
                        <div key={station.id} className="mb-2 flex items-center">
                            <p className="mr-2">
                                {station.name}（徒歩 {station.walkingDistance} 分）
                            </p>
                            <Button
                                variant='red'
                                type="button"
                                onClick={() => handleRemoveStation(station.id)}
                            >
                                削除
                            </Button>
                        </div>
                    ))
                ) : (
                    <p>最寄駅がありません。追加してください。</p>
                )}
            </div>
        </div>
    )
})

export default InputStationArea
