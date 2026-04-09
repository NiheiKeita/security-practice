import { useCallback } from "react"

export const yieldRate = (annualNetProfit: number | undefined, transferPrice: number | undefined) => {
    if (annualNetProfit === undefined || transferPrice === undefined) return undefined
    return (annualNetProfit / transferPrice) * 100
}
