/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Trash2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Application } from "@/types";
import { getStatusStyles } from "@/lib/utils";

export default function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const limit = 10;

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/application?page=${page}&limit=${limit}`
      );
      const { data, meta } = response.data;
      setApplications(data);
      setTotal(meta.total);
      setLastPage(meta.lastPage);
    } catch {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/application/${id}`);
      toast.success("Application deleted");
      fetchHistory();
    } catch (error) {
      toast.error("Failed to delete application");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Manage and edit your generated documents.
          </p>
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-white border-b border-slate-100 py-4">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Application History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="hidden sm:table-cell w-[60px] font-bold text-slate-900 text-center">
                      S/N
                    </TableHead>
                    <TableHead className="font-bold text-slate-900">
                      Company
                    </TableHead>
                    <TableHead className="font-bold text-slate-900">
                      Role
                    </TableHead>
                    {/* Status is now visible on all screens [!code ++] */}
                    <TableHead className="font-bold text-slate-900">
                      Status
                    </TableHead>
                    <TableHead className="hidden lg:table-cell font-bold text-slate-900">
                      Date
                    </TableHead>
                    <TableHead className="text-right font-bold text-slate-900 pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-20">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                          <span className="text-slate-400 font-medium">
                            Fetching records...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map((app: Application, index: number) => (
                      <TableRow
                        key={app._id}
                        className="group hover:bg-slate-50/50"
                      >
                        <TableCell className="hidden sm:table-cell text-center font-medium text-slate-400 group-hover:text-slate-900">
                          {(page - 1) * limit + index + 1}
                        </TableCell>
                        <TableCell className="font-bold text-slate-800 whitespace-nowrap">
                          {app.companyName}
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium truncate max-w-[150px] md:max-w-none">
                          {app.jobTitle}
                        </TableCell>

                        {/* Status cell is now visible on mobile [!code ++] */}
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`${getStatusStyles(
                              app.status
                            )} capitalize gap-1 font-semibold`}
                          >
                            <Clock size={12} /> {app.status || "Pending"}
                          </Badge>
                        </TableCell>

                        <TableCell className="hidden lg:table-cell text-slate-500 text-sm whitespace-nowrap">
                          {format(new Date(app.createdAt), "MMM dd, yyyy")}
                        </TableCell>

                        <TableCell className="text-right space-x-2 pr-4 md:pr-6 whitespace-nowrap">
                          <Link href={`/dashboard/applications/${app._id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3 text-slate-600 hover:text-emerald-600"
                            >
                              <Eye size={16} className="md:mr-2" />
                              <span className="hidden md:inline">View</span>
                            </Button>
                          </Link>

                          {/* Restore Delete AlertDialog [!code ++] */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3 text-slate-400 hover:text-red-600"
                              >
                                <Trash2 size={16} className="md:mr-2" />
                                <span className="hidden md:inline">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold">
                                  Confirm Deletion
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-600">
                                  You are about to delete the application for{" "}
                                  <span className="font-bold text-slate-900">
                                    {app.companyName}
                                  </span>
                                  . This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">
                                  Keep Application
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(app._id)}
                                  className="bg-red-600 hover:bg-red-700 rounded-xl px-6"
                                >
                                  Yes, Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {!loading && applications.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-20 text-slate-400"
                      >
                        No applications yet. Start by generating one!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50/50 border-t border-slate-100">
            <div className="text-xs md:text-sm text-slate-500 font-medium">
              Showing page <span className="text-slate-900">{page}</span> of{" "}
              <span className="text-slate-900">{lastPage}</span>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
                disabled={page <= 1 || loading}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={16} /> <span className="ml-1">Prev</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
                disabled={page >= lastPage || loading}
                onClick={() => setPage(page + 1)}
              >
                <span className="mr-1">Next</span> <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
