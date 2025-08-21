"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_BANK = "https://api.vietqr.io/v2/banks"

export type NewBankAccountPayload = {
	id?: string;
	bankName: string;
	bankAccountNumber: string;
	bankOwnerName: string;
	isDefault: boolean;
};

export type NewBankAccountFormProps = {
	defaultValues?: Partial<NewBankAccountPayload>;
	onSubmit: (payload: NewBankAccountPayload) => Promise<void> | void;
	onCancel?: () => void;
	submitting?: boolean;
	className?: string;
	isEdit?: boolean;
};

export default function NewBankAccountForm({
	defaultValues,
	onSubmit,
	onCancel,
	submitting,
	className,
	isEdit,
}: NewBankAccountFormProps) {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<NewBankAccountPayload>({
		defaultValues: {
			bankName: defaultValues?.bankName ?? "",
			bankAccountNumber: defaultValues?.bankAccountNumber ?? "",
			bankOwnerName: defaultValues?.bankOwnerName ?? "",
			isDefault: defaultValues?.isDefault ?? false,
		},
		mode: "onChange",
	});

	const accountNumber = watch("bankAccountNumber");
	const [banks, setBanks] = useState<any[]>([]);
	const onNumberChange = (value: string) => {
		// Only digits
		const digits = value.replace(/[^0-9]/g, "");
		setValue("bankAccountNumber", digits, { shouldValidate: true, shouldDirty: true });
	};

	useEffect(() => {
		fetch(API_BANK)
			.then(res => res.json())
			.then(data => {
				setBanks(data.data)
			})
	}, [])

	return (
		<form
			onSubmit={handleSubmit(async (values) => {
				const payload: NewBankAccountPayload = {
					id: defaultValues?.id,
					bankName: values.bankName.trim(),
					bankAccountNumber: values.bankAccountNumber.trim(),
					bankOwnerName: values.bankOwnerName.trim(),
					isDefault: values.isDefault,
				};
				await onSubmit(payload);
			})}
			className={["space-y-4", className || ""].join(" ")}
			aria-label="Tạo tài khoản ngân hàng mới"
		>
			{/* Bank owner */}
			<div className="space-y-1">
				<Label htmlFor="bankOwnerName">Chủ tài khoản</Label>
				<Input
					id="bankOwnerName"
					placeholder="Nhập tên chủ tài khoản"
					aria-invalid={!!errors.bankOwnerName}
					{...register("bankOwnerName", { required: "Vui lòng nhập tên chủ tài khoản" })}
				/>
				{errors.bankOwnerName && (
					<p className="text-xs text-red-600">{errors.bankOwnerName.message}</p>
				)}
			</div>

			{/* Bank name */}
			<div className="space-y-1">
				<Label htmlFor="bankName">Ngân hàng</Label>
				<Select
					value={watch("bankName")}
					onValueChange={(value) => setValue("bankName", value, { shouldValidate: true, shouldDirty: true })}
				>
					<SelectTrigger>
						<SelectValue placeholder="Chọn ngân hàng" />
					</SelectTrigger>
					<SelectContent className="max-h-[300px] w-[450px] overflow-y-auto">
						{banks.map((bank: any) => (
							<SelectItem key={bank.code} value={bank.code} className="capitalize"	>
								{bank.code} - {bank.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.bankName && <p className="text-xs text-red-600">{errors.bankName.message}</p>}
			</div>

			{/* Account number */}
			<div className="space-y-1">
				<Label htmlFor="bankAccountNumber">Số tài khoản</Label>
				<Input
					id="bankAccountNumber"
					inputMode="numeric"
					placeholder="Chỉ nhập số"
					aria-invalid={!!errors.bankAccountNumber}
					value={accountNumber}
					onChange={(e) => onNumberChange(e.target.value)}
				/>
				{errors.bankAccountNumber ? (
					<p className="text-xs text-red-600">{errors.bankAccountNumber.message}</p>
				) : (
					<p className="text-xs text-gray-500">Chỉ nhập ký tự số, tối thiểu 4 ký tự.</p>
				)}
			</div>

			{/* Default toggle */}
			<div className="flex items-center justify-between rounded-md border border-gray-200 p-3 dark:border-gray-800">
				<div>
					<Label htmlFor="isDefault">Đặt làm mặc định</Label>
					<p className="text-xs text-gray-500">Dùng làm tài khoản nhận mặc định khi rút tiền</p>
				</div>
				<Switch
					id="isDefault"
					checked={watch("isDefault")}
					onCheckedChange={(checked) => setValue("isDefault", checked, { shouldDirty: true })}
					aria-label="Đặt làm mặc định"
				/>
			</div>

			{/* Actions */}
			<div className="flex items-center justify-end gap-2 pt-2">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					aria-label="Hủy"
				>
					Hủy
				</Button>
				<Button
					type="submit"
					disabled={submitting}
					aria-label="Tạo tài khoản ngân hàng"
				>
					{submitting ? "Đang tạo..." : isEdit ? "Cập nhật" : "Tạo tài khoản"}
				</Button>
			</div>
		</form>
	);
}


