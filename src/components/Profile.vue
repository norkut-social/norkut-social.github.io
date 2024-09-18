<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import { fetchProfile } from '../helpers/nostr.ts'
import { useNdkStore } from '../stores/Ndk'
import { useAuthStore } from '../stores/Auth.ts'
import { useUserStore } from '../stores/User.js'
import getIdenticon from '../helpers/getIdenticon.ts'

const NdkStore = useNdkStore()
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
</script>

<template>
  <div class="user">
    <div class="user__banner"></div>

    <router-link to="" class="user-photo circle">
      <!--:src="data.picture || getIdenticon(props.npub)"-->
      <img :src="data.picture || getIdenticon(props.npub)" alt="" class="user-photo__img circle" />
    </router-link>

    <div class="user-info">
      <!--p>Perfil de</p-->
      <h1 class="user-info__name">
        {{ data.name }}
      </h1>
      <!--p class="user-info__status">
        {{ data.status }}
      </p-->

      <br />

      <a href="/" class="btn btn-primary">+ Seguir</a>
    </div>

    <nav>
      <ul class="user-nav">
        <li>
          <a href="/" class="active"> Meu perfil </a>
        </li>
        <li>
          <a href="/"> Mensagens (4) </a>
        </li>
        <li>
          <a href="/"> Notificações </a>
        </li>
      </ul>
    </nav>
    <!-- /.user-nav -->
  </div>
  <!-- /.user -->
</template>

<style scoped></style>
