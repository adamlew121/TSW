<template>
<div class="noteBox">
  <p class="noteBoxText">You have {{notes.length}} new notifications!</p>
  <div v-for="note in notes" :key="note.id" class="noteBoxText">
    {{note.senderUserName}} has sent you new message! Check your chats
  </div>
</div>
</template>

<script>
import ChatsService from '@/services/ChatsService'
export default {
  data () {
    return {
      notes: {}
    }
  },
  async mounted () {
    this.notes = (await ChatsService.getNotes()).data
  }
}
</script>

<style scoped>
@import '../sass/notifications.css'
</style>
