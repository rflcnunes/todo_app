import { createApp } from "vue";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/main.css";

const app = createApp(App);

app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
});

app.use(router);
app.use(store);

app.mount("#app");
