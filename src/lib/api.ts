import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

// Define directories for posts and main introduction
const postsDirectory = join(process.cwd(), "_posts");
const mainIntroductionDirectory = join(process.cwd(), "_mainIntroduction");
const orderFilePath = join(process.cwd(), "postOrder.json");

// Get slugs (filenames) from _posts directory
export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md")); // Only include Markdown files
}

// Get a single post by slug
export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.md$/, "");

  // Define possible file paths
  const postPath = join(postsDirectory, `${realSlug}.md`);
  const mainIntroPath = join(mainIntroductionDirectory, `${realSlug}.md`);

  let fullPath = "";

  // Check which path exists
  if (fs.existsSync(postPath)) {
    fullPath = postPath;
  } else if (fs.existsSync(mainIntroPath)) {
    fullPath = mainIntroPath;
  } else {
    throw new Error(`Post with slug "${slug}" not found in either directory.`);
  }

  // Read and parse the file
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

// Get all posts from the _posts directory
export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs.map((slug) => getPostBySlug(slug));

  let order: string[] = [];
  try {
    // Read the order JSON file
    const orderFile = fs.readFileSync(orderFilePath, "utf8");
    order = JSON.parse(orderFile).order;
  } catch (error) {
    const errorMessage = (error as Error).message || "Unknown error occurred.";
    console.warn(
      `Error reading or parsing postOrder.json: ${errorMessage}. Defaulting to no specific order.`
    );
  }

  // Sort posts based on the custom order if it exists
  const orderedPosts = posts.sort((a, b) => {
    const indexA = order.indexOf(a.slug);
    const indexB = order.indexOf(b.slug);

    // If a post is not found in the order list, place it at the end
    if (indexA === -1 && indexB === -1) return 0; // Both missing, keep existing order
    if (indexA === -1) return 1; // A missing, B takes precedence
    if (indexB === -1) return -1; // B missing, A takes precedence

    return indexA - indexB;
  });

  return orderedPosts;
}


// Function to retrieve the main introduction post
export function getMainIntroduction(): Post {
  // The file name is fixed, so we can directly reference it
  const fullPath = join(mainIntroductionDirectory, "main_introduction.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Return the parsed post with metadata and content
  return { ...data, slug: "main_introduction", content } as Post;
}
