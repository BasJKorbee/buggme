# BuggMe

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

To build:

```bash
bun build index.ts
```

To compile:

```bash
bun build index.ts --compile --outfile=BuggMe.exe
```

## Environment

| VARIABLE NAME           | DESCRIPTION                                                                                                                  | REQUIRED | TYPE | DEFAULT                              | EXAMPLE                                                             |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------|----------|------|--------------------------------------|---------------------------------------------------------------------|
| UNREAD_THRESHOLD        | Number of unread emails required before noise plays.                                                                         | N        | INT  | 0                                    | 0                                                                   |
| TIMING                  | Time in seconds between repeating noise.                                                                                     | N        | INT  | 60                                   | 60                                                                  |
| NOISE_FREQ              | Amount of times to play noise when number of unread emails exceeds threshold.                                                | N        | INT  | 1                                    | 1                                                                   |
| NOISE_PATH              | Path to MP3 file to play.                                                                                                    | Y        | PATH |                                      | "./ding.mp3"                                                        |
| NOISE_PLAYER_PATH       | Path to CLI MP3 player executable that takes a path to a MP3 audio file as first argument (such as MPG123).                  | Y        | PATH |                                      | "./mpg123"                                                          |
| LISTEN_ADDR             | Address to listen for requests to authenticate.                                                                              | N        | HOST | "localhost"                          | "localhost"                                                         |
| PORT                    | Port to listen for requests to authenticate.                                                                                 | N        | PORT | 7634                                 | 7634                                                                |
| AUTH_CLIENT_ID          | OAuth2 client ID to authenticate mail getter call.                                                                           | Y        | STR  |                                      |                                                                     |
| AUTH_CLIENT_SECRET      | OAuth2 client secret to authenticate mail getter call.                                                                       | Y        | STR  |                                      |                                                                     |
| AUTH_SCOPE              | OAuth2 scope to authenticate mail getter call. Should include some kind of offline access scope for getting a refresh token. | N        | STR  | "offline_access user.read mail.read" | "offline_access user.read mail.read"                                |
| AUTH_AUTHORIZE_ENDPOINT | OAuth2 authorize endpoint to authenticate mail getter call.                                                                  | Y        | URL  |                                      | "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize" |
| AUTH_TOKEN_ENDPOINT     | OAuth2 token endpoint to authenticate mail getter call.                                                                      | Y        | URL  |                                      | "https://login.microsoftonline.com/consumers/oauth2/v2.0/token"     |
| MAIL_GETTER             | Which mail getter to use. Currently supported choices are [ "microsoft_graph" ].                                             | N        | STR  | "microsoft_graph"                    | "microsoft_graph"                                                   |

