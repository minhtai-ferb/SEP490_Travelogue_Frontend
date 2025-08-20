"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPriceSimple } from "@/utils/format"
import { Wallet } from "lucide-react"

type Props = {
	balance: number
	onWithdraw: () => void
}

export default function WalletSummaryCard({ balance, onWithdraw }: Props) {
	return (
		<Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-semibold mb-2">Ví của bạn</h2>
						<p className="text-blue-100 mb-4">Quản lý số dư và giao dịch</p>
						<div className="text-3xl font-bold">{formatPriceSimple(balance)}</div>
					</div>
					<Wallet className="w-16 h-16 text-white/20" />
				</div>
				<div className="mt-4 flex justify-end">
					<Button onClick={onWithdraw} className="bg-red-600 hover:bg-red-700">Rút tiền</Button>
				</div>
			</CardContent>
		</Card>
	)
}


