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
  },
});

export default store;
