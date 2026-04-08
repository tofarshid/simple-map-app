import { createStore } from 'vuex';

export interface Location {
  id: number;
  lat: number;
  long: number;
  address: string;
}

export interface RootState {
  locations: Location[];
  loading: boolean;
  error: string | null;
}

interface SaveLocationPayload {
  lat: number;
  long: number;
}

export const store = createStore<RootState>({
  state: {
    locations: [],
    loading: false,
    error: null,
  },
  mutations: {
    setLocations(state, locations: Location[]) {
      state.locations = locations;
    },
    setLoading(state, loading: boolean) {
      state.loading = loading;
    },
    setError(state, error: string | null) {
      state.error = error;
    },
  },
  actions: {
    async getLocations({ commit }) {
      commit('setLoading', true);
      commit('setError', null);
      try {
        const response = await fetch('/api/locations');
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const locations = (await response.json()) as Location[];
        commit('setLocations', locations);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        commit('setError', message);
      } finally {
        commit('setLoading', false);
      }
    },
    async saveLocation({ dispatch, commit }, payload: SaveLocationPayload) {
      commit('setError', null);
      try {
        const response = await fetch('/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to save location');
        }

        await dispatch('getLocations');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        commit('setError', message);
      }
    },
  },
  getters: {
    locationCount: (state) => state.locations.length,
  },
});
