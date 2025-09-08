// pages/_app.js
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import theme from '../theme'

function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, or fallback to plain render
  const getLayout = Component.getLayout || ((page) => page);
  
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider options={{ useSystemColorMode: true }}>
          {getLayout(<Component {...pageProps} />)}
        </ColorModeProvider>
      </ChakraProvider>
    </GoogleOAuthProvider>
  )
}

export default MyApp;
