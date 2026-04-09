import { Meta, StoryObj } from '@storybook/react'
// import { waitFor, within } from '@storybook/testing-library';
import { ModalView } from '.'
import { useState } from 'react'

const meta: Meta<typeof ModalView> = {
    title: 'components/ModalView',
    component: ModalView,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Test: Story = {
    render() {
        const [isModalOpen, setIsModalOpen] = useState(false)

        const openModal = () => setIsModalOpen(true)
        const closeModal = () => setIsModalOpen(false)

        return (
            <div className="flex h-screen items-center justify-center">
                <button
                    onClick={openModal}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                    Open Modal
                </button>

                <ModalView
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title="Sample Modal"
                //   handleTelClick={() => console.log("ss")}
                //   handleInquiryClick={() => console.log("ss")}
                >
                    <p>ここにモーダルの内容が入ります。</p>
                    <button
                        onClick={closeModal}
                        className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        Close
                    </button>
                </ModalView>
            </div>
        )
    },
    play: async ({ canvasElement }) => {
        // const canvas = within(canvasElement)
        // await waitFor(async () => {
        //   canvas.getByText("QuestionListView")
        // })
    },
}
