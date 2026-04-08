import { createStore } from 'vuex';

export interface Marker {
  id: number;
  lat: number;
  long: number;
  address: string;
}

export interface RootState {
  markers: Marker[];
  loading: boolean;
  error: string | null;
}

interface SaveMarkerPayload {
  lat: number;
  long: number;
}

export const store = createStore<RootState>({
  state: {
    markers: [],
    loading: false,
    error: null,
  },
  mutations: {
    setMarkers(state, markers: Marker[]) {
      state.markers = markers;
    },
    setLoading(state, loading: boolean) {
      state.loading = loading;
    },
    setError(state, error: string | null) {
      state.error = error;
    },
  },
  actions: {
    async getMarkers({ commit }) {
      const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';
      commit('setLoading', true);
      commit('setError', null);
      try {
        const response = await fetch(`${apiBase}/api/markers`);
        if (!response.ok) {
          throw new Error('Failed to fetch markers');
        }
        const markers = (await response.json()) as Marker[];
        commit('setMarkers', markers);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        commit('setError', message);
      } finally {
        commit('setLoading', false);
      }
    },
    async saveMarker({ dispatch, commit }, payload: SaveMarkerPayload) {
      const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';
      commit('setError', null);
      try {
        const response = await fetch(`${apiBase}/api/markers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to save marker');
        }

        await dispatch('getMarkers');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        commit('setError', message);
      }
    },
  },
  getters: {
    markerCount: (state) => state.markers.length,
  },
});
