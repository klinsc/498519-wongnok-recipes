import { type DefaultSession, type NextAuthConfig } from 'next-auth'
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
          throw new Error('No user found with the email')
        }

        return null
      },
    }),
  ],
  // Uncomment the following line to use a database adapter
  // adapter: PrismaAdapter(db),

  secret: env.AUTH_SECRET,

  session: {
    strategy: 'jwt', // Use JWT-based sessions
  },

  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },

  // add custom pages here
  pages: {
    signIn: '/signin',
    // signOut: '/signout',
  },
} satisfies NextAuthConfig
