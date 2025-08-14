"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCards } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-cards"
import BankAccountCard, { BankAccountData } from "../molecules/BankAccountCard"

type Props = {
	accounts: BankAccountData[]
	onEdit?: (acc: BankAccountData) => void
	onDelete?: (acc: BankAccountData) => void
	onSetDefault?: (acc: BankAccountData) => void
}

export default function BankAccountsCarousel({ accounts, onEdit, onDelete, onSetDefault }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Các thẻ của bạn</CardTitle>
			</CardHeader>
			<CardContent>
				{accounts?.length ? (
					<Swiper effect="cards" grabCursor modules={[EffectCards]} className="rounded-xl max-w-md">
						{accounts.map((acc) => (
							<SwiperSlide key={acc.id || `${acc.bankName}-${acc.bankAccountNumber}`}>
								<BankAccountCard data={acc} onEdit={onEdit} onDelete={onDelete} onSetDefault={onSetDefault} />
							</SwiperSlide>
						))}
					</Swiper>
				) : (
					<div className="text-sm text-gray-500">Chưa có tài khoản ngân hàng nào.</div>
				)}
			</CardContent>
		</Card>
	)
}


