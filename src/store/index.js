import Vue from 'vue'
import Vuex from 'vuex'
import vuexModules from './modules'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules: vuexModules,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
