import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function About() {
  const teamMembers = [
    {
      name: "Louis Midson LAJEANTY",
      role: "Etudiant en MBDS",
      email: "louis_midson.lajeanty@student.ueh.edu.ht",
      phone: "+509 46 95 4516 / 40 21 7596",
      avatar: "",
      initials: "LM",
    },
    {
      name: "Getro BUISSERETH",
      role: "Etudiant en MBDS",
      email: "getro.buissereth@ueh.edu.ht",
      phone: "+509 47 04 3500",
      avatar: "",
      initials: "GB",
    },
    {
      name: "Serge BEAUBOEUF",
      role: "Etudiant en MBDS",
      email: "serge.beauboeuf@student.ueh.edu.ht",
      phone: "+509 33 14 9226",
      avatar: "",
      initials: "SB",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          À Propos du Projet
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Une solution complète de gestion scolaire conçue pour simplifier le suivi
          académique.
        </p>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Notre Mission</CardTitle>
        </CardHeader>
        <CardContent className="text-lg leading-relaxed">
          Cette application a été développée dans le cadre du programme de Master
          MBDS (Mobilité, Big Data et Intégration de Systèmes) de la Faculté des
          Sciences et de l'Université Côte d'Azur. Elle vise à fournir aux
          enseignants et aux étudiants des outils performants pour gérer les
          notes, les matières et les profils étudiants de manière intuitive et
          efficace.
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
          Notre Équipe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center gap-4 pb-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-xl font-bold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium mt-1">
                    {member.role}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground space-y-2">
                <p>{member.email}</p>
                {member.phone && <p>{member.phone}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}