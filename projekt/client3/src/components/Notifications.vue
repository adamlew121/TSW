<template>
<div class="noteBox">
  <p class="noteBoxText">You have {{notes.length}} new notifications!</p>
  <div v-for="note in notes" :key="note.id" class="noteBoxText">
    {{note.text}}
  </div>
</div>
</template>

<script>
import ChatsService from '@/services/ChatsService';

export default {
  data() {
    return {
      notes: {},
    };
  },
  async mounted() {
    this.notes = (await ChatsService.getNotes()).data;
    if (this.notes.length === 0) {
      this.$router.push({
        name: 'offers',
      });
    }
  },
};
</script>

<style scoped>
@import '../sass/notifications.css'
</style>
