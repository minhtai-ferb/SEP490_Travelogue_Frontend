"use client";

import React from "react";
import { Pencil, Trash2, Star, StarOff } from "lucide-react";

export type BankAccountData = {
	bankName: string;
	bankAccountNumber: string;
	bankOwnerName: string;
	isDefault: boolean;
	id?: string;
};

export type BankAccountCardProps = {
	data: BankAccountData;
	secondaryText?: string;
	onEdit?: (data: BankAccountData) => void;
	onDelete?: (data: BankAccountData) => void;
	onSetDefault?: (data: BankAccountData) => void;
	className?: string;
};

export function maskAccount(account: string): string {
	if (!account || account.length < 4) return "****";
	const last4 = account.slice(-4);
	return `****${last4}`;
}

export default function BankAccountCard({
	data,
	secondaryText,
	onEdit,
	onDelete,
	onSetDefault,
	className,
}: BankAccountCardProps) {
	const masked = maskAccount(data.bankAccountNumber);

	return (
		<article
			className={[
				"group relative w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm",
				"hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500",
				"dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-850",
				className || "",
			].join(" ")}
			aria-label={`Tài khoản ngân hàng: ${data.bankOwnerName}, ${masked}, ${data.bankName}`}
			role="region"
			tabIndex={0}
		>
			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<span className="truncate font-semibold text-gray-900 dark:text-gray-100">
							{data.bankOwnerName}
						</span>
						<span className="text-gray-500 dark:text-gray-400">—</span>
						<span className="font-mono text-sm tracking-wider text-gray-700 dark:text-gray-300">
							{masked}
						</span>
						<span className="text-gray-500 dark:text-gray-400">—</span>
						<span className="truncate text-gray-700 dark:text-gray-300">
							{data.bankName}
						</span>
						{data.isDefault && (
							<span
								className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300"
								aria-label="Tài khoản mặc định"
							>
								Mặc định
							</span>
						)}
					</div>
					{secondaryText ? (
						<div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
							{secondaryText}
						</div>
					) : null}
				</div>

				<div className="flex items-center gap-2 md:shrink-0">
					<button
						type="button"
						onClick={() => onEdit?.(data)}
						aria-label="Chỉnh sửa tài khoản"
						className={[
							"inline-flex items-center justify-center rounded-md border border-transparent p-2 text-gray-600",
							"hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
							"dark:text-gray-300 dark:hover:bg-gray-800",
						].join(" ")}
					>
						<Pencil className="h-4 w-4" />
					</button>

					<button
						type="button"
						onClick={() => onDelete?.(data)}
						aria-label="Xóa tài khoản"
						className={[
							"inline-flex items-center justify-center rounded-md border border-transparent p-2 text-red-600",
							"hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
							"dark:text-red-400 dark:hover:bg-red-900/20",
						].join(" ")}
					>
						<Trash2 className="h-4 w-4" />
					</button>

					{data.isDefault ? (
						<button
							type="button"
							aria-label="Đang là mặc định"
							disabled
							className={[
								"inline-flex items-center justify-center rounded-md border border-transparent p-2 text-green-600",
								"opacity-60 dark:text-green-400",
							].join(" ")}
							title="Đang là mặc định"
						>
							<Star className="h-4 w-4" />
						</button>
					) : (
						<button
							type="button"
							onClick={() => onSetDefault?.(data)}
							aria-label="Đặt làm mặc định"
							className={[
								"inline-flex items-center justify-center rounded-md border border-transparent p-2 text-gray-600",
								"hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
								"dark:text-gray-300 dark:hover:bg-gray-800",
							].join(" ")}
						>
							<StarOff className="h-4 w-4" />
						</button>
					)}
				</div>
			</div>
		</article>
	);
}


