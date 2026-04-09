
import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode,
    className?: string,
    disabled?: boolean,
    variant?: "default" | "blue"
}

export const Tag = React.memo<Props>(function Tag({
    children,
    className = "",
    disabled = false,
    variant = "default",
    ...props
}) {

    const variantCss = (() => {
        switch (variant) {
            case 'default':
                return ' bg-white border-2 text-theme border-theme-default hover:bg-theme hover:text-white'
            case 'blue':
                return ' bg-theme border-2 text-white border-theme hover:opacity-90'
        }
    })()

    return (
        <button
            {...props}
            className={
                `inline-flex justify-center items-center px-4 py-2 rounded-full w-fit
                font-semibold text-sm uppercase tracking-widest transition ease-in duration-150
                ${disabled && 'opacity-25'} ` + className + variantCss
            }
            disabled={disabled}
        >
            <div className=''>{children}</div>
        </button>
    )
})
export default Tag
