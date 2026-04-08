import { createStore } from 'vuex'

export interface State {
  count: number
}

export default createStore<State>({
  state: () => ({
    count: 0,
  }),
  mutations: {
    increment(state: State) {
      state.count += 1
    },
  },
})
