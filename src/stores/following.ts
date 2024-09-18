import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as nip19 from 'nostr-tools/nip19'
import { SimplePool } from 'nostr-tools/pool'

const pool = new SimplePool()
const relays = [
  'wss://purplepag.es/',
  'wss://nos.lol/',
  'wss://relay.damus.io/',
  'wss://nostr.mom/',
  'wss://relay.nostr.band/',
  'wss://relay.nostr.bg/'
]

export const useFollowingsStore = defineStore('followings', () => {
  const followings = ref([])
  const counter = ref(0)
  const isLoaded = ref(false)

  async function fetchData() {
    if (isLoaded.value) return

    let npub = 'npub10wlfumja930vzz4jhh9vc6t3wy8ay7thg8mt9qcptlp5leqfmazqn79ee9'
    let { type, data: pk } = nip19.decode(npub)

    try {
      let events = await pool.querySync(relays, {
        kinds: [3],
        authors: [pk]
      })

      if (events.length > 0 && events[0].kind === 3) {
        let followingsData = events[0].tags
          .filter((tag) => tag[0] === 'p') // 'p' tags are public keys of followers
          .map((tag) => tag[1]) // Extract the follower public key

        counter.value = followingsData.length

        let eventPersonalData = await pool.querySync(relays, {
          kinds: [0],
          authors: followingsData
        })

        eventPersonalData = reduceDuplicates(eventPersonalData)

        eventPersonalData.forEach(async (event) => {
          let profile = JSON.parse(event.content)
          profile.npub = nip19.npubEncode(event.pubkey)

          //if (profile.picture === undefined || !testImageUrl(profile.picture)) {
          //    profile.picture = getIdenticon(profile.npub)
          //}

          followings.value.push(profile)
        })

        isLoaded.value = true
      }
    } catch (error) {
      console.error('Error fetching followers:', error)
    }
  }

  function reduceDuplicates(data) {
    const uniqueMap = new Map()

    data.forEach((obj) => {
      const existingObj = uniqueMap.get(obj.pubkey)

      if (!existingObj || obj.created_at > existingObj.created_at) {
        uniqueMap.set(obj.pubkey, obj)
      }
    })

    return Array.from(uniqueMap.values())
  }

  async function update() {
    isLoaded.value = false
  }

  return { followings, counter, fetchData }
})
