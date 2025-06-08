// Updated BlogService with Supabase Storage integration for public blog-images bucket
const { supabaseAdmin } = require("../../SupabaseClient")

/**
 * Helper function to check if a user is a Clayo Admin.
 * @param {string} userId - The ID of the user to check.
 * @returns {Promise<boolean>} True if the user is a Clayo Admin, false otherwise.
 */
async function isUserClayoAdmin(userId) {
  if (!userId) {
    console.warn("isUserClayoAdmin called with null userId.")
    return false
  }
  try {
    const { data, error } = await supabaseAdmin.from("users").select("is_clayo_admin").eq("id", userId).single()

    if (error) {
      console.error("Error checking Clayo Admin status:", error.message)
      return false
    }
    return data?.is_clayo_admin === true
  } catch (e) {
    console.error("Exception in isUserClayoAdmin:", e.message)
    return false
  }
}

/**
 * Uploads an image to Supabase Storage and returns the public URL.
 * @param {Buffer|File} imageFile - The image file to upload.
 * @param {string} fileName - The desired file name.
 * @param {string} userId - The ID of the user uploading the image.
 * @returns {Promise<string>} The public URL of the uploaded image.
 * @throws {Error} If upload fails or user is unauthorized.
 */
async function uploadBlogImage(imageFile, fileName, userId) {
  try {
    console.log("=== UPLOAD BLOG IMAGE ===")

    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can upload blog images.")
    }

    // Generate unique filename to avoid conflicts
    const timestamp = Date.now()
    const fileExtension = fileName.split(".").pop()
    const uniqueFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const filePath = `${uniqueFileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabaseAdmin.storage.from("blog-images").upload(filePath, imageFile, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Supabase Storage upload error:", error)
      throw new Error(`Failed to upload image: ${error.message}`)
    }

    // Get public URL for the uploaded image
    const { data: publicUrlData } = supabaseAdmin.storage.from("blog-images").getPublicUrl(filePath)

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to get public URL for uploaded image")
    }

    console.log("Image uploaded successfully:", publicUrlData.publicUrl)
    return publicUrlData.publicUrl
  } catch (error) {
    console.error("Error in uploadBlogImage:", error.message)
    throw error
  }
}

/**
 * Deletes an image from Supabase Storage.
 * @param {string} imageUrl - The public URL of the image to delete.
 * @param {string} userId - The ID of the user deleting the image.
 * @returns {Promise<boolean>} True if deletion was successful.
 * @throws {Error} If deletion fails or user is unauthorized.
 */
async function deleteBlogImage(imageUrl, userId) {
  try {
    console.log("=== DELETE BLOG IMAGE ===")

    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can delete blog images.")
    }

    // Extract file path from public URL
    const urlParts = imageUrl.split("/")
    const fileNameIndex = urlParts.length - 1
    const fileName = urlParts[fileNameIndex]

    // Delete file from Supabase Storage
    const { error } = await supabaseAdmin.storage.from("blog-images").remove([fileName])

    if (error) {
      console.error("Supabase Storage delete error:", error)
      throw new Error(`Failed to delete image: ${error.message}`)
    }

    console.log("Image deleted successfully:", fileName)
    return true
  } catch (error) {
    console.error("Error in deleteBlogImage:", error.message)
    throw error
  }
}

/**
 * Creates a new blog post with optional image upload.
 * Restricted to Clayo Admins only.
 * @param {object} postData - The data for the new blog post.
 * @param {string} userId - The ID of the user initiating the creation.
 * @param {File|Buffer} [imageFile] - Optional image file to upload.
 * @param {string} [imageFileName] - Original name of the image file.
 * @returns {Promise<object>} The created blog post record.
 * @throws {Error} If unauthorized, missing required data, or slug exists.
 */
async function createBlogPost(postData, userId, imageFile = null, imageFileName = null) {
  try {
    console.log("=== CREATE BLOG POST ===")

    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can create blog posts.")
    }

    const {
      title,
      slug,
      excerpt,
      content,
      category,
      featuredImage, // This could be a URL or null if uploading file
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
      readTime,
      organizationId,
    } = postData

    if (!title || !slug || !content) {
      throw new Error("Title, slug, and content are required.")
    }

    if (!organizationId) {
      throw new Error("organization_id is required.")
    }

    // Check if slug already exists
    const { data: existingPost, error: existingPostError } = await supabaseAdmin
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .single()

    if (existingPostError && existingPostError.code !== "PGRST116") {
      console.error("Supabase error checking existing slug:", existingPostError)
      throw new Error(`Failed to check slug uniqueness: ${existingPostError.message}`)
    }
    if (existingPost) {
      throw new Error("A post with this slug already exists. Please choose a different one.")
    }

    // Handle image upload if provided
    let finalImageUrl = featuredImage
    if (imageFile && imageFileName) {
      finalImageUrl = await uploadBlogImage(imageFile, imageFileName, userId)
    }

    const postRecord = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      featured_image_url: finalImageUrl || null,
      category: category || null,
      seo_keywords: seoKeywords || [],
      author_id: userId,
      status: status || "draft",
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt,
      read_time: readTime || null,
      published_at: status === "published" ? new Date().toISOString() : null,
      organization_id: organizationId,
    }

    const { data, error } = await supabaseAdmin.from("blog_posts").insert(postRecord).select().single()

    if (error) {
      // If post creation fails and we uploaded an image, clean it up
      if (finalImageUrl && finalImageUrl !== featuredImage) {
        try {
          await deleteBlogImage(finalImageUrl, userId)
        } catch (cleanupError) {
          console.error("Failed to cleanup uploaded image:", cleanupError.message)
        }
      }
      console.error("Supabase error creating blog post:", error)
      throw new Error(`Failed to create blog post: ${error.message}`)
    }
    return data
  } catch (error) {
    console.error("Error in createBlogPost:", error.message)
    throw error
  }
}

/**
 * Updates an existing blog post with optional image upload.
 * Restricted to Clayo Admins.
 * @param {string} id - The ID of the blog post to update.
 * @param {object} updateData - The data to update.
 * @param {string} userId - The ID of the user initiating the update.
 * @param {File|Buffer} [imageFile] - Optional new image file to upload.
 * @param {string} [imageFileName] - Original name of the new image file.
 * @returns {Promise<object>} The updated blog post record.
 * @throws {Error} If unauthorized or updating fails.
 */
async function updateBlogPost(id, updateData, userId, imageFile = null, imageFileName = null) {
  try {
    console.log("=== UPDATE BLOG POST ===")

    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can update blog posts.")
    }

    // Get current post to check for existing image
    const { data: currentPost, error: fetchError } = await supabaseAdmin
      .from("blog_posts")
      .select("featured_image_url")
      .eq("id", id)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch current post: ${fetchError.message}`)
    }

    // Handle image upload if provided
    let finalImageUrl = updateData.featuredImage
    if (imageFile && imageFileName) {
      // Upload new image
      finalImageUrl = await uploadBlogImage(imageFile, imageFileName, userId)

      // Delete old image if it exists and is different
      if (
        currentPost.featured_image_url &&
        currentPost.featured_image_url !== finalImageUrl &&
        currentPost.featured_image_url.includes("blog-images")
      ) {
        try {
          await deleteBlogImage(currentPost.featured_image_url, userId)
        } catch (deleteError) {
          console.error("Failed to delete old image:", deleteError.message)
          // Don't fail the update if old image deletion fails
        }
      }
    }

    const recordToUpdate = {
      title: updateData.title,
      slug: updateData.slug,
      excerpt: updateData.excerpt,
      content: updateData.content,
      featured_image_url: finalImageUrl,
      category: updateData.category,
      seo_keywords: updateData.seoKeywords,
      status: updateData.status,
      seo_title: updateData.seoTitle,
      seo_description: updateData.seoDescription,
      read_time: updateData.readTime,
      updated_at: new Date().toISOString(),
    }

    if (recordToUpdate.status === "published" && !updateData.published_at) {
      recordToUpdate.published_at = new Date().toISOString()
    } else if (recordToUpdate.status !== "published") {
      recordToUpdate.published_at = null
    }

    // Remove undefined values
    Object.keys(recordToUpdate).forEach((key) => recordToUpdate[key] === undefined && delete recordToUpdate[key])

    const { data, error } = await supabaseAdmin.from("blog_posts").update(recordToUpdate).eq("id", id).select().single()

    if (error) {
      console.error("Supabase error updating blog post:", error)
      throw new Error(`Failed to update blog post: ${error.message}`)
    }
    return data
  } catch (error) {
    console.error("Error in updateBlogPost:", error.message)
    throw error
  }
}

/**
 * Deletes a blog post and its associated image.
 * Restricted to Clayo Admins.
 * @param {string} id - The ID of the blog post to delete.
 * @param {string} userId - The ID of the user initiating the deletion.
 * @returns {Promise<boolean>} True if deletion was successful.
 * @throws {Error} If unauthorized or deletion fails.
 */
async function deleteBlogPost(id, userId) {
  try {
    console.log("=== DELETE BLOG POST ===")

    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can delete blog posts.")
    }

    // Get post data to check for image
    const { data: post, error: fetchError } = await supabaseAdmin
      .from("blog_posts")
      .select("featured_image_url")
      .eq("id", id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      throw new Error(`Failed to fetch post for deletion: ${fetchError.message}`)
    }

    // Delete the blog post
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id)

    if (error) {
      console.error("Supabase error deleting blog post:", error)
      throw new Error(`Failed to delete blog post: ${error.message}`)
    }

    // Delete associated image if it exists
    if (post?.featured_image_url && post.featured_image_url.includes("blog-images")) {
      try {
        await deleteBlogImage(post.featured_image_url, userId)
      } catch (imageDeleteError) {
        console.error("Failed to delete associated image:", imageDeleteError.message)
        // Don't fail the post deletion if image deletion fails
      }
    }

    return true
  } catch (error) {
    console.error("Error in deleteBlogPost:", error.message)
    throw error
  }
}

// Keep existing functions unchanged
async function getPublishedBlogPosts() {
  try {
    console.log("=== GET PUBLISHED BLOG POSTS ===")
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        featured_image_url,
        category,
        seo_keywords,
        status,
        published_at,
        seo_title,
        seo_description,
        read_time,
        created_at,
        updated_at,
        author:users(id, full_name)
        `,
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Supabase error fetching published blog posts:", error)
      throw new Error(`Failed to fetch published blog posts: ${error.message}`)
    }

    return data.map((post) => ({
      ...post,
      author_id: post.author?.id || null,
      author_name: post.author?.full_name || "Clayo Team",
      author: undefined,
    }))
  } catch (error) {
    console.error("Error in getPublishedBlogPosts:", error.message)
    throw error
  }
}

async function getBlogPostBySlug(slug) {
  try {
    console.log("=== GET BLOG POST BY SLUG ===")
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select(
        `
        id,
        title,
        slug,
        content,
        excerpt,
        featured_image_url,
        category,
        seo_keywords,
        status,
        published_at,
        seo_title,
        seo_description,
        read_time,
        created_at,
        updated_at,
        author:users(id, full_name)
        `,
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single()

    if (error) {
      console.error("Supabase error fetching blog post by slug:", error)
      if (error.code === "PGRST116") {
        throw new Error("Blog post not found or not published.")
      }
      throw new Error(`Failed to fetch blog post: ${error.message}`)
    }

    return {
      ...data,
      author_id: data.author?.id || null,
      author_name: data.author?.full_name || "Clayo Team",
      author: undefined,
    }
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error.message)
    throw error
  }
}

async function getAllBlogPostsForAdmin(userId) {
  try {
    console.log("=== GET ALL BLOG POSTS FOR ADMIN ===")

    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can view all blog posts.")
    }

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        featured_image_url,
        category,
        seo_keywords,
        status,
        published_at,
        seo_title,
        seo_description,
        read_time,
        created_at,
        updated_at,
        author:users(id, full_name)
        `,
      )
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error fetching all blog posts:", error)
      throw new Error(`Failed to fetch all blog posts: ${error.message}`)
    }

    return data.map((post) => ({
      ...post,
      author_id: post.author?.id || null,
      author_name: post.author?.full_name || "Clayo Team",
      author: undefined,
    }))
  } catch (error) {
    console.error("Error in getAllBlogPostsForAdmin:", error.message)
    throw error
  }
}

module.exports = {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getAllBlogPostsForAdmin,
  uploadBlogImage,
  deleteBlogImage,
}
