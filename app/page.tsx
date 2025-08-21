"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect, useCallback } from "react"
import { ImageModal } from "@/components/image-modal"
import { PWAInstall } from "@/components/pwa-install"
import { OfflineIndicator } from "@/components/offline-indicator"
import { Coins, Train, Smartphone } from "lucide-react"

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

// Data for 立减金
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
  { href: "#小程序://云闪付/Gn6frzjxdlNihZt", text: "云闪付小程序" },
  { href: "#小程序://工行服务/ajrZfaHiPpWiact",  text: "工行储蓄卡月月刷：最高领20元立减金（8.31截止）" },
  { href: "##小程序://中国建设银行/75JZiGVVasPxM1I", text: "建行红包雨：抽1.88-6.66元立减金（9.30截止）" },
  { href: "https://lsjr.ccb.com/msmp/ecpweb/page/internet/dist/activity.html?CCB_EmpID=81860520&Spcl_CmAvy_ID=H4501b211a677a385000&Spcl_CmAvy_Nm=%E6%89%8B%E6%9C%BA%E9%93%B6%E8%A1%8C%E5%A4%A9%E5%A4%A9%E4%B9%90&CLData=Z28081&prtflId=SS450250819203122496&cmpnTskId=SC450250819204555820&wxwork_userid=V1001299", text: "建设银行天天乐" },
  { href: "https://example.com/reduce-3", text: "中行消费达标赠礼：满3笔199元领30元礼品（12.31截止）" }
]

const weeklyCollectionLinks: LinkItem[] = [
  { href: "https://wap.10010hb.net/zinfo/wt/activity/hb/race/lamp?zx=12", text: "联通每周抽奖" },
  { href: "#小程序://兴业银行/BVwWMnh7tbz99Ns", text: "兴业6元喝咖啡：每周二抢星巴克/瑞幸券（8.31截止）" },
  { href: "https://wap.psbc.com/zh/wxyh/ymt_clt/#/ymt/yxhd",  text: "邮储星级权益：每月19/29日领1-6元立减金（需资产达标）" }
]

const monthlyDiscountLinks: LinkItem[] = [
  { href: "#小程序://中国建设银行/OQmP068lUbpi1sK", text: "小程序:中国建设银行立减金领取" },
  { href: "#小程序://光大银行/TES2kYh65FZb61E", text: "光大阳光花园：每日浇水抽1-2元立减金" },
  { href: "#小程序://交通银行/P3epqJKEbqRV5Nw", text: "交行月月有礼：签到抽1-88元立减金（8.31截止）" },
  { href: "#小程序://浦发银行/6OVyTJwHsxt9sco", text: "浦发18财富日：集卡抽1-88元立减金（8.24截止）" }
]

const bankDiscountInfo = [
  { title: "中国银行", content: "下载并登录中国银行APP，点击生活标签页，选择立减金月月领参与活动。" },
  { title: "工商银行", content: "微信搜索小程序微信支付月月刷，完成指定消费可获得立减金奖励。" },
  { title: "平安银行", content: "每月消费3笔18元可领取18元微信立减金。" },
  { title: "建设银行", content: "搜索惠省钱抽取购买金额，最低可抽到0.99元购买16元立减金。" },
  { title: "交通银行", content: "注册过交通银行电子卡的用户可参加周周领好礼活动。" },
]

const ecommerceInfo = [
  { title: "京东", content: '关注"京东JD.COM"公众号，点击"粉丝福利"进行签到兑红包。' },
  { title: "淘宝/天猫", content: "淘宝APP右上角每天红包签到，周日额外瓜分五千万。" },
  { content: "天猫超市里喵店签到可以兑换商品。" },
]

const images = [
  { src:`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat-pay-points.jpeg`, alt: "微信支付宝积分二维码" },
  { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat-pay-recommend.jpeg`, alt: "推荐使用微信支付二维码" },
  { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat-contact.jpeg`, alt: "微信联系人二维码" },
]

// 按tab分类的图片集合
const tabImages = {
  discount: [
    { src:`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat-pay-points.jpeg`, alt: "微信支付宝积分二维码" },
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat-pay-recommend.jpeg`, alt: "推荐使用微信支付二维码" },
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat-contact.jpeg`, alt: "微信联系人二维码" },
  ],
  train: [
    { src:`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat-pay-points.jpeg`, alt: "微信支付宝积分二维码" },
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat-pay-recommend.jpeg`, alt: "推荐使用微信支付二维码" },
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/yunshanfu_chou.jpg`, alt: "微信联系人二维码" },
  ],
  alipay: [
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/Alipay_hongbao.jpg`, alt: "支付宝会员积分兑换" },
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/yunshanfu_chou.jpg`, alt: "支付宝优惠券领取中心" },
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat-pay-recommend.jpeg`, alt: "支付宝支付优惠指南" }
  ]
}

// Data for 火车票优惠券
const trainTicketLinks: LinkItem[] = [
  { href: "https://m.tb.cn/h.hQaDCUx?tk=UB9n42ji01H", text: "【闲鱼】 - 火车券20元无门槛火车票优惠券" },
  { href: "https://ur.alipay.com/_4gRmyjz0b1EF59Mw3Jh1oK", text: "支付宝会员 - 积分兑换火车票券" },
  { href: "https://m.tb.cn/h.hQb5UbZ", text: "淘宝淘金币 - 淘金币兑换火车票券" },
  { href: "#小程序://支付有优惠/7ULh6EaLcQyUjMb", text: "支付有优惠 - 金币兑换火车票券" },
  { href: "https://kyfw.12306.cn/otn/resources/login.html", text: "12306官网 - 支付宝购票返券" },
  { href: "https://m.ly.com/", text: "同程旅行 - 新用户领15元券" },
  { href: "https://www.didiglobal.com/", text: "滴滴出行小程序 - 领最高30元券" },
  { href: "https://www.qunar.com/", text: "去哪儿 - 领5元火车票券" },
  { href: "https://www.tieyou.com/", text: "铁友火车票 - APP内活动领券" },
]

const trainTicketBankInfo = [
  {
    title: "云闪付+邮储银行",
    content: "12306支付选择邮储银行，满60元减15元（每日10点起，数量有限）",
  },
  {
    title: "华夏银行借记卡",
    content: "支付选择阳光惠生活，满100减10元、满200减20元、满1000减50元",
  },
  {
    title: "浙商银行",
    content: "周四银联支付享3折优惠（月限1次），其他时间满50随机减5-50元",
  },
  {
    title: "工商银行生肖卡",
    content: "火车票支付随机立减，最高可减20元",
  },
  {
    title: "东亚携程白金卡",
    content: "高铁票享66折优惠，每月返现66元",
  },
]

const trainTicketTips = [
  { content: "🎯 学生/常旅客：优先使用12306积分兑换免费车票，积分=票面价×5，满10000分可兑换指定车票" },
  { content: "💰 小额优惠：支付宝积分换券、银行随机立减适合短途出行" },
  { content: "🎁 大额减省：关注银行满减活动或平台新用户专享券" },
  { content: "⏰ 有效期：优惠券通常限7天内使用，逾期失效" },
  { content: "⚠️ 使用限制：多数券不可叠加，退票时不退券，需实名认证" },
]

// Data for 支付宝优惠券
const alipayLinks: LinkItem[] = [
  { href: "https://ur.alipay.com/_4gRmyjz0b1EF59Mw3Jh1oK", text: "支付宝会员中心 - 积分兑换优惠券" },
  { href: "https://ur.alipay.com/", text: "支付宝生活号 - 每日签到领积分" },
  { href: "https://e.tb.cn/h.hMvsSEWhmbe4Kg6?tk=6x8D45tiFMp", text: "淘宝店铺-商品" },
  { href: "https://koubei.alipay.com/", text: "口碑 - 到店付款优惠券" },
  { href: "https://www.ele.me/", text: "饿了么 - 外卖红包券" },
  { href: "https://www.taobao.com/", text: "淘宝 - 购物津贴和店铺券" },
  { href: "https://pages.tmall.com/", text: "天猫 - 品牌优惠券和满减券" },
]

const alipayActivityInfo = [
  { title: "蚂蚁庄园", content: "每日喂鸡领取爱心，可兑换公益项目或优惠券" },
  { title: "蚂蚁森林", content: "收集能量种树，获得环保证书和合作商家优惠" },
  { title: "支付宝会员", content: "根据会员等级享受不同折扣，积分可兑换各类优惠券" },
  { title: "花呗分期", content: "使用花呗分期付款享受免息或优惠利率" },
  { title: "余额宝", content: "余额宝用户专享理财产品和消费优惠" },
]

const alipayMerchantInfo = [
  { title: "餐饮美食", content: "麦当劳、肯德基、星巴克等品牌定期推出支付宝专享优惠" },
  { title: "出行交通", content: "滴滴出行、哈啰单车、高德打车等出行优惠券" },
  { title: "生活服务", content: "美团、大众点评、饿了么等生活服务平台优惠" },
  { title: "购物消费", content: "天猫、淘宝、盒马等购物平台的专属优惠券" },
  { title: "金融理财", content: "余额宝、花呗、借呗等金融产品的优惠活动" },
]

// Components
function LinkItem({ href, text }: LinkItem) {
  const isMiniProgram = href.startsWith("#小程序://")

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isMiniProgram) {
      e.preventDefault()
      // 复制到剪贴板，兼容性处理
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(href)
          .then(() => {
            alert("该链接为微信小程序，请复制后在微信搜索栏粘贴打开。\n已自动复制到剪贴板。")
          })
          .catch(() => {
            fallbackCopy(href)
          })
      } else {
        fallbackCopy(href)
      }
    }
    // 普通链接无需处理
  }, [href, isMiniProgram])

  // 兼容旧浏览器复制
  function fallbackCopy(text: string) {
    try {
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      alert("该链接为微信小程序，请复制后在微信搜索栏粘贴打开。\n已自动复制到剪贴板。")
    } catch {
      alert("请手动复制链接到微信搜索栏打开。\n复制失败，请长按链接手动复制。")
    }
  }

  return (
    <li className="mb-2.5 p-2 rounded bg-[#d9edf7] hover:bg-[#d3eafb] transition-colors cursor-pointer">
      <a
        href={isMiniProgram ? "#" : href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#31708f] no-underline block"
        onClick={handleClick}
      >
        {text}
        {isMiniProgram && (
          <span className="ml-2 text-xs text-[#ff9800]">(微信小程序链接)</span>
        )}
      </a>
    </li>
  )
}

function LinkSection({ title, links, showOpenAllButton = false }: LinkSectionProps) {
  const [isOpening, setIsOpening] = useState(false)

  const openAllLinks = () => {
    setIsOpening(true)
    try {
      links.forEach((link) => {
        window.open(link.href, "_blank")
      })
    } catch (e) {
      console.error(e)
    } finally {
      setTimeout(() => setIsOpening(false), 1000)
    }
  }

  return (
    <div className="mb-8" style={{marginBottom: '1rem'}}>
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

function ImageGallery({ tabValue }: { tabValue: string }) {
  const currentImages = tabImages[tabValue as keyof typeof tabImages] || tabImages.discount
  return (
    <div className="mb-8" style={{marginBottom: '1rem'}}>
      <ImageModal images={currentImages} />
    </div>
  )
}

// 立减金内容组件
function DiscountContent() {
  return (
    <div>
      <LinkSection title="每日签到领金币" links={dailyCheckinLinks} showOpenAllButton={false} />
      <LinkSection title="限时立减金领取" links={limitedTimeDiscountLinks} />
      <LinkSection title="每周领取" links={weeklyCollectionLinks} />
      <LinkSection title="每月立减金领取" links={monthlyDiscountLinks} />
      <InfoSection title="银行立减金活动" items={bankDiscountInfo} />
      <InfoSection title="电商平台活动" items={ecommerceInfo} className="mb-0" />
    </div>
  )
}

// 火车票优惠券内容组件
function TrainTicketContent() {
  return (
    <div>
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">🚆 火车票优惠券攻略</h3>
        <p className="text-sm text-gray-600">综合官方平台、第三方应用及银行活动，帮你省钱出行</p>
      </div>

      <LinkSection title="🎫 官方及第三方平台" links={trainTicketLinks} />

      <InfoSection title="🏦 银行支付优惠（无需领券，支付直减）" items={trainTicketBankInfo} />

      <div className="mb-8 p-3 bg-[#fff3cd] rounded border-l-4 border-yellow-500">
        <h2 className="text-xl font-bold mb-3 text-[#856404]">💡 使用技巧与注意事项</h2>
        {trainTicketTips.map((tip, index) => (
          <p key={index} className="my-2 text-[#856404]">
            {tip.content}
          </p>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-700 mb-2">🎯 推荐策略</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded shadow-sm">
            <h4 className="font-medium text-blue-600">学生/常旅客</h4>
            <p className="text-gray-600">优先用12306积分兑换免费车票</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <h4 className="font-medium text-green-600">小额优惠</h4>
            <p className="text-gray-600">支付宝积分换券、银行随机立减</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <h4 className="font-medium text-purple-600">大额减省</h4>
            <p className="text-gray-600">关注银行满减活动和新用户券</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 支付宝优惠券内容组件
function AlipayContent() {
  return (
    <div>
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">💰 支付宝优惠券全攻略</h3>
        <p className="text-sm text-gray-600">从积分兑换到商家优惠，全方位省钱指南</p>
      </div>

      <LinkSection title="🔗 官方入口链接" links={alipayLinks} />

      <InfoSection title="🎮 支付宝活动专区" items={alipayActivityInfo} />

      <InfoSection title="🏪 商家合作优惠" items={alipayMerchantInfo} />

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
        <h3 className="font-semibold text-orange-700 mb-3">🎯 获取优惠券的最佳方式</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-3 rounded shadow-sm">
            <h4 className="font-medium text-blue-600 mb-2">每日必做</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• 蚂蚁庄园喂鸡领爱心</li>
              <li>• 蚂蚁森林收集能量</li>
              <li>• 支付宝会员签到</li>
              <li>• 生活号关注领券</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <h4 className="font-medium text-green-600 mb-2">定期关注</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• 节假日大促活动</li>
              <li>• 品牌商家活动页</li>
              <li>• 支付宝首页推荐</li>
              <li>• 会员专享权益</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 bg-[#d1ecf1] rounded border-l-4 border-[#bee5eb]">
        <h3 className="font-semibold text-[#0c5460] mb-2">💡 省钱小贴士</h3>
        <ul className="text-[#0c5460] text-sm space-y-1">
          <li>• 优惠券有使用期限，及时使用避免过期</li>
          <li>• 关注支付宝会员等级，等级越高优惠越多</li>
          <li>• 结合花呗分期和余额宝收益最大化优惠</li>
          <li>• 多关注品牌官方支付宝生活号获取专属券</li>
        </ul>
      </div>
    </div>
  )
}

// 右上角游戏链接
function GameGo() {
  return (
    <div className="absolute right-5 top-5 z-10">
        <a 
          href="https://lishulincug.github.io/webGameHub/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white">
            <span>游戏中心</span>
          </Button>
        </a>
      </div>
  )
}

export default function CheckinRewardsPage() {
  // // 注册 Service Worker
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     window.addEventListener("load", () => {
  //       navigator.serviceWorker
  //         .register("/sw.js")
  //         .then((registration) => {
  //           console.log("SW registered: ", registration)
  //         })
  //         .catch((registrationError) => {
  //           console.log("SW registration failed: ", registrationError)
  //         })
  //     })
  //   }
  // }, [])

  const [tabValue, setCurrentValue] = useState("discount");

  // 切换时触发：更新 value + 获取标签名称
  const handleValueChange = (newValue: string) => {
    setCurrentValue(newValue);
  }

  return (
    <div className="min-h-screen bg-[#f0f8ff] py-6" style={{paddingTop: "0rem"}}>
      <OfflineIndicator />
      <PWAInstall />
      <GameGo/>
      
      <div className="max-w-[800px] mx-auto my-5 p-5 md:p-6 bg-white rounded-lg shadow-md" style={{padding: "1rem"}}>
        <h1 className="text-2xl font-bold mb-6 text-center text-[#2c3e50]" style={{marginBottom: '0.5rem'}}>福利领取中心</h1>

        <ImageGallery tabValue={tabValue}/>

        <Tabs defaultValue="discount" value={tabValue}  onValueChange={handleValueChange}  className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6" style={{marginBottom: '0.5rem'}}>
            <TabsTrigger value="discount" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              立减金
            </TabsTrigger>
            <TabsTrigger value="train" className="flex items-center gap-2">
              <Train className="h-4 w-4" />
              火车票优惠券
            </TabsTrigger>
            <TabsTrigger value="alipay" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              支付宝优惠券
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discount">
            <DiscountContent />
          </TabsContent>

          <TabsContent value="train">
            <TrainTicketContent />
          </TabsContent>

          <TabsContent value="alipay">
            <AlipayContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
