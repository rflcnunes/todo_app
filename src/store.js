import { createStore } from "vuex";
import { useToast } from "vue-toastification";
import axios from "axios";
import router from "./router";

const toast = useToast();

const store = createStore({
  state() {
    return {
      tasks: [],
      accessToken: "",
      user: {
        id: null,
        username: "",
      },
    };
  },
  mutations: {
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    setAccessToken(state, accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
      state.accessToken = accessToken;
    },
    setUsername(state, username) {
      state.user.username = username;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  getters: {
    getAccessToken(state) {
      if (!state.accessToken) {
        state.accessToken = sessionStorage.getItem("accessToken")
          ? sessionStorage.getItem("accessToken")
          : "";
      }

      return state.accessToken === ""
        ? new Error("No access token")
        : state.accessToken;
    },
    getTasksList(state) {
      return state.tasks;
    },
    getUsername(state) {
      return state.user.username;
    },
    getUser(state) {
      return state.user;
    },
  },
  actions: {
    async getTasks(context, accessToken) {
      try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const response = await axios
          .get(`${url}/tasks`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            console.log(response.data.data);
            return response.data.data;
          })
          .catch((error) => {
            if (error.response.status === 401) {
              router.push({ path: "/login" });
              toast.error("Your session has expired. Please login again.");
            }
          });

        context.commit("setTasks", response);
      } catch (error) {
        console.log(error);
      }
    },
    async updateTaskStatus(context, payload) {
      const url = import.meta.env.VITE_API_BASE_URL;
      const apiUrl = `${url}/tasks/${payload.id}`;

      const config = {
        headers: {
          Authorization: `Bearer ${payload.accessToken}`,
        },
      };

      try {
        await axios.put(
          apiUrl,
          {
            completed: payload.completed,
          },
          config
        );
      } catch (error) {
        console.log(error);
      }
    },
    async getUsername(context, accessToken) {
      try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const response = await axios
          .get(`${url}/profile`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            return response;
          })
          .catch((error) => {
            if (error.response.status === 401) {
              router.push({ path: "/login" });
              toast.error("Your session has expired. Please login again.");
            }
          });

        context.commit("setUsername", response.data.username);
      } catch (error) {
        console.log(error);
      }
    },
    async createTask(payload) {
      const url = import.meta.env.VITE_API_BASE_URL;
      const apiUrl = `${url}/users/${payload.userId}/tasks`;

      const config = {
        headers: {
          Authorization: `Bearer ${payload.accessToken}`,
        },
      };

      const taskToCreate = {
        title: payload.title,
        description: payload.description,
      };

      try {
        await axios.post(apiUrl, taskToCreate, config);
      } catch (error) {
        console.log(error);
      }
    },
    async getUser(context, payload) {
      const url = import.meta.env.VITE_API_BASE_URL;

      await axios
        .get(`${url}/auth/${payload.username}`, {
          headers: {
            Authorization: `Bearer ${payload.accessToken}`,
          },
        })
        .then((response) => {
          context.commit("setUser", response.data);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            router.push({ path: "/login" });
            toast.error("Your session has expired. Please login again.");
          }
        });
    },
  },
});

export default store;
