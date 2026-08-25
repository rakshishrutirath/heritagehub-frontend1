import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Brush,
  Circle,
  Download,
  Eraser,
  Image as ImageIcon,
  Layers,
  Loader2,
  Palette,
  RefreshCw,
  RotateCcw,
  Save,
  Sparkles,
  Stamp,
  Trash2,
  X,
} from "lucide-react";

import {
  api,
} from "../services/api";

import {
  useLanguage,
} from "../context/LanguageContext";

/* =========================================================
   TYPES
========================================================= */

interface CanvasArtwork {
  id: string;
  title: string;
  template_image: string | null;
  artwork_image: string | null;
  created_at: string;
  updated_at: string;
}

type Tool =
  | "brush"
  | "stamp"
  | "eraser";

type Texture =
  | "tussar"
  | "palm"
  | "sandstone";

interface Pigment {
  name: string;
  odia: string;
  color: string;
}

interface CanvasPageProps {
  artifacts?: any[];
  onSelectArtifact?: (
    artifact: any
  ) => void;
}

/* =========================================================
   CONSTANTS
========================================================= */

const CANVAS_WIDTH =
  1000;

const CANVAS_HEIGHT =
  700;

const pigments:
Pigment[] = [
  {
    name:
      "Hingula",
    odia:
      "ହିଙ୍ଗୁଳ",
    color:
      "#a93616",
  },
  {
    name:
      "Haritala",
    odia:
      "ହରିତାଳ",
    color:
      "#d8a221",
  },
  {
    name:
      "Shankha",
    odia:
      "ଶଙ୍ଖ",
    color:
      "#f4efe2",
  },
  {
    name:
      "Kajala",
    odia:
      "କାଜଳ",
    color:
      "#17120f",
  },
  {
    name:
      "Indigo",
    odia:
      "ନୀଳ",
    color:
      "#264d68",
  },
  {
    name:
      "Geru",
    odia:
      "ଗେରୁଆ",
    color:
      "#9c4e32",
  },
  {
    name:
      "Patra",
    odia:
      "ପତ୍ର ସବୁଜ",
    color:
      "#416b48",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export const CanvasPage:
React.FC<CanvasPageProps> = () => {
  const {
    language,
  } =
    useLanguage();

  const isOdia =
    language === "or";

  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );

  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const drawingRef =
    useRef(false);

  const lastPointRef =
    useRef<{
      x: number;
      y: number;
    } | null>(
      null
    );

  const undoStackRef =
    useRef<ImageData[]>(
      []
    );

  const [
    artworks,
    setArtworks,
  ] =
    useState<
      CanvasArtwork[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    title,
    setTitle,
  ] =
    useState("");

  const [
    tool,
    setTool,
  ] =
    useState<Tool>(
      "brush"
    );

  const [
    brushSize,
    setBrushSize,
  ] =
    useState(4);

  const [
    brushColor,
    setBrushColor,
  ] =
    useState(
      "#17120f"
    );

  const [
    texture,
    setTexture,
  ] =
    useState<Texture>(
      "tussar"
    );

  const [
    stampType,
    setStampType,
  ] =
    useState<
      "wheel" | "flower"
    >(
      "wheel"
    );

  /* =======================================================
     TEXT
  ======================================================= */

  const t = {
    archive:
      isOdia
        ? "ଲୋକକଳା କାର୍ଯ୍ୟଶାଳା"
        : "Folk Art Workshop",

    title:
      isOdia
        ? "ପାରମ୍ପରିକ ପଟ୍ଟଚିତ୍ର ଓ ଐତିହ୍ୟ କଳା ଷ୍ଟୁଡିଓ"
        : "Traditional Pattachitra & Heritage Art Studio",

    subtitle:
      isOdia
        ? "ଓଡ଼ିଶାର ପ୍ରାଚୀନ ଚିତ୍ରଶୈଳୀ, ପ୍ରାକୃତିକ ରଙ୍ଗ ଏବଂ ପବିତ୍ର ମୋଟିଫରୁ ପ୍ରେରିତ ଡିଜିଟାଲ୍ ଲୋକକଳା ସୃଷ୍ଟି କରନ୍ତୁ।"
        : "Create digital folk art inspired by centuries-old Odishan iconography using traditional natural pigment palettes and sacred motifs.",

    studioTools:
      isOdia
        ? "ଷ୍ଟୁଡିଓ ଉପକରଣ"
        : "Studio Tools",

    brush:
      isOdia
        ? "ମୁକ୍ତହସ୍ତ ବ୍ରଶ୍"
        : "Freehand Brush",

    stamp:
      isOdia
        ? "ମୋଟିଫ୍ ଷ୍ଟାମ୍ପ"
        : "Motif Stamp",

    eraser:
      isOdia
        ? "ଇରେଜର୍"
        : "Eraser",

    brushStroke:
      isOdia
        ? "ବ୍ରଶ୍ ଆକାର"
        : "Brush Stroke",

    pigments:
      isOdia
        ? "ପ୍ରାକୃତିକ ଖଣିଜ ରଙ୍ଗ"
        : "Natural Mineral Pigments",

    texture:
      isOdia
        ? "ପୃଷ୍ଠ ଟେକ୍ସଚର୍"
        : "Surface Texture",

    tussar:
      isOdia
        ? "ତସର ସିଲ୍କ"
        : "Tussar Silk",

    palm:
      isOdia
        ? "ତାଳପତ୍ର"
        : "Palm Leaf",

    sandstone:
      isOdia
        ? "ପୁରୁଣା ବାଲୁକାପଥର"
        : "Aged Sandstone",

    wheel:
      isOdia
        ? "କୋଣାର୍କ ଚକ୍ର"
        : "Konark Wheel",

    flower:
      isOdia
        ? "ପଦ୍ମ ଫୁଲ"
        : "Lotus Motif",

    undo:
      isOdia
        ? "ପଛକୁ"
        : "Undo",

    clear:
      isOdia
        ? "କ୍ୟାନଭାସ୍ ସଫା କରନ୍ତୁ"
        : "Clear Canvas",

    canvasLabel:
      isOdia
        ? "ପ୍ରାକୃତିକ ରଙ୍ଗ କ୍ୟାନଭାସ୍"
        : "Natural Pigment Canvas",

    export:
      isOdia
        ? "PNG ରେ ରପ୍ତାନି"
        : "Export Pattachitra (PNG)",

    artworkTitle:
      isOdia
        ? "କଳାକୃତିର ନାମ"
        : "Artwork Title",

    titlePlaceholder:
      isOdia
        ? "ମୋର ପଟ୍ଟଚିତ୍ର କଳା"
        : "My Pattachitra Artwork",

    save:
      isOdia
        ? "ଐତିହ୍ୟ ଅଭିଲେଖରେ ସଂରକ୍ଷଣ"
        : "Save to Heritage Archive",

    saving:
      isOdia
        ? "ସଂରକ୍ଷଣ ହେଉଛି..."
        : "Saving...",

    saved:
      isOdia
        ? "ସଂରକ୍ଷିତ କଳାକୃତି"
        : "Saved Artworks",

    canvasArtwork:
      isOdia
        ? "କ୍ୟାନଭାସ୍ କଳାକୃତି"
        : "Canvas Artwork",

    refresh:
      isOdia
        ? "ପୁନଃଲୋଡ୍"
        : "Refresh",

    noArtwork:
      isOdia
        ? "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି କଳାକୃତି ସଂରକ୍ଷିତ ହୋଇନାହିଁ।"
        : "No artworks have been saved yet.",

    open:
      isOdia
        ? "କଳାକୃତି ଖୋଲନ୍ତୁ"
        : "Open Artwork",

    saveSuccess:
      isOdia
        ? "କଳାକୃତି ସଫଳତାର ସହ ସଂରକ୍ଷିତ ହୋଇଛି।"
        : "Artwork saved successfully.",

    titleRequired:
      isOdia
        ? "ଦୟାକରି କଳାକୃତିର ନାମ ଲେଖନ୍ତୁ।"
        : "Please enter an artwork title.",

    drawingHint:
      isOdia
        ? "ଚିତ୍ର ଆଙ୍କିବା ପାଇଁ କ୍ୟାନଭାସ୍ ଉପରେ କ୍ଲିକ୍ କିମ୍ବା ଡ୍ରାଗ୍ କରନ୍ତୁ।"
        : "Click or drag on the canvas to begin creating your artwork.",

    loading:
      isOdia
        ? "କଳାକୃତି ଲୋଡ୍ ହେଉଛି..."
        : "Loading artworks...",
  };

  /* =======================================================
     CANVAS HELPERS
  ======================================================= */

  const getContext =
    useCallback(
      () => {
        const canvas =
          canvasRef.current;

        if (
          !canvas
        ) {
          return null;
        }

        return canvas.getContext(
          "2d",
          {
            willReadFrequently:
              true,
          }
        );
      },
      []
    );

  const paintTexture =
    useCallback(
      (
        selectedTexture:
          Texture
      ) => {
        const canvas =
          canvasRef.current;

        const ctx =
          getContext();

        if (
          !canvas ||
          !ctx
        ) {
          return;
        }

        ctx.save();

        if (
          selectedTexture ===
          "tussar"
        ) {
          ctx.fillStyle =
            "#f4ead4";

          ctx.fillRect(
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
          );

          for (
            let x = 0;
            x <
            CANVAS_WIDTH;
            x += 9
          ) {
            ctx.strokeStyle =
              "rgba(125,94,55,0.035)";

            ctx.beginPath();

            ctx.moveTo(
              x,
              0
            );

            ctx.lineTo(
              x,
              CANVAS_HEIGHT
            );

            ctx.stroke();
          }
        }

        if (
          selectedTexture ===
          "palm"
        ) {
          ctx.fillStyle =
            "#ead9b1";

          ctx.fillRect(
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
          );

          for (
            let y = 12;
            y <
            CANVAS_HEIGHT;
            y += 14
          ) {
            ctx.strokeStyle =
              "rgba(88,63,33,0.08)";

            ctx.lineWidth =
              1;

            ctx.beginPath();

            ctx.moveTo(
              0,
              y
            );

            ctx.lineTo(
              CANVAS_WIDTH,
              y
            );

            ctx.stroke();
          }
        }

        if (
          selectedTexture ===
          "sandstone"
        ) {
          ctx.fillStyle =
            "#d7b38d";

          ctx.fillRect(
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
          );

          for (
            let i = 0;
            i < 2500;
            i++
          ) {
            const x =
              Math.random() *
              CANVAS_WIDTH;

            const y =
              Math.random() *
              CANVAS_HEIGHT;

            const alpha =
              Math.random() *
              0.06;

            ctx.fillStyle =
              `rgba(78,50,32,${alpha})`;

            ctx.fillRect(
              x,
              y,
              1.5,
              1.5
            );
          }
        }

        ctx.restore();
      },
      [
        getContext,
      ]
    );

  const resetCanvas =
    useCallback(
      (
        selectedTexture:
          Texture =
          texture
      ) => {
        const canvas =
          canvasRef.current;

        const ctx =
          getContext();

        if (
          !canvas ||
          !ctx
        ) {
          return;
        }

        ctx.clearRect(
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );

        paintTexture(
          selectedTexture
        );

        undoStackRef.current =
          [];
      },
      [
        getContext,
        paintTexture,
        texture,
      ]
    );

  /* =======================================================
     INITIAL CANVAS
  ======================================================= */

  useEffect(
    () => {
      resetCanvas(
        texture
      );
    },
    []
  );

  /* =======================================================
     CHANGE TEXTURE
  ======================================================= */

  const handleTextureChange =
    (
      nextTexture:
        Texture
    ) => {
      const ctx =
        getContext();

      const canvas =
        canvasRef.current;

      if (
        canvas &&
        ctx
      ) {
        undoStackRef.current.push(
          ctx.getImageData(
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
          )
        );
      }

      setTexture(
        nextTexture
      );

      resetCanvas(
        nextTexture
      );
    };

  /* =======================================================
     SAVE UNDO SNAPSHOT
  ======================================================= */

  const pushUndo =
    () => {
      const ctx =
        getContext();

      if (
        !ctx
      ) {
        return;
      }

      undoStackRef.current.push(
        ctx.getImageData(
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        )
      );

      if (
        undoStackRef.current
          .length > 30
      ) {
        undoStackRef.current.shift();
      }
    };

  /* =======================================================
     POINTER POSITION
  ======================================================= */

  const getPointerPosition =
    (
      event:
        React.PointerEvent<HTMLCanvasElement>
    ) => {
      const canvas =
        canvasRef.current;

      if (
        !canvas
      ) {
        return {
          x: 0,
          y: 0,
        };
      }

      const rect =
        canvas.getBoundingClientRect();

      return {
        x:
          (
            event.clientX -
            rect.left
          ) *
          (
            CANVAS_WIDTH /
            rect.width
          ),

        y:
          (
            event.clientY -
            rect.top
          ) *
          (
            CANVAS_HEIGHT /
            rect.height
          ),
      };
    };

  /* =======================================================
     STAMP DRAWING
  ======================================================= */

  const drawWheelStamp =
    (
      x: number,
      y: number
    ) => {
      const ctx =
        getContext();

      if (
        !ctx
      ) {
        return;
      }

      const radius =
        44;

      ctx.save();

      ctx.strokeStyle =
        brushColor;

      ctx.fillStyle =
        brushColor;

      ctx.lineWidth =
        Math.max(
          2,
          brushSize /
            2
        );

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        radius * 0.22,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      for (
        let i = 0;
        i < 16;
        i++
      ) {
        const angle =
          (
            Math.PI *
            2 *
            i
          ) /
          16;

        ctx.beginPath();

        ctx.moveTo(
          x +
            Math.cos(
              angle
            ) *
              radius *
              0.25,
          y +
            Math.sin(
              angle
            ) *
              radius *
              0.25
        );

        ctx.lineTo(
          x +
            Math.cos(
              angle
            ) *
              radius *
              0.9,
          y +
            Math.sin(
              angle
            ) *
              radius *
              0.9
        );

        ctx.stroke();
      }

      ctx.restore();
    };

  const drawFlowerStamp =
    (
      x: number,
      y: number
    ) => {
      const ctx =
        getContext();

      if (
        !ctx
      ) {
        return;
      }

      ctx.save();

      ctx.strokeStyle =
        brushColor;

      ctx.fillStyle =
        brushColor;

      ctx.lineWidth =
        Math.max(
          2,
          brushSize /
            2
        );

      const petals =
        8;

      for (
        let i = 0;
        i < petals;
        i++
      ) {
        const angle =
          (
            Math.PI *
            2 *
            i
          ) /
          petals;

        const px =
          x +
          Math.cos(
            angle
          ) *
            28;

        const py =
          y +
          Math.sin(
            angle
          ) *
            28;

        ctx.beginPath();

        ctx.ellipse(
          px,
          py,
          13,
          28,
          angle,
          0,
          Math.PI * 2
        );

        ctx.stroke();
      }

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        12,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();
    };

  /* =======================================================
     POINTER EVENTS
  ======================================================= */

  const handlePointerDown =
    (
      event:
        React.PointerEvent<HTMLCanvasElement>
    ) => {
      event.currentTarget.setPointerCapture(
        event.pointerId
      );

      const point =
        getPointerPosition(
          event
        );

      pushUndo();

      if (
        tool ===
        "stamp"
      ) {
        if (
          stampType ===
          "wheel"
        ) {
          drawWheelStamp(
            point.x,
            point.y
          );
        } else {
          drawFlowerStamp(
            point.x,
            point.y
          );
        }

        return;
      }

      drawingRef.current =
        true;

      lastPointRef.current =
        point;
    };

  const handlePointerMove =
    (
      event:
        React.PointerEvent<HTMLCanvasElement>
    ) => {
      if (
        !drawingRef.current
      ) {
        return;
      }

      const previous =
        lastPointRef.current;

      if (
        !previous
      ) {
        return;
      }

      const point =
        getPointerPosition(
          event
        );

      const ctx =
        getContext();

      if (
        !ctx
      ) {
        return;
      }

      ctx.save();

      ctx.lineCap =
        "round";

      ctx.lineJoin =
        "round";

      ctx.lineWidth =
        brushSize;

      if (
        tool ===
        "eraser"
      ) {
        ctx.globalCompositeOperation =
          "destination-out";

        ctx.strokeStyle =
          "rgba(0,0,0,1)";
      } else {
        ctx.globalCompositeOperation =
          "source-over";

        ctx.strokeStyle =
          brushColor;
      }

      ctx.beginPath();

      ctx.moveTo(
        previous.x,
        previous.y
      );

      ctx.lineTo(
        point.x,
        point.y
      );

      ctx.stroke();

      ctx.restore();

      lastPointRef.current =
        point;
    };

  const stopDrawing =
    (
      event?:
        React.PointerEvent<HTMLCanvasElement>
    ) => {
      if (
        event
      ) {
        try {
          event.currentTarget.releasePointerCapture(
            event.pointerId
          );
        } catch {
          // Safe fallback.
        }
      }

      drawingRef.current =
        false;

      lastPointRef.current =
        null;
    };

  /* =======================================================
     UNDO
  ======================================================= */

  const handleUndo =
    () => {
      const ctx =
        getContext();

      if (
        !ctx
      ) {
        return;
      }

      const previous =
        undoStackRef.current.pop();

      if (
        !previous
      ) {
        return;
      }

      ctx.putImageData(
        previous,
        0,
        0
      );
    };

  /* =======================================================
     CLEAR
  ======================================================= */

  const handleClear =
    () => {
      pushUndo();

      const ctx =
        getContext();

      if (
        !ctx
      ) {
        return;
      }

      ctx.clearRect(
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );

      paintTexture(
        texture
      );
    };

  /* =======================================================
     EXPORT PNG
  ======================================================= */

  const handleExport =
    () => {
      const canvas =
        canvasRef.current;

      if (
        !canvas
      ) {
        return;
      }

      const url =
        canvas.toDataURL(
          "image/png"
        );

      const anchor =
        document.createElement(
          "a"
        );

      anchor.href =
        url;

      anchor.download =
        `${title.trim() || "heritage-pattachitra"}.png`;

      anchor.click();
    };

  /* =======================================================
     CANVAS TO FILE
  ======================================================= */

  const canvasToFile =
    (
      fileName:
        string
    ) =>
      new Promise<File>(
        (
          resolve,
          reject
        ) => {
          const canvas =
            canvasRef.current;

          if (
            !canvas
          ) {
            reject(
              new Error(
                "Canvas unavailable"
              )
            );

            return;
          }

          canvas.toBlob(
            (
              blob
            ) => {
              if (
                !blob
              ) {
                reject(
                  new Error(
                    "Could not create artwork image."
                  )
                );

                return;
              }

              resolve(
                new File(
                  [
                    blob,
                  ],
                  fileName,
                  {
                    type:
                      "image/png",
                  }
                )
              );
            },
            "image/png",
            1
          );
        }
      );

  const createTemplateFile =
    () =>
      new Promise<File>(
        (
          resolve,
          reject
        ) => {
          const template =
            document.createElement(
              "canvas"
            );

          template.width =
            CANVAS_WIDTH;

          template.height =
            CANVAS_HEIGHT;

          const ctx =
            template.getContext(
              "2d"
            );

          if (
            !ctx
          ) {
            reject(
              new Error(
                "Could not create template."
              )
            );

            return;
          }

          if (
            texture ===
            "tussar"
          ) {
            ctx.fillStyle =
              "#f4ead4";
          } else if (
            texture ===
            "palm"
          ) {
            ctx.fillStyle =
              "#ead9b1";
          } else {
            ctx.fillStyle =
              "#d7b38d";
          }

          ctx.fillRect(
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
          );

          template.toBlob(
            (
              blob
            ) => {
              if (
                !blob
              ) {
                reject(
                  new Error(
                    "Could not create template file."
                  )
                );

                return;
              }

              resolve(
                new File(
                  [
                    blob,
                  ],
                  "heritage-template.png",
                  {
                    type:
                      "image/png",
                  }
                )
              );
            },
            "image/png"
          );
        }
      );

  /* =======================================================
     SAVE TO DJANGO
  ======================================================= */

  const handleSave =
    async () => {
      if (
        !title.trim()
      ) {
        setError(
          t.titleRequired
        );

        return;
      }

      try {
        setSaving(
          true
        );

        setError(
          ""
        );

        setSuccess(
          ""
        );

        const [
          artworkFile,
          templateFile,
        ] =
          await Promise.all([
            canvasToFile(
              "heritage-artwork.png"
            ),
            createTemplateFile(),
          ]);

        await api.saveCanvasArtwork(
          {
            title:
              title.trim(),

            template_image:
              templateFile,

            artwork_image:
              artworkFile,
          }
        );

        setSuccess(
          t.saveSuccess
        );

        setTitle(
          ""
        );

        await loadArtworks(
          true
        );
      } catch (
        err
      ) {
        console.error(
          "Canvas save error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Could not save artwork."
        );
      } finally {
        setSaving(
          false
        );
      }
    };

  /* =======================================================
     LOAD SAVED ARTWORKS
  ======================================================= */

  const loadArtworks =
    async (
      refresh =
        false
    ) => {
      try {
        if (
          refresh
        ) {
          setRefreshing(
            true
          );
        } else {
          setLoading(
            true
          );
        }

        const response =
          await api.getCanvasArtworks();

        setArtworks(
          Array.isArray(
            response
          )
            ? response
            : []
        );
      } catch (
        err
      ) {
        console.error(
          "Canvas load error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Could not load artworks."
        );
      } finally {
        setLoading(
          false
        );

        setRefreshing(
          false
        );
      }
    };

  useEffect(
    () => {
      loadArtworks();
    },
    []
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        min-h-screen

        bg-[#faf9f5]
        dark:bg-[#12100f]

        text-[#1b1c1a]
        dark:text-[#f3eee7]

        transition-colors
      "
    >
      {/* ===================================================
          HERO
      =================================================== */}

      <section
        className="
          max-w-[1440px]
          mx-auto

          px-5
          md:px-12

          pt-12
          md:pt-16

          pb-8

          text-center
        "
      >
        <div
          className="
            inline-flex
            items-center
            gap-2

            text-[10px]
            md:text-[11px]

            uppercase
            tracking-[0.18em]
            font-bold

            text-[#94492d]
            dark:text-[#d97955]
          "
        >
          <Sparkles
            className="
              w-4
              h-4
            "
          />

          {
            t.archive
          }
        </div>

        <h1
          className="
            mt-3

            max-w-4xl
            mx-auto

            font-display
            font-bold

            text-[38px]
            md:text-[58px]

            leading-[1.05]
          "
        >
          {
            t.title
          }
        </h1>

        <p
          className="
            mt-4

            max-w-2xl
            mx-auto

            text-sm
            md:text-base

            leading-7

            text-[#747878]
            dark:text-[#aaa39c]
          "
        >
          {
            t.subtitle
          }
        </p>
      </section>

      {/* ===================================================
          STUDIO
      =================================================== */}

      <section
        className="
          max-w-[1440px]
          mx-auto

          px-5
          md:px-12

          pb-16
        "
      >
        <div
          className="
            grid

            grid-cols-1
            lg:grid-cols-[320px_1fr]

            gap-5
          "
        >
          {/* ===============================================
              LEFT TOOLBOX
          =============================================== */}

          <aside
            className="
              rounded-2xl

              border
              border-[#d8c9ba]
              dark:border-[#3b3531]

              bg-[#f6f1ea]
              dark:bg-[#1c1917]

              shadow-sm

              p-5
            "
          >
            <div
              className="
                flex
                items-center
                gap-2

                text-[11px]
                font-bold

                uppercase
                tracking-wider

                text-[#94492d]
                dark:text-[#d97955]
              "
            >
              <Palette
                className="
                  w-4
                  h-4
                "
              />

              {
                t.studioTools
              }
            </div>

            {/* TOOL BUTTONS */}

            <div
              className="
                grid
                grid-cols-2

                gap-2

                mt-4
              "
            >
              <button
                type="button"
                onClick={() =>
                  setTool(
                    "brush"
                  )
                }
                className={`
                  py-3
                  px-3

                  rounded-lg

                  border

                  text-[11px]
                  font-bold

                  flex
                  items-center
                  justify-center
                  gap-2

                  ${
                    tool ===
                    "brush"
                      ? `
                        bg-[#94492d]
                        text-white
                        border-[#94492d]
                      `
                      : `
                        bg-white
                        dark:bg-[#24201d]

                        border-[#d8c9ba]
                        dark:border-[#3b3531]
                      `
                  }
                `}
              >
                <Brush
                  className="
                    w-4
                    h-4
                  "
                />

                {
                  t.brush
                }
              </button>

              <button
                type="button"
                onClick={() =>
                  setTool(
                    "stamp"
                  )
                }
                className={`
                  py-3
                  px-3

                  rounded-lg

                  border

                  text-[11px]
                  font-bold

                  flex
                  items-center
                  justify-center
                  gap-2

                  ${
                    tool ===
                    "stamp"
                      ? `
                        bg-[#94492d]
                        text-white
                        border-[#94492d]
                      `
                      : `
                        bg-white
                        dark:bg-[#24201d]

                        border-[#d8c9ba]
                        dark:border-[#3b3531]
                      `
                  }
                `}
              >
                <Stamp
                  className="
                    w-4
                    h-4
                  "
                />

                {
                  t.stamp
                }
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                setTool(
                  "eraser"
                )
              }
              className={`
                mt-2

                w-full

                py-3

                rounded-lg

                border

                text-[11px]
                font-bold

                flex
                items-center
                justify-center
                gap-2

                ${
                  tool ===
                  "eraser"
                    ? `
                      bg-[#94492d]
                      text-white
                      border-[#94492d]
                    `
                    : `
                      bg-white
                      dark:bg-[#24201d]

                      border-[#d8c9ba]
                      dark:border-[#3b3531]
                    `
                }
              `}
            >
              <Eraser
                className="
                  w-4
                  h-4
                "
              />

              {
                t.eraser
              }
            </button>

            {/* BRUSH SIZE */}

            <div
              className="
                mt-6
              "
            >
              <div
                className="
                  flex
                  justify-between
                  items-center
                "
              >
                <span
                  className="
                    text-[10px]
                    font-bold

                    uppercase
                    tracking-wider
                  "
                >
                  {
                    t.brushStroke
                  }
                </span>

                <span
                  className="
                    text-[11px]
                    font-bold

                    text-[#94492d]
                    dark:text-[#d97955]
                  "
                >
                  {
                    brushSize
                  }
                  px
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="30"
                value={
                  brushSize
                }
                onChange={(
                  event
                ) =>
                  setBrushSize(
                    Number(
                      event.target.value
                    )
                  )
                }
                className="
                  w-full

                  mt-3

                  accent-[#94492d]
                "
              />
            </div>

            {/* PIGMENTS */}

            <div
              className="
                mt-6

                pt-5

                border-t
                border-[#d8c9ba]
                dark:border-[#3b3531]
              "
            >
              <div
                className="
                  text-[10px]
                  font-bold

                  uppercase
                  tracking-wider

                  text-[#94492d]
                  dark:text-[#d97955]
                "
              >
                {
                  t.pigments
                }
              </div>

              <div
                className="
                  mt-3

                  grid
                  grid-cols-2

                  gap-2
                "
              >
                {pigments.map(
                  (
                    pigment
                  ) => (
                    <button
                      key={
                        pigment.name
                      }
                      type="button"
                      onClick={() => {
                        setBrushColor(
                          pigment.color
                        );

                        setTool(
                          "brush"
                        );
                      }}
                      className={`
                        min-h-[40px]

                        px-3

                        rounded-lg

                        border

                        flex
                        items-center
                        gap-2

                        text-[10px]
                        font-medium

                        bg-white
                        dark:bg-[#24201d]

                        ${
                          brushColor ===
                          pigment.color
                            ? `
                              border-[#94492d]
                              ring-1
                              ring-[#94492d]
                            `
                            : `
                              border-[#d8c9ba]
                              dark:border-[#3b3531]
                            `
                        }
                      `}
                    >
                      <span
                        className="
                          w-3
                          h-3

                          rounded-full

                          border
                          border-black/10

                          shrink-0
                        "
                        style={{
                          backgroundColor:
                            pigment.color,
                        }}
                      />

                      {
                        isOdia
                          ? pigment.odia
                          : pigment.name
                      }
                    </button>
                  )
                )}
              </div>
            </div>

            {/* STAMP TYPE */}

            {tool ===
              "stamp" && (
              <div
                className="
                  mt-6

                  pt-5

                  border-t
                  border-[#d8c9ba]
                  dark:border-[#3b3531]
                "
              >
                <div
                  className="
                    text-[10px]
                    font-bold

                    uppercase
                    tracking-wider

                    text-[#94492d]
                    dark:text-[#d97955]
                  "
                >
                  {
                    t.stamp
                  }
                </div>

                <div
                  className="
                    grid
                    grid-cols-2

                    gap-2

                    mt-3
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setStampType(
                        "wheel"
                      )
                    }
                    className={`
                      py-3

                      rounded-lg
                      border

                      text-[10px]
                      font-bold

                      ${
                        stampType ===
                        "wheel"
                          ? `
                            bg-[#94492d]
                            text-white
                            border-[#94492d]
                          `
                          : `
                            bg-white
                            dark:bg-[#24201d]

                            border-[#d8c9ba]
                            dark:border-[#3b3531]
                          `
                      }
                    `}
                  >
                    {
                      t.wheel
                    }
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStampType(
                        "flower"
                      )
                    }
                    className={`
                      py-3

                      rounded-lg
                      border

                      text-[10px]
                      font-bold

                      ${
                        stampType ===
                        "flower"
                          ? `
                            bg-[#94492d]
                            text-white
                            border-[#94492d]
                          `
                          : `
                            bg-white
                            dark:bg-[#24201d]

                            border-[#d8c9ba]
                            dark:border-[#3b3531]
                          `
                      }
                    `}
                  >
                    {
                      t.flower
                    }
                  </button>
                </div>
              </div>
            )}

            {/* TEXTURE */}

            <div
              className="
                mt-6

                pt-5

                border-t
                border-[#d8c9ba]
                dark:border-[#3b3531]
              "
            >
              <div
                className="
                  text-[10px]
                  font-bold

                  uppercase
                  tracking-wider

                  text-[#94492d]
                  dark:text-[#d97955]
                "
              >
                {
                  t.texture
                }
              </div>

              <div
                className="
                  grid
                  grid-cols-3

                  gap-2

                  mt-3
                "
              >
                {[
                  {
                    value:
                      "tussar" as Texture,

                    label:
                      t.tussar,
                  },
                  {
                    value:
                      "palm" as Texture,

                    label:
                      t.palm,
                  },
                  {
                    value:
                      "sandstone" as Texture,

                    label:
                      t.sandstone,
                  },
                ].map(
                  (
                    item
                  ) => (
                    <button
                      key={
                        item.value
                      }
                      type="button"
                      onClick={() =>
                        handleTextureChange(
                          item.value
                        )
                      }
                      className={`
                        py-3
                        px-1

                        rounded-lg

                        border

                        text-[9px]
                        leading-tight
                        font-semibold

                        ${
                          texture ===
                          item.value
                            ? `
                              bg-[#94492d]
                              text-white
                              border-[#94492d]
                            `
                            : `
                              bg-white
                              dark:bg-[#24201d]

                              border-[#d8c9ba]
                              dark:border-[#3b3531]
                            `
                        }
                      `}
                    >
                      {
                        item.label
                      }
                    </button>
                  )
                )}
              </div>
            </div>

            {/* UNDO / CLEAR */}

            <div
              className="
                grid
                grid-cols-2

                gap-2

                mt-6

                pt-5

                border-t
                border-[#d8c9ba]
                dark:border-[#3b3531]
              "
            >
              <button
                type="button"
                onClick={
                  handleUndo
                }
                className="
                  py-3

                  rounded-lg

                  border
                  border-[#d8c9ba]
                  dark:border-[#3b3531]

                  bg-white
                  dark:bg-[#24201d]

                  text-[10px]
                  font-bold

                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <RotateCcw
                  className="
                    w-4
                    h-4
                  "
                />

                {
                  t.undo
                }
              </button>

              <button
                type="button"
                onClick={
                  handleClear
                }
                className="
                  py-3

                  rounded-lg

                  border
                  border-red-200
                  dark:border-red-900/50

                  bg-white
                  dark:bg-[#24201d]

                  text-red-600
                  dark:text-red-400

                  text-[10px]
                  font-bold

                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <Trash2
                  className="
                    w-4
                    h-4
                  "
                />

                {
                  t.clear
                }
              </button>
            </div>
          </aside>

          {/* ===============================================
              CANVAS AREA
          =============================================== */}

          <div
            className="
              rounded-2xl

              border
              border-[#d8c9ba]
              dark:border-[#3b3531]

              bg-[#f6f1ea]
              dark:bg-[#1c1917]

              shadow-md

              p-4
              md:p-5
            "
          >
            <div
              className="
                flex
                flex-col
                md:flex-row

                md:items-center
                justify-between

                gap-3

                mb-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2

                  text-[11px]
                  font-semibold

                  text-[#747878]
                  dark:text-[#aaa39c]
                "
              >
                <Layers
                  className="
                    w-4
                    h-4

                    text-[#94492d]
                    dark:text-[#d97955]
                  "
                />

                {
                  t.canvasLabel
                }

                <span
                  className="
                    opacity-60
                  "
                >
                  (
                  {
                    CANVAS_WIDTH
                  }
                  ×
                  {
                    CANVAS_HEIGHT
                  }
                  px)
                </span>
              </div>

              <button
                type="button"
                onClick={
                  handleExport
                }
                className="
                  px-4
                  py-2.5

                  rounded-lg

                  bg-[#94492d]
                  hover:bg-[#773319]

                  text-white

                  text-[10px]
                  font-bold

                  uppercase
                  tracking-wider

                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <Download
                  className="
                    w-4
                    h-4
                  "
                />

                {
                  t.export
                }
              </button>
            </div>

            <div
              ref={
                containerRef
              }
              className="
                overflow-hidden

                rounded-xl

                border
                border-[#d8c9ba]
                dark:border-[#3b3531]

                bg-[#ead9b1]

                shadow-inner
              "
            >
              <canvas
                ref={
                  canvasRef
                }
                width={
                  CANVAS_WIDTH
                }
                height={
                  CANVAS_HEIGHT
                }
                onPointerDown={
                  handlePointerDown
                }
                onPointerMove={
                  handlePointerMove
                }
                onPointerUp={
                  stopDrawing
                }
                onPointerCancel={
                  stopDrawing
                }
                onPointerLeave={
                  stopDrawing
                }
                className="
                  block

                  w-full
                  h-auto

                  touch-none

                  cursor-crosshair
                "
              />
            </div>

            <p
              className="
                text-[11px]

                text-[#747878]
                dark:text-[#aaa39c]

                mt-3
              "
            >
              {
                t.drawingHint
              }
            </p>

            {/* SAVE */}

            <div
              className="
                mt-5

                pt-5

                border-t
                border-[#d8c9ba]
                dark:border-[#3b3531]

                grid
                grid-cols-1
                md:grid-cols-[1fr_auto]

                gap-3
              "
            >
              <div>
                <label
                  className="
                    block

                    text-[10px]
                    font-bold

                    uppercase
                    tracking-wider

                    mb-2
                  "
                >
                  {
                    t.artworkTitle
                  }
                </label>

                <input
                  type="text"
                  value={
                    title
                  }
                  onChange={(
                    event
                  ) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder={
                    t.titlePlaceholder
                  }
                  className="
                    w-full

                    rounded-lg

                    border
                    border-[#d8c9ba]
                    dark:border-[#3b3531]

                    bg-white
                    dark:bg-[#24201d]

                    px-4
                    py-3

                    text-sm

                    outline-none

                    focus:border-[#94492d]
                  "
                />
              </div>

              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  saving
                }
                className="
                  md:self-end

                  min-h-[46px]

                  px-5

                  rounded-lg

                  bg-[#94492d]
                  hover:bg-[#773319]

                  disabled:opacity-50

                  text-white

                  text-[10px]
                  font-bold

                  uppercase
                  tracking-wider

                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {saving ? (
                  <Loader2
                    className="
                      w-4
                      h-4
                      animate-spin
                    "
                  />
                ) : (
                  <Save
                    className="
                      w-4
                      h-4
                    "
                  />
                )}

                {saving
                  ? t.saving
                  : t.save}
              </button>
            </div>

            {error && (
              <div
                className="
                  mt-4

                  rounded-lg

                  bg-red-50
                  dark:bg-red-950/30

                  border
                  border-red-200
                  dark:border-red-900/50

                  px-4
                  py-3

                  text-sm
                  text-red-700
                  dark:text-red-300
                "
              >
                {
                  error
                }
              </div>
            )}

            {success && (
              <div
                className="
                  mt-4

                  rounded-lg

                  bg-green-50
                  dark:bg-green-950/30

                  border
                  border-green-200
                  dark:border-green-900/50

                  px-4
                  py-3

                  text-sm
                  text-green-700
                  dark:text-green-300
                "
              >
                {
                  success
                }
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          SAVED ARTWORKS
      =================================================== */}

      <section
        className="
          max-w-[1440px]
          mx-auto

          px-5
          md:px-12

          pb-20
        "
      >
        <div
          className="
            flex
            flex-col
            sm:flex-row

            sm:items-end
            justify-between

            gap-4

            border-t
            border-[#d7d7d2]
            dark:border-[#3b3531]

            pt-10
            pb-6
          "
        >
          <div>
            <div
              className="
                text-[10px]
                uppercase
                tracking-[0.18em]
                font-bold

                text-[#94492d]
                dark:text-[#d97955]
              "
            >
              {
                t.saved
              }
            </div>

            <div
              className="
                mt-2

                font-display
                font-bold

                text-[32px]
              "
            >
              {
                isOdia
                  ? String(
                      artworks.length
                    )
                      .replace(
                        /0/g,
                        "୦"
                      )
                      .replace(
                        /1/g,
                        "୧"
                      )
                      .replace(
                        /2/g,
                        "୨"
                      )
                      .replace(
                        /3/g,
                        "୩"
                      )
                      .replace(
                        /4/g,
                        "୪"
                      )
                      .replace(
                        /5/g,
                        "୫"
                      )
                      .replace(
                        /6/g,
                        "୬"
                      )
                      .replace(
                        /7/g,
                        "୭"
                      )
                      .replace(
                        /8/g,
                        "୮"
                      )
                      .replace(
                        /9/g,
                        "୯"
                      )
                  : artworks.length
              }
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              loadArtworks(
                true
              )
            }
            disabled={
              refreshing
            }
            className="
              px-4
              py-2.5

              border
              border-[#d7d7d2]
              dark:border-[#3b3531]

              bg-white
              dark:bg-[#1c1917]

              text-[10px]
              uppercase
              tracking-wider
              font-bold

              flex
              items-center
              gap-2
            "
          >
            <RefreshCw
              className={`
                w-4
                h-4

                ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              `}
            />

            {
              t.refresh
            }
          </button>
        </div>

        {loading ? (
          <div
            className="
              min-h-[240px]

              flex
              items-center
              justify-center
            "
          >
            <Loader2
              className="
                w-7
                h-7

                animate-spin

                text-[#94492d]
              "
            />

            <span
              className="
                ml-3

                text-sm

                text-[#747878]
                dark:text-[#aaa39c]
              "
            >
              {
                t.loading
              }
            </span>
          </div>
        ) : artworks.length ===
          0 ? (
          <div
            className="
              min-h-[260px]

              border
              border-dashed
              border-[#d7d7d2]
              dark:border-[#3b3531]

              flex
              flex-col
              items-center
              justify-center

              text-center
            "
          >
            <ImageIcon
              className="
                w-10
                h-10

                text-[#94492d]
              "
            />

            <p
              className="
                mt-3

                text-sm

                text-[#747878]
                dark:text-[#aaa39c]
              "
            >
              {
                t.noArtwork
              }
            </p>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3

              gap-6
            "
          >
            {artworks.map(
              (
                artwork
              ) => (
                <article
                  key={
                    artwork.id
                  }
                  className="
                    overflow-hidden

                    border
                    border-[#d7d7d2]
                    dark:border-[#3b3531]

                    bg-white
                    dark:bg-[#1c1917]

                    group
                  "
                >
                  <div
                    className="
                      relative
                      aspect-[4/3]

                      overflow-hidden

                      bg-[#efeeea]
                      dark:bg-[#24201d]
                    "
                  >
                    {artwork.artwork_image ? (
                      <img
                        src={
                          artwork.artwork_image
                        }
                        alt={
                          artwork.title
                        }
                        className="
                          w-full
                          h-full

                          object-cover

                          group-hover:scale-105

                          transition-transform
                          duration-500
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-full
                          h-full

                          flex
                          items-center
                          justify-center
                        "
                      >
                        <ImageIcon
                          className="
                            w-9
                            h-9

                            text-[#747878]
                          "
                        />
                      </div>
                    )}

                    <span
                      className="
                        absolute

                        top-4
                        left-4

                        bg-white/95
                        dark:bg-[#1c1917]/95

                        px-3
                        py-1

                        text-[9px]

                        uppercase
                        tracking-wider
                        font-bold

                        text-[#94492d]
                        dark:text-[#d97955]
                      "
                    >
                      {
                        t.canvasArtwork
                      }
                    </span>
                  </div>

                  <div
                    className="
                      p-5
                    "
                  >
                    <h3
                      className="
                        font-display

                        text-xl
                        font-bold
                      "
                    >
                      {
                        artwork.title
                      }
                    </h3>

                    {artwork.artwork_image && (
                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            artwork.artwork_image!,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                        className="
                          mt-4

                          text-[10px]
                          uppercase
                          tracking-wider
                          font-bold

                          text-[#94492d]
                          dark:text-[#d97955]
                        "
                      >
                        {
                          t.open
                        }
                      </button>
                    )}
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default CanvasPage;