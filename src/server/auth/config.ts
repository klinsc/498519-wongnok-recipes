import {
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { env } from '~/env'
import { db } from '../db'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

class AuthorizationError extends CredentialsSignin {
  code = 'AuthorizationError'
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        // Query the database for the user
        const user = await db.user.findFirst({
          where: {
            email,
            password,
          },
        })
        if (!user) {
          // throw new Error('No user found with the email')
          console.error('No user found with the email')
          // throw new Error('InvalidCredentials')
          throw new AuthorizationError()
        }

        return user
      },
    }),
  ],
  // Uncomment the following line to use a database adapter
  // adapter: PrismaAdapter(db),

  secret: env.AUTH_SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    // jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    // secret: env.NEXTAUTH_SECRET,
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // If successfully sign in, keep Firebase Authentication user info
      // in JWT payload
      if (user) {
        token.id = user.id
        token.email = user.email
        // Add other properties as needed
      }
      return token
    },

    async session({ session, token }) {
      if (session) {
        session.user.id = token.id as string
        session.user.email = token.email!
      }
      return session
    },
  },

  // add custom pages here
  pages: {
    signIn: '/signin',
    // signOut: '/signout',
  },
} satisfies NextAuthConfig
