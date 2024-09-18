<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/Auth.ts'
import { useUserStore } from '../stores/User.js'

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
  <div class="profile card">
    <header class="profile__head">
      <h1 class="profile__title">
        {{ data.name }}
      </h1>

      <nav class="profile__nav">
        <a href="/" class="btn btn-primary">
          <img src="/qrcode.svg" width="15" alt="QR Code" style="display: block" />
        </a>
        &nbsp;
        <a href="/" class="btn btn-primary">
          <img src="/pencil.svg" width="15" alt="Edit" style="display: block" />
        </a>
      </nav>
      <!-- /.profile_nav -->
    </header>
    <!-- /.profile__head -->

    <div v-if="data.about" v-html="data.about" class="profile__about"></div>

    <div class="info">
      <div v-if="data.nip05" class="row">
        <div class="col col-3">
          <span class="info__title">
            <img src="/profile.svg" width="15" alt="Profile" style="display: inline-block" />
            &nbsp; Nostr address:
          </span>
        </div>
        <!-- /.col -->

        <div class="col">
          {{ data.nip05 }} &nbsp;
          <a href=".">
            <img src="/copy.svg" width="15" alt="Copy" style="display: inline-block" />
          </a>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->

      <div v-if="data.lud16" class="row">
        <div class="col col-3">
          <span class="info__title">
            <img src="/btc.svg" width="15" alt="Profile" style="display: inline-block" />
            &nbsp; LN address:
          </span>
        </div>
        <!-- /.col -->

        <div class="col">
          {{ data.lud16 }}
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->

      <div class="row">
        <div class="col col-3">
          <span class="info__title">
            <img src="/key.svg" width="15" alt="Profile" style="display: inline-block" />
            &nbsp; Public key:
          </span>
        </div>
        <!-- /.col -->

        <div class="col">
          {{ data.pubkey }} &nbsp;
          <a href=".">
            <img src="/copy.svg" width="15" alt="Copy" style="display: inline-block" />
          </a>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->

      <div v-if="data.website" class="row">
        <div class="col col-3">
          <span class="info__title">
            <img src="/link.svg" width="15" alt="Profile" style="display: inline-block" />
            &nbsp; Website:
          </span>
        </div>
        <!-- /.col -->

        <div class="col">
          <a :href="data.website">
            {{ data.website }}
          </a>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </div>
    <!-- /.info -->
  </div>
  <!-- /.profile -->
</template>

<style scoped></style>
