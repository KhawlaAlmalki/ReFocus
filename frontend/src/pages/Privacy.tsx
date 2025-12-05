import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircle, Lock, Eye, User, Shield } from 'lucide-react';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-white py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                {/* Page Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                        Privacy & Data Protection
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Your focus is personal. We're committed to protecting your data, respecting your privacy, and giving you full control over your information.
                    </p>
                </div>

                {/* Security Highlight Box */}
                <Card className="rounded-3xl border border-green-200 bg-green-50 shadow-sm mb-12">
                    <CardContent className="p-8">
                        <div className="flex items-start gap-4">
                            <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-bold text-green-900 mb-2">
                                    Your Data is Secure
                                </h3>
                                <p className="text-green-800 mb-3">
                                    ReFocus uses industry-standard encryption and role-based access control to protect your personal information. Your focus sessions, progress data, and coaching interactions are only accessible to authorized users who need them for your benefit.
                                </p>
                                <ul className="space-y-2 text-sm text-green-800">
                                    <li>✓ End-to-end encryption for sensitive data</li>
                                    <li>✓ Role-based access control (only you, your coach, and admins when necessary)</li>
                                    <li>✓ Regular security audits and compliance checks</li>
                                    <li>✓ GDPR and privacy law compliance</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Collection Section */}
                <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
                    <CardHeader className="border-b border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <AlertCircle className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>What Data We Collect</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div>
                            <h4 className="font-bold text-foreground mb-3">Account Information</h4>
                            <p className="text-muted-foreground">
                                Name, email address, password (hashed), profile picture, location, and role (student, professional, coach, admin).
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-bold text-foreground mb-3">Focus Session Data</h4>
                            <p className="text-muted-foreground">
                                Session start/end times, duration, category (study, deep work, reading, etc.), notes, and performance metrics. This data helps us understand your focus patterns and provide personalized insights.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-bold text-foreground mb-3">Challenge Progress</h4>
                            <p className="text-muted-foreground">
                                Progress on active challenges, completion dates, and engagement metrics. This helps track your growth and recommend new challenges.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-bold text-foreground mb-3">Messages & Coaching Notes</h4>
                            <p className="text-muted-foreground">
                                If you're working with a coach, messages and notes are stored securely. These are only visible to you and your assigned coach.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-bold text-foreground mb-3">Platform Usage Data</h4>
                            <p className="text-muted-foreground">
                                General app usage analytics (pages visited, features used) to improve the platform. This is anonymized and never sold to third parties.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* How We Use Data Section */}
                <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
                    <CardHeader className="border-b border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-secondary/10 rounded-2xl">
                                <Eye className="w-6 h-6 text-secondary" />
                            </div>
                            <CardTitle>How We Use Your Data</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div>
                            <h4 className="font-bold text-foreground mb-3">✨ Personalized Dashboards</h4>
                            <p className="text-muted-foreground">
                                Your focus score, streaks, and progress summaries are calculated from your session data to give you a clear view of your improvement.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-bold text-foreground mb-3">📊 Progress Analytics</h4>
                            <p className="text-muted-foreground">
                                We analyze your focus patterns to generate insights, trends, and recommendations. For example, we might notice you focus best in the morning and suggest scheduling deep work then.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-bold text-foreground mb-3">🎯 Coaching Support</h4>
                            <p className="text-muted-foreground">
                                If assigned a coach, they'll review your data to provide personalized feedback, goal-setting advice, and support.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-bold text-foreground mb-3">🔧 Platform Improvement</h4>
                            <p className="text-muted-foreground">
                                Anonymized usage data helps us improve features, fix bugs, and build new tools that better support your focus.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-bold text-foreground mb-3">🛡️ Safety & Moderation</h4>
                            <p className="text-muted-foreground">
                                We may review data to prevent abuse, enforce community guidelines, or comply with legal obligations.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Who Can See Your Data Section */}
                <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
                    <CardHeader className="border-b border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-2xl">
                                <Lock className="w-6 h-6 text-purple-600" />
                            </div>
                            <CardTitle>Who Can See Your Data</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                            <h4 className="font-bold text-foreground mb-2">👤 You</h4>
                            <p className="text-muted-foreground">
                                Full access to all your data: sessions, progress, profile, and messages. You can edit, download, or delete your information anytime.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                            <h4 className="font-bold text-foreground mb-2">👥 Your Assigned Coach</h4>
                            <p className="text-muted-foreground">
                                If you're working with a coach, they see your session data, progress, and coaching notes—only what's relevant to help you improve.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                            <h4 className="font-bold text-foreground mb-2">🛡️ Admin Only When Necessary</h4>
                            <p className="text-muted-foreground">
                                ReFocus admins only access your data for platform moderation, legal compliance, or if you request support. We never share it for marketing or third-party use.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                            <h4 className="font-bold text-foreground mb-2">❌ Third Parties</h4>
                            <p className="text-muted-foreground">
                                Your data is never sold, traded, or shared with third parties without your explicit consent. Period.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Your Rights Section */}
                <Card className="rounded-3xl border border-border/50 shadow-sm mb-12">
                    <CardHeader className="border-b border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-2xl">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <CardTitle>Your Rights</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div>
                            <h4 className="font-bold text-foreground mb-3">📝 Edit Your Profile</h4>
                            <p className="text-muted-foreground mb-3">
                                Update your name, email, bio, and preferences anytime. Go to Account Settings in your profile.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-bold text-foreground mb-3">🔔 Control Notifications</h4>
                            <p className="text-muted-foreground mb-3">
                                Choose what notifications you receive via email, push, or in-app. Manage settings in your notification preferences.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-bold text-foreground mb-3">📥 Download Your Data</h4>
                            <p className="text-muted-foreground mb-3">
                                Request a copy of all your data in a portable format. This helps you back up your progress or switch platforms.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-bold text-foreground mb-3">🗑️ Delete Your Account</h4>
                            <p className="text-muted-foreground mb-3">
                                If you decide to leave, you can permanently delete your account and all associated data. This action is irreversible.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-bold text-foreground mb-3">❓ Contact Us</h4>
                            <p className="text-muted-foreground">
                                Have privacy concerns or data questions? Reach out to our support team at{' '}
                                <a href="mailto:privacy@refocus.com" className="text-primary font-semibold hover:underline">
                                    privacy@refocus.com
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Section */}
                <div className="border-t border-border/50 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-foreground mb-4">More Information</h3>
                            <div className="space-y-3">
                                <Link to="/" className="text-primary hover:underline font-medium">
                                    → Terms of Use
                                </Link>
                                <Link to="/" className="text-primary hover:underline font-medium block">
                                    → Contact Support
                                </Link>
                                <Link to="/" className="text-primary hover:underline font-medium block">
                                    → Cookie Policy
                                </Link>
                                <Link to="/" className="text-primary hover:underline font-medium block">
                                    → GDPR Request
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground mb-4">Last Updated</h3>
                            <p className="text-muted-foreground">January 2024</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                We update this policy as needed to reflect changes in our practices or legal requirements.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mt-12">
                        <Link to="/" className="flex-1">
                            <Button className="w-full rounded-full">
                                Back to Home
                            </Button>
                        </Link>
                        <a href="mailto:privacy@refocus.com" className="flex-1">
                            <Button variant="outline" className="w-full rounded-full">
                                Contact Support
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
