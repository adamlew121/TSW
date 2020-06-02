<template>
<div>
  You have {{notes.length}} new notifications!
  <div v-for="note in notes" :key="note.id">
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

<style scoped></style>
