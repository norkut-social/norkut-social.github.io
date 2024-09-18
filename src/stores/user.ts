import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as nip19 from 'nostr-tools/nip19'
import { SimplePool } from 'nostr-tools/pool'
import getIdenticon from '../helpers/getIdenticon.ts'
import { getProfile } from '../helpers/nostr.ts'

const pool = new SimplePool()
const relays = [
  'wss://purplepag.es/',
  'wss://nos.lol/',
  'wss://relay.damus.io/',
  'wss://nostr.mom/',
  'wss://relay.nostr.band/',
  'wss://relay.nostr.bg/'
]

export const useUserStore = defineStore('user', () => {
  const user = ref({})
  const status = ref(null)

  async function fetchData(npub) {
    user.value = {}

    let { type, data: pk } = nip19.decode(npub)

    let personalData = {
      displayName: '',
      display_name: '',
      name: '',
      about: '',
      picture: getIdenticon(npub),
      pubkey: pk,
      npub
    }

    user.value = personalData

    const data = await getProfile(npub)

    user.value = data.user
    status.value = data.status
  }

  async function update() {}

  return { user, status, fetchData }
})
