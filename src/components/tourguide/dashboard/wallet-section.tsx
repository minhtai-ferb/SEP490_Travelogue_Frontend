"use client"

import { useMemo, useState } from "react"
import { useAtom } from "jotai"
import { userAtom } from "@/store/auth"
import { useWallet } from "@/hooks/use-wallet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDateTime, formatPrice } from "@/utils/format"
import type { WalletTransaction } from "@/types/wallet"
import { Badge } from "@/components/ui/badge"
import { ArrowDownToLine, ArrowUpFromLine, WalletIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export function WalletSection() {
	const [user] = useAtom(userAtom)
	const { wallet, loading, error, deposit, withdraw } = useWallet(user?.id)
	const [depositOpen, setDepositOpen] = useState(false)
	const [withdrawOpen, setWithdrawOpen] = useState(false)
	const [amount, setAmount] = useState<number>(0)
	const { toast } = useToast()

	const transactions = useMemo(() => wallet?.transactions ?? [], [wallet])

	const onDeposit = async () => {
		if (amount <= 0) {
			toast({ title: "Số tiền không hợp lệ", description: "Vui lòng nhập số tiền lớn hơn 0.", variant: "destructive" })
			return
		}
		const ok = await deposit(amount, "Nạp tiền thủ công (demo)")
		if (ok) {
			toast({ title: "Thành công", description: "Đã nạp tiền vào ví." })
			setDepositOpen(false)
			setAmount(0)
		}
	}

	const onWithdraw = async () => {
		if (amount <= 0) {
			toast({ title: "Số tiền không hợp lệ", description: "Vui lòng nhập số tiền lớn hơn 0.", variant: "destructive" })
			return
		}
		const ok = await withdraw(amount, "Yêu cầu rút tiền (demo)")
		if (ok) {
			toast({ title: "Thành công", description: "Yêu cầu rút tiền đã được xử lý." })
			setWithdrawOpen(false)
			setAmount(0)
		}
	}

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Ví tiền của bạn</CardTitle>
					<WalletIcon className="w-5 h-5 text-gray-500" />
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
						<div>
							<div className="text-3xl font-bold">{formatPrice(wallet?.balance ?? 0)}</div>
							<div className="text-xs text-gray-500">Cập nhật: {wallet ? formatDateTime(wallet.updatedAt) : "-"}</div>
							{error && <div className="text-sm text-red-600 mt-2">{error}</div>}
						</div>
						<div className="flex gap-2">
							<Button variant="outline" onClick={() => setDepositOpen(true)}>
								<ArrowDownToLine className="w-4 h-4 mr-2" />
								Nạp tiền
							</Button>
							<Button onClick={() => setWithdrawOpen(true)}>
								<ArrowUpFromLine className="w-4 h-4 mr-2" />
								Rút tiền
							</Button>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="min-w-full text-sm">
							<thead>
								<tr className="text-left text-gray-600 border-b">
									<th className="py-2 pr-4">Thời gian</th>
									<th className="py-2 pr-4">Loại</th>
									<th className="py-2 pr-4">Số tiền</th>
									<th className="py-2 pr-4">Số dư sau</th>
									<th className="py-2 pr-4">Ghi chú</th>
									<th className="py-2 pr-4">Trạng thái</th>
								</tr>
							</thead>
							<tbody>
								{transactions.map((t: WalletTransaction) => (
									<tr key={t.id} className="border-b last:border-0">
										<td className="py-2 pr-4">{formatDateTime(t.createdAt)}</td>
										<td className="py-2 pr-4 capitalize">
											<span className="px-2 py-1 rounded-md bg-gray-100">{t.type}</span>
										</td>
										<td className={`py-2 pr-4 font-medium ${t.type === "withdrawal" ? "text-red-600" : "text-green-600"}`}>
											{t.type === "withdrawal" ? "-" : "+"}
											{formatPrice(Math.abs(t.amount))}
										</td>
										<td className="py-2 pr-4">{formatPrice(t.balanceAfter)}</td>
										<td className="py-2 pr-4">{t.note || "-"}</td>
										<td className="py-2 pr-4">
											<Badge variant="outline" className="text-xs">
												{t.status}
											</Badge>
										</td>
									</tr>
								))}
								{transactions.length === 0 && (
									<tr>
										<td colSpan={6} className="py-6 text-center text-gray-500">
											Chưa có giao dịch nào
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{loading && <div className="text-sm text-gray-500">Đang tải...</div>}
				</CardContent>
			</Card>

			{/* Deposit Dialog */}
			<Dialog open={depositOpen} onOpenChange={setDepositOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Nạp tiền vào ví</DialogTitle>
						<DialogDescription>Nhập số tiền bạn muốn nạp</DialogDescription>
					</DialogHeader>
					<div className="space-y-3">
						<div>
							<Label>Số tiền (VND)</Label>
							<Input type="number" min={0} value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} />
						</div>
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setDepositOpen(false)}>
								Hủy
							</Button>
							<Button onClick={onDeposit}>Xác nhận</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Withdraw Dialog */}
			<Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Rút tiền</DialogTitle>
						<DialogDescription>Nhập số tiền bạn muốn rút</DialogDescription>
					</DialogHeader>
					<div className="space-y-3">
						<div>
							<Label>Số tiền (VND)</Label>
							<Input type="number" min={0} value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} />
						</div>
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setWithdrawOpen(false)}>
								Hủy
							</Button>
							<Button onClick={onWithdraw}>Xác nhận</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
