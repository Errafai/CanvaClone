import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./ToolSidebarHeader";
import { ToolSidebarClose } from "./ToolSidebarClose";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useGenerateImage } from "../ai/api/use-generate-image";
import React, { useState } from "react";
import { SelectValue } from "@base-ui/react";
interface AiSidebarProps  {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const AiSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool
}: AiSidebarProps) => {
    const mutation = useGenerateImage();
    const [value, setValue] = useState("");
    const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        //Todo: block with paywall
        mutation.mutate({ prompt: value }, {
            onSuccess: ({ data }) => { editor?.addImage(data); }
        });
    };
    const onClose = () => {
        onChangeActiveTool("select");
    }

    
    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
                activeTool === "ai" ? "visible" : "hidden",
            )}
        >
            <ToolSidebarHeader
                title="AI"
                description="Generate an image using AI"
            />
            <ScrollArea>
                <form className="p-4 space-y-6" onSubmit={onSubmit}>
                    
                    <Textarea placeholder="Beautiful digital matte pastel paint sunflowers poppies chillwave greg rutkowski artstation" cols={30} rows={10}
                        required minLength={3}
                        onChange={(e) => setValue(e.target.value)}
                    value={value}/>
                        <Button disabled={mutation.isPending} type="submit" className="w-full">Generate</Button>
                    
                    
                </form>
            </ScrollArea>
            <ToolSidebarClose onClick={onClose} />
        </aside>
    )
}