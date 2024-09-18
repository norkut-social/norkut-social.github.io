import { defineStore } from 'pinia'
import NDK from '@nostr-dev-kit/ndk'
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie'

const dexieAdapter = new NDKCacheAdapterDexie({ dbName: 'your-db-name' })

export const useNdkStore = defineStore({
  id: 'ndk-store',
  /**
   *
   * @returns {
   *   {
   *     defaultOutboxRelayUrls: string[],
   *     ndk: NDK,
   *     defaultExplicitRelayUrls: string[],
   *     explicitRelayUrls: *[],
   *     enableOutboxModel: boolean,
   *     initialized: boolean,
   *     outboxRelayUrls: *[]
   *   }
   * }
   */
  state: () => ({
    initialized: false,
    defaultExplicitRelayUrls: [
      //'wss://nostr.sebastix.dev',
      'wss://nos.lol/',
      'wss://relay.damus.io/',
      'wss://nostr.mom/'
      //'wss://nostr.oxtr.dev/',
      //'wss://nostr.fmt.wiz.biz/',
      //'wss://nostr.bitcoiner.social/',
      //'wss://relay.nostr.band/',
      //'wss://relay.nostr.bg/',
      //'wss://nostr.wine/'
    ],
    explicitRelayUrls: [],
    defaultOutboxRelayUrls: ['wss://purplepag.es'],
    outboxRelayUrls: [],
    enableOutboxModel: false,
    ndk: null
  }),
  actions: {
    async initNdk() {
      if (this.ndk === null) {
        let options = {
          explicitRelayUrls: this.explicitRelayUrls.length
            ? this.explicitRelayUrls
            : this.defaultExplicitRelayUrls,
          outboxRelayUrls: this.outboxRelayUrls.length
            ? this.outboxRelayUrls
            : this.defaultOutboxRelayUrls,
          enableOutboxModel: this.enableOutboxModel,
          cacheAdapter: dexieAdapter
        }
        this.ndk = new NDK(options)
        this.initialized = true
      }
    },
    // @todo
    // - add an explicit relay
    // @todo
    // - remove an explicit relay
    // - set explicit relays (override current list)
    setExplicitRelays(relays = []) {
      this.explicitRelayUrls = relays
    },
    // - reset explicit relays (set to defaults)
    resetExplicitRelays() {
      this.explicitRelayUrls = this.defaultExplicitRelayUrls
    },
    // @todo
    // - add outbox relay
    // @todo
    // - remove outbox relay
    // - set outbox relays (override current list)
    setOutBoxRelays(relays = []) {
      this.outboxRelayUrls = relays
    },
    // @todo
    // - connect
    // @todo
    // - disconnect
    // @todo
    // - reconnect (disconnect and connect)
    // - reset outbox relays
    resetOutboxModelRelays() {
      this.outboxRelayUrls = this.defaultOutboxRelayUrls
    },
    // - set outboxModal modus with a boolean
    setOutboxModel(bool) {
      this.enableOutboxModel = bool
    }
  },
  getters: {
    getDefaultExplicitRelays(state) {
      return state.defaultExplicitRelayUrls
    },
    getDefaultOutboxRelays(state) {
      return state.defaultOutboxRelayUrls
    }
  }
})
