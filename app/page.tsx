"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ImageModal } from "@/components/image-modal"

// Types
interface LinkItem {
  href: string
  text: string
}

interface LinkSectionProps {
  title: string
  links: LinkItem[]
  showOpenAllButton?: boolean
}

interface InfoSectionProps {
  title: string
  items: {
    title?: string
    content: string
  }[]
  className?: string
}

// Data
const dailyCheckinLinks: LinkItem[] = [
  {
    href: "https://wap.10010hb.net/zinfo/wt/activity/signNew/index?zx=12",
    text: "联通打卡领金币：每日累计可得2-5金币",
  },
  {
    href: "https://flow.hn.189.cn/hnfx/hkly/newhlwkflzxqd1?clientid=WXHL117&tk=",
    text: "电信打卡领金币",
  },
  {
    href: "https://mbas.mbs.boc.cn/WeiBankFront/weixinVue/openApp/index.html#/openApp?lastShortUrl=BCxiPVJuLi",
    text: "福仔云游记每日签到",
  },
]

const limitedTimeDiscountLinks: LinkItem[] = [
  { href: "#小程序://云闪付/Gn6frzjxdlNihZt", text: "#小程序://云闪付/Gn6frzjxdlNihZt" },
  { href: "https://example.com/reduce-2", text: "立减金领取通道B：满100减20" },
  { href: "https://example.com/reduce-3", text: "立减金领取通道C：新用户专属满30减15" },
]

const weeklyCollectionLinks: LinkItem[] = [
  { href: "https://wap.10010hb.net/zinfo/wt/activity/hb/race/lamp?zx=12", text: "联通每周抽奖" },
  { href: "https://example.com/reduce-2", text: "立减金领取通道B：满100减20" },
  { href: "https://example.com/reduce-3", text: "立减金领取通道C：新用户专属满30减15" },
]

const monthlyDiscountLinks: LinkItem[] = [
  { href: "#小程序://中国建设银行/OQmP068lUbpi1sK", text: "小程序:中国建设银行立减金领取" },
  { href: "#小程序://光大银行/TES2kYh65FZb61E", text: "小程序:光大银行立减金领取" },
]

const bankDiscountInfo = [
  { title: "中国银行", content: "下载并登录中国银行APP，点击生活标签页，选择立减金月月领参与活动。" },
  { title: "工商银行", content: "微信搜索小程序微信支付月月刷，完成指定消费可获得立减金奖励。" },
  { title: "平安银行", content: "每月消费3笔18元可领取18元微信立减金。" },
  { title: "建设银行", content: "搜索惠省钱抽取购买金额，最低可抽到0.99元购买16元立减金。" },
  { title: "交通银行", content: "注册过交通银行电子卡的用户可参加周周领好礼活动。" },
]

const ecommerceInfo = [
  { title: "京东", content: "关注“京东JD.COM”公众号，点击“粉丝福利”进行签到兑红包。" },
  { title: "淘宝/天猫", content: "淘宝APP右上角每天红包签到，周日额外瓜分五千万。" },
  { content: "天猫超市里喵店签到可以兑换商品。" },
]

const images = [
  { src:`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat-pay-points.jpeg`, alt: "微信支付宝积分二维码" },
  { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat-pay-recommend.jpeg`, alt: "推荐使用微信支付二维码" },
  { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat-contact.jpeg`, alt: "微信联系人二维码" },
]

// Components
function LinkItem({ href, text }: LinkItem) {
  return (
    <li className="mb-2.5 p-2 rounded bg-[#d9edf7] hover:bg-[#d3eafb] transition-colors cursor-pointer">
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#31708f] no-underline block">
        {text}
      </a>
    </li>
  )
}

function LinkSection({ title, links, showOpenAllButton = false }: LinkSectionProps) {
  const [isOpening, setIsOpening] = useState(false)

  const openAllLinks = () => {
    setIsOpening(true)
    links.forEach(async (link) => {
      try {
        window.open(link.href, "_blank")
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (e) {
        console.error(`Failed to open link: ${link.href}`, e)
        // 继续执行下一个链接
      }
    })
    setIsOpening(false)
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-3 text-[#34495e]">{title}</h2>

      {showOpenAllButton && (
        <Button onClick={openAllLinks} disabled={isOpening} className="mb-3 bg-blue-500 hover:bg-blue-600 text-white">
          {isOpening ? "正在打开..." : "一键打开所有页面"}
        </Button>
      )}

      <ul className="list-none p-0">
        {links.map((link, index) => (
          <LinkItem key={index} href={link.href} text={link.text} />
        ))}
      </ul>
    </div>
  )
}

function InfoSection({ title, items, className = "" }: InfoSectionProps) {
  const 生活 = "生活"
  const 立减金月月领 = "立减金月月领"
  const 微信支付月月刷 = "微信支付月月刷"
  const 惠省钱 = "惠省钱"
  const 关注 = "关注"
  return (
    <div className={`mb-8 p-3 bg-[#e9f7fa] rounded ${className}`}>
      <h2 className="text-xl font-bold mb-3 text-[#34495e]">{title}</h2>
      {items.map((item, index) => (
        <p key={index} className="my-1">
          {item.title && <strong>{item.title}：</strong>}
          {item.content}
        </p>
      ))}
    </div>
  )
}

function ImageGallery() {
  return (
    <div className="mb-8">
      <ImageModal images={images} />
    </div>
  )
}

export default function CheckinRewardsPage() {
  return (
    <div className="min-h-screen bg-[#f0f8ff] py-6">
      <div className="max-w-[800px] mx-auto my-5 p-5 md:p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#2c3e50]">打卡领金币/立减金/红包汇总</h1>

        <ImageGallery />

        <LinkSection title="每日签到领金币" links={dailyCheckinLinks} showOpenAllButton={true} />

        <LinkSection title="限时立减金领取" links={limitedTimeDiscountLinks} />

        <LinkSection title="每周领取" links={weeklyCollectionLinks} />

        <LinkSection title="每月立减金领取" links={monthlyDiscountLinks} />

        <InfoSection title="银行立减金活动" items={bankDiscountInfo} />

        <InfoSection title="电商平台活动" items={ecommerceInfo} className="mb-0" />
      </div>
    </div>
  )
}
