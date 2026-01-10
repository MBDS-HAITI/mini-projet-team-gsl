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
import { CourseForm } from "@/components/courses/course-form";

export default function Courses() {
  const { data: courses, loading, error, refetch } = useFetchData("/courses");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Matières</h1>
        <Button onClick={() => setIsSheetOpen(true)}>
          <IconPlus className="mr-2 size-4" /> Ajouter
        </Button>
      </div>
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Code</TableHead>
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
            {!loading && !error && courses?.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.code}</TableCell>
              </TableRow>
            ))}
             {!loading && !error && courses?.length === 0 && (
               <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  Aucune matière trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CourseForm 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        onSuccess={refetch} 
      />
    </div>
  );
}