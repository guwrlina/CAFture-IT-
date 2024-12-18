import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { User } from '@/types/user'

const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Student One',
    email: 'student1@example.com',
    role: 'student',
    studentId: 'STU001'
  }
]

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // In a real app, you would check against your database
        const user = users.find(u => u.email === credentials.email)
        
        if (user && credentials.password === 'password') { // Replace with proper password check
          return user
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as User).role
        token.studentId = (user as User).studentId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        if (token.studentId) {
          (session.user as any).studentId = token.studentId
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }

