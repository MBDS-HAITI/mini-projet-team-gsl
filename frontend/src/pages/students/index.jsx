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
import { StudentForm } from "@/components/students/student-form";

export default function Students() {
  const { data: students, loading, error, refetch } = useFetchData("/students");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Étudiants</h1>
        <Button onClick={() => setIsSheetOpen(true)}>
          <IconPlus className="mr-2 size-4" /> Ajouter
        </Button>
      </div>
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center text-red-500">
                  Erreur: {error}
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && students?.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
              </TableRow>
            ))}
            {!loading && !error && students?.length === 0 && (
               <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  Aucun étudiant trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <StudentForm 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        onSuccess={refetch} 
      />
    </div>
  );
}
