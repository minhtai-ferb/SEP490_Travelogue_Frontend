import React from "react";
import { cn } from "@/lib/utils";

interface PulsatingButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	pulseColor?: string;
	duration?: string;
}

export const PulsatingButton = React.forwardRef<
	HTMLButtonElement,
	PulsatingButtonProps
>(
	(
		{
			className,
			children,
			pulseColor = "#75ccfe",
			duration = "2s",
			...props
		},
		ref,
	) => {
		return (
			<button
				ref={ref}
				className={cn(
					"relative flex cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-[#6DD5FA] to-[#2980B9] px-4 py-2 text-center text-primary-foreground",
					className,
				)}
				style={
					{
						"--pulse-color": pulseColor,
						"--duration": duration,
					} as React.CSSProperties
				}
				{...props}
			>
				<div className="relative z-10">{children}</div>
				<div className="absolute left-1/4 top-1/4 size-full -translate-x-1/4 -translate-y-1/4 animate-pulse rounded-lg bg-inherit" />
			</button>
		);
	},
);

PulsatingButton.displayName = "PulsatingButton";