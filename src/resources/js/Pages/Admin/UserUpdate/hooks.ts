import { useForm } from "@inertiajs/react"
import { FormEventHandler, useEffect } from "react"

export const useUserUpdate = (user: any) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: user?.name,
        email: user?.email,
        plan_id: user?.plan_id,
        company: user?.company,
        tel: user?.tel,
    })
    // useEffect(() => {
    //     return () => {
    //         reset('password', 'password_confirmation');
    //     };
    // }, []);
    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('user.update', user?.id))
    }

    return {
        data, setData, post, processing, errors, reset, submit
    }
}
