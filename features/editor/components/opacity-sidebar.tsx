import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./ToolSidebarHeader";
import { ToolSidebarClose } from "./ToolSidebarClose";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import React, { useEffect, useMemo, useState } from "react";

interface OpacitySidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const OpacitySidebar = ({
    editor,
    activeTool,
    onChangeActiveTool
}: OpacitySidebarProps) => {
    const initialValue = editor?.getActiveOpacity() || 1;
    const [opacity, setOpacity] = useState(initialValue);
    const selectedObject = useMemo(() => editor?.selectedObjects[0], [editor?.selectedObjects])
    const onClose = () => {
        onChangeActiveTool("select");
    }

    useEffect(() => {
        if (selectedObject) {
            setOpacity(selectedObject.get("opacity") || 1);
        }
    }, [selectedObject])

    const onChange = (value: number) => {
        editor?.changeOpacity(value);
        setOpacity(value);
    }

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
                activeTool === "opacity" ? "visible" : "hidden",
            )}
        >
            <ToolSidebarHeader
                title="Opacity"
                description="change the opacity of the selected object"
            />
            <ScrollArea>
                <div className="p-4 space-y-6 border-b">
                    <Slider
                        value={opacity}
                        onValueChange={(value) => onChange(Number(value))}
                        max={1}
                        min={0}
                        step={0.01} />
                </div>

            </ScrollArea>
            <ToolSidebarClose onClick={onClose} />
        </aside>
    );
};