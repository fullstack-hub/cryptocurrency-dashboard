<template>
    <v-container fluid :grid-list-md="!$vuetify.breakpoint.xs">
        <v-layout column>
            <v-flex>
                <v-layout>
                    <v-flex v-for="i in exchangeRate.length" :key="i">
                        <v-card height="130px">
                            <v-chip
                                class="ma-2"
                                color="#2a593f"
                                label
                                text-color="white"
                            >
                                {{ exchangeRate[i - 1].symbol }}
                            </v-chip>
                            {{
                                numeral(exchangeRate[i - 1].price).format(
                                    '0,0.00'
                                )
                            }}
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-layout row>
                <v-flex>
                    <v-card height="800">
                        <v-data-table
                            dense
                            :headers="premiumStatusHeaders"
                            :items="items"
                        >
                            <template #[`item.askPrice`]="{ item }">
                                <template
                                    v-if="
                                        item.symbol.toString().includes('KRW')
                                    "
                                >
                                    <div class="red--text text--lighten-2">
                                        {{
                                            numeral(item.askPrice).format('0,0')
                                        }}
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="red--text text--lighten-2">
                                        {{
                                            numeral(item.askPrice).format(
                                                '0,0.00'
                                            )
                                        }}
                                    </div>
                                </template>
                            </template>
                            <template #[`item.bidPrice`]="{ item }">
                                <template
                                    v-if="
                                        item.symbol.toString().includes('KRW')
                                    "
                                >
                                    <div class="green--text text--lighten-2">
                                        {{
                                            numeral(item.bidPrice).format('0,0')
                                        }}
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="green--text text--lighten-2">
                                        {{
                                            numeral(item.bidPrice).format(
                                                '0,0.00'
                                            )
                                        }}
                                    </div>
                                </template>
                            </template>
                            <template #[`item.premium`]="{ item }">
                                <template v-if="item.premium >= 0.25">
                                    <div class="red--text text--lighten-2">
                                        <strong>
                                            {{
                                                numeral(item.premium).format(
                                                    '0.0000%'
                                                )
                                            }}
                                        </strong>
                                    </div>
                                </template>
                                <template v-else-if="item.premium >= 0">
                                    {{
                                        numeral(item.premium).format('0.0000%')
                                    }}
                                </template>
                                <template v-else>
                                    <div class="blue--text text--lighten-2">
                                        {{
                                            numeral(item.premium).format(
                                                '0.0000%'
                                            )
                                        }}
                                    </div>
                                </template>
                            </template>
                            <template #[`item.profitRate`]="{ item }">
                                <template v-if="item.profitRate > 0">
                                    <div class="red--text text--lighten-2">
                                        <strong>
                                            {{
                                                numeral(item.profitRate).format(
                                                    '0.0000%'
                                                )
                                            }}
                                        </strong>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="blue--text text--lighten-2">
                                        {{
                                            numeral(item.profitRate).format(
                                                '0.0000%'
                                            )
                                        }}
                                    </div>
                                </template>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-flex>
                <v-flex>
                    <v-card height="800">
                        <v-data-table
                            dense
                            :headers="premiumHistoryHeaders"
                            :items="premiumHistory"
                        >
                            <template #[`item.minProfitRate`]="{ item }">
                                {{
                                    numeral(item.minProfitRate).format(
                                        '0.0000%'
                                    )
                                }}
                            </template>
                            <template #[`item.maxProfitRate`]="{ item }">
                                {{
                                    numeral(item.maxProfitRate).format(
                                        '0.0000%'
                                    )
                                }}
                            </template>
                            <template #[`item.minQuantity`]="{ item }">
                                {{ numeral(item.minQuantity).format('0.0000') }}
                            </template>
                            <template #[`item.maxQuantity`]="{ item }">
                                {{ numeral(item.maxQuantity).format('0.0000') }}
                            </template>

                            <template #[`item.beginTimestamp`]="{ item }">
                                {{
                                    moment(item.beginTimestamp).format(
                                        'HH:mm:ss'
                                    )
                                }}
                            </template>
                            <template #[`item.endTimestamp`]="{ item }">
                                {{
                                    moment(item.endTimestamp).format('HH:mm:ss')
                                }}
                            </template>
                        </v-data-table>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import PremiumStatusDto from '@/dto/premiumStatusDto'
import PremiumHistoryDto from '@/dto/premiumHistoryDto'

@Component({})
export default class Dashboard extends Vue {
    private PROFIT_RATE: number = 0.25
    private items: PremiumStatusDto[] = []
    private premiumHistory: PremiumHistoryDto[] = []
    private socket = new WebSocket('ws://localhost:8080/ws')

    private exchangeRate = [
        { symbol: 'USD/KRW', pid: 650, price: 0 },
        { symbol: 'JPY/KRW', pid: 159, price: 0 },
        { symbol: 'USD/JPY', pid: 3, price: 0 },
    ]

    private premiumStatusHeaders = [
        { text: 'SYMBOL', value: 'symbol' },
        { text: 'BUY', value: 'buyExchange' },
        { text: 'ASK PRICE', value: 'askPrice' },
        { text: 'SELL', value: 'sellExchange' },
        { text: 'BID PRICE', value: 'bidPrice' },
        { text: 'PREMIUM', value: 'premium' },
        { text: 'PROFIT', value: 'profitRate' },
    ]

    private premiumHistoryHeaders = [
        { text: 'SYMBOL', value: 'symbol' },
        { text: 'BUY', value: 'askExchange' },
        { text: 'SELL', value: 'bidExchange' },
        { text: 'MIN PROFIT', value: 'minProfitRate' },
        { text: 'MAX PROFIT', value: 'maxProfitRate' },
        { text: 'MIN QUANTITY', value: 'minQuantity' },
        { text: 'MAX QUANTITY', value: 'maxQuantity' },
        { text: 'BEGIN', value: 'beginTimestamp' },
        { text: 'END', value: 'endTimestamp' },
    ]

    public constructor() {
        super()

        this.socket.onopen = () => {
            console.log('connected')
        }

        this.socket.onmessage = ev => {
            const msg = JSON.parse(ev.data)
            this.onReceiveMessage(msg)
        }
    }

    private onReceiveMessage(msg: any) {
        switch (msg.type) {
            case 'premium-status':
                {
                    console.log(msg)

                    const dto: PremiumStatusDto = {
                        symbol: msg.data.symbol,
                        buyExchange: msg.data.buyExchange,
                        askPrice: parseFloat(msg.data.askPrice),
                        sellExchange: msg.data.sellExchange,
                        bidPrice: parseFloat(msg.data.bidPrice),
                        premium: parseFloat(msg.data.premium),
                        profitRate: parseFloat(msg.data.profitRate),
                    }
                    this.updatePremiumStatus(dto)
                }
                break
            case 'exchange-rate':
                {
                    const item = _.find(this.exchangeRate, {
                        pid: msg.data.pid,
                    })
                    if (item) {
                        item.price = msg.data.last_numeric
                    }
                }
                break
            case 'premium-history':
                {
                    this.addPremiumHistory({
                        symbol: msg.data.symbol,
                        bidExchange: msg.data.bidExchange,
                        askExchange: msg.data.askExchange,
                        minPremium: parseFloat(msg.data.minPremium),
                        maxPremium: parseFloat(msg.data.maxPremium),
                        minQuantity: parseFloat(msg.data.minQuantity),
                        maxQuantity: parseFloat(msg.data.maxQuantity),
                        minProfitRate: parseFloat(msg.data.minProfitRate),
                        maxProfitRate: parseFloat(msg.data.maxProfitRate),
                        beginTimestamp: new Date(
                            msg.data.beginTimestamp * 1000
                        ),
                        endTimestamp: new Date(msg.data.endTimestamp * 1000),
                    })
                }
                break
        }
    }

    private addPremiumHistory(dto: PremiumHistoryDto) {
        this.premiumHistory.push(dto)
    }

    private updatePremiumStatus(dto: PremiumStatusDto) {
        const item = _.find(this.items, {
            symbol: dto.symbol,
            buyExchange: dto.buyExchange,
            sellExchange: dto.sellExchange,
        })
        if (item) {
            item.premium = dto.premium
            item.profitRate = dto.profitRate
            item.askPrice = dto.askPrice
            item.bidPrice = dto.bidPrice
        } else {
            this.items.push(dto)
        }
    }
}
</script>

<style scoped></style>
