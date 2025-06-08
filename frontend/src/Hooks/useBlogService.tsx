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
  getPublishedPostBySlug: (slug: string) => Promise<BlogPost | null>
  createPost: (data: CreateBlogPostBody) => Promise<BlogPost | null>
  getAllPostsForAdmin: () => Promise<BlogPost[] | null>
  updatePost: (id: string, data: UpdateBlogPostBody) => Promise<BlogPost | null>
  deletePost: (id: string) => Promise<boolean>
  clearMessages: () => void
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
    async (url: string, method: string = "GET", body?: object) => {
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
        const response = await fetch(`${apiBaseUrl}${url}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: body ? JSON.stringify(body) : undefined,
        })

        const result = await response.json()

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
    [isAuthenticated, user, userLoading, clearMessages]
  )

  const publicRequest = useCallback(
    async (url: string, method: string = "GET") => {
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
    [clearMessages]
  )

  const getPublishedPosts = useCallback(async () => {
    return (await publicRequest("/api/blog/posts")) as BlogPost[] | null
  }, [publicRequest])

  const getPublishedPostBySlug = useCallback(async (slug: string) => {
    return (await publicRequest(`/api/blog/posts/${slug}`)) as BlogPost | null
  }, [publicRequest])

  const createPost = useCallback(
    async (data: CreateBlogPostBody) => {
      return (await authenticatedRequest("/api/admin/blog/posts", "POST", data)) as BlogPost | null
    },
    [authenticatedRequest]
  )

  const getAllPostsForAdmin = useCallback(async () => {
    return (await authenticatedRequest("/api/admin/blog/posts")) as BlogPost[] | null
  }, [authenticatedRequest])

  const updatePost = useCallback(
    async (id: string, data: UpdateBlogPostBody) => {
      return (await authenticatedRequest(`/api/admin/blog/posts/${id}`, "PUT", data)) as BlogPost | null
    },
    [authenticatedRequest]
  )

  const deletePost = useCallback(
    async (id: string) => {
      const result = await authenticatedRequest(`/api/admin/blog/posts/${id}`, "DELETE")
      return result !== null
    },
    [authenticatedRequest]
  )

  return {
    isLoading,
    error,
    success,
    getPublishedPosts,
    getPublishedPostBySlug,
    createPost,
    getAllPostsForAdmin,
    updatePost,
    deletePost,
    clearMessages,
  }
}