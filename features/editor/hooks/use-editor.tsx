import { useCallback, useState, useMemo } from "react";
import { fabric } from "fabric";
import { useAutoResize } from "./use-auto-resize";
import { BuildEditorProps, CIRCLE_OPTIONS, Editor, EditorHookProps, FILL_COLOR, RECTANGLE_OPTIONS, STROKE_COLOR, STROKE_DASH_ARRAY, STROKE_WIDTH, TRIANGLE_OPTIONS } from "../types";
import { useCanvasEvents } from "./use-canvas-events";
import { isTextType } from "../utils";

const buildEditor = ({
    canvas,
    fillColor,
    setFillColor,
    strokeWidth,
    strokeColor,
    setStrokeColor,
    setStrokeWidth,
    selectedObjects,
    strokeDashArray,
    setstrokeDashArray

}: BuildEditorProps): Editor => {
    const getWorkspace = () => {
        return canvas.getObjects().find((object) => object.name === "clip")
    }
    const center = (object: fabric.Object) => {
        const workspace = getWorkspace();
        const center = workspace?.getCenterPoint();

        //@ts-ignore
        canvas._centerObject(object, center);

        //canvas.centerObject(object);
    };
    const addToCnavas = (object: fabric.Object) => {
        center(object);//IMPORTANT!!! always center before adding object (managing history efficenly)
        canvas.add(object);
        canvas.setActiveObject(object);
    }
    return {
        setFillColor: (value: string) => {
            setFillColor(value);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ fill: value });
            });
            canvas.renderAll();
        },
        setStrokeWidth: (value: number) => {
            setStrokeWidth(value);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ strokeWidth: value });
            });
            canvas.renderAll();
        }
        ,
        changeStrokeDashArray: (value: number[]) => {
            setstrokeDashArray(value);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ strokeDashArray: value });
            });
            canvas.renderAll();
        }
        ,
        setStrokeColor: (value: string) => {
            setStrokeColor(value);
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    //text types don't have stroke
                    object.set({ fill: value });
                    return; 
                }
                object.set({ stroke: value });
            });
            canvas.renderAll();
        }
        ,
        addCircle: () => {
            const object = new fabric.Circle({
                ...CIRCLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
            });
            addToCnavas(object);
        },
        addSoftRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                rx: 50,
                ry: 50,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
            })
            addToCnavas(object);
        },
        addRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
            })
            addToCnavas(object);
        },
        addTriangle: () => {
            const object = new fabric.Triangle({
                ...TRIANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
            })
            addToCnavas(object);
        },
        addInverseTriangle: () => {
            const HEIGHT = 400;
            const WIDTH = 400;

            const object = new fabric.Polygon(
                [
                    { x: 0, y: 0 },
                    { x: WIDTH, y: 0 },
                    { x: WIDTH / 2, y: HEIGHT },
                ],
                {
                    ...TRIANGLE_OPTIONS,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray,
                }

            )
            addToCnavas(object);
        },
        addDiamand: () => {
            const HEIGHT = 400;
            const WIDTH = 400;

            const object = new fabric.Polygon(
                [
                    { x: WIDTH / 2, y: 0 },
                    { x: WIDTH, y: HEIGHT / 2 },
                    { x: WIDTH / 2, y: HEIGHT },
                    { x: 0, y: HEIGHT / 2 },
                ],
                {
                    ...TRIANGLE_OPTIONS,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray,

                }
            )
            addToCnavas(object);
        },
        getActiveFillColor: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return fillColor;
            }
            const value = selectedObject.get("fill") || fillColor;

            //currently, gradients & patterns are not supported
            return value as string;
        },
        getActiveStrokeColor: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return fillColor;
            }
            const value = selectedObject.get("stroke") || strokeColor;

            //currently, gradients & patterns are not supported
            return value;
        },
        getActiveStrokeWidth: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return strokeWidth;
            }
            const value = selectedObject.get("strokeWidth") || strokeWidth;

            //currently, gradients & patterns are not supported
            return value;
        },
        getActiveStrokeDashArray: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return strokeDashArray;
            }
            const value = selectedObject.get("strokeDashArray") || strokeDashArray;

            //currently, gradients & patterns are not supported
            return value;
        },
        canvas,
        selectedObjects


    };
};



export const useEditor = ({
    clearSelectionCallback
}: EditorHookProps) => {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
    const [container, setContainer] = useState<HTMLDivElement | null>(null)
    const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

    const [fillColor, setFillColor] = useState(FILL_COLOR);
    const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
    const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
    const [strokeDashArray, setstrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);
    useAutoResize({
        canvas,
        container,
    });

    useCanvasEvents({
        canvas,
        setSelectedObjects,
        clearSelectionCallback
    });

    const editor = useMemo(() => {
        if (canvas) {
            return buildEditor({
                canvas,
                fillColor,
                setFillColor,
                strokeWidth,
                strokeColor,
                setStrokeColor,
                setStrokeWidth,
                selectedObjects,
                strokeDashArray,
                setstrokeDashArray
            });
        }
        return undefined;
    }, [
        canvas,
        fillColor,
        setFillColor,
        strokeWidth,
        strokeColor,
        setStrokeColor,
        setStrokeWidth,
        setSelectedObjects,
        selectedObjects,
        strokeDashArray,
        setstrokeDashArray
    ]);


    const init = useCallback(({
        initialCanvas,
        initialContainer,
    }: {
        initialCanvas: fabric.Canvas,
        initialContainer: HTMLDivElement
    }) => {

        fabric.Object.prototype.set({
            cornerColor: "#FFFF",
            cornerStyle: "circle",
            borderColor: "#3b82f6",
            borderScaleFactor: 1.5,
            transparentCorners: false,
            borderOpacityWhenMoving: 1,
            cornerStrokeColor: "#3b82f6"
        })
        const initialWorkspace = new fabric.Rect({
            width: 900,
            height: 1200,
            name: "clip",
            fill: "white",
            selectable: false,
            hasControls: false,
            shadow: new fabric.Shadow({
                color: "rgba(0, 0, 0, 0.8)",
                blur: 5,
            }),
        })
        initialCanvas.setWidth(initialContainer.offsetWidth);
        initialCanvas.setHeight(initialContainer.offsetHeight);

        initialCanvas.add(initialWorkspace);
        initialCanvas.centerObject(initialWorkspace);
        initialCanvas.clipPath = initialWorkspace;

        setCanvas(initialCanvas);
        setContainer(initialContainer);

        // const test = new fabric.Rect({
        //     height: 100,
        //     width: 100,
        //     fill: "black",
        // })
        // initialCanvas.add(test);
        // initialCanvas.centerObject(test);
    }, []);
    return { init, editor };
}