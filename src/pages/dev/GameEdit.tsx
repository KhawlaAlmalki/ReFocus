import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Input } from 'src/components/ui/input';
import { Badge } from 'src/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import { Textarea } from 'src/components/ui/textarea';
import {
  Upload,
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Lock,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface GameData {
  id?: string;
  title: string;
  description: string;
  category: string;
  sessionTime: string;
  buildFile?: File | null;
  coverImage?: File | null;
  screenshots: File[];
  licenseType: string;
  licensePath?: string;
}

const CATEGORIES = [
  'Focus & Concentration',
  'Memory',
  'Relaxation',
  'Cognitive Training',
  'Reflexes',
  'Problem Solving',
];

export default function GameEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewGame = id === 'new';

  const [gameData, setGameData] = useState<GameData>({
    title: isNewGame ? '' : 'Focus Quest',
    description: isNewGame ? '' : 'An adventure game to improve concentration.',
    category: isNewGame ? '' : 'Focus & Concentration',
    sessionTime: isNewGame ? '' : '15',
    buildFile: null,
    coverImage: null,
    screenshots: [],
    licenseType: isNewGame ? '' : 'MIT',
    licensePath: '',
  });

  const [status] = useState<'Draft' | 'In Review' | 'Approved'>(
    isNewGame ? 'Draft' : 'Approved'
  );
  const [uploadProgress, setUploadProgress] = useState({
    buildFile: 0,
    coverImage: 0,
  });

  const handleInputChange = (
    field: keyof GameData,
    value: string | number
  ) => {
    setGameData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (
    field: 'buildFile' | 'coverImage',
    file: File | null
  ) => {
    if (file) {
      // Simulate upload progress
      setUploadProgress((prev) => ({
        ...prev,
        [field]: 0,
      }));
      setTimeout(() => {
        setUploadProgress((prev) => ({
          ...prev,
          [field]: 100,
        }));
      }, 1500);
    }
    setGameData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleScreenshotsChange = (files: FileList | null) => {
    if (files) {
      setGameData((prev) => ({
        ...prev,
        screenshots: Array.from(files).slice(0, 5),
      }));
    }
  };

  const removeScreenshot = (index: number) => {
    setGameData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  const handleSaveAsDraft = () => {
    if (!gameData.title) {
      toast.error('Please enter a game title');
      return;
    }
    toast.success('Game saved as draft');
  };

  const handleSubmitForReview = () => {
    if (!gameData.title || !gameData.description || !gameData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!gameData.buildFile) {
      toast.error('Please upload a build file');
      return;
    }
    toast.success('Game submitted for review');
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link to="/dev/dashboard">
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {isNewGame ? 'Add New Game' : 'Edit Game'}
              </h1>
              <p className="text-muted-foreground">
                {isNewGame
                  ? 'Create a new focus mini-game'
                  : 'Update game details and files'}
              </p>
            </div>
          </div>
          <Badge className={status === 'Draft' ? 'bg-gray-100 text-gray-800' : status === 'In Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
            {status}
          </Badge>
        </div>

        {/* Game Details Card */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Game Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Game Title *
              </label>
              <Input
                value={gameData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Focus Quest"
                className="rounded-2xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Short Description *
              </label>
              <Textarea
                value={gameData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the game and its benefits..."
                className="rounded-2xl min-h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Focus Category *
                </label>
                <Select
                  value={gameData.category}
                  onValueChange={(value) =>
                    handleInputChange('category', value)
                  }
                >
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Estimated Session Time (min) *
                </label>
                <Input
                  type="number"
                  value={gameData.sessionTime}
                  onChange={(e) => handleInputChange('sessionTime', e.target.value)}
                  placeholder="e.g., 15"
                  className="rounded-2xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Files Upload Card */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/10 rounded-2xl">
                <Upload className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Game Files Upload</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Build File (.zip, .exe, .apk) *
              </label>
              <div className="relative border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChange('buildFile', e.target.files?.[0] || null)
                  }
                  accept=".zip,.exe,.apk"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-semibold text-foreground mb-1">
                  {gameData.buildFile
                    ? gameData.buildFile.name
                    : 'Click or drag to upload build file'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported: ZIP, EXE, APK (Max 500MB)
                </p>
                {uploadProgress.buildFile > 0 &&
                  uploadProgress.buildFile < 100 && (
                    <div className="mt-3 bg-muted rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${uploadProgress.buildFile}%` }}
                      />
                    </div>
                  )}
                {uploadProgress.buildFile === 100 && (
                  <Check className="w-5 h-5 text-green-600 mx-auto mt-2" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Card */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <ImageIcon className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Media</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Cover Image
              </label>
              <div className="relative border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChange('coverImage', e.target.files?.[0] || null)
                  }
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-semibold text-foreground mb-1">
                  {gameData.coverImage
                    ? gameData.coverImage.name
                    : 'Click or drag to upload cover image'}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG (Recommended: 1280x720)
                </p>
                {uploadProgress.coverImage > 0 &&
                  uploadProgress.coverImage < 100 && (
                    <div className="mt-3 bg-muted rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${uploadProgress.coverImage}%` }}
                      />
                    </div>
                  )}
                {uploadProgress.coverImage === 100 && (
                  <Check className="w-5 h-5 text-green-600 mx-auto mt-2" />
                )}
              </div>
            </div>

            {/* Screenshots */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Screenshots (2-5 images)
              </label>
              <div className="relative border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleScreenshotsChange(e.target.files)}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-semibold text-foreground mb-1">
                  Click or drag to upload screenshots
                </p>
                <p className="text-xs text-muted-foreground">
                  Upload 2-5 images (JPG, PNG)
                </p>
              </div>

              {gameData.screenshots.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Preview ({gameData.screenshots.length}/5)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {gameData.screenshots.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="bg-muted rounded-xl aspect-video flex items-center justify-center overflow-hidden">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {file.name}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeScreenshot(index)}
                          className="absolute top-0 right-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* License & Ownership Card */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-2xl">
                <Lock className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>License & Ownership</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                License Type
              </label>
              <Select
                value={gameData.licenseType}
                onValueChange={(value) =>
                  handleInputChange('licenseType', value)
                }
              >
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Select license type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MIT">MIT License</SelectItem>
                  <SelectItem value="Apache">Apache 2.0</SelectItem>
                  <SelectItem value="GPL">GPL v3</SelectItem>
                  <SelectItem value="Custom">Custom License</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                License Document
              </label>
              <div className="relative border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    handleInputChange('licensePath', file?.name || '');
                  }}
                  accept=".pdf,.txt,.doc,.docx"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-semibold text-foreground mb-1">
                  {gameData.licensePath
                    ? gameData.licensePath
                    : 'Click or drag to upload license'}
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, TXT, DOC (Optional)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <Link to="/dev/Games" className="w-full md:w-auto">
            <Button variant="outline" className="w-full rounded-full">
              Cancel
            </Button>
          </Link>
          <div className="flex gap-4 w-full md:w-auto">
            <Button
              onClick={handleSaveAsDraft}
              variant="outline"
              className="flex-1 md:flex-none rounded-full"
            >
              Save as Draft
            </Button>
            <Button
              onClick={handleSubmitForReview}
              className="flex-1 md:flex-none rounded-full gap-2"
            >
              <Check className="w-4 h-4" />
              Submit for Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
