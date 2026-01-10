import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { useFetchData } from "@/hooks/use-fetch-data";
import { postData } from "@/lib/api";

const gradeSchema = z.object({
  student: z.string().min(1, "L'étudiant est requis"),
  course: z.string().min(1, "La matière est requise"),
  grade: z.coerce
    .number()
    .min(0, "La note doit être positive")
    .max(20, "La note ne peut pas dépasser 20"),
  date: z.string().min(1, "La date est requise"),
});

export function GradeForm({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    student: "",
    course: "",
    grade: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { data: students, loading: loadingStudents } = useFetchData("/students");
  const { data: courses, loading: loadingCourses } = useFetchData("/courses");

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validatedData = gradeSchema.parse(formData);

      await postData("/grades", validatedData);

      toast.success("Note ajoutée avec succès");
      setFormData({ student: "", course: "", grade: "", date: "" });
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(err.message || "Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ajouter une note</SheetTitle>
          <SheetDescription>
            Remplissez les informations pour ajouter une note.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6">

          <div className="p-4 space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="student">Étudiant</Label>
              <Select
                value={formData.student}
                onValueChange={(val) => handleChange("student", val)}
                disabled={loadingStudents}
              >
                <SelectTrigger id="student">
                  <SelectValue
                    placeholder={
                      loadingStudents
                        ? "Chargement..."
                        : "Sélectionner un étudiant"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {students?.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.firstName} {s.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.student && (
                <span className="text-sm text-red-500">{errors.student}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="course">Matière</Label>
              <Select
                value={formData.course}
                onValueChange={(val) => handleChange("course", val)}
                disabled={loadingCourses}
              >
                <SelectTrigger id="course">
                  <SelectValue
                    placeholder={
                      loadingCourses
                        ? "Chargement..."
                        : "Sélectionner une matière"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name} ({c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course && (
                <span className="text-sm text-red-500">{errors.course}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="grade">Note (/20)</Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={formData.grade}
                onChange={(e) => handleChange("grade", e.target.value)}
                placeholder="Ex: 15"
              />
              {errors.grade && (
                <span className="text-sm text-red-500">{errors.grade}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
              {errors.date && (
                <span className="text-sm text-red-500">{errors.date}</span>
              )}
            </div>
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Ajout..." : "Ajouter"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
