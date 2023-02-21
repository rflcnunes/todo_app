<template>
  <div id="home_view">
    <p class="font-sans">TODOS</p>
    <ul id="tasks" class="divide-y divide-gray-200">
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
    };
  },
  created() {
    this.$store.dispatch("getTasks", this.accessToken);
  },
  computed: {
    accessToken() {
      return this.$store.getters.getAccessToken;
    },
    tasks() {
      return this.$store.getters.getTasksList;
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
  },
};
</script>

<style lang="scss" scoped>
#home_view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  #tasks {
    width: 40%;
  }
}
</style>
