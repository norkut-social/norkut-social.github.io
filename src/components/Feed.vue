<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/Auth.ts'
import { useUserStore } from '../stores/User.js'
import getIdenticon from '../helpers/getIdenticon.ts'

const props = defineProps(['npub'])

let userStore = {}

let data = computed(() => {
  if (props.npub) {
    userStore = useUserStore()
  } else {
    userStore = useAuthStore()
  }

  return userStore
})

function formatTimestamp(timestamp) {
    // Convert the timestamp to milliseconds
    const date = new Date(timestamp * 1000);
    const now = new Date();
    
    // Helper functions to format time
    const getFormattedTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const isToday = (date) => {
        return date.toDateString() === now.toDateString();
    };

    const getFormattedDate = (date) => {
        if (isToday(date)) {
            return `Today, ${getFormattedTime(date)}`;
        }
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return `${dayNames[date.getDay()]} ${getFormattedTime(date)}`;
    };

    const getRelativeTime = (date) => {
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'less than an hour ago';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
        return `${Math.floor(diffInDays / 365)} years ago`;
    };

  return `${getFormattedDate(date)}, ${getRelativeTime(date)}`
}

function loadFallbackImage(event) {
  const npub = event.target.dataset.npub
  event.target.src = getIdenticon(npub)
}
</script>

<template>
  <div class="feed">
    <header class="feed__head">
      <h2 class="feed__title">Publicações</h2>
    </header>
    <!-- /.feed__head -->

    <div class="feed__body">
      <div v-for="(item, index) in data.feed" :key="index" class="feed-item">
        <div v-if="item.kind === 1" class="feed-media">
          <img :src="data.picture" alt="" class="feed-media__img circle" />
          <div class="feed-media__body">
            <header class="feed-media__body-head">
              <h3>{{ data.name }}</h3>
              <p>
                <a :href="'/note/' + item.id" class="link">{{ formatTimestamp(item.created_at) }}</a>
              </p>
            </header>
            <div v-if="item.content" v-html="item.content"></div>
          </div>
        </div>
        <!-- /.feed-media -->

        <div v-if="item.kind === 6" class="feed-media"></div>
        <!-- /.feed-media -->
      </div>
      <!-- /.feed-item -->
    </div>
    <!-- /.feed__body -->
  </div>
  <!-- /.feed -->
</template>
