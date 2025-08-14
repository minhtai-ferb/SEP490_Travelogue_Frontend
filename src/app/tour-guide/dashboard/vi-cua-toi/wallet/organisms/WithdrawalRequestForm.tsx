"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type WithdrawalPayload = {
	amount: number;
	bankAccountId: string;
	note?: string;
};

export type WithdrawalRequestFormProps = {
	accounts: Array<{ id: string; bankName: string; bankAccountNumber?: string; bankOwnerName?: string; isDefault?: boolean }>;
	availableBalance: number;
	onSubmit: (payload: WithdrawalPayload) => Promise<void> | void;
	onCancel?: () => void;
	submitting?: boolean;
};

export default function WithdrawalRequestForm({ accounts, availableBalance, onSubmit, onCancel, submitting }: WithdrawalRequestFormProps) {
	const { register, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm<{ amount: string; bankAccountId: string; note: string }>({
		defaultValues: { amount: "", bankAccountId: accounts.find(a => a.isDefault)?.id || "", note: "" },
		mode: "onChange",
	});

	const amountRaw = watch("amount");
	const bankAccountId = watch("bankAccountId");

	const formatAmount = (raw: string) => {
		const digits = (raw || "").replace(/[^0-9]/g, "");
		if (!digits) return "";
		return Number(digits).toLocaleString("vi-VN");
	};

	const parseAmount = (raw: string) => Number(((raw || "").replace(/[^0-9]/g, "")) || 0);

	const amountValue = parseAmount(amountRaw);
	const minWithdraw = 1; // adjust if needed
	const tooLow = amountValue > 0 && amountValue < minWithdraw;
	const tooHigh = amountValue > availableBalance;
	const canSubmit = !!bankAccountId && amountValue > 0 && !tooLow && !tooHigh && isValid && !submitting;

	const handleQuick = (ratio: number) => {
		const v = Math.floor(availableBalance * ratio);
		setValue("amount", String(v), { shouldValidate: true, shouldDirty: true });
	};

	return (
		<form
			onSubmit={handleSubmit(async (values) => {
				const payload: WithdrawalPayload = {
					amount: parseAmount(values.amount),
					bankAccountId: values.bankAccountId,
					note: values.note?.trim() || "",
				};
				await onSubmit(payload);
			})}
			className="space-y-4"
			aria-label="Tạo yêu cầu rút tiền"
		>
			{/* Amount */}
			<div className="space-y-1">
				<Label htmlFor="amount">Số tiền</Label>
				<Input
					id="amount"
					inputMode="numeric"
					placeholder="Nhập số tiền muốn rút"
					value={formatAmount(amountRaw)}
					onChange={(e) => setValue("amount", e.target.value, { shouldValidate: true, shouldDirty: true })}
					aria-invalid={!!errors.amount}
				/>
				<div className="mt-1 flex items-center justify-between text-xs text-gray-500">
					<span>Số dư khả dụng: {availableBalance.toLocaleString("vi-VN")} ₫</span>
					<span>Tối thiểu: {minWithdraw.toLocaleString("vi-VN")} ₫</span>
				</div>
				<div className="mt-2 flex gap-2">
					{[0.25, 0.5, 1].map(r => (
						<Button key={r} type="button" size="sm" variant="outline" onClick={() => handleQuick(r)}>
							{Math.round(r * 100)}%
						</Button>
					))}
				</div>
				{(tooLow || tooHigh) && (
					<p className="text-xs text-red-600 mt-2">
						{tooLow && `Số tiền tối thiểu là ${minWithdraw.toLocaleString("vi-VN")} ₫.`}
						{tooHigh && `Số tiền vượt quá số dư khả dụng.`}
					</p>
				)}
			</div>

			{/* Bank account */}
			<div className="space-y-1">
				<Label htmlFor="bankAccountId">Tài khoản ngân hàng</Label>
				<Select value={bankAccountId} onValueChange={(v) => setValue("bankAccountId", v, { shouldValidate: true, shouldDirty: true })}>
					<SelectTrigger id="bankAccountId">
						<SelectValue placeholder="Chọn tài khoản" />
					</SelectTrigger>
					<SelectContent>
						{accounts.map(acc => (
							<SelectItem key={acc.id} value={acc.id}>
								{acc.bankOwnerName || ""} — {(acc.bankAccountNumber || "")} — {acc.bankName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Note */}
			<div className="space-y-1">
				<Label htmlFor="note">Ghi chú (không bắt buộc)</Label>
				<Textarea id="note" placeholder="Ghi chú cho yêu cầu rút tiền" {...register("note")} />
			</div>

			{/* Summary */}
			<div className="rounded-md border border-gray-200 p-3 text-sm dark:border-gray-800">
				<div className="flex justify-between"><span>Yêu cầu</span><span>{amountValue.toLocaleString("vi-VN")} ₫</span></div>
				<div className="flex justify-between"><span>Phí</span><span>0 ₫</span></div>
				<div className="mt-1 border-t pt-2 flex justify-between font-semibold"><span>Thực nhận</span><span>{amountValue.toLocaleString("vi-VN")} ₫</span></div>
			</div>

			{/* Actions */}
			<div className="flex items-center justify-end gap-2">
				<Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
				<Button type="submit" disabled={!canSubmit}>{submitting ? "Đang gửi..." : "Tạo yêu cầu"}</Button>
			</div>
		</form>
	);
}


