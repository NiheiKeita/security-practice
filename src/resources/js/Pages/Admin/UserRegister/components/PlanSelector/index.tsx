import TextInput from '@/Components/TextInput'
import React, { InputHTMLAttributes, useState } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
    items: string[],
    onChange: (value: any) => void,
}

export const PlanSelector = React.memo<Props>(function PlanSelector({
    items,
    onChange,
    ...props
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
        onChange(item)
    }

    return (
        <div className="mx-auto w-full">
            <div className='relative'>
                <TextInput
                    type="text"
                    placeholder="Select an option..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        onChange(e.target.value)
                    }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full rounded-md border border-gray-300 p-2 text-gray-800"
                    {...props}
                />
                {isOpen && (
                    <ul className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
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
    )
})
export default PlanSelector
