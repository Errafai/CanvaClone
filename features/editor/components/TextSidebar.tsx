import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./ToolSidebarHeader";
import { ToolSidebarClose } from "./ToolSidebarClose";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TextSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}
 
export const TextSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool
}: TextSidebarProps) => {
    const onClose = () => {
        onChangeActiveTool("select");
    }

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
                activeTool === "text" ? "visible" : "hidden",
            )}
        >
            <ToolSidebarHeader
                title="Text"
                description="Add text to you Canvas"
            />
            <ScrollArea>
                <div className="p-4 space-y-6 border-b">
                    
                </div>

            </ScrollArea>
            <ToolSidebarClose onClick={onClose} />
        </aside>
    );
};