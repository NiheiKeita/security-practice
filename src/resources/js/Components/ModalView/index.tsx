
import React from 'react'
import Button from '../Button'

type Props = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    // handleTelClick: () => void,
    // handleInquiryClick: () => void,
    children: React.ReactNode;
}

export const ModalView = React.memo<Props>(function TitleText({
    isOpen,
    onClose,
    title,
    // handleTelClick,
    // handleInquiryClick,
    children
}) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="relative m-2 w-full max-w-2xl rounded-lg bg-white shadow-lg">
                <div className="relative max-h-[90vh] w-full overflow-y-auto p-6 pb-20">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">{title}</h2>
                    </div>
                    <div>{children}</div>
                </div>
                {/* <div className="absolute bottom-0 left-0 w-full text-white flex gap-2 p-2 bg-black bg-opacity-30">
                    <Button className='w-full' onClick={handleTelClick}>電話でお問合せ</Button>
                    <Button className='w-full' onClick={handleInquiryClick} variant='blue'>お問合せ(無料)</Button>
                </div> */}
                <div
                    className="absolute -top-5 right-0 flex h-10 w-10 cursor-pointer items-center
                               justify-center rounded-full bg-theme p-2 text-2xl font-bold text-white hover:opacity-70 sm:-right-5"
                    onClick={onClose}
                >
                    ×
                </div>
            </div>
        </div>
    )

})
export default ModalView
