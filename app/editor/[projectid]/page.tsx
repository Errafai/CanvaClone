
"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("@/features/editor/components/Editor").then(mod => ({ default: mod.Editor })),
  {
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
);

const EditorProjectIdPage = () => {
  return <Editor />
}
export default EditorProjectIdPage;