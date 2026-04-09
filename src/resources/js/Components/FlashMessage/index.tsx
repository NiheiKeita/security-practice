
import React from 'react'

type Props = {
    children: React.ReactNode,
}

export const FlashMessage = React.memo<Props>(function FlashMessage({
    children,
}) {
    return (
        < div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700" role="alert" >
            <span className="block sm:inline">{children}</span>
        </div >
    )
})
export default FlashMessage
