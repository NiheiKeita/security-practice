
import React, { useEffect, useState } from 'react'
import Button from '../Button'
import { router, usePage } from '@inertiajs/react'

type Props = {
    page?: "rental" | "ma",
}
export const WebHeader = React.memo<Props>(function WebHeader({
    page
}) {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const handleScroll = () => {
        if (typeof window !== 'undefined') {
            const currentScrollY = window.scrollY
            setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50)
            setLastScrollY(currentScrollY)
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [lastScrollY])

    return (
        <header className={`sticky left-0 top-0 z-50 w-full bg-white shadow transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="mx-auto flex items-center justify-between p-4">
                <div className="flex items-center" >
                    <div className='cursor-pointer' onClick={() => router.visit(route('web.top'))}>
                        <img src="/img/logo.png" alt="Logo" className="h-8" />
                    </div>
                    <div className="ms-6 hidden justify-start space-x-4 md:flex">
                        <div className={`cursor-pointer`} onClick={() => { }}>メニュー１</div>
                        <div className={`cursor-pointer`} onClick={() => { }}>メニュー２</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button className='ms-8' variant='blue' onClick={() => router.visit(route("user.login"))}>ログイン</Button>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="ml-2 md:hidden">
                        {isMenuOpen ? (
                            <span className="block h-6 w-6 text-gray-700">✖</span>
                        ) : (
                            <span className="block h-auto w-6 text-gray-700">
                                <span className="mb-1 block h-0.5 w-6 bg-gray-700"></span>
                                <span className="mb-1 block h-0.5 w-6 bg-gray-700"></span>
                                <span className="block h-0.5 w-6 bg-gray-700"></span>
                            </span>
                        )}
                    </button>
                </div>
            </div >
            {/* ハンバーガーメニュー */}
            < nav className={`fixed left-0 top-16 flex w-full flex-col space-y-2 bg-white p-4 shadow-md ${isMenuOpen ? 'block' : 'hidden'}`}>
                <button className={`text-gray-700 hover:text-blue-500 `} onClick={() => { }}>メニュー１</button>
                <button className={`text-gray-700 hover:text-blue-500 `} onClick={() => { }}>メニュー２</button>
            </nav >
        </header >
    )
})
export default WebHeader
