<template>
<div>
  <div v-for="user in visibleUsers" :key="user.id">
    {{user.username}}
    /// {{user._id}}
    <button
    @click="navigateTo({
      name: 'chat',
      params: {
        userId: user._id
        }
      })">
      View Chat
      </button>
      <div v-if="totalPages() > 0" class="pagination-wrapper">
    <span v-if="showPreviousLink()" class="pagination-btn" v-on:click="updatePage(currentPage - 1)"> &lt; </span>
    {{ currentPage + 1 }} of {{ totalPages() }}
    <span v-if="showNextLink()" class="pagination-btn" v-on:click="updatePage(currentPage + 1)"> &gt; </span>
  </div>
  </div>
</div>
</template>

<script>
import ChatsService from '@/services/ChatsService'
export default {
  data () {
    return {
      users: {},
      visibleUsers: {},
      currentPage: 0,
      pageSize: 5
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    updateVisibleUsers () {
      this.visibleUsers = this.users.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize)
      if (this.visibleUsers.length === 0 && this.currentPage > 0) {
        this.updatePage(this.currentPage - 1)
      }
    },
    updatePage (pageNumber) {
      this.currentPage = pageNumber
      this.updateVisibleUsers()
    },
    totalPages () {
      return Math.ceil(this.users.length / this.pageSize)
    },
    showPreviousLink () {
      return this.currentPage !== 0
    },
    showNextLink () {
      return this.currentPage !== (this.totalPages() - 1)
    }
  },
  async mounted () {
    if (!this.$store.state.isUserLoggedIn) {
      this.$router.push({
        name: 'offers'
      })
    } else {
      this.users = (await ChatsService.index()).data
      this.updateVisibleUsers()
    }
  }
}
</script>

<style scoped></style>
