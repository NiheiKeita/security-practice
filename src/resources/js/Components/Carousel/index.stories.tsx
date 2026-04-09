import { Meta, StoryObj } from '@storybook/react'
import { Carousel } from '.'

const meta: Meta<typeof Carousel> = {
    title: 'components/Carousel',
    component: Carousel,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    render() {

        const images = [
            'https://img.minpaku-bukken.com/Rooms/16636/1022336548570766d1b37e86c72b9cc6.jpg',
            'https://img.minpaku-bukken.com/Rooms/16636/1022336548570766d1b37e86c72b9cc6.jpg',
            'https://img.minpaku-bukken.com/Rooms/16636/1022336548570766d1b37e86c72b9cc6.jpg',
            'https://img.minpaku-bukken.com/Rooms/16636/1022336548570766d1b37e86c72b9cc6.jpg',
        ]
        return (
            <Carousel images={images} />
        )
    },
}
