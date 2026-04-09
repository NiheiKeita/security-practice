import React, { useState, useRef } from 'react'
import { useUploadImageArea } from './hooks'
import Button from '@/Components/Button'

type Props = {
    images: { url: any; id: any }[],
    onImageChange: (images: { url: any; id: any }[]) => void,
    type?: "a" | "b"
}

export const UploadImageArea = React.memo<Props>(function UploadImageArea({
    images,
    onImageChange,
    type = "a"
}) {
    const { handleRemoveImage, handleButtonClick, handleImageChange, fileInputRef } = useUploadImageArea(onImageChange, images, type)

    return (
        <div>
            <form>
                <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
                >
                    +
                </button>
                <div className="mt-4">
                    {images.length > 0 ? (
                        images.map((image: { url: any; id: any }) => (
                            <div key={image.id} className="mb-2 flex items-center">
                                <img
                                    src={image.url}
                                    alt="Uploaded"
                                    className="mr-2 max-h-96 w-4/5 object-contain"
                                />
                                <Button variant='red'
                                    type="button"
                                    onClick={() => handleRemoveImage(image.id)}
                                >
                                    削除
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p>画像がありません。画像を追加してください。</p>
                    )}
                </div>
            </form>
        </div>
    )
})

export default UploadImageArea
