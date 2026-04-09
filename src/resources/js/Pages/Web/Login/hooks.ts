import { useForm } from "@inertiajs/react"
import { FormEventHandler, useEffect } from "react"

export const useLogin = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    })
    useEffect(() => {
        return () => {
            reset('password')
        }
    }, [])

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('user.login'))
    }
    return {
        data, setData, post, processing, errors, reset, submit
    }
}
