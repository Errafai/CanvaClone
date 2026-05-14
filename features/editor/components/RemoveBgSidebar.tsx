import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./ToolSidebarHeader";
import { ToolSidebarClose } from "./ToolSidebarClose";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useGenerateImage } from "../ai/api/use-generate-image";
import React, { useState } from "react";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
interface RemoveBgSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const RemoveBgSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool
}: RemoveBgSidebarProps) => {
    const selectedObject = editor?.selectedObjects[0];
    //@ts-ignore
    const imageSrc = selectedObject?._originalElement?.currentSrc
    const onClose = () => {
        onChangeActiveTool("select");
    }
    const onClick = () => {
        console.log("removing")
    }

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
                activeTool === "remove-bg" ? "visible" : "hidden",
            )}
        >
            <ToolSidebarHeader
                title="Background Removal"
                description="remove background form image using Ai"
            />
            {!imageSrc && (
                <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
                    <AlertTriangle className="size-4 text-muted-foregroun" />
                    <p className="text-muted-foreground text-xs">
                        Feature not available for this object
                    </p>
                </div>
            )}
            {imageSrc && (
                <ScrollArea>
                    <div className="p-4 space-y-4">
                    <div className={cn(
                        "relative aspect-square rounded-md overflow-hidden transition bg-muted",
                        false && "opacity-50",

                    )}>
                        <Image src={imageSrc}
                            fill
                            alt="Image"
                            className="object-cover" />
                        
                    </div>
                    <Button onClick={onClick} className="w-full">Remove Background</Button>
                </div>
                </ScrollArea>
            )}

            <ToolSidebarClose onClick={onClose} />
        </aside>
    )
}