
"use client"

import { useState, useCallback, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Save, Eye, Upload, X, Bold, Italic, List, LinkIcon, ImageIcon, Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

import { useBlogService, CreateBlogPostBody } from "../../Hooks/useBlogService"
import { useUser } from "../../Auth/Contexts/UserContext"

export default function NewBlogPostPage() {
  const [formData, setFormData] = useState<CreateBlogPostBody & { featured: boolean, seoKeywords: string, readTime: number }>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    featuredImage: "",
    featured: false,
    status: "draft",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    readTime: 0,
  })

  const [previewMode, setPreviewMode] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null, message: string | null }>({ type: null, message: null })

  const { createPost, isLoading, error, success, clearMessages } = useBlogService()
  const { isAuthenticated, user, isLoading: userLoading } = useUser()

  useEffect(() => {
    if (!userLoading) {
      if (!isAuthenticated) {
        setSubmitStatus({ type: 'error', message: "You must be logged in to access this page." })
      } else if (!user?.is_clayo_admin) {
        setSubmitStatus({ type: 'error', message: "You are not authorized to create blog posts." })
      }
    }
  }, [userLoading, isAuthenticated, user])

  useEffect(() => {
    if (error) {
      setSubmitStatus({ type: 'error', message: error })
    } else if (success) {
      setSubmitStatus({ type: 'success', message: success })
      setFormData({
        title: "", slug: "", excerpt: "", content: "", category: "",
        featuredImage: "", featured: false, status: "draft", seoTitle: "",
        seoDescription: "", seoKeywords: "", readTime: 0
      })
    }
    const timer = setTimeout(() => clearMessages(), 5000)
    return () => clearTimeout(timer)
  }, [error, success, clearMessages])

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { id, value } = e.target
      setFormData((prev) => {
        const newState = { ...prev, [id]: value }
        if (id === "title") {
          newState.slug = generateSlug(value)
        }
        return newState
      })
    },
    [generateSlug]
  )

  const handleSwitchChange = useCallback((checked: boolean, id: string) => {
    setFormData((prev) => ({ ...prev, [id]: checked }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    setSubmitStatus({ type: null, message: null })

    if (!isAuthenticated || !user?.is_clayo_admin) {
      setSubmitStatus({ type: 'error', message: "You are not authorized to perform this action." })
      return
    }

    if (!formData.title || !formData.slug || !formData.content || !formData.category) {
      setSubmitStatus({ type: 'error', message: "Title, Slug, Content, and Category are required fields." })
      return
    }

    const postData: CreateBlogPostBody = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || undefined,
      content: formData.content,
      category: formData.category || undefined,
      featuredImage: formData.featuredImage || undefined,
      status: formData.status,
      seoTitle: formData.seoTitle || undefined,
      seoDescription: formData.seoDescription || undefined,
      seoKeywords: formData.seoKeywords ? formData.seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0) : undefined,
      readTime: formData.readTime > 0 ? formData.readTime : undefined,
    }

    await createPost(postData)
  }

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading user data...</p>
      </div>
    )
  }

  if (!isAuthenticated || !user?.is_clayo_admin) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>{submitStatus.message || "You are not authorized to view this page."}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100/40">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6">
        <Link to="/admin/blog" className="flex items-center gap-2 text-lg font-semibold">
          <ArrowLeft className="h-5 w-5" />
          Back to Blog Management
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Exit Preview" : "Preview"}
          </Button>
          <Button size="sm" type="submit" form="blog-post-form" disabled={isLoading}>
            {isLoading ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Article</>}
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="col-span-2 space-y-6">
            {submitStatus.message && (
              <div className={`p-4 rounded-lg text-sm ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {submitStatus.message}
              </div>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form id="blog-post-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter article title"
                      value={formData.title}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="auto-generated-from-title"
                      value={formData.slug}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      rows={3}
                      placeholder="A short summary for search results and previews..."
                      value={formData.excerpt}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                      <SelectTrigger disabled={isLoading}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="sustainability">Sustainability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="readTime">Read Time (minutes)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      placeholder="e.g., 5"
                      value={formData.readTime}
                      onChange={(e) => setFormData((prev) => ({ ...prev, readTime: parseInt(e.target.value) || 0 }))}
                      min="0"
                      disabled={isLoading}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.featuredImage ? (
                    <>
                      <img src={formData.featuredImage} alt="Featured Image" className="mx-auto mb-4 object-cover h-32 w-auto rounded-md" />
                      <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => setFormData((prev) => ({ ...prev, featuredImage: "" }))} disabled={isLoading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Drag & drop your image here, or click to upload</p>
                      <input type="file" className="sr-only" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0]
                          setFormData((prev) => ({ ...prev, featuredImage: URL.createObjectURL(file) }))
                        }
                      }} disabled={isLoading}/>
                      <Button type="button" variant="outline" className="mt-4" onClick={() => document.querySelector('input[type="file"]')?.click()} disabled={isLoading}>
                        Upload Image
                      </Button>
                    </>
                  )}
                </div>
                <div>
                  <Label htmlFor="featuredImageURL">Image URL (Optional)</Label>
                  <Input
                    id="featuredImageURL"
                    placeholder="Or paste an image URL"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Mark as Featured</Label>
                  <Switch id="featured" checked={formData.featured} onCheckedChange={(checked) => handleSwitchChange(checked, "featured")} disabled={isLoading}/>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as "draft" | "published" | "archived" }))}>
                    <SelectTrigger disabled={isLoading}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-2">
                  <Button variant="outline" size="sm" disabled={isLoading}><Bold className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" disabled={isLoading}><Italic className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" disabled={isLoading}><List className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" disabled={isLoading}><LinkIcon className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" disabled={isLoading}><ImageIcon className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" disabled={isLoading}><Hash className="h-4 w-4" /></Button>
                </div>
                <Textarea
                  id="content"
                  rows={15}
                  placeholder="Start writing your article content here... Supports Markdown."
                  value={formData.content}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    placeholder="SEO optimized title..."
                    value={formData.seoTitle}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoTitle.length}/60 characters
                  </p>
                </div>
                <div>
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    placeholder="SEO meta description..."
                    rows={3}
                    value={formData.seoDescription}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoDescription.length}/160 characters
                  </p>
                </div>
                <div>
                  <Label htmlFor="seoKeywords">Keywords</Label>
                  <Input
                    id="seoKeywords"
                    placeholder="keyword1, keyword2, keyword3"
                    value={formData.seoKeywords}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
