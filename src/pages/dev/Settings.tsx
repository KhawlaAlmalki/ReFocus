import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Input } from 'src/components/ui/input';
import { Badge } from 'src/components/ui/badge';
import { Textarea } from 'src/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import {
  ArrowLeft,
  User,
  Bell,
  Lock,
  Globe,
  Save,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface DeveloperProfile {
  name: string;
  email: string;
  company: string;
  bio: string;
  website: string;
  location: string;
  experienceLevel: string;
}

interface NotificationSettings {
  submissionUpdates: boolean;
  reviewerFeedback: boolean;
  gamePerformance: boolean;
  newsletter: boolean;
}

export default function DeveloperSettings() {
  const [profile, setProfile] = useState<DeveloperProfile>({
    name: 'John Developer',
    email: 'john@example.com',
    company: 'Dev Studios',
    bio: 'Passionate game developer creating focus and wellness mini-games.',
    website: 'https://devstudios.com',
    location: 'San Francisco, CA',
    experienceLevel: 'intermediate',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    submissionUpdates: true,
    reviewerFeedback: true,
    gamePerformance: true,
    newsletter: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleProfileChange = (field: keyof DeveloperProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (
    field: keyof NotificationSettings,
    value: boolean
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  const handleSaveNotifications = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Notification settings saved');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <Link to="/dev/dashboard">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Manage your developer profile and preferences
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-8 border-b border-border/50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </div>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'notifications'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </div>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security
            </div>
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <Card className="rounded-3xl border border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Full Name
                    </label>
                    <Input
                      value={profile.name}
                      onChange={(e) =>
                        handleProfileChange('name', e.target.value)
                      }
                      className="rounded-2xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        handleProfileChange('email', e.target.value)
                      }
                      className="rounded-2xl"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Company / Studio Name
                    </label>
                    <Input
                      value={profile.company}
                      onChange={(e) =>
                        handleProfileChange('company', e.target.value)
                      }
                      placeholder="Your company name"
                      className="rounded-2xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Location
                    </label>
                    <Input
                      value={profile.location}
                      onChange={(e) =>
                        handleProfileChange('location', e.target.value)
                      }
                      placeholder="City, Country"
                      className="rounded-2xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Bio
                  </label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    placeholder="Tell us about yourself"
                    className="rounded-2xl min-h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Website
                  </label>
                  <Input
                    value={profile.website}
                    onChange={(e) =>
                      handleProfileChange('website', e.target.value)
                    }
                    placeholder="https://example.com"
                    className="rounded-2xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Experience Level
                  </label>
                  <Select
                    value={profile.experienceLevel}
                    onValueChange={(value) =>
                      handleProfileChange('experienceLevel', value)
                    }
                  >
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="rounded-full gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-8">
            <Card className="rounded-3xl border border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary/10 rounded-2xl">
                    <Bell className="w-6 h-6 text-secondary" />
                  </div>
                  <CardTitle>Email Notifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Submission Updates */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Submission Updates
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when your game submission status changes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.submissionUpdates}
                    onChange={(e) =>
                      handleNotificationChange('submissionUpdates', e.target.checked)
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Reviewer Feedback */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Reviewer Feedback
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Receive detailed feedback from our review team
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.reviewerFeedback}
                    onChange={(e) =>
                      handleNotificationChange('reviewerFeedback', e.target.checked)
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Game Performance */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Game Performance Reports
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Weekly reports on your games' performance metrics
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.gamePerformance}
                    onChange={(e) =>
                      handleNotificationChange('gamePerformance', e.target.checked)
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Newsletter */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Newsletter
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Subscribe to our developer newsletter with tips and updates
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.newsletter}
                    onChange={(e) =>
                      handleNotificationChange('newsletter', e.target.checked)
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                <div className="pt-6 border-t border-border/50">
                  <Button
                    onClick={handleSaveNotifications}
                    disabled={isSaving}
                    className="rounded-full gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            <Card className="rounded-3xl border border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-2xl">
                    <Lock className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle>Password & Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <p className="font-semibold text-foreground mb-2">
                    Password
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Last changed 3 months ago
                  </p>
                  <Button variant="outline" className="rounded-full">
                    Change Password
                  </Button>
                </div>

                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <p className="font-semibold text-foreground mb-2">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-800 mb-4">
                    Not Enabled
                  </Badge>
                  <Button variant="outline" className="rounded-full">
                    Enable 2FA
                  </Button>
                </div>

                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <p className="font-semibold text-foreground mb-2">
                    Active Sessions
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    1 active session on this device
                  </p>
                  <Button variant="outline" className="rounded-full">
                    View Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-red-200 shadow-sm bg-red-50">
              <CardHeader className="border-b border-red-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <CardTitle className="text-red-900">Danger Zone</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div>
                  <p className="font-semibold text-red-900 mb-2">Delete Account</p>
                  <p className="text-sm text-red-800 mb-4">
                    Permanently delete your account and all associated data. This
                    action cannot be undone.
                  </p>
                  <Button
                    variant="destructive"
                    className="rounded-full bg-red-600 hover:bg-red-700"
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
