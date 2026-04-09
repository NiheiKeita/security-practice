import { useState } from "react"
import { Station } from "./types"

export const useInputStationArea = (stations: Station[], onStationChange: (stations: Station[]) => void) => {

    const [newStation, setNewStation] = useState({ name: '', walkingDistance: '' })
    const handleAddStation = () => {
        if (newStation.name === "" || newStation.walkingDistance === "") return
        const newId = stations.length > 0 ? stations[stations.length - 1].id + 1 : 1
        const updatedStations = [...stations, { id: newId, ...newStation }]
        onStationChange(updatedStations)
        setNewStation({ name: '', walkingDistance: '' }) // Reset input fields
    }
    const handleRemoveStation = (id: number) => {
        const updatedStations = stations.filter(station => station.id !== id)
        onStationChange(updatedStations)
    }
    return {
        handleAddStation,
        handleRemoveStation,
        newStation,
        setNewStation
    }
}
