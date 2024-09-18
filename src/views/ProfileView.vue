<script setup lang="ts">
import { computed, onMounted, onUpdated } from 'vue'
import { useRoute } from 'vue-router'
import Profile from '../components/Profile.vue'
import ProfileInfo from '../components/ProfileInfo.vue'
import Followings from '../components/Followings.vue'
import Followers from '../components/Followers.vue'
import Feed from '../components/Feed.vue'
import { useAuthStore } from '../stores/Auth.js'
import { useUserStore } from '../stores/User.js'
import { useNdkStore } from '../stores/Ndk'

const NdkStore = useNdkStore()
const AuthStore = useAuthStore()
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
      <div v-if="AuthStore.signedIn" class="row">
        <div class="col col-3">
          <Profile :npub="npub" />
        </div>
        <!-- /.col -->

        <div class="col col-6">
          <ProfileInfo :npub="npub" />

          <Feed :npub="npub" />

          <!--form class="feed-form">
            <input type="text" placeholder="What's on your mind?" />
            <button type="submit">Publicar</button>
          </form-->
          <!-- /.feed-form -->
        </div>
        <!-- /.col -->

        <div class="col col-3">
          <Followings :npub="npub" type="short" />

          <Followers :npub="npub" type="short" />

          <div class="communities card">
            <header class="followers-head">
              <h2 class="followers-head__title">Comunidades ()</h2>
              <a href="/communities/" class="followers-head__more">Ver todos</a>
            </header>

            <div class="followers-body">
              <div class="row"></div>
              <!-- /.row -->
            </div>
          </div>
          <!-- /.communities -->
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->

      <div v-else>
        <router-link
          to="/login"
          class="block text-purple-500 mt-6 p-2 mx-auto bg-purple-100 hover:bg-purple-200"
        >
          You need to login first
        </router-link>
      </div>
    </div>
    <!-- /.container -->
  </div>
  <!-- /.main -->
</template>
