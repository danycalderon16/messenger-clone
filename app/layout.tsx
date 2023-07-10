import { Inter } from 'next/font/google'

import ToasterContext from './context/ToasterContext'

import './globals.css'
import AuthContext from './context/AuthContext'
import ActiveStatus from './components/sidebar/ActiveStatus'

const inter = Inter({subsets:['latin']})

export const metadata = {
  title: 'Messenger',
  description: 'Messenger Clone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>     
      <AuthContext>
          <ToasterContext/> 
          <ActiveStatus />
          {children}
      </AuthContext>
      </body>
    </html>
  )
}
