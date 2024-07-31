import Image from "next/image"

import PostEditor from "@/components/posts/editor/PostEditor"

export default function Home() {
  return (
    <main className="h-[200vh] w-full bg-red-100">
      <div className="w-full">
        <PostEditor />
      </div>
    </main>
  )
}
