// context/NotistackContext.tsx
'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'
import NotiAlert from '~/app/_components/NotiAlert'
import type { AlertColor } from '@mui/material'

type NotistackState = {
  open: boolean
  message: string
  severity: AlertColor
}

type NotistackContextType = {
  showNotistack: (message: string, severity?: AlertColor) => void
}

const NotistackContext = createContext<
  NotistackContextType | undefined
>(undefined)

export function NotistackProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notistack, setNotistack] = useState<NotistackState>({
    open: false,
    message: '',
    severity: 'success',
  })

  const handleClose = useCallback(() => {
    setNotistack((prev) => ({ ...prev, open: false }))
  }, [])

  const showNotistack = useCallback(
    (message: string, severity: AlertColor = 'success') => {
      setNotistack({
        open: true,
        message,
        severity,
      })
    },
    [],
  )

  return (
    <NotistackContext.Provider value={{ showNotistack }}>
      {children}
      <NotiAlert
        open={notistack.open}
        message={notistack.message}
        severity={notistack.severity}
        handleClose={handleClose}
      />
    </NotistackContext.Provider>
  )
}

export function useNotistack() {
  const context = useContext(NotistackContext)
  if (!context) {
    throw new Error(
      'useNotistack must be used within a NotistackProvider',
    )
  }
  return context
}
