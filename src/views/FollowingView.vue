<script setup lang="ts">
import Profile from '../components/Profile.vue'
import Followings from '../components/Followings.vue'
import { computed, onMounted, onUpdated } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/Auth.js'
import { useUserStore } from '../stores/User.js'
import { useNdkStore } from '../stores/Ndk'

const NdkStore = useNdkStore()
//const AuthStore = useAuthStore()
const route = useRoute()

const npub = computed(() => {
  return route.params.npub
})

async function getData() {
  NdkStore.resetExplicitRelays()
  await NdkStore.initNdk()

  if (npub.value) {
    const user = { npub: npub.value }
    const UserStore = useUserStore()
    await UserStore.fetchProfile(user, NdkStore.ndk)
    UserStore.fetchFollowings(UserStore, NdkStore.ndk)
    UserStore.fetchFollowers(UserStore, NdkStore.ndk)
    UserStore.fetchFeed(UserStore, NdkStore.ndk)
  } else {
    const UserStore = useAuthStore()
  }
}

onMounted(() => {
  getData()
})

onUpdated(async () => {
  getData()
})
</script>

<template>
  <!--div v-if="!route.params.npub" class="container">Profile</div>
  <div v-if="route.params.npub" class="container">Profile Npub: {{ route.params.npub }}</div-->

  <div class="main">
    <div class="container">
      <div class="row">
        <div class="col col-3">
          <Profile :npub="npub" />
        </div>
        <!-- /.col -->

        <div class="col">
          <Followings :npub="npub" type="full" />
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </div>
    <!-- /.container -->
  </div>
  <!-- /.main -->
</template>
