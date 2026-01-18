'use client';

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Trash2, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  email: string;
  role: string;
}

interface UserListProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onPromote: (id: string) => void;
}

export function UserList({ users, currentPage, totalPages, onPageChange, onDelete, onPromote }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePromoteClick = (id: string) => {
    setPromotingUserId(id);
  };

  const handleConfirmPromote = () => {
    if (promotingUserId !== null) {
      onPromote(promotingUserId);
      setPromotingUserId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingUserId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingUserId !== null) {
      onDelete(deletingUserId);
      setDeletingUserId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted border-b border-border">
              <TableHead className="text-foreground font-semibold">Email</TableHead>
              <TableHead className="text-foreground font-semibold">Role</TableHead>
              <TableHead className="text-foreground font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50 border-b border-border transition-colors">
                <TableCell className="text-foreground">{user.email}</TableCell>
                <TableCell className="text-foreground">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {user.role !== "admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePromoteClick(user.id)}
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                    {(user.role !== 'admin') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(user.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          className="border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          className="border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <AlertDialog open={promotingUserId !== null} onOpenChange={() => setPromotingUserId(null)}>
        <AlertDialogContent className="bg-card border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Promote User to Admin</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to promote this user to Admin? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted border-border text-foreground hover:bg-muted/80">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPromote} className="bg-primary hover:bg-primary/90 text-primary-foreground">Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deletingUserId !== null} onOpenChange={() => setDeletingUserId(null)}>
        <AlertDialogContent className="bg-card border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted border-border text-foreground hover:bg-muted/80">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UserList;
