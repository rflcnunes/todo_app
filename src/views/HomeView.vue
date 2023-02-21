<template>
  <main>
    <input type="text" v-model="user.username" />
    <input type="text" v-model="user.password" />
    {{ tasks }}
    {{ accessToken }}
    <button @click="login">Login</button>
    <button @click="getTasks">Get Env</button>
  </main>
</template>

<script>
// import { useStore } from "vuex";
import axios from "axios";

export default {
  name: "HomeView",
  data() {
    return {
      tasks: [],
      user: {
        username: "",
        password: "",
      },
    };
  },
  computed: {
    getUrl() {
      return import.meta.env.VITE_API_BASE_URL;
    },
    accessToken() {
      return this.$store.state.accessToken;
    },
  },
  methods: {
    login() {
      axios
        .post(`${this.getUrl}/auth/login`, {
          username: this.user.username,
          password: this.user.password,
        })
        .then((response) => {
          console.log(response.data);
          this.$store.commit("setAccessToken", response.data.access_token);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getTasks() {
      const url = import.meta.env.VITE_API_BASE_URL;
      const response = await axios
        .get(`${url}/tasks`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.tasks = response.data;
        });

      return response;
    },
  },
};
</script>
