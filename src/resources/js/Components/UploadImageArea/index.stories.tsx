import { Meta, StoryObj } from '@storybook/react'
import { UploadImageArea } from '.'
import { useState } from 'react'
import { HttpResponse, ResponseResolver, http } from 'msw'

const meta: Meta<typeof UploadImageArea> = {
    title: 'components/UploadImageArea',
    component: UploadImageArea,
    parameters: {
        msw: {
            handlers: [
                http.post('/api/upload', () => {
                    return HttpResponse.json({
                        url: 'http://localhost:8081/storage/images/aDc999GM87DWbuXQTc3uXEecB3wBQnnFz2KCfCFk.png',
                        id: '1',
                    })
                }),
            ],
        },
    },
    tags: ['autodocs'],
}
export default meta


type Story = StoryObj<typeof meta>

export const Test: Story = {
    render() {
        const [images, setImages] = useState<{ url: any; id: any; }[]>([])
        return (
            <UploadImageArea
                images={images}
                onImageChange={setImages} />
        )
    },
}
