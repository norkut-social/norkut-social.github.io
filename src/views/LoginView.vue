<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NDKNip07Signer, NDKNip46Signer } from '@nostr-dev-kit/ndk'
import { useAuthStore } from '../stores/Auth'
import { useNdkStore } from '../stores/Ndk'

const NdkStore = useNdkStore()
const nip07signer = new NDKNip07Signer()
const AuthStore = useAuthStore()
const modalRef = ref(null)
const router = useRouter()

const loginExtension = async () => {
  try {
    NdkStore.resetExplicitRelays()
    await NdkStore.initNdk()
    NdkStore.ndk.signer = nip07signer
    await NdkStore.ndk.connect()
    const user = await nip07signer.user()
    await AuthStore.login(user, NdkStore.ndk)
    router.push('/profile')
  } catch (e) {
    console.log(e)
    alert(e)
  }
}

const loginNostrConnect = () => {
  // @todo
  // open Modal
  try {
    console.log('open the modal')
    modalRef.value.show()
  } catch (e) {
    console.log(e)
    alert(e)
  }
}
</script>
<template>
  <div class="container">
    <!--div v-if="AuthStore.signedIn">
      <p class="text-center">
        Welcome <strong>{{ AuthStore.name }}</strong>
        <br />
        <code>{{ AuthStore.npub }}</code>
        <br />
        <br />
        <router-link to="/profile">View your profile here</router-link>
      </p>
      <button @click="AuthStore.logout(NdkStore.ndk)">Logout</button>
    </div-->
    <!--div v-else-->
    <div>
      <button @click="loginExtension">Connect with extension (NIP-07)</button>
      <!--button @click="loginNostrConnect">
        Connect with Nostr Connect (NIP-46)
      </button-->
    </div>
    <!--Modal :open="false" ref="modalRef">
      <label>
        Enter your bunker URL:
        <input type="text" name="bunker" class="bg-purple-100 w-full p-2" />
      </label>
    </Modal-->
  </div>
</template>
