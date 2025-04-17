import { Coins, Gift, Percent, TimerIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RewardItem {
  title: string
  description: string
  expiryDate: string
  link: string
  amount: string
}

const coins: RewardItem[] = [
  {
    title: "每日签到",
    description: "连续签到7天额外奖励",
    expiryDate: "当日有效",
    link: "https://example.com/daily-check",
    amount: "5金币",
  },
  {
    title: "看视频领金币",
    description: "每天最多可领30次",
    expiryDate: "当日刷新",
    link: "https://example.com/video-reward",
    amount: "2金币/次",
  },
]

const discounts: RewardItem[] = [
  {
    title: "新人立减券",
    description: "首单可用",
    expiryDate: "领取后7天内有效",
    link: "https://example.com/new-user",
    amount: "¥10",
  },
  {
    title: "全品类通用券",
    description: "无使用门槛",
    expiryDate: "2024-03-01到期",
    link: "https://example.com/general",
    amount: "¥5",
  },
]

const redPackets: RewardItem[] = [
  {
    title: "分享红包",
    description: "邀请好友最高可得",
    expiryDate: "永久有效",
    link: "https://example.com/share",
    amount: "¥88",
  },
  {
    title: "新春红包",
    description: "限时限量抢",
    expiryDate: "2024-02-29到期",
    link: "https://example.com/festival",
    amount: "¥66",
  },
]

function RewardList({ items }: { items: RewardItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item, index) => (
        <Card key={index} className="group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <Badge variant="secondary" className="font-normal">
                {item.amount}
              </Badge>
            </div>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <TimerIcon className="mr-1 h-4 w-4" />
                {item.expiryDate}
              </div>
              <Button
                variant="outline"
                asChild
                className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  立即领取
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function RewardLinks() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">每日福利领取中心</h1>

      <Tabs defaultValue="coins" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="coins" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            金币
          </TabsTrigger>
          <TabsTrigger value="discounts" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            立减金
          </TabsTrigger>
          <TabsTrigger value="redpackets" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            红包
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="coins">
            <RewardList items={coins} />
          </TabsContent>

          <TabsContent value="discounts">
            <RewardList items={discounts} />
          </TabsContent>

          <TabsContent value="redpackets">
            <RewardList items={redPackets} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
