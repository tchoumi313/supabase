import { Code, Console, GoToFile } from "./console";

const accountContents = `import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Account({ session }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select('username, website, avatar_url')
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button
          className="button block"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}`;

const indexContents = `import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Account from '../components/Account'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
        />
      ) : (
        <Account session={session} />
      )}
    </div>
  )
}

export default Home`;

const stylesContents = `html,
body {
  --custom-font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  --custom-bg-color: #101010;
  --custom-panel-color: #222;
  --custom-box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.8);
  --custom-color: #fff;
  --custom-color-brand: #24b47e;
  --custom-color-secondary: #666;
  --custom-border: 1px solid #333;
  --custom-border-radius: 5px;
  --custom-spacing: 5px;

  padding: 0;
  margin: 0;
  font-family: var(--custom-font-family);
  background-color: var(--custom-bg-color);
}

* {
  color: var(--custom-color);
  font-family: var(--custom-font-family);
  box-sizing: border-box;
}

html,
body,
#__next {
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
}

/* Grid */

.container {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}
.row {
  position: relative;
  width: 100%;
}
.row [class^='col'] {
  float: left;
  margin: 0.5rem 2%;
  min-height: 0.125rem;
}
.col-1,
.col-2,
.col-3,
.col-4,
.col-5,
.col-6,
.col-7,
.col-8,
.col-9,
.col-10,
.col-11,
.col-12 {
  width: 96%;
}
.col-1-sm {
  width: 4.33%;
}
.col-2-sm {
  width: 12.66%;
}
.col-3-sm {
  width: 21%;
}
.col-4-sm {
  width: 29.33%;
}
.col-5-sm {
  width: 37.66%;
}
.col-6-sm {
  width: 46%;
}
.col-7-sm {
  width: 54.33%;
}
.col-8-sm {
  width: 62.66%;
}
.col-9-sm {
  width: 71%;
}
.col-10-sm {
  width: 79.33%;
}
.col-11-sm {
  width: 87.66%;
}
.col-12-sm {
  width: 96%;
}
.row::after {
  content: '';
  display: table;
  clear: both;
}
.hidden-sm {
  display: none;
}

@media only screen and (min-width: 33.75em) {
  /* 540px */
  .container {
    width: 80%;
  }
}

@media only screen and (min-width: 45em) {
  /* 720px */
  .col-1 {
    width: 4.33%;
  }
  .col-2 {
    width: 12.66%;
  }
  .col-3 {
    width: 21%;
  }
  .col-4 {
    width: 29.33%;
  }
  .col-5 {
    width: 37.66%;
  }
  .col-6 {
    width: 46%;
  }
  .col-7 {
    width: 54.33%;
  }
  .col-8 {
    width: 62.66%;
  }
  .col-9 {
    width: 71%;
  }
  .col-10 {
    width: 79.33%;
  }
  .col-11 {
    width: 87.66%;
  }
  .col-12 {
    width: 96%;
  }
  .hidden-sm {
    display: block;
  }
}

@media only screen and (min-width: 60em) {
  /* 960px */
  .container {
    width: 75%;
    max-width: 60rem;
  }
}

/* Forms */

label {
  display: block;
  margin: 5px 0;
  color: var(--custom-color-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
}

input {
  width: 100%;
  border-radius: 5px;
  border: var(--custom-border);
  padding: 8px;
  font-size: 0.9rem;
  background-color: var(--custom-bg-color);
  color: var(--custom-color);
}

input[disabled] {
  color: var(--custom-color-secondary);
}

/* Utils */

.block {
  display: block;
  width: 100%;
}
.inline-block {
  display: inline-block;
  width: 100%;
}
.flex {
  display: flex;
}
.flex.column {
  flex-direction: column;
}
.flex.row {
  flex-direction: row;
}
.flex.flex-1 {
  flex: 1 1 0;
}
.flex-end {
  justify-content: flex-end;
}
.flex-center {
  justify-content: center;
}
.items-center {
  align-items: center;
}
.text-sm {
  font-size: 0.8rem;
  font-weight: 300;
}
.text-right {
  text-align: right;
}
.font-light {
  font-weight: 300;
}
.opacity-half {
  opacity: 50%;
}

/* Button */

button,
.button {
  color: var(--custom-color);
  border: var(--custom-border);
  background-color: var(--custom-bg-color);
  display: inline-block;
  text-align: center;
  border-radius: var(--custom-border-radius);
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-align: center;
  font-size: 0.9rem;
  text-transform: uppercase;
}

button.primary,
.button.primary {
  background-color: var(--custom-color-brand);
  border: 1px solid var(--custom-color-brand);
}

/* Widgets */

.card {
  width: 100%;
  display: block;
  border: var(--custom-border);
  border-radius: var(--custom-border-radius);
  padding: var(--custom-spacing);
}

.avatar {
  border-radius: var(--custom-border-radius);
  overflow: hidden;
  max-width: 100%;
}
.avatar.image {
  object-fit: cover;
}
.avatar.no-image {
  background-color: #333;
  border: 1px solid rgb(200, 200, 200);
  border-radius: 5px;
}

.footer {
  position: absolute;
  max-width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-flow: row;
  border-top: var(--custom-border);
  background-color: var(--custom-bg-color);
}
.footer div {
  padding: var(--custom-spacing);
  display: flex;
  align-items: center;
  width: 100%;
}
.footer div > img {
  height: 20px;
  margin-left: 10px;
}
.footer > div:first-child {
  display: none;
}
.footer > div:nth-child(2) {
  justify-content: left;
}

@media only screen and (min-width: 60em) {
  /* 960px */
  .footer > div:first-child {
    display: flex;
  }
  .footer > div:nth-child(2) {
    justify-content: center;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.mainHeader {
  width: 100%;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.avatarPlaceholder {
  border: var(--custom-border);
  border-radius: var(--custom-border-radius);
  width: 35px;
  height: 35px;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Auth */

.auth-widget {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.auth-widget > .button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #444444;
  text-transform: none !important;
  transition: all 0.2s ease;
}

.auth-widget .button:hover {
  background-color: #2a2a2a;
}

.auth-widget .button > .loader,
.account .button > .loader {
  width: 17px;
  animation: spin 1s linear infinite;
  filter: invert(1);
}

/* Account */

.account {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.account > * > .avatarField {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.account > * > .avatarField > .avatarContainer {
  margin-right: 20px;
}

/* Profile Card */

.profileCard {
  border-radius: 5px;
  display: flex;
  border: var(--custom-border);
  background-color: var(--custom-panel-color);
  padding: 20px 20px;
  margin-bottom: 20px;
}

.profileCard:last-child {
  margin-bottom: 0px;
}

.profileCard > .userInfo {
  margin-left: 20px;
  font-weight: 300;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.profileCard > .userInfo > p {
  margin: 0;
}

.profileCard > .userInfo > .username {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 5px;
}

.profileCard > .userInfo > .website {
  font-size: 0.9rem;
  color: var(--custom-color-brand);
  margin-bottom: 10px;
  text-decoration: none;
}`;

export default {
  title: "Step 4: The Account component",
  content: [
    {
      type: "step",
      header: "Create the Account component",
      intro: [
        {
          path: "components/Account.js",
          contents: ``,
        },
      ],
      solution: [{ path: "components/Account.js", contents: accountContents }],
      show: () => <Console />,
      children: (
        <>
          <p>
            Add a <GoToFile path="components/Account.js" /> file and put this:
          </p>
          <Code>{accountContents}</Code>
        </>
      ),
    },
    {
      ref: {},
      type: "step",
      header: "Update index.js",
      solution: [{ path: "pages/index.js", contents: indexContents }],
      show: () => <Console />,
      children: (
        <>
          <p>
            Now in <GoToFile path="pages/index.js" /> add:
          </p>
          <Code>{indexContents}</Code>
        </>
      ),
    },
    {
      type: "step",
      header: "Update styles",
      solution: [{ path: "styles/globals.css", contents: stylesContents }],
      show: () => <Console />,
    },
    {
      type: "step",
      header: "Test",
      show: () => <Console />,
    },
  ],
};
