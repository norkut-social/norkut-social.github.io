<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Profile from '../components/Profile.vue'
import ProfileInfo from '../components/ProfileInfo.vue'

const route = useRoute()
//const { npub } = route.params

const npub = computed(() => {
  return route.params.npub
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

        <div class="col col-6">
          <ProfileInfo :npub="npub" />

          <div class="feed">
            <header class="feed__head">
              <h1 class="feed__title">Publicações</h1>
            </header>
            <!-- /.feed__head -->

            <div class="feed__body"></div>
            <!-- /.feed__body -->
          </div>
          <!-- /.feed -->
        </div>
        <!-- /.col -->

        <div class="col col-3">
          <div class="followers card">
            <header class="followers-head">
              <h2 class="followers-head__title">Seguidores ()</h2>
              <a href="/followers/" class="followers-head__more">Ver todos</a>
            </header>

            <div class="followers-body">
              <div class="row"></div>
              <!-- /.row -->
            </div>
          </div>
          <!-- /.followers -->

          <div class="following card">
            <header class="followers-head">
              <h2 class="followers-head__title">Seguindo ()</h2>
              <a href="/followings/" class="followers-head__more">Ver todos</a>
            </header>

            <div class="followers-body">
              <div class="row"></div>
              <!-- /.row -->
            </div>
          </div>
          <!-- /.following -->

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
    </div>
    <!-- /.container -->
  </div>
  <!-- /.main -->
</template>
