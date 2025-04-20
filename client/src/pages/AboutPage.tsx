import { Helmet } from "react-helmet-async";
import { AlertTriangle, Shield, Terminal, FileCode, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMembers } from "@/components/TeamMembers";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About ShopSecure XSS Lab - ShopSecure</title>
        <meta name="description" content="Learn about the ShopSecure XSS vulnerability lab and how it works" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4">About ShopSecure XSS Lab</h1>
            <p className="text-gray-600">
              An educational platform demonstrating Cross-Site Scripting vulnerabilities in a controlled environment
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span>What is Cross-Site Scripting (XSS)?</span>
              </CardTitle>
              <CardDescription>
                Understanding the risks and types of XSS vulnerabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious client-side scripts into web pages viewed by other users. 
                These attacks occur when an application takes untrusted data and sends it to a web browser without proper validation or escaping.
              </p>
              <p>
                When successful, XSS attacks can steal user data (such as cookies, session tokens, or sensitive information), 
                perform actions impersonating the user, or deface websites and modify presented content.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-blue-500" />
                  <span>Reflected XSS</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Reflected XSS occurs when malicious script is reflected off a web application to the victim's browser. 
                  It's typically delivered through URLs containing malicious code.
                </p>
                <p className="text-sm mt-2 font-semibold">Try it: Use the search bar</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-green-500" />
                  <span>Stored XSS</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Stored XSS occurs when malicious script is stored on the target server, such as in a database, 
                  message forum, comment field, or visitor log.
                </p>
                <p className="text-sm mt-2 font-semibold">Try it: Add a product review</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  <span>DOM-based XSS</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  DOM-based XSS is a type of XSS where the vulnerability exists in client-side code rather than server-side code. 
                  It occurs when JavaScript dynamically updates the page.
                </p>
                <p className="text-sm mt-2 font-semibold">Try it: Add a note to a cart item</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Educational Purpose</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This application was created solely for educational purposes to demonstrate how XSS vulnerabilities work and how to defend against them.
                You can toggle between secure and vulnerable modes using the security toggle in the header to see how proper input sanitization prevents these attacks.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <h3 className="text-sm font-medium text-amber-800">Important Warning</h3>
                <p className="mt-2 text-sm text-amber-700">
                  Never attempt to use these techniques on real websites. Doing so without explicit permission is illegal and unethical.
                  This lab environment is designed to be intentionally vulnerable for learning purposes only.
                </p>
              </div>
            </CardContent>
          </Card>

          <TeamMembers />
        </div>
      </div>
    </>
  );
}
