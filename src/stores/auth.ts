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

export const useAuthStore = defineStore('auth', () => {
  const user = ref({})
  const status = ref(null)
  const isAuthenticated = ref(false)

  const followings = ref([])
  const followingsCounter = ref(0)
  const isFollowingsLoaded = ref(false)

  const followers = ref([])
  const followersCounter = ref(0)
  const isFollowersLoaded = ref(false)

  async function fetchData(npub) {
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

  async function fetchFollowings(npub) {
    if (isFollowingsLoaded.value) return

    let { type, data: pk } = nip19.decode(npub)

    try {
      let events = await pool.querySync(relays, {
        kinds: [3],
        authors: [pk]
      })

      if (events.length > 0) {
        let followingsData = events[0].tags
          .filter((tag) => tag[0] === 'p') // 'p' tags are public keys of followers
          .map((tag) => tag[1]) // Extract the follower public key

        followingsCounter.value = followingsData.length

        let eventPersonalData = await pool.querySync(relays, {
          kinds: [0],
          authors: followingsData
        })

        eventPersonalData = reduceDuplicates(eventPersonalData)

        eventPersonalData.forEach(async (event) => {
          let profile = JSON.parse(event.content)
          profile.npub = nip19.npubEncode(event.pubkey)

          followings.value.push(profile)
        })

        isFollowingsLoaded.value = true
      }
    } catch (error) {
      console.error('Error fetching followers:', error)
    }
  }

  async function fetchFollowers(npub) {
    if (isFollowersLoaded.value) return

    let { type, data: pk } = nip19.decode(npub)

    try {
      let events = await pool.querySync(relays, {
        kinds: [3],
        '#p': [pk]
      })

      let followersData = []

      if (events.length > 0) {
        events = events.filter(
          (obj, index, self) => index === self.findIndex((o) => o.pubkey === obj.pubkey)
        )

        events.forEach((item) => {
          if (item.kind === 3) {
            followersData.push(item.pubkey)
          }
        })

        followersCounter.value = followersData.length

        let eventPersonalData = await pool.querySync(relays, {
          kinds: [0],
          authors: followersData
        })

        eventPersonalData = reduceDuplicates(eventPersonalData)

        eventPersonalData.forEach(async (event) => {
          let profile = JSON.parse(event.content)
          profile.npub = nip19.npubEncode(event.pubkey)

          followers.value.push(profile)
        })

        followers.value = shuffleArray(followers.value)
      }

      isFollowersLoaded.value = true
    } catch (error) {
      console.error('Error fetching followers:', error)
    }
  }

  async function fetchCommunities(npub) {
    let { type, data: pk } = nip19.decode(npub)

    try {
      let events = await pool.querySync(relays, {
        kinds: [10004],
        authors: [pk]
        //kinds: [10004] all communities
        //kinds: [30001], "#d": ["communities"]
        //kinds: [40], authors: [pk]
      })

      events.forEach(async (event) => {
        console.log(event)

        //event.tags.forEach(async (tag) => {
        //    let community = tag[1].split(':')

        //    let communityMetadata = await pool.querySync(relays, {
        //        kinds: [Number(community[0])],
        //        authors: [community[1]],
        //        '#d': [community[2]],
        //    })

        //    //console.log(communityMetadata)

        //    if (communityMetadata[0].tags[2][1] === undefined || !await testImageUrl(communityMetadata[0].tags[2][1])) {
        //        communityMetadata[0].tags[2][1] = getIdenticon(communityMetadata[0].pubkey)
        //    }

        //    communities.push({
        //        name: communityMetadata[0].tags[0][1],
        //        picture: communityMetadata[0].tags[2][1],
        //        pubkey: communityMetadata[0].pubkey
        //    })

        //    communitiesCounter++

        //    //console.log(communities)

        //    communities = [...communities]
        //})
      })
    } catch (error) {
      console.error('Error fetching personal data:', error)
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]] // Swap elements
    }
    return array
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

  async function login() {
    // Simulating an API call to log in the user
    try {
      // Imagine userData contains information from an API response
      user.value = userData
      isAuthenticated.value = true
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Login failed')
    }
  }

  async function logout() {}

  async function update() {}

  return {
    user,
    status,
    followings,
    followingsCounter,
    followers,
    followersCounter,
    isAuthenticated,
    fetchData,
    fetchFollowings,
    fetchFollowers,
    fetchCommunities
  }
})
