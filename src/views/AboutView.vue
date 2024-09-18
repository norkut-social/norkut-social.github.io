<script setup lang="ts">
//import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'
//import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie"
//import 'websocket-polyfill'
//
//const dexieAdapter = new NDKCacheAdapterDexie({ dbName: 'your-db-name' })
//
//const ndk = new NDK({
//  explicitRelayUrls: [
//    'wss://relay.nostr.band/',
//    'wss://relay.damus.io',
//    'wss://nostr-pub.wellorder.net',
//    'wss://nostr-relay.wlvs.space',
//    'wss://relay.nostr.band',
//    'wss://nos.lol'
//    // Add more relays as needed
//  ],
//  cacheAdapter: dexieAdapter
//});
//
//async function init(params) {
//  await ndk.connect();
//
//  const npubA = await ndk.getUser({ npub: "npub170tczj2c4fjuw0swuyls45a4hkrpqtysh6ca43avdwxph7v4r3vsppdy0a" });
//  await npubA.fetchProfile();
//
//  const fullProfile = npubA.profile;
//  console.log(fullProfile)
//  const feedEvents = await ndk.fetchEvents({ kinds: [1], authors: ['f3d7814958aa65c73e0ee13f0ad3b5bd86102c90beb1dac7ac6b8c1bf9951c59'] }, { subId: "feed"});
//  console.log(feedEvents.size, feedEvents)
//  //const feedEvents = await npubA.feed();
//  //console.log(feedEvents)
//
//
//  //const nip07signer = new NDKNip07Signer();
//  //const ndk = new NDK({ signer: nip07signer });
//  //const ndkEvent = new NDKEvent(ndk)
//  //ndkEvent.kind = 1
//  //ndkEvent.content = 'Hello, world!'
//  //ndkEvent.publish()
//
//  //const nip07signer = new NDKNip07Signer();
//  //const ndk = new NDK({ signer: nip07signer });
//
//  //nip07signer.user().then(async (user) => {
//  //if (!!user.npub) {
//  //    console.log("Permission granted to read their public key:", user.npub);
//  //}
//  //});
//}
//init()
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
