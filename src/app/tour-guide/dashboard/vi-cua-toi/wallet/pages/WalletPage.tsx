"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useBankAccount } from "@/services/use-bankaccount"
import { getStoredUser } from "@/utils/auth-storage"
import { formatPriceSimple } from "@/utils/format"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import "swiper/css"
import "swiper/css/effect-cards"
import { EffectCards } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useWalletData, WithdrawalPayload } from "../hooks/useWalletData"
import NewBankAccountForm, { NewBankAccountPayload } from "../organisms/NewBankAccountForm"
import TransactionsList from "../organisms/TransactionsList"
import WalletSummaryCard from "../organisms/WalletSummaryCard"
import WalletTwoColumn from "../templates/WalletTwoColumn"
import WithdrawalRequestForm from "../organisms/WithdrawalRequestForm"
import { useWallet } from "@/services/use-wallet"
import { BankAccountData } from "../molecules/BankAccountCard"

export default function WalletPage() {
	const user = useMemo(() => getStoredUser(), [])
	const { balance, accounts, transactions, withdrawalRequests, refetchAll } = useWalletData(user?.id)
	const [open, setOpen] = useState(false)
	const [selectedTxn, setSelectedTxn] = useState<any | null>(null)
	const [openAddAccount, setOpenAddAccount] = useState(false)
	const [openWithdraw, setOpenWithdraw] = useState(false)
	const [openEditBankAccount, setOpenEditBankAccount] = useState(false)
	const { deleteBankAccount, updateBankAccount, createBankAccount, loading: isLoadingCreateBankAccount } = useBankAccount()
	const { createWithdrawalRequest, loading: isLoadingCreateWithdrawalRequest } = useWallet()
	const [selectedBankAccount, setSelectedBankAccount] = useState<any | null>(null)
	const handleAddAccount = async (payload: NewBankAccountPayload) => {
		try {
			const res = await createBankAccount(payload)
			if (res) {
				toast.success("Thêm thẻ thành công")
				setOpenAddAccount(false)
				refetchAll()
			}
		} catch (error: any) {
			toast.error(error?.response?.data?.Message || "Thêm thẻ thất bại")
		}
	}

	const handleWithdraw = async (payload: WithdrawalPayload) => {
		try {
			const res = await createWithdrawalRequest(payload)
			if (res) {
				toast.success("Yêu cầu rút tiền thành công")
				setOpenWithdraw(false)
				refetchAll()
			}
		} catch (error: any) {
			toast.error(error?.response?.data?.Message || "Yêu cầu rút tiền thất bại")
		}
	}

	const handleViewDetailCard = (acc: BankAccountData) => {
		setSelectedBankAccount(acc)
		setOpenEditBankAccount(true)
	}

	const handleUpdateBankAccount = async (payload: BankAccountData) => {
		try {
			const res = await updateBankAccount(payload.id || "", {
				bankName: payload.bankName,
				bankAccountNumber: payload.bankAccountNumber,
				bankOwnerName: payload.bankOwnerName,
				isDefault: payload.isDefault,
			})
			if (res) {
				toast.success("Cập nhật thẻ thành công")
				refetchAll()
				setOpenEditBankAccount(false)
			}
		} catch (error: any) {
			toast.error(error?.response?.data?.Message || "Cập nhật thẻ thất bại")
		}
	}

	const handleDeleteBankAccount = async (id: string) => {
		try {
			const res = await deleteBankAccount(id)
			if (res) {
				toast.success("Xóa thẻ thành công")
				refetchAll()
			}
		} catch (error: any) {
			toast.error(error?.response?.data?.Message || "Xóa thẻ thất bại")
		}
	}

	return (
		<WalletTwoColumn
			left={
				<>
					<WalletSummaryCard balance={balance} onWithdraw={() => setOpenWithdraw(true)} />
					<Card>
						<CardHeader>
							<CardTitle>Lịch sử giao dịch</CardTitle>
						</CardHeader>
						<CardContent>
							<TransactionsList transactions={transactions} onSelect={setSelectedTxn} />
						</CardContent>
					</Card>
				</>
			}
			right={
				<>
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Các thẻ của bạn</CardTitle>
								<Button variant="outline" size="sm" onClick={() => setOpenAddAccount(true)}>
									<Plus className="w-4 h-4 mr-2" />
									Thêm thẻ
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{accounts?.length ? (
								<Swiper effect="cards" grabCursor modules={[EffectCards]} className="rounded-xl max-w-md">
									{accounts.map((acc: any) => (
										<SwiperSlide key={acc.id}>
											<div className="relative rounded-xl cursor-pointer" onClick={() => handleViewDetailCard(acc)}>
												<div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 text-white relative overflow-hidden h-[150px] flex flex-col justify-center items-center">
													<div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
													<div className="relative z-10 flex flex-col justify-center items-center">
														<div className="text-sm text-blue-100">{acc.bankName}</div>
														<div className="text-lg font-semibold">{acc.bankOwnerName}</div>
														<div className="text-base font-mono tracking-wider">{String(acc.bankAccountNumber || "").replace(/\d(?=\d{4})/g, "*")}</div>
													</div>
												</div>
											</div>
										</SwiperSlide>
									))}
								</Swiper>
							) : (
								<div className="text-sm text-gray-500">Chưa có tài khoản ngân hàng nào.</div>
							)}
						</CardContent>
					</Card>

					<Card className="">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Các yêu cầu rút tiền</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							{withdrawalRequests?.length ? (
								<div className="space-y-3">
									{withdrawalRequests.map((wr: any) => (
										<div key={wr.id} className="p-3 border rounded-lg text-sm">
											<div className="font-medium">{wr?.bankAccount?.bankOwnerName} • {String(wr?.bankAccount?.bankAccountNumber || "").replace(/\d(?=\d{4})/g, "*")} • {wr?.bankAccount?.bankName}</div>
											<div className="text-gray-500">{formatPriceSimple(wr.amount || 0)}</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-sm text-gray-500">Không có yêu cầu rút tiền nào.</div>
							)}
						</CardContent>
					</Card>

					<Dialog open={!!selectedTxn} onOpenChange={(o) => !o && setSelectedTxn(null)}>
						<DialogContent className="sm:max-w-lg">
							<DialogHeader>
								<DialogTitle>Chi tiết thẻ {selectedTxn?.bankAccount?.bankName}</DialogTitle>
							</DialogHeader>
							{selectedTxn && (
								<div className="space-y-3 text-sm">
									<div className="flex justify-between"><span className="text-gray-500">Mã giao dịch</span><span className="font-medium">{selectedTxn.id}</span></div>
									<div className="flex justify-between"><span className="text-gray-500">Số tiền</span><span className="font-semibold">{Math.abs(Number(selectedTxn.paidAmount ?? selectedTxn.amount ?? 0)).toLocaleString("vi-VN")}</span></div>
									<div className="flex justify-between"><span className="text-gray-500">Trạng thái</span><span>{selectedTxn.paymentStatusText || selectedTxn.statusText || ""}</span></div>
									<div className="flex justify-between"><span className="text-gray-500">Thời gian</span><span>{selectedTxn.transactionDateTime || selectedTxn.createdAt || selectedTxn.date || ""}</span></div>
								</div>
							)}
						</DialogContent>
					</Dialog>

					<Dialog open={openAddAccount} onOpenChange={(o) => !o && setOpenAddAccount(false)}>
						<DialogContent className="sm:max-w-lg">
							<DialogHeader>
								<DialogTitle>Thêm thẻ</DialogTitle>
							</DialogHeader>
							<NewBankAccountForm defaultValues={{ isDefault: true }} onSubmit={handleAddAccount} onCancel={() => setOpenAddAccount(false)} submitting={isLoadingCreateBankAccount} />
						</DialogContent>
					</Dialog>

					<Dialog open={openWithdraw} onOpenChange={(o) => !o && setOpenWithdraw(false)}>
						<DialogContent className="sm:max-w-lg">
							<DialogHeader>
								<DialogTitle>Yêu cầu rút tiền</DialogTitle>
							</DialogHeader>
							<WithdrawalRequestForm
								accounts={accounts}
								availableBalance={balance}
								onSubmit={handleWithdraw}
								onCancel={() => setOpenWithdraw(false)}
								submitting={isLoadingCreateWithdrawalRequest}
							/>
						</DialogContent>
					</Dialog>

					<Dialog open={openEditBankAccount} onOpenChange={(o) => !o && setOpenEditBankAccount(false)}>
						<DialogContent className="sm:max-w-lg">
							<DialogHeader>
								<DialogTitle>Cập nhật thẻ</DialogTitle>
							</DialogHeader>
							<NewBankAccountForm isEdit defaultValues={selectedBankAccount} onSubmit={handleUpdateBankAccount} onCancel={() => setOpenEditBankAccount(false)} submitting={isLoadingCreateBankAccount} />
						</DialogContent>
					</Dialog>
				</>
			}
		/>
	)
}


