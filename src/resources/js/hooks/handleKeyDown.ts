

export const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
        e.preventDefault() // エンターキーのデフォルト動作を防ぐ
    }
}
