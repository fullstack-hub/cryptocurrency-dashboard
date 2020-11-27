import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import numeral from 'numeral'
import _ from 'lodash'

Vue.use(Vuetify)

Vue.mixin({
    methods: {
        numeral: value => numeral(value),
        _: () => _,
    },
})

export default new Vuetify({
    theme: {
        dark: true,
    },
})
