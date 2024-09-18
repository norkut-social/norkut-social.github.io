<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/Auth.ts'
import { useUserStore } from '../stores/User.js'
import getIdenticon from '../helpers/getIdenticon.ts'

const props = defineProps(['npub', 'type'])

let data = computed(() => {
  if (props.npub) {
    return useUserStore()
  } else {
    return useAuthStore()
  }
})

function loadFallbackImage(event) {
  const npub = event.target.dataset.npub
  event.target.src = getIdenticon(npub)
}
</script>

<template>
  <div v-if="props.type === 'full'" class="card">
    <h1>Seguindo ({{ data.followingsCounter }})</h1>

    <div class="followers-body">
      <div class="row">
        <div v-for="(item, key) in data.followings" :key="key" class="col">
          <div class="followers-item">
            <router-link :to="'/profile/' + item.npub" class="followers-item__photo circle">
              <img
                :src="item.picture || getIdenticon(item.npub)"
                :data-npub="item.npub"
                @error="loadFallbackImage"
                alt=""
                class="followers-item__img circle"
              />
            </router-link>
            <h5 class="followers-item__name">
              {{ item.name }}
            </h5>
          </div>
          <!-- /.followers-item -->
        </div>
      </div>
      <!-- /.row -->
    </div>
    <!-- /.followers-body -->
  </div>
  <!-- /.card -->

  <div v-if="props.type === 'short'" class="card">
    <header class="followers-head">
      <h2 class="followers-head__title">Seguindo ({{ data.followingsCounter }})</h2>
      <router-link
        :to="props.npub === undefined ? '/followings' : '/followings/' + props.npub"
        class="followers-head__more"
        >Ver todos</router-link
      >
    </header>

    <div class="followers-body">
      <div class="row">
        <div v-for="(item, key) in data.followings.slice(0, 6)" :key="key" class="col">
          <div class="followers-item">
            <router-link :to="'/profile/' + item.npub" class="followers-item__photo circle">
              <img
                :src="item.picture || getIdenticon(item.npub)"
                :data-npub="item.npub"
                @error="loadFallbackImage"
                alt=""
                class="followers-item__img circle"
              />
            </router-link>
            <h5 class="followers-item__name">
              {{ item.name }}
            </h5>
          </div>
          <!-- /.followers-item -->
        </div>
      </div>
      <!-- /.row -->
    </div>
    <!-- /.followers-body -->
  </div>
  <!-- /.card -->
</template>

<style scoped></style>
