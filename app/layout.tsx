import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "微信打卡签到领金币/立减金汇总",
  description: "汇总各种打卡签到领金币、立减金、红包的链接",
  // themeColor: "#2c3e50",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "打卡汇总",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "打卡领金币立减金红包汇总",
    title: "打卡领金币立减金红包汇总",
    description: "汇总各种打卡签到领金币、立减金、红包的链接",
  },
  twitter: {
    card: "summary",
    title: "打卡领金币立减金红包汇总",
    description: "汇总各种打卡签到领金币、立减金、红包的链接",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      {/* <head>
        <meta name="application-name" content="打卡汇总" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="打卡汇总" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2c3e50" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2c3e50" />

        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#2c3e50" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head> */}
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'