'use client'

export default function Loading() {
	return (
		<div className="flex h-screen items-center justify-center bg-gray-50">
			<div className="text-center animate-fade-in-up">
				<div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg mx-auto mb-4 animate-pulse-glow"></div>
				<p className="text-sm text-gray-600">Loading Scheduled Tasks...</p>
			</div>
		</div>
	)
}



