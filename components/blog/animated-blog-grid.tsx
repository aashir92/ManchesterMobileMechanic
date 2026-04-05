"use client";

import { BlogPostCard } from "@/components/blog/blog-post-card";
import type { BlogPostRow } from "@/lib/types/blog";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.44, ease } },
};

export function AnimatedBlogGrid({
  posts,
  isAdmin,
}: {
  posts: BlogPostRow[];
  isAdmin: boolean;
}) {
  return (
    <motion.div
      className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {posts.map((post) => (
        <motion.div key={post.id} variants={item}>
          <BlogPostCard post={post} isAdmin={isAdmin} />
        </motion.div>
      ))}
    </motion.div>
  );
}
