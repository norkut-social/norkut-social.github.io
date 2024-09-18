import { defineStore } from 'pinia'
import * as nip19 from 'nostr-tools/nip19'

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]] // Swap elements
  }
  return array
}

function abbreviatePublicKey(input, withEnd = true) {
  if (input.length <= 18) {
    return input // Return the input if it's too short to transform
  }

  const start = input.slice(0, 4) // Get the first 7 characters
  const end = input.slice(-4) // Get the last 8 characters

  let res = `${start}...${end}`
  if (!withEnd) {
    res = `${start}...`
  }

  return res
}

export const useUserStore = defineStore({
  id: 'user-store',
  state: () => ({
    npub: '',
    pubkey: '',
    name: '',
    picture: '',
    about: '',
    nip05: '',
    lud16: '',
    customRelays: [],
    followings: [],
    followingsCounter: 0,
    followers: [],
    followersCounter: 0,
    feed: [],
    communities: [],
    signedIn: false,
    loggedOut: true
  }),
  actions: {
    setNpub(npub) {
      this.npub = npub
    },
    setName(name) {
      this.name = name
    },
    async login(user, ndk) {
      this.pubkey = user.pubkey
      await this.fetchProfile(user, ndk)
      this.signedIn = true
      this.loggedOut = false
      this.fetchFollowings(user, ndk)
      this.fetchFollowers(user, ndk)
    },
    logout() {
      // @todo how dow we logout / disconnect from the signer with NDK?
      this.loggedOut = true
      this.signedIn = false
    },
    // Fetch profile of user with
    // https://ndk.fyi/docs/classes/NDKUser.html#fetchProfile
    async fetchProfile(user, ndk) {
      this.picture = ''

      try {
        user = ndk.getUser({
          npub: user.npub
        })
        if (user.profile === undefined) {
          await user.fetchProfile()
          console.log(user)
          this.pubkey = user.profile.pubkey
          this.npub = user.npub
          this.name = user.profile.displayName || user.profile.display_name || user.profile.name
          this.picture = user.profile.image
          this.about = user.profile.about
          this.nip05 = user.profile.nip05
          this.lud16 = user.profile.lud16
        }
      } catch (error) {
        console.log(error)
      }
    },

    // Fetch followings of user
    async fetchFollowings(user, ndk) {
      this.followings = []
      this.followingsCounter = 0

      let events = await ndk.fetchEvents(
        {
          kinds: [3],
          authors: [user.pubkey]
        },
        { subId: 'followings' }
      )

      events = Array.from(events)

      if (events.length > 0) {
        let followingsData = events[0].tags
          .filter((tag) => tag[0] === 'p') // 'p' tags are public keys of followers
          .map((tag) => tag[1]) // Extract the follower public key

        followingsData = shuffleArray(followingsData)

        this.followingsCounter = followingsData.length

        followingsData.forEach(async (pubkey) => {
          let npub = nip19.npubEncode(pubkey)
          this.followings.push({
            npub,
            name: abbreviatePublicKey(npub)
          })
        })

        let partSize = 1000
        let tempFollowings = []

        if (this.followingsCounter >= 1500) {
          for (let i = 0; i < Math.ceil(this.followingsCounter / partSize); i++) {
            let part = followingsData.slice(i * partSize, (i + 1) * partSize)

            let eventsPersonalData = await ndk.fetchEvents(
              {
                kinds: [0],
                authors: part
              },
              { subId: 'followings-profiles' }
            )

            eventsPersonalData.forEach(async (event) => {
              let profile = JSON.parse(event.content)
              profile.npub = nip19.npubEncode(event.pubkey)
              profile.name = profile.display_name || profile.name || profile.displayName

              tempFollowings.push(profile)
            })

            this.followings = tempFollowings
          }
        } else {
          let eventsPersonalData = await ndk.fetchEvents(
            {
              kinds: [0],
              authors: followingsData
            },
            { subId: 'followings-profiles' }
          )

          eventsPersonalData.forEach(async (event) => {
            let profile = JSON.parse(event.content)
            profile.npub = nip19.npubEncode(event.pubkey)
            profile.name = profile.display_name || profile.name || profile.displayName

            tempFollowings.push(profile)
          })

          this.followings = tempFollowings
        }
      }
    },

    // Fetch followings of user
    async fetchFollowers(user, ndk) {
      this.followers = []
      this.followersCounter = 0

      let events = await ndk.fetchEvents(
        {
          kinds: [3],
          '#p': [user.pubkey]
        },
        { subId: 'followers' }
      )

      events = Array.from(events)

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

        followersData = shuffleArray(followersData)

        this.followersCounter = followersData.length

        followersData.forEach(async (pubkey) => {
          let npub = nip19.npubEncode(pubkey)
          this.followers.push({
            npub,
            name: abbreviatePublicKey(npub)
          })
        })

        let partSize = 1000
        let tempFollowers = []

        if (this.followersCounter >= 1500) {
          for (let i = 0; i < Math.ceil(this.followersCounter / partSize); i++) {
            let part = followersData.slice(i * partSize, (i + 1) * partSize)

            let eventsPersonalData = await ndk.fetchEvents(
              {
                kinds: [0],
                authors: part
              },
              { subId: 'followers-profiles' }
            )

            eventsPersonalData.forEach(async (event) => {
              let profile = JSON.parse(event.content)
              profile.npub = nip19.npubEncode(event.pubkey)
              profile.name = profile.display_name || profile.name || profile.displayName

              tempFollowers.push(profile)
            })

            this.followings = tempFollowers
          }
        } else {
          let eventsPersonalData = await ndk.fetchEvents(
            {
              kinds: [0],
              authors: followersData
            },
            { subId: 'followers-profiles' }
          )

          eventsPersonalData.forEach(async (event) => {
            let profile = JSON.parse(event.content)
            profile.npub = nip19.npubEncode(event.pubkey)
            profile.name = profile.display_name || profile.name || profile.displayName

            tempFollowers.push(profile)
          })

          this.followers = tempFollowers
        }
      }
    },

    async fetchFeed(user, ndk) {
      this.feed = []

      let events = await ndk.fetchEvents(
        { kinds: [1], authors: [user.pubkey], limit: 1000 },
        { subId: 'feed' }
      )

      events.forEach(async (item) => {
        if (item.kind === 1) {
          if (item.tags.some((subArray) => subArray.includes('e'))) {
            return
          }

          let formattedText = item.content.replace(/<br\s*\/?>/gi, '\n')

          formattedText = formattedText.replace(
            /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp))/gi,
            '<img src="$1" alt="Image" style="width:100%">'
          )

          formattedText = formattedText.replace(/\n/g, '<br>')

          const urlRegex =
            /https:\/\/(?!.*(?:jpg|jpeg|png|gif|bmp|webp|mp4|avi|mov|wmv|flv|mkv|youtube\.com|youtu\.be))[^ \n"<>'"]+/gi
          formattedText = formattedText.replace(urlRegex, (match) => {
            return `<a href="${match}" target="_blank">${match}</a>`
          })

          const videoRegex = /(https?:\/\/\S+\.(?:mp4|webm|ogg|mov))/g
          formattedText = formattedText.replace(
            videoRegex,
            '<video controls><source src="$1" type="video/mp4">Your browser does not support the video tag.</video>'
          )

          const npubRegex = /\bnostr:(npub[0-9a-z]+)\b/g
          formattedText = formattedText.replace(npubRegex, (match, npub) => {
            return `<a href="/profile/${npub}">${npub}</a>`
          })

          item.content = formattedText

          this.feed.push(item)
        }

        if (item.kind === 6) {
          //console.log(item)

          item.content = JSON.parse(item.content)
          item.content.loading = true

          this.feed.push(item)
        }
      })

      this.feed = this.feed.sort((a, b) => b.created_at - a.created_at)

      //this.feed.forEach(async (item, index) => {
      //  if (item.kind === 6) {
      //    this.feed[index].content.metadata = await getUserMetadata(item.content.pubkey)
      //    this.feed[index].content.loading = false
      //  }
      //})

      //console.log(this.feed)
    },

    // Fetch profile with an event request.
    async fetchProfileKind0(user, ndk) {
      // @todo
      // Fetch the newest event kind 0 from user with an event.
      try {
        const filter = {
          kinds: [0],
          authors: [user.hexpubkey]
        }
        return await ndk.fetchEvent(filter)
      } catch (e) {
        console.log(e)
        alert(e)
      }
    }
  },
  getters: {}
})
