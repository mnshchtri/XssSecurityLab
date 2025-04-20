import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const teamMembers = [
  {
    name: "Manish Karki",
    role: "Lead Developer",
    description: "Security expert and full-stack developer specializing in XSS vulnerabilities and prevention techniques."
  },
  {
    name: "Nishab Khatiwada",
    role: "Security Researcher",
    description: "Focuses on identifying and documenting XSS vulnerabilities in web applications."
  },
  {
    name: "Parisha Shrestha",
    role: "Frontend Developer",
    description: "UI/UX specialist with expertise in creating interactive and secure web interfaces."
  },
  {
    name: "Supreme Ranabhat",
    role: "Backend Developer",
    description: "Database and server-side security expert, implementing robust security measures."
  }
];

export function TeamMembers() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <p className="text-sm text-gray-500">{member.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 