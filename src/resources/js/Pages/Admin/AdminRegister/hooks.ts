import { useForm } from "@inertiajs/react"
import { FormEventHandler, useEffect } from "react"

export const useAdminRegister = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
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
        post(route('admin_user.store'))
    }
    return {
        data, setData, post, processing, errors, reset, submit
    }
}
