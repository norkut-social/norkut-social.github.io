<script setup lang="ts">
import { useAuthStore } from '../stores/Auth.ts'

const AuthStore = useAuthStore()
</script>

<template>
  <!--{{ $t('message.hello') }}
  <div class="locale-changer">
    <select v-model="$i18n.locale">
      <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
        {{ locale }}
      </option>
    </select>
  </div-->

  <header v-if="AuthStore.signedIn" class="head">
    <div class="container">
      <div class="row row--center">
        <div class="col col-2">
          <a href="/feed" class="head-logo">
            <img src="/norkut-typo.png" alt="Norkut" class="head-logo__img" />
          </a>
          <!-- /.head-logo -->
        </div>
        <!-- /.col -->

        <nav class="col">
          <ul class="head-nav">
            <!--li>
              <router-link :to="'/notifications'">Notificações</router-link>
            </li-->
            <li>
              <router-link :to="'/profile'">Perfil</router-link>
            </li>
            <li>
              <router-link :to="'/followings'">Seguindo</router-link>
            </li>
            <li>
              <router-link :to="'/followers'">Seguidores</router-link>
            </li>
            <li><router-link to="/communities">Comunidades</router-link></li>
          </ul>
          <!-- /.head-nav -->
        </nav>
        <!-- /.col -->

        <div class="col">
          <input type="search" name="" class="search-input" placeholder="Pesquisar" />
        </div>
        <!-- /.col -->

        <div class="col">
          <div class="head-media">
            <div class="head-media__body">
              <h3>
                {{ AuthStore.name }}
              </h3>
              <div v-if="AuthStore.nip05 !== undefined">
                {{ AuthStore.nip05 }}
              </div>
            </div>
            <img :src="AuthStore.picture" alt="" class="head-media__img circle" />
            <div class="head-media__arrow">&#x25BC;</div>
          </div>
          <!-- /.head-media -->
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </div>
    <!-- /.container -->
  </header>
  <!-- /.head -->
</template>

<style scoped></style>
