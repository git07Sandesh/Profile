import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to THIS project. Without this, a stray lockfile in a
  // parent dir (e.g. ~/package-lock.json) makes Turbopack infer the wrong root
  // and try to crawl all of ~/Desktop, which macOS blocks (os error 1).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
