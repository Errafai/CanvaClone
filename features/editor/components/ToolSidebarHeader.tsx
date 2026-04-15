import { title } from "process";

interface ToolSidebarHeaderPops {
    title: string;
    description?: string;
}

export const ToolSidebarHeader = ({
    title,
    description
}: ToolSidebarHeaderPops) => {
    return (
        <div className="p=4 border-b space-y-1 h-[68px]">
            <p>
                {title}
            </p>
            {description && (
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    )
}
