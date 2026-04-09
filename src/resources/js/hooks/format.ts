
export const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return ""
    // if (price >= 10000) {
    //     // 金額が1万円以上の場合は「万円」表記に変換
    //     const manYen = (price / 10000).toFixed(1); // 小数点1桁まで表示
    //     if (!manYen?.toLocaleString()) return ""
    //     return `${manYen?.toLocaleString()}万円`;
    // } else {
    //     if (!price?.toLocaleString()) return ""
    //     // それ以外はカンマ区切りで表示
    //     return `${price?.toLocaleString()}円`;
    // }
    return `${price?.toLocaleString()}円`
}

export const formatNumber = (price: number | undefined): string => {
    if (price === undefined) return ""
    if (!price?.toLocaleString()) return ""
    return `${price?.toLocaleString()}`
}

export const formatCreatedAt = (date: Date): string => {
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).replace(/\//g, '-') // スラッシュをハイフンに置き換え
}
export const formatCreatedAtLong = (date: Date): string => {
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}
