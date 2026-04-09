import React, { useState } from 'react'
import { useApplication } from './hooks'

type Props = {
    items: string[],
    title: string
}

export const Selector = React.memo<Props>(function Selector({
    title,
    items
}) {

    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')

    const filteredItems = items.filter((item: string) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleFocus = () => setIsOpen(true)
    const handleBlur = () => setTimeout(() => setIsOpen(false), 200) // Delay to allow click on options

    const handleClick = (item: string) => {
        setSelectedItem(item)
        setSearchTerm(item)
        setIsOpen(false)
    }

    return (
        <div className="mx-auto w-full">
            <div className='grid grid-cols-3 md:grid-cols-4'>
                <h2 className="col-span-1 mb-2 text-lg font-semibold">{title}</h2>
                <div className='relative col-span-2 md:col-span-3'>
                    <input
                        type="text"
                        placeholder="Select an option..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className="w-full rounded-md border border-gray-300 p-2 text-gray-800"
                    />
                    {isOpen && (
                        <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleClick(item)}
                                        className={`cursor-pointer truncate p-2 text-gray-600  hover:bg-gray-100 ${item === selectedItem ? 'bg-gray-200' : ''}`}
                                    >
                                        {item}
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-gray-500">No items found</li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
})
export default Selector
