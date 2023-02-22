<template>
  <div id="home_view">
    <p>Hello, {{ username }}</p>
    <div class="form w-full">
      <div class="title">
        <label for="about" class="block text-sm font-medium text-gray-700"
          >Title</label
        >
        <input
          v-model="task.title"
          placeholder="Buy coffee"
          class="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div class="textarea mt-3">
        <label for="about" class="block text-sm font-medium text-gray-700"
          >Description</label
        >
        <div class="mt-1">
          <textarea
            id="about"
            name="about"
            rows="3"
            v-model="task.description"
            class="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Make a note of your tasks."
          ></textarea>
        </div>
      </div>
      <button
        class="ml-auto group mt-2 relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        @click="saveTask"
      >
        Save Task
      </button>
    </div>
    <ul id="tasks" class="divide-y divide-gray-200 mt-4">
      <li v-for="task in tasks" :key="task.id" class="py-4 flex">
        <div class="flex-shrink-0">
          <input
            type="checkbox"
            v-model="task.completed"
            @change="updateStatus(task.id, task.completed)"
            class="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">{{ task.title }}</p>
          <p class="text-sm text-gray-500">{{ task.description }}</p>
          <p class="text-sm text-gray-500">{{ task.createdAt }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  name: "HomeView",
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      task: {
        title: "",
        description: "",
      },
    };
  },
  created() {
    this.$store.dispatch("getTasks", this.accessToken);
    this.$store.dispatch("getUsername", this.accessToken);
  },
  computed: {
    accessToken() {
      return this.$store.getters.getAccessToken;
    },
    username() {
      return this.$store.getters.getUsername;
    },
    tasks() {
      return this.$store.getters.getTasksList;
    },
    authenticatedUser() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    updateStatus(id, completed) {
      console.log(id, completed);
      this.$store.dispatch("updateTaskStatus", {
        id: id,
        completed: completed,
        accessToken: this.accessToken,
      });

      this.toast.success("Task status updated!");
    },
    async saveTask() {
      await this.$store.dispatch("getUser", {
        username: this.username,
        accessToken: this.accessToken,
      });

      await this.$store.dispatch("createTask", {
        title: this.task.title,
        description: this.task.description,
        accessToken: this.accessToken,
        userId: this.authenticatedUser.id,
      });
      this.toast.success("Task created!");

      this.$store.dispatch("getTasks", this.accessToken);
    },
  },
};
</script>

<style lang="scss" scoped>
#home_view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  .form {
    width: 40%;
  }

  #tasks {
    width: 40%;
  }
}
</style>
