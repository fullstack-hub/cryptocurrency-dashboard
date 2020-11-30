export default interface PremiumHistoryDto {
    symbol: string
    bidExchange: string
    askExchange: string
    minPremium: number
    maxPremium: number
    minQuantity: number
    maxQuantity: number
    minProfitRate: number
    maxProfitRate: number
    beginTimestamp: Date
    endTimestamp: Date
}
