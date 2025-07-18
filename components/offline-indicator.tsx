"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    // 设置初始状态
    setIsOnline(navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showOfflineMessage) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 right-4 bg-orange-100 border border-orange-200 rounded-lg p-3 z-50 max-w-sm mx-auto">
      <div className="flex items-center gap-2">
        <WifiOff size={16} className="text-orange-600" />
        <span className="text-sm text-orange-800">您当前处于离线状态，部分功能可能不可用</span>
      </div>
    </div>
  )
}
