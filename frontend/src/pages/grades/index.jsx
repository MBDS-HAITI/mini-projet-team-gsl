import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useFetchData } from "@/hooks/use-fetch-data";
import { GradeForm } from "@/components/grades/grade-form";

export default function Notes() {
  const { data: grades, loading, error, refetch } = useFetchData("/grades");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
    }).format(new Date(dateString));
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
        <Button onClick={() => setIsSheetOpen(true)}>
          <IconPlus className="mr-2 size-4" /> Ajouter
        </Button>
      </div>
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Étudiant</TableHead>
              <TableHead>Matière</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-red-500">
                  Erreur: {error}
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && grades?.map((gradeItem) => (
              <TableRow key={gradeItem._id}>
                <TableCell>
                  {gradeItem.student?.firstName} {gradeItem.student?.lastName}
                </TableCell>
                <TableCell>
                  {gradeItem.course?.name} <span className="text-muted-foreground text-xs">({gradeItem.course?.code})</span>
                </TableCell>
                <TableCell className="font-medium">{gradeItem.grade}/20</TableCell>
                <TableCell>{formatDate(gradeItem.date)}</TableCell>
              </TableRow>
            ))}
            {!loading && !error && grades?.length === 0 && (
               <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Aucune note trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <GradeForm 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        onSuccess={refetch} 
      />
    </div>
  );
}
