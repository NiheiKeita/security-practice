import { useForm } from "@inertiajs/react"
import { FormEventHandler, useEffect } from "react"

export const useUserRegister = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        // password: '',
        // password_confirmation: '',
        plan_id: '',
        tel: '',
        company: ''
    })

    // useEffect(() => {
    //     return () => {
    //         reset('password', 'password_confirmation');
    //     };
    // }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('user.store'))
    }
    return {
        data, setData, post, processing, errors, reset, submit
    }
}
