#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { supabaseAdmin } = require('./SupabaseClient');

// Configuration - Update these for your website
const config = {
  domain: 'https://clayo.co', // Your website domain
  outputDir: '../frontend/public', // Save to frontend public directory
  
  // Static pages configuration
  staticPages: [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/pricing', priority: '0.9', changefreq: 'monthly' },
    { url: '/blog', priority: '0.9', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/login', priority: '0.3', changefreq: 'monthly' },
    { url: '/signup', priority: '0.3', changefreq: 'monthly' }
  ],
  
  // Database configuration
  database: {
    enabled: true, // Set to true to fetch from your Supabase database
    type: 'supabase'
  },
  
  // Exclusions
  excludePatterns: [
    '/admin',
    '/dashboard',
    '/api',
    '/private',
    '/.well-known'
  ]
};

class SitemapGenerator {
  constructor(config) {
    this.config = config;
    this.urls = [];
  }

  // Add static pages to sitemap
  addStaticPages() {
    console.log('📄 Adding static pages...');
    
    this.config.staticPages.forEach(page => {
      this.urls.push({
        loc: `${this.config.domain}${page.url}`,
        lastmod: new Date().toISOString(),
        changefreq: page.changefreq,
        priority: page.priority
      });
    });
    
    console.log(`✅ Added ${this.config.staticPages.length} static pages`);
  }

  // Fetch dynamic pages from database (if configured)
  async addDynamicPages() {
    if (!this.config.database.enabled) {
      console.log('⏭️ Database integration disabled, skipping dynamic pages');
      return;
    }

    try {
      if (this.config.database.type === 'supabase') {
        await this.fetchFromSupabase();
      }
      // Add other database types here as needed
    } catch (error) {
      console.log('⚠️ Could not fetch dynamic pages:', error.message);
    }
  }

  // Fetch from Supabase using your existing client
  async fetchFromSupabase() {
    try {
      // Fetch blog posts only
      const { data: blogPosts, error } = await supabaseAdmin
        .from('blog_posts')
        .select('slug, updated_at, created_at')
        .eq('status', 'published');

      if (error) throw error;

      if (blogPosts && blogPosts.length > 0) {
        console.log(`📝 Found ${blogPosts.length} blog posts`);
        
        blogPosts.forEach(post => {
          this.urls.push({
            loc: `${this.config.domain}/blog/${post.slug}`,
            lastmod: post.updated_at || post.created_at || new Date().toISOString(),
            changefreq: 'weekly',
            priority: '0.8'
          });
        });
      }
    } catch (error) {
      console.log('⚠️ Error fetching blog posts:', error.message);
    }
  }

  // Crawl website to discover pages (optional advanced feature)
  async crawlWebsite() {
    // This is a basic implementation - you might want to use a more robust crawler
    console.log('🕷️ Crawling website for additional pages...');
    // Implementation would go here for automatic page discovery
  }

  // Generate XML sitemap
  generateSitemapXML() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    this.urls.forEach(url => {
      xml += `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    return xml;
  }

  // Generate robots.txt
  generateRobotsTxt() {
    let robots = `User-agent: *
Allow: /

# Disallow admin and private areas`;

    this.config.excludePatterns.forEach(pattern => {
      robots += `\nDisallow: ${pattern}`;
    });

    robots += `\n\n# Sitemap location
Sitemap: ${this.config.domain}/sitemap.xml

# Crawl delay (optional - be nice to servers)
Crawl-delay: 1`;

    return robots;
  }

  // Save files to disk
  saveFiles() {
    // Ensure output directory exists
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }

    const sitemapPath = path.join(this.config.outputDir, 'sitemap.xml');
    const robotsPath = path.join(this.config.outputDir, 'robots.txt');

    // Generate and save sitemap
    const sitemapXML = this.generateSitemapXML();
    fs.writeFileSync(sitemapPath, sitemapXML);
    console.log(`✅ Sitemap saved to ${sitemapPath}`);

    // Generate and save robots.txt
    const robotsTxt = this.generateRobotsTxt();
    fs.writeFileSync(robotsPath, robotsTxt);
    console.log(`✅ robots.txt saved to ${robotsPath}`);

    return { sitemapPath, robotsPath };
  }

  // Submit sitemap to search engines
  async submitToSearchEngines() {
    const sitemapUrl = `${this.config.domain}/sitemap.xml`;
    
    console.log('\n🔍 Search Engine Submission URLs:');
    console.log(`Google: https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    console.log(`Bing: https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    console.log('\n📝 Manual submission (recommended):');
    console.log('Google Search Console: https://search.google.com/search-console');
    console.log('Bing Webmaster Tools: https://www.bing.com/webmasters');
  }

  // Main generation process
  async generate() {
    console.log('🚀 Starting sitemap generation...\n');
    
    try {
      // Add pages
      this.addStaticPages();
      await this.addDynamicPages();
      
      // Sort URLs by priority (highest first)
      this.urls.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));
      
      // Save files
      const { sitemapPath, robotsPath } = this.saveFiles();
      
      // Show summary
      console.log(`\n📊 Sitemap Summary:`);
      console.log(`Total URLs: ${this.urls.length}`);
      console.log(`Sitemap: ${sitemapPath}`);
      console.log(`Robots.txt: ${robotsPath}`);
      
      // Show submission info
      await this.submitToSearchEngines();
      
      console.log('\n🎉 Sitemap generation complete!');
      
    } catch (error) {
      console.error('❌ Error generating sitemap:', error);
      process.exit(1);
    }
  }
}

// CLI functionality
if (require.main === module) {
  const generator = new SitemapGenerator(config);
  generator.generate();
}

module.exports = SitemapGenerator;