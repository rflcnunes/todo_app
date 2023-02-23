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
        <div class="actions ml-auto flex flex-col">
          <button @click="editTask()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
          <button @click="deleteTask(task.id)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 mt-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
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

      this.task = {
        title: "",
        description: "",
      };

      this.$store.dispatch("getTasks", this.accessToken);
    },
    async deleteTask(id) {
      await this.$store.dispatch("deleteTask", {
        id: id,
        accessToken: this.accessToken,
      });
      this.toast.success("Task deleted!");

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
