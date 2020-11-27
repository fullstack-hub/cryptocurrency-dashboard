<template>
    <v-container :grid-list-md="!$vuetify.breakpoint.xs">
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
                            {{ exchangeRate[i - 1].price }}
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
                                <div class="red--text text--lighten-2">
                                    {{ item.askPrice.toFixed(2) }}
                                </div>
                            </template>
                            <template #[`item.bidPrice`]="{ item }">
                                <div class="green--text text--lighten-2">
                                    {{ item.bidPrice.toFixed(2) }}
                                </div>
                            </template>
                            <template #[`item.premium`]="{ item }">
                                <template v-if="item.premium >= 0.25">
                                    <div class="blue--text text--lighten-2">
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
                                    <div class="red--text text--lighten-2">
                                        {{
                                            numeral(item.premium).format(
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
                        <v-data-table dense :headers="premiumHistoryHeaders">
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
import PremiumDto from '@/dto/premium'

@Component({})
export default class Dashboard extends Vue {
    private PROFIT_RATE: number = 0.25
    private items: PremiumDto[] = []
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
        { text: 'PREMIUM(%)', value: 'premium' },
    ]

    private premiumHistoryHeaders = [
        { text: 'SYMBOL', value: 'symbol' },
        { text: 'BUY', value: 'buyExchange' },
        { text: 'SELL', value: 'sellExchange' },
        { text: 'MIN PREMIUM', value: 'minPremium' },
        { text: 'MAX PREMIUM', value: 'maxPremium' },
        { text: 'BEGIN', value: 'beginDate' },
        { text: 'END', value: 'endDate' },
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
                    const dto: PremiumDto = {
                        symbol: msg.data.symbol,
                        buyExchange: msg.data.buyExchange,
                        askPrice: parseFloat(msg.data.askPrice),
                        sellExchange: msg.data.sellExchange,
                        bidPrice: parseFloat(msg.data.bidPrice),
                        premium: parseFloat(msg.data.premium),
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
        }
    }

    private updatePremiumStatus(dto: PremiumDto) {
        const item = _.find(this.items, {
            symbol: dto.symbol,
            buyExchange: dto.buyExchange,
            sellExchange: dto.sellExchange,
        })
        if (item) {
            item.premium = dto.premium
            item.askPrice = dto.askPrice
            item.bidPrice = dto.bidPrice
        } else {
            this.items.push(dto)
        }
    }
}
</script>

<style scoped></style>
