<template>
  <div id="the_text_area">
    <label for="about" class="block text-sm font-medium text-gray-700"
      >Description</label
    >
    <div class="mt-1">
      <textarea
        id="about"
        name="about"
        rows="3"
        class="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Make a note of your tasks."
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "TheTextArea",
};
</script>

<style lang="scss" scoped>
#the_text_area {
  width: 100%;
}
</style>
