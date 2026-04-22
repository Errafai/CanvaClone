import { cn } from "@/lib/utils";
import { ActiveTool, Editor, FILL_COLOR, STROKE_COLOR, STROKE_DASH_ARRAY, STROKE_WIDTH } from "../types";
import { ToolSidebarHeader } from "./ToolSidebarHeader";
import { ToolSidebarClose } from "./ToolSidebarClose";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface StrokeWidthSidebarProps  {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const StrokeWidthSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool
}: StrokeWidthSidebarProps) => {
    const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
    const typeValue = editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;
    const onClose = () => {
        onChangeActiveTool("select");
    }

    const onChangeStrokeWidth = (value:number) => {
        editor?.setStrokeWidth(value);
    }

    const onChangeStrokeType = (value: number[]) => {
        editor?.changeStrokeDashArray(value);
    }
    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
                activeTool === "stroke-width" ? "visible" : "hidden",
            )}
        >
            <ToolSidebarHeader
                title="Stroke options"
                description="Add stroke width to your element"
            />
            <ScrollArea>
                <div className="p-4 space-y-6 border-b">
                    <Label className="text-sm">
                        Stroke Width
                    </Label>
                    <Slider
                        value={[widthValue]}
                        onValueChange={(values) => onChangeStrokeWidth(Array.isArray(values) ? values[0] : values)}/>
                </div>
                <div className="p-4 space-y-6 border-b">
                    <Label className="text-sm">
                        Stroke type
                    </Label>
                    <Button
                        onClick={() => onChangeStrokeType([])}
                        variant="secondary"
                        size="lg"
                        className={cn("w-full h-16 justify-start text-left",
                            typeValue.length === 0 && "border-2 border-blue-500"
                        )}
                        style={{padding: "8px 16px"}}
                        >
                        <div className="w-full border-black rounded-full border-4"/>
                    </Button>
                    <Button
                        onClick={() => onChangeStrokeType([5, 5])}
                        variant="secondary"
                        size="lg"
                        className={cn("w-full h-16 justify-start text-left",
                            typeValue.length === 2 && typeValue[0] === 5 && typeValue[1] === 5 && "border-2 border-blue-500"
                        )}
                        style={{ padding: "8px 16px" }}
                    >
                        <div className="w-full border-black rounded-full border-4 border-dashed" />
                    </Button>

                </div>
            </ScrollArea>
            <ToolSidebarClose onClick={onClose} />
        </aside>
    )
}