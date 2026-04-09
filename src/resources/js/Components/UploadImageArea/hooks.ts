import { useForm } from "@inertiajs/react"
import { FormEventHandler, useEffect, useRef } from "react"

export const useUploadImageArea = (
    onImageChange: (images: { url: any; id: any }[]) => void,
    images: { url: any; id: any }[],
    type: "a" | "b"
) => {

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const files = e.target.files
        if (!files) return

        const newImages: { url: any; id: any }[] = []
        for (const file of files) {
            const formData = new FormData()
            formData.append('image', file)
            const url = type === "a" ? '/api/upload' : '/api/upload/ma'

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                })

                if (!response.ok) {
                    throw new Error('ネットワークエラーが発生しました。')
                }

                const result = await response.json()
                newImages.push({ url: result.url, id: result.id }) // URLとIDを保存
            } catch (error) {
                console.error('エラー:', error)
                alert("画像のアップロードに失敗しました。")
            }
        }

        onImageChange([...images, ...newImages])
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveImage = (id: string) => {
        onImageChange(images.filter(image => image.id !== id))
    }

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }
    return {
        handleRemoveImage, handleButtonClick, handleImageChange, fileInputRef
    }
}
