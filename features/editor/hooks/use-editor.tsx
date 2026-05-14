import { useCallback, useState, useMemo } from "react";
import { fabric } from "fabric";
import { useAutoResize } from "./use-auto-resize";
import { BuildEditorProps, CIRCLE_OPTIONS, Editor, EditorHookProps, FILL_COLOR, FONT_FAMILY, RECTANGLE_OPTIONS, STROKE_COLOR, STROKE_DASH_ARRAY, FONT_WEIGHT, STROKE_WIDTH, TEXT_OPTIONS, TRIANGLE_OPTIONS, FONT_SIZE } from "../types";
import { useCanvasEvents } from "./use-canvas-events";
import { createFilter, isTextType } from "../utils";
import { ITextboxOptions } from "fabric/fabric-impl";

import { object } from "zod";
import { useClipboard } from "./use-clipboard";
import { PassThrough } from "stream";

const buildEditor = ({
    copy,
    past,
    canvas,
    fillColor,
    setFillColor,
    strokeWidth,
    strokeColor,
    setStrokeColor,
    setStrokeWidth,
    selectedObjects,
    strokeDashArray,
    setStrokeDashArray,
    fontFamily,
    setFontFamily

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
        onPast: () => past(),
        onCopy: () => copy(),
        
        changeImageFilter: (value: string) => {
            const objects = canvas.getActiveObjects();
            objects.forEach((object) => {
                if (object.type === "image") {
                    const imageObject = object as fabric.Image;
                    const effect = createFilter(value);
                    imageObject.filters = effect ? [effect] : [];
                    imageObject.applyFilters();
                    canvas.renderAll()
                }
            })
        },
        addImage: (value: string) => {
            fabric.Image.fromURL(value, (image) => {
                const workspace = getWorkspace();

                image.scaleToWidth(workspace?.width || 0);
                image.scaleToHeight(workspace?.height || 0);
                addToCnavas(image);
            },
                {
                    crossOrigin: "anonymous"
                })
        },
        delete: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.remove(object)
            });
            canvas.discardActiveObject();
            canvas.renderAll();

        },
        addText: (value: string, options?: ITextboxOptions) => {
            const object = new fabric.Textbox(value, {
                ...TEXT_OPTIONS,
                fill: fillColor,
                ...options
            });
            addToCnavas(object);
        },
        bringForward: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.bringForward(object);
            });
            canvas.renderAll()
            const workspace = getWorkspace();
            workspace?.sendToBack();
        },
        sendBackwords: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.sendBackwards(object);
            });
            canvas.renderAll()
        },
        getActiveOpacity: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return 1;
            }
            const value = selectedObject.get("opacity") || 1;

            //currently, gradients & patterns are not supported
            return value;
        },
        changeFontWeight: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    (object as any).set({ fontWeight: value })
                }
            })
            canvas.renderAll();
        },
        changeFontStyle: (value: string) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    (object as any).set({ fontStyle: value })
                }
            })
            canvas.renderAll();
        },
        changeFontLinethrough: (value: boolean) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    (object as any).set({ linethrough: value })
                }
            })
            canvas.renderAll();
        },
        changeFontUnderline: (value: boolean) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    (object as any).set({ underline: value })
                }
            })
            canvas.renderAll();
        },
        changeTextAlign: (value: string) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    (object as any).set({ textAlign: value })
                }
            })
            canvas.renderAll();
        },
        changeFontSize: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    (object as any).set({ fontSize: value })
                }
            })
            canvas.renderAll();
        },
        changeOpacity: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                object.set({ opacity: value })
            })
            canvas.renderAll();
        },
        changeFontFamily: (value: string) => {
            setFontFamily(value);
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type)) {
                    (object as any).set({ fontFamily: value });
                }

            });
            canvas.renderAll();
        },
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
            setStrokeDashArray(value);
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
        getActiveFontFamily: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return fontFamily;
            }
            const value = (selectedObject as any).get("fontFamily") || fontFamily;

            //currently, gradients & patterns are not supported
            return value as string;
        },
        getActiveFontWeight: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return FONT_WEIGHT;
            }
            const value = (selectedObject as any).get("fontWeight") || FONT_WEIGHT;

            //currently, gradients & patterns are not supported
            return value;
        },
        getActiveFontStyle: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return "normal";
            }
            const value = (selectedObject as any).get("fontStyle") || "normal";

            //currently, gradients & patterns are not supported
            return value;
        },
        getActiveFontLinethrough: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return false;
            }
            const value = (selectedObject as any).get("linethrough") || false;

            //currently, gradients & patterns are not supported
            return value;
        },
        getActiveFontUnderline: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return false;
            }
            const value = (selectedObject as any).get("underline") || false;

            //currently, gradients & patterns are not supported
            return value;
        },
        getActiveTextAlign: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return "left";
            }
            const value = (selectedObject as any).get("textAlign") || "left";

            //currently, gradients & patterns are not supported
            return value;
        },
        getActiveFontSize: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return FONT_SIZE;
            }
            const value = (selectedObject as any).get("fontSize") || FONT_SIZE;

            //currently, gradients & patterns are not supported
            return value;
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


    const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
    const [fillColor, setFillColor] = useState(FILL_COLOR);
    const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
    const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
    const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);
    useAutoResize({
        canvas,
        container,
    });

    useCanvasEvents({
        canvas,
        setSelectedObjects,
        clearSelectionCallback
    });
    const { copy, past } = useClipboard( { canvas });
    const editor = useMemo(() => {
        if (canvas) {
            return buildEditor({
                copy,
                past,
                canvas,
                fillColor,
                setFillColor,
                strokeWidth,
                strokeColor,
                setStrokeColor,
                setStrokeWidth,
                selectedObjects,
                strokeDashArray,
                setStrokeDashArray,
                fontFamily,
                setFontFamily
            });
        }
        return undefined;
    }, [
        copy,
        past,
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
        setStrokeDashArray,
        fontFamily,
        setFontFamily
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
