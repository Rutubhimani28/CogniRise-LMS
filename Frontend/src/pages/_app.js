import Head from 'next/head'
import { Router } from 'next/router'
import NProgress from 'nprogress'
import { CacheProvider } from '@emotion/react'
import { Provider } from 'react-redux'
import store from 'src/redux/store'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from 'src/theme'
import { Toaster } from 'react-hot-toast'
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import WindowWrapper from 'src/@core/components/window-wrapper'
import Spinner from 'src/@core/components/spinner'
import { AuthProvider } from 'src/context/AuthContext'
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'
import { GoogleOAuthProvider } from '@react-oauth/google'

import 'bootstrap/dist/css/bootstrap.css'
import '../../styles/globals.css'

const clientSideEmotionCache = createEmotionCache()

if (typeof window !== 'undefined' && window.performance && window.performance.measure) {
  const origMeasure = window.performance.measure.bind(window.performance)
  window.performance.measure = (name, startMark, endMark) => {
    try {
      return origMeasure(name, startMark, endMark)
    } catch (e) {}
  }
}

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeError', () => NProgress.done())
Router.events.on('routeChangeComplete', () => NProgress.done())

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false
  const aclAbilities = Component.acl ?? { action: 'manage', subject: 'all' }

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>College DAO Academy</title>
          <meta name='description' content='College DAO Academy LMS' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>

        <AuthProvider>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLEOAUTH_CLIENT_ID}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <WindowWrapper>
                <Guard authGuard={authGuard} guestGuard={guestGuard}>
                  <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                    {getLayout(<Component {...pageProps} />)}
                  </AclGuard>
                </Guard>
              </WindowWrapper>
              <Toaster position='top-right' />
            </ThemeProvider>
          </GoogleOAuthProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
