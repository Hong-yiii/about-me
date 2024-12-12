import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

// Define directories for posts and main introduction
const postsDirectory = join(process.cwd(), "_posts");
const mainIntroductionDirectory = join(process.cwd(), "_mainIntroduction");

// Get slugs (filenames) from _posts directory
export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

// Get a single post by slug
export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

// Get all posts from the _posts directory
export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1)); // Sort posts by date (newest first)
  return posts;
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
