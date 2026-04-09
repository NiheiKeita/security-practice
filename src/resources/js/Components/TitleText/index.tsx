
import React from 'react'

type Props = {
    children: React.ReactNode
}

export const TitleText = React.memo<Props>(function TitleText({
    children
}) {
    return (
        <p className='text-2xl font-bold text-gray-700'>
            {children}
        </p>
    )

})
export default TitleText