import { cn } from "@/lib/utils";
import { ActiveTool, Editor, filters, fonts } from "../types";
import { ToolSidebarHeader } from "./ToolSidebarHeader";
import { ToolSidebarClose } from "./ToolSidebarClose";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
interface FilterSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}
 
export const FilterSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool
}: FilterSidebarProps) => {
    const value = null;
    const onClose = () => {
        onChangeActiveTool("select");
    }

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
                activeTool === "filter" ? "visible" : "hidden",
            )}
        >
            <ToolSidebarHeader
                title="Filters"
                description="Apply a filter to your image"
            />
            <ScrollArea>
                <div className="p-4 space-y-6 border-b">
                    {filters.map((filter) => (
                       <Button
                            key={filter}
                            variant="secondary"
                            size="lg"
                            className={cn("w-full h-16 justify-start text-left",
                                   value===filter && "border-2 border-blue-500"
                            )}
                            
                            onClick={() => editor?.changeImageFilter(filter)}>
                            {filter}
                        </Button> 
                    ))}
                </div>

            </ScrollArea>
            <ToolSidebarClose onClick={onClose} />
        </aside>
    );
};