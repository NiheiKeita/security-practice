import React, { useState } from 'react'

type Item = {
    label: string,
    value: any
};

type Props = {
    items: Item[],
    onChange: (value: any) => void,
    selectValue: Item
}

export const PlanPulldown = React.memo<Props>(function PlanPulldown({
    items,
    onChange,
    selectValue,
}) {

    const [isOpen, setIsOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Item>(selectValue)

    const handleToggle = () => setIsOpen(!isOpen)
    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (e.relatedTarget && e.relatedTarget.classList.contains('dropdown-item')) {
            return // ドロップダウンのアイテムがクリックされた場合は閉じない
        }
        setIsOpen(false)
    }

    const handleClick = (item: Item) => {
        setSelectedItem(item)
        setIsOpen(false)
        onChange(item.value) // 選択したアイテムのvalueを返す
    }

    return (
        <div className="mx-auto w-full">
            <div className="relative" tabIndex={0} onBlur={handleBlur}>
                <div
                    className="w-full cursor-pointer overflow-hidden rounded-md border border-gray-300 bg-white p-2 text-gray-800 "
                    onClick={handleToggle}
                >
                    <span className="truncate">
                        {selectedItem ? selectedItem.label : "-"}
                    </span>
                </div>

                {isOpen && (
                    <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300  bg-white shadow-lg">
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <li
                                    key={index}
                                    onMouseDown={() => handleClick(item)}
                                    className={`dropdown-item cursor-pointer truncate p-2 text-gray-600 hover:bg-gray-100 ${item === selectedItem ? 'bg-gray-200' : ''}`}
                                >
                                    {item.label} {/* ラベルを表示 */}
                                </li>
                            ))
                        ) : (
                            <li className="p-2 text-gray-500">項目がありません</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    )
})

export default PlanPulldown
