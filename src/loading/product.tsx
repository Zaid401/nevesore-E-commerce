import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const THUMBNAILS = Array.from({ length: 5 });
const SIZE_PLACEHOLDERS = Array.from({ length: 5 });

export default function ProductSkeleton() {
	return (
		<main className="bg-[#f8f8f8] min-h-screen text-slate-900">
			<Navbar />

			<div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 lg:py-12">
				<div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
					{/* LEFT COLUMN */}
					<div className="lg:col-span-7">
						<div className="flex flex-col gap-3 sm:gap-4 lg:flex-row">
							<div className="order-2 flex gap-2 overflow-x-auto pb-2 sm:gap-3 lg:order-none lg:w-28 lg:flex-col lg:overflow-visible lg:pb-0">
								{THUMBNAILS.map((_, index) => (
									<div
										key={index}
										className="relative h-16 w-16 flex-none rounded border border-gray-100 bg-white sm:h-20 sm:w-20 lg:h-24 lg:w-24"
									>
										<div className="h-full w-full animate-pulse rounded bg-gray-200" />
									</div>
								))}
							</div>
							<div className="order-1 relative flex-1 overflow-hidden rounded-sm bg-white shadow-sm aspect-4/5 lg:order-none">
								<div className="h-full w-full animate-pulse bg-gray-200" />
							</div>
						</div>
					</div>

					{/* RIGHT COLUMN */}
					<div className="lg:col-span-5 space-y-6 sm:space-y-8 lg:space-y-8">
						<div className="space-y-3">
							<div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
							<div className="h-10 w-3/4 rounded bg-gray-200 animate-pulse" />
							<div className="h-0.5 w-1/3 bg-gray-200" />
							<div className="flex items-center gap-4">
								<div className="h-8 w-32 rounded bg-gray-200 animate-pulse" />
								<div className="h-5 w-20 rounded bg-gray-100" />
								<div className="h-4 w-24 rounded bg-gray-100" />
							</div>
							<div className="space-y-2">
								<div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
								<div className="h-3 w-5/6 rounded bg-gray-100 animate-pulse" />
							</div>
						</div>

						<div>
							<div className="h-3 w-32 rounded bg-gray-200 animate-pulse" />
							<div className="mt-3 flex gap-2 sm:gap-3">
								{Array.from({ length: 4 }).map((_, index) => (
									<div
										key={index}
										className="h-8 w-8 rounded-full border border-gray-100 bg-gray-100 animate-pulse"
									/>
								))}
							</div>
						</div>

						<div>
							<div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
							<div className="mt-3 grid grid-cols-5 gap-2">
								{SIZE_PLACEHOLDERS.map((_, index) => (
									<div
										key={index}
										className="h-10 rounded border border-gray-100 bg-gray-50 animate-pulse"
									/>
								))}
							</div>
						</div>

						<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:space-x-4">
							<div className="flex items-center rounded border border-gray-200">
								<div className="h-10 w-10 bg-gray-50 animate-pulse" />
								<div className="h-10 w-12 bg-gray-100" />
								<div className="h-10 w-10 bg-gray-50 animate-pulse" />
							</div>
							<div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
						</div>

						<div className="space-y-3">
							<div className="h-12 rounded bg-gray-200 animate-pulse" />
							<div className="h-12 rounded border-2 border-gray-200 bg-gray-50" />
						</div>

						<div className="space-y-2 border-t border-gray-100 pt-6">
							<div className="h-3 w-32 rounded bg-gray-200 animate-pulse" />
							<div className="space-y-2">
								<div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
								<div className="h-3 w-5/6 rounded bg-gray-100 animate-pulse" />
								<div className="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 pb-12">
				<div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
				<div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
					{Array.from({ length: 4 }).map((_, index) => (
						<div key={index} className="rounded-xl border border-gray-100 bg-white p-4">
							<div className="aspect-3/4 rounded bg-gray-100 animate-pulse" />
							<div className="mt-3 h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
							<div className="mt-2 h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
						</div>
					))}
				</div>
			</div>

			<Footer />
		</main>
	);
}
