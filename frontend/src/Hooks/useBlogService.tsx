"use client"

import { useState, useCallback } from "react"
import { useUser } from "../Auth/Contexts/UserContext"
import { supabase } from "../Auth/SupabaseAuth"

const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  category: string | null
  seo_keywords: string[] | null
  author_id: string | null
  author_name: string | null
  status: "draft" | "published" | "archived"
  seo_title: string | null
  seo_description: string | null
  read_time: number | null
  published_at: string | null
  created_at: string
  updated_at: string
  organization_id: string | null
}

export interface CreateBlogPostBody {
  title: string
  slug: string
  excerpt?: string
  content: string
  category?: string
  featuredImage?: string
  status?: "draft" | "published" | "archived"
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  readTime?: number
  organizationId?: string
}

export interface UpdateBlogPostBody extends Partial<CreateBlogPostBody> {}

interface UseBlogServiceReturn {
  isLoading: boolean
  error: string | null
  success: string | null
  getPublishedPosts: () => Promise<BlogPost[] | null>
  getBlogPostBySlug: (slug: string) => Promise<BlogPost | null>
  getBlogPostById: (id: string) => Promise<BlogPost | null>
  createPost: (data: CreateBlogPostBody, imageFile?: File) => Promise<BlogPost | null>
  getAllPostsForAdmin: () => Promise<BlogPost[] | null>
  updatePost: (id: string, data: UpdateBlogPostBody, imageFile?: File) => Promise<BlogPost | null>
  deletePost: (id: string) => Promise<boolean>
  uploadImage: (imageFile: File) => Promise<string | null>
  clearMessages: () => void
  generateAIBlogPost: (params: {
    title: string
    hook: string
    targetKeywords?: string[]
    tone?: string
    wordCount?: number
  }) => Promise<any>
  generateTopicSuggestions: () => Promise<any>
  checkTitleExists: (title: string) => Promise<any>
}

export function useBlogService(): UseBlogServiceReturn {
  const { user, isAuthenticated, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const getAuthToken = async () => {
    if (!isAuthenticated) {
      throw new Error("Authentication required. Please log in.")
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      throw new Error("Authentication required. Please log in again.")
    }

    return sessionData.session.access_token
  }

  const authenticatedRequest = useCallback(
    async (url: string, method = "GET", body?: object | FormData) => {
      if (userLoading) {
        setError("Please wait for user data to load")
        return null
      }

      if (!isAuthenticated || !user) {
        setError("Please log in to perform this action")
        return null
      }

      setIsLoading(true)
      clearMessages()

      try {
        const token = await getAuthToken()

        // Determine if we're sending FormData or JSON
        const isFormData = body instanceof FormData
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
        }

        // Only set Content-Type for JSON, let browser set it for FormData
        if (!isFormData) {
          headers["Content-Type"] = "application/json"
        }

        console.log(`Making ${method} request to ${url}`, {
          headers: { ...headers, Authorization: "Bearer [REDACTED]" },
          body: isFormData ? "[FormData]" : body,
        })

        const response = await fetch(`${apiBaseUrl}${url}`, {
          method,
          headers,
          body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        })

        const result = await response.json()
        console.log(`Response from ${url}:`, result)

        if (!response.ok) {
          throw new Error(result.error || `Operation failed with status ${response.status}`)
        }

        setSuccess("Operation completed successfully!")
        return result
      } catch (err: any) {
        console.error(`Error during request to ${url}:`, err)
        setError(err.message || "A network error occurred. Please try again.")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, user, userLoading, clearMessages],
  )

  const publicRequest = useCallback(
    async (url: string, method = "GET") => {
      clearMessages()
      setIsLoading(true)
      try {
        const response = await fetch(`${apiBaseUrl}${url}`, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || `Failed to fetch data with status ${response.status}`)
        }

        return result
      } catch (err: any) {
        console.error(`Error during public request to ${url}:`, err)
        setError(err.message || "A network error occurred. Please try again.")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [clearMessages],
  )

  const getPublishedPosts = useCallback(async () => {
    return (await publicRequest("/api/blog/posts")) as BlogPost[] | null
  }, [publicRequest])

  const getBlogPostBySlug = useCallback(
    async (slug: string) => {
      return (await publicRequest(`/api/blog/posts/${slug}`)) as BlogPost | null
    },
    [publicRequest],
  )

  const getBlogPostById = useCallback(
    async (id: string) => {
      return (await authenticatedRequest(`/api/admin/blog/posts/${id}`)) as BlogPost | null
    },
    [authenticatedRequest],
  )

  const createPost = useCallback(
    async (data: CreateBlogPostBody, imageFile?: File) => {
      if (imageFile) {
        // Create FormData for multipart upload
        const formData = new FormData()

        // Add all the post data
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value))
            } else {
              formData.append(key, value.toString())
            }
          }
        })

        // Add the image file
        formData.append("image", imageFile)

        return (await authenticatedRequest("/api/admin/blog/posts", "POST", formData)) as BlogPost | null
      } else {
        // Regular JSON request when no image
        return (await authenticatedRequest("/api/admin/blog/posts", "POST", data)) as BlogPost | null
      }
    },
    [authenticatedRequest],
  )

  const getAllPostsForAdmin = useCallback(async () => {
    return (await authenticatedRequest("/api/admin/blog/posts")) as BlogPost[] | null
  }, [authenticatedRequest])

  const updatePost = useCallback(
    async (id: string, data: UpdateBlogPostBody, imageFile?: File) => {
      if (imageFile) {
        // Create FormData for multipart upload
        const formData = new FormData()

        // Add all the post data
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value))
            } else {
              formData.append(key, value.toString())
            }
          }
        })

        // Add the image file
        formData.append("image", imageFile)

        return (await authenticatedRequest(`/api/admin/blog/posts/${id}`, "PUT", formData)) as BlogPost | null
      } else {
        // Regular JSON request when no image
        return (await authenticatedRequest(`/api/admin/blog/posts/${id}`, "PUT", data)) as BlogPost | null
      }
    },
    [authenticatedRequest],
  )

  const deletePost = useCallback(
    async (id: string) => {
      const result = await authenticatedRequest(`/api/admin/blog/posts/${id}`, "DELETE")
      return result !== null
    },
    [authenticatedRequest],
  )

  const uploadImage = useCallback(
    async (imageFile: File) => {
      const formData = new FormData()
      formData.append("image", imageFile)

      const result = await authenticatedRequest("/api/admin/blog/upload-image", "POST", formData)
      return result?.imageUrl || null
    },
    [authenticatedRequest],
  )

  const generateAIBlogPost = useCallback(
    async (params: {
      title: string
      hook: string
      targetKeywords?: string[]
      tone?: string
      wordCount?: number
    }) => {
      console.log("Calling generateAIBlogPost with params:", params)
      const response = await authenticatedRequest("/api/ai/blog/generate", "POST", params)
      console.log("Raw API response from generateAIBlogPost:", response)
      return response
    },
    [authenticatedRequest],
  )

  const generateTopicSuggestions = useCallback(async () => {
    return await authenticatedRequest("/api/ai/blog/topics", "POST", {})
  }, [authenticatedRequest])

  const checkTitleExists = useCallback(
    async (title: string) => {
      return await authenticatedRequest("/api/ai/blog/check-title", "POST", { title })
    },
    [authenticatedRequest],
  )

  return {
    isLoading,
    error,
    success,
    getPublishedPosts,
    getBlogPostBySlug,
    getBlogPostById,
    createPost,
    getAllPostsForAdmin,
    updatePost,
    deletePost,
    uploadImage,
    clearMessages,
    generateAIBlogPost,
    generateTopicSuggestions,
    checkTitleExists,
  }
}
