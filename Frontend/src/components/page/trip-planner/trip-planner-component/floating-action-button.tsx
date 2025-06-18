"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, MessageCircle, Phone } from "lucide-react"
import { useState } from "react"

export function FloatingActionButton() {
	const [isOpen, setIsOpen] = useState(false)

	const actions = [
		{ icon: MessageCircle, label: "Chat hỗ trợ", color: "bg-blue-500" },
		{ icon: Phone, label: "Gọi điện", color: "bg-green-500" },
	]

	return (
		<div className="fixed bottom-8 right-8 z-50">
			<motion.div className="flex flex-col items-end gap-3">
				{/* Action Buttons */}
				<motion.div
					initial={false}
					animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
					className="flex flex-col gap-3"
				>
					{actions.map((action, index) => (
						<motion.div
							key={index}
							initial={false}
							animate={{
								opacity: isOpen ? 1 : 0,
								y: isOpen ? 0 : 20,
								scale: isOpen ? 1 : 0.8,
							}}
							transition={{ delay: index * 0.1 }}
							className="flex items-center gap-3"
						>
							<div className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
								{action.label}
							</div>
							<Button
								size="icon"
								className={`${action.color} hover:scale-110 transition-transform duration-200 shadow-lg w-12 h-12 rounded-full`}
							>
								<action.icon className="h-5 w-5 text-white" />
							</Button>
						</motion.div>
					))}
				</motion.div>

				{/* Main FAB */}
				<Button
					onClick={() => setIsOpen(!isOpen)}
					size="icon"
					className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
				>
					<motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
						<Plus className="h-6 w-6 text-white" />
					</motion.div>
				</Button>
			</motion.div>
		</div>
	)
}
