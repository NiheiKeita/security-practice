import TextInput from '@/Components/TextInput'
import React, { InputHTMLAttributes, useState } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
    items: string[],
    onChange: (value: any) => void,
    value: string
}

export const PlanSelector = React.memo<Props>(function PlanSelector({
    items,
    onChange,
    value,
    ...props
}) {

    const [isOpen, setIsOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')

    const filteredItems = items.filter((item: string) => {
        if (!value) return items
        return item?.includes(value)
    })

    const handleFocus = () => setIsOpen(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.relatedTarget && e.relatedTarget.classList.contains('dropdown-item')) {
            // ドロップダウンのアイテムがクリックされた場合は、閉じる処理をスキップ
            return
        }
        setIsOpen(false)
    }

    const handleClick = (item: string) => {
        setSelectedItem(item)
        setIsOpen(false)
        onChange(item)
    }

    return (
        <div className="mx-auto w-full">
            <div className='relative'>
                <TextInput
                    type="text"
                    placeholder="Select an option..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full rounded-md border border-gray-300 p-2 text-gray-800"
                    {...props}
                />
                {isOpen && (
                    <ul className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                        {items.length > 0 ? (
                            filteredItems.map((item, index) => (
                                <li
                                    key={index}
                                    onMouseDown={() => handleClick(item)}
                                    className={`dropdown-item cursor-pointer truncate p-2 text-gray-600  hover:bg-gray-100 ${item === selectedItem ? 'bg-gray-200' : ''}`}
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
