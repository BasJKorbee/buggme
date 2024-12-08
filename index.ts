import open from 'open'
import { exec } from 'child_process'
import createEnv from './env'

type Auth = {
    token_type: string
    scope: string
    expires_in: number
    ext_expires_in: number
    created: number
    access_token: string
    refresh_token: string
}

global.env = createEnv()

const authenticate = async (req: Request, path: string): Promise<Response> => {
    const url = new URL(req.url)
    const params = url.searchParams
    const code = params.get("code")
    if (!code) return new Response("Invalid Request", { status: 401 })

    const res = await fetch(env.AUTH_TOKEN_ENDPOINT, { method: 'POST', headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: env.AUTH_CLIENT_ID, client_secret: env.AUTH_CLIENT_SECRET, scope: env.AUTH_SCOPE, code, redirect_uri: `http://${env.LISTEN_ADDR}:${env.PORT}/auth`, grant_type: "authorization_code" }) })
    const body = await res.json()
    await Bun.write(path, JSON.stringify({ ...body, created: Date.now() }))
    return new Response("BuggMe has authenticated, you can close this!")
}

const refresh = async ({ refresh_token }: Auth) => {
    const res = await fetch(env.AUTH_TOKEN_ENDPOINT, { method: 'POST', headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: env.AUTH_CLIENT_ID, client_secret: env.AUTH_CLIENT_SECRET, scope: env.AUTH_SCOPE, grant_type: "refresh_token", refresh_token }) })
    const body = await res.json()
    const completeBody = { ...body, created: Date.now() }
    await Bun.write(path, JSON.stringify(completeBody))
    return completeBody
}

type MailGetter = (auth: Auth) => Promise<number>
const microsoft_graph: MailGetter = async (auth) => {
    const res = await fetch("https://graph.microsoft.com/v1.0/me/messages?$filter=isRead eq false&$count=true", { headers: { Authorization: `Bearer ${auth.access_token}`, Accept: 'application/json' } })
    const body = await res.json()
    const count = body["@odata.count"]
    if (typeof count === 'undefined') console.error(body)
    return count
}

const getMail: Record<typeof env.MAIL_GETTER, MailGetter> = {
    microsoft_graph
}

const path = "buggme.json"
Bun.serve({
    port: Bun.env.PORT || 5000,
    hostname: Bun.env.LISTEN_ADDR || "localhost",
    fetch(req) {
        const url = new URL(req.url)
        if (url.pathname === '/auth') {
            return authenticate(req, path)
        }
        return new Response("Not Found", { status: 404 })
    },
})

let file = Bun.file(path)
if (!(await file.exists())) {
    await open(`${env.AUTH_AUTHORIZE_ENDPOINT}?${new URLSearchParams({ client_id: env.AUTH_CLIENT_ID, scope: env.AUTH_SCOPE, response_type: "code", response_mode: "query", redirect_uri: `http://${env.LISTEN_ADDR}:${env.PORT}/auth` })}`)
}

while(true) {
    file = Bun.file(path)
    if (!(await file.exists())) {
        console.log('Waiting for auth...')
        await Bun.sleep(5000)
        continue
    }

    const auth = await file.json().catch((e) => {
        console.error(e)
        process.exit(0)
    }) as Auth

    if (Date.now() > auth.created + ((auth.expires_in - 1) * 1000)) {
        console.log('Refreshing auth...')
        await refresh(auth)
        continue
    }

    const count = await getMail[env.MAIL_GETTER](auth)
    console.log(`Unread: ${count}\nMax Unread Threshold: ${env.UNREAD_THRESHOLD}`)
    if (count > env.UNREAD_THRESHOLD) {
        console.log(`Unread exceeds threshold. Notifying...`)
        for (let i = 0; i < env.NOISE_FREQ; i++) {
            exec(`"${env.NOISE_PLAYER_PATH}" ${env.NOISE_PATH}`)
            await Bun.sleep(1000)
        }
    }
    await Bun.sleep(1000 * env.TIMING)
}