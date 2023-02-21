import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      tasks: [],
      accessToken: "",
    };
  },
  mutations: {
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
  },
  actions: {
    async fetchTasks(context) {
      const url = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${url}}/tasks`, {
        headers: {
          Authorization: `Bearer ${context.state.accessToken}`,
        },
      });
      const tasks = await response.json();
      context.commit("setTasks", tasks);
    },
  },
});

export default store;
