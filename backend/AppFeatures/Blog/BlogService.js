
// Ensure this path is correct for your Supabase Admin client initialization
const { supabaseAdmin } = require("../../SupabaseClient");

/**
 * Helper function to check if a user is a Clayo Admin.
 * @param {string} userId - The ID of the user to check.
 * @returns {Promise<boolean>} True if the user is a Clayo Admin, false otherwise.
 */
async function isUserClayoAdmin(userId) {
  if (!userId) {
    console.warn("isUserClayoAdmin called with null userId.");
    return false;
  }
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("is_clayo_admin")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error checking Clayo Admin status:", error.message);
      return false;
    }
    return data?.is_clayo_admin === true;
  } catch (e) {
    console.error("Exception in isUserClayoAdmin:", e.message);
    return false;
  }
}

/**
 * Creates a new blog post.
 * Restricted to Clayo Admins only.
 * @param {object} postData - The data for the new blog post.
 * @param {string} userId - The ID of the user initiating the creation.
 * @returns {Promise<object>} The created blog post record.
 * @throws {Error} If unauthorized, missing required data, or slug exists.
 */
async function createBlogPost(postData, userId) {
  try {
    console.log("=== CREATE BLOG POST ===");

    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can create blog posts.");
    }

    const {
      title,
      slug,
      excerpt,
      content,
      category,
      featuredImage,
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
      readTime,
      organizationId,
    } = postData;

    if (!title || !slug || !content) {
      throw new Error("Title, slug, and content are required.");
    }

    if (!organizationId) {
      throw new Error("organization_id is required.");
    }

    const { data: existingPost, error: existingPostError } = await supabaseAdmin
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingPostError && existingPostError.code !== 'PGRST116') {
      console.error("Supabase error checking existing slug:", existingPostError);
      throw new Error(`Failed to check slug uniqueness: ${existingPostError.message}`);
    }
    if (existingPost) {
      throw new Error("A post with this slug already exists. Please choose a different one.");
    }

    const postRecord = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      featured_image_url: featuredImage || null,
      category: category || null,
      seo_keywords: seoKeywords || [],
      author_id: userId,
      status: status || "draft",
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt,
      read_time: readTime || null,
      published_at: status === "published" ? new Date().toISOString() : null,
      organization_id: organizationId,
    };

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .insert(postRecord)
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating blog post:", error);
      throw new Error(`Failed to create blog post: ${error.message}`);
    }
    return data;
  } catch (error) {
    console.error("Error in createBlogPost:", error.message);
    throw error;
  }
}

/**
 * Retrieves all published blog posts.
 * Public access for any user.
 * @returns {Promise<Array<object>>} An array of published blog posts.
 * @throws {Error} If fetching fails.
 */
async function getPublishedBlogPosts() {
  try {
    console.log("=== GET PUBLISHED BLOG POSTS ===");
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
        `
      )
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching published blog posts:", error);
      throw new Error(`Failed to fetch published blog posts: ${error.message}`);
    }

    return data.map((post) => ({
      ...post,
      author_id: post.author?.id || null,
      author_name: post.author?.full_name || "Clayo Team",
      author: undefined,
    }));
  } catch (error) {
    console.error("Error in getPublishedBlogPosts:", error.message);
    throw error;
  }
}

/**
 * Retrieves a single published blog post by its slug.
 * Public access if the post is published.
 * @param {string} slug - The slug of the blog post.
 * @returns {Promise<object>} The blog post record.
 * @throws {Error} If not found, not published, or fetching fails.
 */
async function getBlogPostBySlug(slug) {
  try {
    console.log("=== GET BLOG POST BY SLUG ===");
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
        `
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error) {
      console.error("Supabase error fetching blog post by slug:", error);
      if (error.code === 'PGRST116') {
        throw new Error("Blog post not found or not published.");
      }
      throw new Error(`Failed to fetch blog post: ${error.message}`);
    }

    return {
      ...data,
      author_id: data.author?.id || null,
      author_name: data.author?.full_name || "Clayo Team",
      author: undefined,
    };
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error.message);
    throw error;
  }
}

/**
 * Retrieves all blog posts for admin view.
 * Restricted to Clayo Admins.
 * @param {string} userId - The ID of the user requesting the posts.
 * @returns {Promise<Array<object>>} An array of all blog posts.
 * @throws {Error} If unauthorized or fetching fails.
 */
async function getAllBlogPostsForAdmin(userId) {
  try {
    console.log("=== GET ALL BLOG POSTS FOR ADMIN ===");

    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can view all blog posts.");
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
        `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching all blog posts:", error);
      throw new Error(`Failed to fetch all blog posts: ${error.message}`);
    }

    return data.map((post) => ({
      ...post,
      author_id: post.author?.id || null,
      author_name: post.author?.full_name || "Clayo Team",
      author: undefined,
    }));
  } catch (error) {
    console.error("Error in getAllBlogPostsForAdmin:", error.message);
    throw error;
  }
}

/**
 * Updates an existing blog post.
 * Restricted to Clayo Admins.
 * @param {string} id - The ID of the blog post to update.
 * @param {object} updateData - The data to update.
 * @param {string} userId - The ID of the user initiating the update.
 * @returns {Promise<object>} The updated blog post record.
 * @throws {Error} If unauthorized or updating fails.
 */
async function updateBlogPost(id, updateData, userId) {
  try {
    console.log("=== UPDATE BLOG POST ===");

    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can update blog posts.");
    }

    const recordToUpdate = {
      title: updateData.title,
      slug: updateData.slug,
      excerpt: updateData.excerpt,
      content: updateData.content,
      featured_image_url: updateData.featuredImage,
      category: updateData.category,
      seo_keywords: updateData.seoKeywords,
      status: updateData.status,
      seo_title: updateData.seoTitle,
      seo_description: updateData.seoDescription,
      read_time: updateData.readTime,
      updated_at: new Date().toISOString(),
    };

    if (recordToUpdate.status === "published" && !updateData.published_at) {
      recordToUpdate.published_at = new Date().toISOString();
    } else if (recordToUpdate.status !== "published") {
      recordToUpdate.published_at = null;
    }

    Object.keys(recordToUpdate).forEach(
      (key) => recordToUpdate[key] === undefined && delete recordToUpdate[key]
    );

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .update(recordToUpdate)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating blog post:", error);
      throw new Error(`Failed to update blog post: ${error.message}`);
    }
    return data;
  } catch (error) {
    console.error("Error in updateBlogPost:", error.message);
    throw error;
  }
}

/**
 * Deletes a blog post.
 * Restricted to Clayo Admins.
 * @param {string} id - The ID of the blog post to delete.
 * @param {string} userId - The ID of the user initiating the deletion.
 * @returns {Promise<boolean>} True if deletion was successful.
 * @throws {Error} If unauthorized or deletion fails.
 */
async function deleteBlogPost(id, userId) {
  try {
    console.log("=== DELETE BLOG POST ===");

    if (!(await isUserClayoAdmin(userId))) {
      throw new Error("Unauthorized: Only Clayo Admins can delete blog posts.");
    }

    const { error } = await supabaseAdmin
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase error deleting blog post:", error);
      throw new Error(`Failed to delete blog post: ${error.message}`);
    }
    return true;
  } catch (error) {
    console.error("Error in deleteBlogPost:", error.message);
    throw error;
  }
}

module.exports = {
  createBlogPost,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getAllBlogPostsForAdmin,
  updateBlogPost,
  deleteBlogPost,
};
