import * as nip19 from 'nostr-tools/nip19'
import { SimplePool } from 'nostr-tools/pool'
import getIdenticon from './getIdenticon.ts'

const pool = new SimplePool()
const relays = [
  // 'wss://purplepag.es/',
  'wss://nos.lol/',
  'wss://relay.damus.io/',
  'wss://nostr.mom/',
  'wss://relay.nostr.band/',
  'wss://relay.nostr.bg/'
]

export async function getProfile(npub) {
  let { type, data: pk } = nip19.decode(npub)
  let status = null

  let personalData = {
    displayName: '',
    display_name: '',
    name: '',
    about: '',
    picture: getIdenticon(npub),
    pubkey: pk,
    npub
  }

  try {
    let events = await pool.querySync(relays, {
      kinds: [0, 30315],
      authors: [pk]
    })

    let personal: any = []

    events.forEach(async (event) => {
      if (event.kind === 0) {
        personal.push(event)
      }

      if (event.kind === 30315) {
        status = event.content
      }
    })

    if (personal.length) {
      personal = personal.reduce((latest, current) => {
        return current.created_at > latest.created_at ? current : latest
      })

      personal.content = JSON.parse(personal.content)

      personal.tags.forEach((tag) => {
        if (tag[0] === 'i') {
          let info = tag[1].split(':')
          personal.content[info[0]] = info[1]
        }
      })

      const user = { ...personalData, ...personal.content }

      return { user, status }
    }
  } catch (error) {
    console.error('Error fetching personal data:', error)
  }
}
