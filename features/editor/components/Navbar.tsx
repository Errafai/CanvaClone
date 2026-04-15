"use client";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CiFileOn } from "react-icons/ci";
import { ChevronDown, Download, Redo2, Undo2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MousePointerClick } from "lucide-react";
import { Hint } from "@/components/hints";
import { BsCloudCheck } from "react-icons/bs";
import { ActiveTool } from "../types";
import { cn } from "@/lib/utils";

interface NavbarProps {
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}
export const Navbar = ({
    activeTool,
    onChangeActiveTool,
}: NavbarProps) => {
    return (
        <nav className="w-full flex items-center p-4 h-[68px] gap-x-8
        border-b lg:pl-[34px]">
            <Logo />
            <div className="flex">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium hover:bg-accent rounded-md">
                        File
                        <ChevronDown className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-60">
                        <DropdownMenuItem onClick={() => { }} className="flex items-center gap-x-2">
                            <CiFileOn className="size-8" />
                            <div>
                                <p>Open</p>
                                <p className="text-xs text-muted-foreground">Open a Json file</p>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Separator orientation="vertical" className="mx-2" />
                <Hint label="Select" side="bottom" sideOffset={10} >
                    <Button variant="ghost" size="icon"
                    onClick={() => onChangeActiveTool("select")}
                    className={cn(activeTool == "select" && "bg-gray-100" )}>
                    <MousePointerClick className="size-4" />
                </Button>
                </Hint>
                <Hint label="Undo" side="bottom" sideOffset={10} >
                    <Button variant="ghost" size="icon"
                        onClick={() => { }}
                        className="">
                        <Undo2 className="size-4" />
                    </Button>
                </Hint>
                <Hint label="Redo" side="bottom" sideOffset={10} >
                    <Button variant="ghost" size="icon"
                        onClick={() => { }}
                        className="">
                        <Redo2 className="size-4" />
                    </Button>
                </Hint>
                <Separator orientation="vertical" className="mx-2" /> 
                <div className="flex items-center gap-x-2">
                    <BsCloudCheck className="size-[20px] text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Saved</p>
                </div>
                <div className="ml-auto flex items-center gap-x-4 ">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                                Export
                                <Download className="size-4 ml-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-60">
                            <DropdownMenuItem className="flex items-center gap-x-2"
                                onClick={() => {}}>
                                <CiFileOn className="size=8" />
                                <div>
                                    <p>JSON</p>
                                    <p className="text-xs text-muted-foreground">Save for later editing</p>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-x-2"
                                onClick={() => { }}>
                                <CiFileOn className="size=8" />
                                <div>
                                    <p>PNG</p>
                                    <p className="text-xs text-muted-foreground">Best for sharing on the web</p>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-x-2"
                                onClick={() => { }}>
                                <CiFileOn className="size=8" />
                                <div>
                                    <p>JPG</p>
                                    <p className="text-xs text-muted-foreground">Best for printing</p>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-x-2"
                                onClick={() => { }}>
                                <CiFileOn className="size=8" />
                                <div>
                                    <p>SVG</p>
                                    <p className="text-xs text-muted-foreground">Best for editing in vector software</p>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}