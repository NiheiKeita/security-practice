import React from 'react'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    className?: string,
    value?: string,
    ref?: React.Ref<HTMLTextAreaElement>
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, Props>(function TextArea({
    className = "",
    value,
    ...props
}, ref) {
    return (
        <textarea
            {...props}
            ref={ref}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-theme rounded-md shadow-sm ' +
                className
            }
        >
            {value}
        </textarea>
    )
})

export default TextArea
