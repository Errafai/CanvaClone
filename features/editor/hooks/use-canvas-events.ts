import { fabric } from "fabric";
import { useEffect } from "react";

interface useCanvasEnventProps {
    canvas: fabric.Canvas | null;
    setSelectedObjects: (objects: fabric.Object[]) => void;
    clearSelectionCallback?: () => void;
}

export const useCanvasEvents = ({
    canvas,
    setSelectedObjects,
    clearSelectionCallback
}: useCanvasEnventProps) => {
    useEffect(() => {
        if (canvas) {
            canvas.on("selection:created", (e) => {
            console.log('selection:created')
            setSelectedObjects(e.selected || []);
        });
            canvas.on("selection:updated", (e) => {
                console.log('selection:updated') 
            setSelectedObjects(e.selected || []);
        });
            canvas.on("selection:cleared", (e) => {
                console.log('selection:cleared')
                setSelectedObjects(e.selected || []);
                clearSelectionCallback?.()
        });
        }
        return () => {
            if (canvas) {
                canvas.off("selection:created")
                canvas.off("selection:updated")
                canvas.off("selection:cleared")
            }
        }
    }, [canvas, clearSelectionCallback, setSelectedObjects/**no need for this, this is from setState**/])
    
};