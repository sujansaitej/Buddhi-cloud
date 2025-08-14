'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
	title: string
	subtitle?: string
	icon?: React.ReactNode
	actions?: React.ReactNode
	showBackButton?: boolean
	onBack?: () => void
	className?: string
}

export default function PageHeader({
	title,
	subtitle,
	icon,
	actions,
	showBackButton = false,
	onBack,
	className = ''
}: PageHeaderProps) {
	return (
		<div className={`bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 sticky top-0 z-10 ${className}`}>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{showBackButton && (
						<Button
							variant="ghost"
							onClick={onBack}
							className="hover:bg-gray-100 border border-gray-200 shadow-sm rounded-xl p-3"
							title="Go Back"
						>
							<ArrowLeft className="w-5 h-5" />
						</Button>
					)}
					{icon && (
						<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
							{icon}
						</div>
					)}
					<div>
						<h1 className="text-2xl font-bold text-gray-900">{title}</h1>
						{subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
					</div>
				</div>
				{actions && (
					<div className="flex items-center gap-3">{actions}</div>
				)}
			</div>
		</div>
	)
}


