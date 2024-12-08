import { cleanEnv, host, num, port, str } from 'envalid'

const createEnv = () =>
	cleanEnv(Bun.env, {
		UNREAD_THRESHOLD: num({ default: 0, desc: 'Number of unread emails required before noise plays.' }),
		TIMING: num({ default: 60, desc: 'Time in seconds between repeating noise.' }),
		NOISE_FREQ: num({
			default: 1,
			desc: 'Amount of times to play noise when number of unread emails exceeds threshold.',
		}),
		NOISE_PATH: str({ default: 'ding.mp3', desc: 'Path to MP3 file to play.' }),
		NOISE_PLAYER_PATH: str({
			desc: 'Path to CLI MP3 player executable that takes a path to a MP3 audio file as first argument (such as MPG123).',
		}),
		LISTEN_ADDR: host({ default: 'localhost', desc: 'Address to listen for requests to authenticate.' }),
		PORT: port({ default: 7634, desc: 'Port to listen for requests to authenticate.' }),
		AUTH_CLIENT_ID: str({ desc: 'OAuth2 client ID to authenticate mail getter call.' }),
		AUTH_CLIENT_SECRET: str({ desc: 'OAuth2 client secret to authenticate mail getter call.' }),
		AUTH_SCOPE: str({
			default: 'offline_access user.read mail.read',
			desc: 'OAuth2 scope to authenticate mail getter call. Should include some kind of offline access scope for getting a refresh token.',
		}),
		AUTH_AUTHORIZE_ENDPOINT: str({ desc: 'OAuth2 authorize endpoint to authenticate mail getter call.' }),
		AUTH_TOKEN_ENDPOINT: str({ desc: 'OAuth2 token endpoint to authenticate mail getter call.' }),
		MAIL_GETTER: str({ default: 'microsoft_graph', choices: ['microsoft_graph'], desc: 'Which mail getter to use. Currently supported choices are [ "microsoft_graph" ].' }),
	})

export default createEnv
