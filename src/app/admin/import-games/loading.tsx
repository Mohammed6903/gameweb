import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="space-y-6 p-6 md:p-8 bg-background text-foreground">
            <div>
                <Skeleton className="h-10 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Filters Card Skeleton */}
            <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-16 mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table Skeleton */}
            <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Table header */}
                        <div className="grid grid-cols-4 gap-4 pb-4 border-b border-border">
                            <Skeleton className="h-6 w-6" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-24" />
                        </div>

                        {/* Table rows */}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="grid grid-cols-4 gap-4 items-center">
                                <Skeleton className="h-6 w-6" />
                                <Skeleton className="h-14 w-14 rounded-md" />
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-center gap-2">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}