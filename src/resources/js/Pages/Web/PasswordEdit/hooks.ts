import { useForm } from "@inertiajs/react"
import { FormEventHandler, useEffect } from "react"

export const usePasswordEdit = (user?: any) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    })
    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation')
        }
    }, [])
    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('web.password.update', user.password_token))
    }

    return {
        data, setData, post, processing, errors, reset, submit
    }
}
