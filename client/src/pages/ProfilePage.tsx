import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user } = useAuth();
  const [bio, setBio] = useState(user?.bio || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // In a real app, this would update the user's bio in the database
    setIsEditing(false);
  };

  return (
    <>
      <Helmet>
        <title>Profile - ShopSecure</title>
        <meta name="description" content="View and edit your profile" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Username</Label>
                  <Input value={user?.username || ""} disabled />
                </div>
                <div>
                  <Label>Name</Label>
                  <Input value={user?.name || ""} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bio</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label>About Me</Label>
                    <Input
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: bio || "No bio yet" }}
                  />
                  <Button onClick={() => setIsEditing(true)}>Edit Bio</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 