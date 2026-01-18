"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Gamepad } from "lucide-react"



export default function Loading() {
    return (
        <div className="space-y-6 p-6 md:p-8 bg-background text-foreground">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-3">
                    <div className="h-10 w-64 bg-muted rounded-lg animate-pulse" />
                    <div className="h-4 w-96 bg-muted rounded-lg animate-pulse" />
                </div>
                <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
            </div>

            {/* Search Card Skeleton */}
            <Card className="bg-card border-border">
                <CardContent className="p-6">
                    <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
                </CardContent>
            </Card>

            {/* Games Table Skeleton */}
            <Card className="bg-card border-border shadow-sm">
                <CardHeader className="border-b border-border">
                    <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <Gamepad className="h-5 w-5 text-primary" />
                        <div className="h-6 w-40 bg-muted rounded-lg animate-pulse" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border bg-muted/30 hover:bg-muted/30">
                                <TableHead className="text-foreground font-semibold">Thumbnail</TableHead>
                                <TableHead className="text-foreground font-semibold">Title</TableHead>
                                <TableHead className="text-foreground font-semibold">Status</TableHead>
                                <TableHead className="text-right text-foreground font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index} className="border-border hover:bg-muted/50 transition-colors">
                                    <TableCell className="py-3">
                                        <div className="w-14 h-14 bg-muted rounded-md animate-pulse" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-4 w-32 bg-muted rounded-lg animate-pulse" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <div className="h-8 w-16 bg-muted rounded-lg animate-pulse" />
                                            <div className="h-8 w-16 bg-muted rounded-lg animate-pulse" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination Skeleton */}
                    <div className="mt-4 flex justify-center">
                        <div className="h-10 w-64 bg-muted rounded-lg animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}