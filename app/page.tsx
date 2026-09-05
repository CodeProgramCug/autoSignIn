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
// Data for 立减金【2026‑09 更新】
const dailyCheckinLinks: LinkItem[] = [
  {
    href: "https://wap.10010hb.net/zinfo/wt/activity/signNew/index?zx=12",
    text: "联通打卡领金币：每日累计可得2‑5金币（长期）",
  },
  {
    href: "https://flow.hn.189.cn/hnfx/hkly/newhlwkflzxqd1?clientid=WXHL117&tk=",
    text: "电信打卡领金币",
  },
  {
    href: "https://mbas.mbs.boc.cn/WeiBankFront/weixinVue/openApp/index.html#/openApp?lastShortUrl=BCxiPVJuLi",
    text: "福仔云游记每日签到（中国银行）",
  },
  {
    href: "#小程序://光大银行/TES2kYh65FZb61E",
    text: "光大阳光花园：每日浇水抽1‑2元立减金",
  },
]
const limitedTimeDiscountLinks: LinkItem[] = [
  { href: "#小程序://云闪付/Gn6frzjxdlNihZt", text: "云闪付小程序：每日签到领券，支付立减" },
  { href: "#小程序://工行服务/ajrZfaHiPpWiact",  text: "工行储蓄卡月月刷：最高领88元立减金（长期有效）" },
  { href: "#小程序://中国建设银行/75JZiGVVasPxM1I", text: "建行红包雨：抽1.88‑6.66元立减金（长期有效）" },
  { href: "https://lsjr.ccb.com/msmp/ecpweb/page/internet/dist/activity.html?CCB_EmpID=81860520&Spcl_CmAvy_ID=H4501b211a677a385000&Spcl_CmAvy_Nm=%E6%89%8B%E6%9C%BA%E9%93%B6%E8%A1%8C%E5%A4%A9%E5%A4%A9%E4%B9%90&CLData=Z28081&prtflId=SS450250819203122496&cmpnTskId=SC450250819204555820&wxwork_userid=V1001299", text: "建设银行天天乐：每日抽立减金" },
  { href: "https://wap.bank.ecitic.com/NMBFOServer/MobileBankWeb/?index=Share.BankShare.Index&key=LXWWB/as5Jje6SBBBdr8XbiwIk8sQL+tD44m2Qi6UjvOrQKA2uQd8tpkJHnc48pCsI8HaFwBjtoaVoUWDYqxmyNLd88vwK3qVcqNW8wnNOirZtlTIX5+y79OhAEJY8YzxDZpw7d7kqb7CHfRzT+4ycLuLt/vhoAWct3/xwG9cjPhX2LGY4ADxiux0/lwtIMOGQZH8Pb28CF20mtR0Sb3GjHWsk/y5Qo/XA+l3rSO955ve7obqsMYcd1aO8m7HdMYlTlKzVYW/KAjswhIXj6xvyLWpRbajDeOYgY21yE3kxDSPkUHRYwsIxs0Dciozanduq98LbBlRGf7csekTMO2YHo7eBUHfreUD1Vgio2FKQefYCl6wskqpsxrhq+kYB+COuUJRpI/OtjdNJ2HmCGXaooklhkyuWF/JTm6LgDCodayV2QWMVjyxAhLWfBHg7oXg3NXsOeImyF2njb1rcD2Rcumus6hc2e1b7mBcQH+909ywRVg4w9BAw==CITICBANKLOGO", text: "中信银行连续签到赢好礼，6元支付宝红包（至9‑30）" },
  { href: "https://www.psbc.com/cn/grfw/yxk/jjkyhhd/202603/t20260313_404502.html", text: "邮储借记卡支付达标享好礼：月快捷消费满3000/6000/10000元，次月10日起抽1‑500元微信立减金（「邮储好礼汇」小程序报名，至11‑30）" },
  { href: "https://creditcard.ecitic.com/heyue/xieyi402.html", text: "中信颜卡新户礼：9.1‑10.31核卡新户激活后抢180元微信/支付宝立减金券包（动卡空间APP‑我的权益）" },
]
const weeklyCollectionLinks: LinkItem[] = [
  { href: "https://wap.10010hb.net/zinfo/wt/activity/hb/race/lamp?zx=12", text: "联通每周抽奖【微信端打开】" },
  { href: "#小程序://兴业银行/BVwWMnh7tbz99Ns", text: "兴业6元喝咖啡：每周二抢星巴克/瑞幸券（长期有效）" },
  { href: "#小程序://交通银行/P3epqJKEbqRV5Nw", text: "交行周周领好礼：每周领1‑88元立减金（长期有效）" },
]
const monthlyDiscountLinks: LinkItem[] = [
  { href: "https://event.ccbft.com/ccbact/m3742/AP450202407011648001‑act.html#/home", text: "建行约会八桂，各种10元立减金【微信端打开】" },
  { href: "#小程序://中国建设银行/OQmP068lUbpi1sK", text: "小程序:中国建设银行立减金领取" },
  { href: "#小程序://浦发银行/6OVyTJwHsxt9sco", text: "浦发18财富日：每月18日集卡抽1‑88元立减金" },
  { href: "#小程序://邮储银行/8sd7fhjkadf987s", text: "邮储健步邮金喜：步数抽奖赢微信立减金（至10‑31）" },
]
const bankDiscountInfo = [
  { title: "中国银行", content: "信用卡「越刷月返」9月活动：官方微信-活动服务-活动报名，当月消费满5笔且累计满1w/3w/5w元，10月15日10点起抽10‑99/99‑399/399‑999元微信券包；福仔云游记每日签到领奖励；借记卡12306支付宝购票满50减3元。" },
  { title: "工商银行", content: "任务中心「月月刷」「悦达标」「天天签到」浏览签到累计积分兑权益；借记卡指定线上商户走银联云网通道，满10随机减0.88‑5.88元、满100减5.88‑18.88元、满500减18.88‑58.8元（工行APP/工银e生活支付）；无界白金等指定信用卡12306云闪付5折最高减30元。" },
  { title: "农业银行", content: "掌银参与热门活动；信用卡加油满200‑15元；美团首绑至高18元随机立减；携程/去哪儿APP云闪付满100随机减2‑99元；新客礼持续到12月底。" },
  { title: "平安银行", content: "每月消费3笔18元可领取18元微信立减金；万事达卡境外消费返现微信立减金。" },
  { title: "建设银行", content: "「时光好礼月月享」9月：建行生活APP报名，信用卡通过支付宝微信/抖音美团/京东等累计消费满3000元且满5笔，次月20日得20元京东专区支付券（9月30日截止）；任务中心生活缴费/充话费满30元领2‑5元微信立减金；周六9:30惠游中华中石化充值满600减56元；建行生活云闪付版满1.01减1元每月4次。" },
  { title: "交通银行", content: "周周领好礼每周领1‑8.8元云网券；数币月享节支付宝搜「数币节」，开通交行数币钱包领16元券包、每日转盘抽至高2026元红包；买单吧APP热门活动月月更新。" },
  { title: "邮储银行", content: "借记卡「支付达标享好礼」：「邮储好礼汇」小程序报名，月快捷消费满3000/6000/10000元，次月10日起抽1/2.8/6.8/8.8/38/88/500元微信立减金（活动至11月30日）；信用卡「越刷越精彩」三季度当月消费满6000元领5元微信立减金（9月30日截止）；皖邮惠健步邮金喜步数抽奖至10‑31；携程首绑信用卡立减6元。" },
  { title: "华夏银行", content: "信用卡「月刷越有礼」9月：62信用卡累计消费满3000/10000/30000元，达标次日（最早9月6日）13点起用10积分兑换5/10/30元支付宝立减金券包（9月30日截止）；借记卡云闪付12306购票满100减10、满300减20、满1000减50元。" },
  { title: "中信银行", content: "颜卡系列信用卡新户9月活动：9月1日‑10月31日核卡新户激活后可抢180元微信/支付宝立减金券包（180张1元券连发180天）、Klook旅行券包等，动卡空间APP-我的权益参与；连续签到赢好礼6元支付宝红包至9‑30。" },
]
const ecommerceInfo = [
  { title: "京东", content: '关注"京东JD.COM"公众号，点击"粉丝福利"进行签到兑红包。' },
  { title: "淘宝/天猫", content: "淘宝APP右上角每天红包签到，周日额外瓜分红包；天猫超市喵店签到兑换商品。" },
  { title: "美团", content: "美团APP搜索「车票100」「机票100」，领取火车票/机票专属优惠券，新老用户均可参与，可叠加身份优惠。" },
  { title: "同程旅行", content: "同程APP/小程序搜索「福利100」「出行红包」，新人可领百元火车票/高铁票券包。" },
]
const images = [
  { src:`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat‑pay‑points.jpeg`, alt: "微信支付宝积分二维码" },
  { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat‑pay‑recommend.jpeg`, alt: "推荐使用微信支付二维码" },
  { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat‑contact.jpeg`, alt: "微信联系人二维码" },
]
// 按tab分类的图片集合
const tabImages = {
  discount: [
    { src:`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat‑pay‑points.jpeg`, alt: "微信支付宝积分二维码" },
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat‑pay‑recommend.jpeg`, alt: "推荐使用微信支付二维码" },
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat‑contact.jpeg`, alt: "微信联系人二维码" },
  ],
  train: [
    { src:`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat‑pay‑points.jpeg`, alt: "微信支付宝积分二维码" },
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat‑pay‑recommend.jpeg`, alt: "推荐使用微信支付二维码" },
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/yunshanfu_chou.jpg`, alt: "云闪付抽奖页" },
  ],
  alipay: [
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/Alipay_hongbao.jpg`, alt: "支付宝会员积分兑换" },
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/yunshanfu_chou.jpg`, alt: "支付宝优惠券领取中心" },
    { src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/wechat‑pay‑recommend.jpeg`, alt: "支付宝支付优惠指南" }
  ]
}
// Data for 火车票优惠券
const trainTicketLinks: LinkItem[] = [
  { href: "https://m.tb.cn/h.hQaDCUx?tk=UB9n42ji01H", text: "【闲鱼】‑ 火车券20元无门槛火车票优惠券" },
  { href: "https://ur.alipay.com/_4gRmyjz0b1EF59Mw3Jh1oK", text: "支付宝会员‑ 积分兑换火车票券" },
  { href: "https://m.tb.cn/h.hQb5UbZ", text: "淘宝淘金币‑ 淘金币兑换火车票券" },
  { href: "https://kyfw.12306.cn/otn/resources/login.html", text: "12306官网‑ 支付宝购票返券，银行支付享满减" },
  { href: "https://m.ly.com/", text: "同程旅行‑ 新用户领百元火车票券包，老用户每日领券" },
  { href: "https://www.didiglobal.com/", text: "滴滴出行小程序‑ 领最高30元火车票出行券" },
  { href: "https://www.qunar.com/", text: "去哪儿‑ 领5元火车票券，邮储银行卡支付满300减10元" },
  { href: "https://www.tieyou.com/", text: "铁友火车票‑ APP内活动领券，支持多银行支付立减" },
  { href: "#小程序://携程旅行/9sd87fhjksadf987", text: "携程旅行‑ 邮储信用卡首绑立减6元，购票享专属优惠" },
  { href: "#小程序://美团/8sd7fhjkadf987s", text: "美团APP搜「车票100」‑ 领火车票专属优惠券，可叠加身份优惠" },
  { href: "https://ur.alipay.com/", text: "支付宝会员中心‑ 积分兑换火车票立减券，购票直接抵扣" },
  { href: "#小程序://支付有优惠/7ULh6EaLcQyUjMb", text: "支付有优惠‑ 金币兑换火车票立减券" },
]
const trainTicketBankInfo = [
  {
    title: "工商银行银联信用卡",
    content: "12306购票走云闪付通道享5折，单笔最高减30元、下限1元，每卡每月限2次；适用无界白金数字卡、大美青海/阳光海南等美丽中国系列指定62卡（2026.12.31截止，每日名额先到先得）。",
  },
  {
    title: "广州银行信用卡",
    content: "12306购票满100元减8元，支付宝支付，单用户单月限享2次（2026.12.31截止）",
  },
  {
    title: "邮储银行",
    content: "携程首绑信用卡立减6元；去哪儿借记卡支付满300元减10元，每日10点放名额；云闪付12306满60减15元每日限量；邮储APP云闪付版线上满5减1元、日限3次月限5次（9月13日截止）。",
  },
  {
    title: "华夏银行借记卡",
    content: "云闪付渠道12306支付：满100减10元、满300减20元、满1000减50元，单月限4次，每日名额有限先到先得（具体期次与名额以云闪付APP展示为准）。",
  },
  {
    title: "建设银行",
    content: "建行生活APP云闪付版线上消费满1.01减1元、月限4次，可充话费/油卡/京东E卡（2026.12.31截止）；借记卡12306购票满100减10元以建行APP活动页展示为准。",
  },
  {
    title: "中国银行借记卡",
    content: "12306支付宝支付满50元立减3元，手机银行领券中心领券参与。",
  },
]
const trainTicketTips = [
  { content: "🎯 学生/常旅客：优先使用12306积分兑换免费车票，积分=票面价×5，满10000分可兑换指定车票" },
  { content: "💰 小额优惠：支付宝积分换券、银行随机立减适合短途出行" },
  { content: "🎁 大额减省：关注银行满减活动或平台新用户专享券，周五购票优惠力度更大" },
  { content: "⏰ 有效期：优惠券通常限7天内使用，逾期失效；银行满减每日名额有限，建议10点准点参与" },
  { content: "⚠️ 使用限制：多数券不可叠加，退票不退券，需实名认证；优惠未显示即当日名额耗尽，以收银台为准" },
  { content: "📌提示：银行活动各地存在差异，部分优惠仅限指定地区用户参与。" },
]
// Data for 支付宝优惠券【2026‑09更新】
const alipayLinks: LinkItem[] = [
  { href: "https://ur.alipay.com/", text: "支付宝官方首页‑ 生活号每日签到领积分" },
  { href: "https://ur.alipay.com/_4gRmyjz0b1EF59Mw3Jh1oK", text: "支付宝会员中心‑ 积分兑换全品类优惠券/火车票券/生活缴费券" },
  { href: "https://www.ele.me/", text: "饿了么‑ 外卖红包券，支付宝支付享专属立减" },
  { href: "https://www.taobao.com/", text: "淘宝‑ 购物津贴和店铺券，支付宝付款叠加优惠" },
]
const alipayActivityInfo = [
  { title: "蚂蚁庄园", content: "每日喂鸡领取爱心，可兑换公益项目或餐饮、出行优惠券" },
  { title: "蚂蚁森林", content: "收集能量种树，获得环保证书和合作商家专属消费优惠" },
  { title: "支付宝会员", content: "2026年8月20日起积分规则调整：支付每20‑200元得1积分、每日上限3‑20积分，积分产生后7天内领取；可兑1999积分视频月卡、99积分兑1.6元数币红包、火车票立减券、生活缴费红包等。" },
  { title: "网商银行周四福利日", content: "每周四在支付宝搜「网商银行」参与，领三重礼：88‑8888元福利金、0.18‑5.88元红包、最高60元出行券。" },
  { title: "整点红包", content: "支付宝首页搜「整点红包」，每天10点开抢最高8.8元现金红包，拼手气每日瓜分万元现金。" },
  { title: "花呗分期", content: "使用花呗分期付款享受免息或优惠利率，指定商户消费立减；淘宝/京东3C分期满3000减200、满6000减400等银行分期满减可叠加。" },
  { title: "余额宝", content: "余额宝用户专享理财产品和消费优惠，会员频道积分可兑8.8元余额宝红包，每月专属立减金活动。" },
  { title: "数币月享节", content: "支付宝搜「数币节」或「玩转数字人民币」：开通交行/网商数币钱包领16元消费券包，每日转盘抽至高2026元数币红包，淘宝/盒马/飞猪/12306/高德等场景满16元随机减0.16‑88元，99积分可兑1.6元数币红包，指定城市1分钱乘地铁公交。" },
]
const alipayMerchantInfo = [
  { title: "餐饮美食", content: "麦当劳、肯德基、星巴克等品牌定期推出支付宝专享优惠，每周五六日优惠力度更大" },
  { title: "出行交通", content: "滴滴出行、哈啰单车、高德打车等出行优惠券；首次开通NFC交通卡可得3元乘车券包（至9‑30）；12306购票支付宝支付享银行满减。" },
  { title: "生活服务", content: "美团、大众点评、饿了么等生活服务平台优惠，水电燃缴费专属立减红包" },
  { title: "购物消费", content: "天猫、淘宝、盒马等购物平台的专属优惠券，大促期间叠加满减力度更大" },
  { title: "金融理财", content: "余额宝、花呗、借呗等金融产品的优惠活动，数字人民币专属立减福利。" },
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
      <div className="mb-4 p‑3 bg-yellow‑50 border-l‑4 border-yellow‑400 rounded text-sm text‑yellow-800">
        💡提示：银行活动名额每日限量，部分活动存在地区限制，实际奖励以银行页面为准，过期活动会自动下线。
      </div>
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
              <li>• 数币月享节抢数币券包</li>
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
          <li>• 数币月享节每日券包限量，12点更新库存</li>
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

