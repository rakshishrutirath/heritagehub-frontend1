import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import * as THREE from "three";

import { GLTFLoader } from
  "three/examples/jsm/loaders/GLTFLoader.js";

import {
  Upload,
  Box,
  RefreshCw,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  ExternalLink,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import api from "../services/api";
import { Artifact } from "../types";
import { useLanguage } from "../context/LanguageContext";

/* =========================================================
   PROPS
========================================================= */

interface ThreeDHeritagePageProps {
  models?: unknown[];
  artifacts?: Artifact[];
  initialModelId?: string;

  onSelectArtifactDetail?: (
    artifact: Artifact | null
  ) => void;
}

/* =========================================================
   STATUS TYPE
========================================================= */

type GenerationStatus =
  | "idle"
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "error";

/* =========================================================
   PAGE
========================================================= */

export const ThreeDHeritagePage:
React.FC<ThreeDHeritagePageProps> = () => {
  /* =======================================================
     LANGUAGE
  ======================================================= */

  const { language } = useLanguage();

  const isOdia =
    language === "or";

  const t = {
    eyebrow:
      isOdia
        ? "ଛବିରୁ 3D ଐତିହ୍ୟ"
        : "IMAGE-TO-3D HERITAGE",

    title:
      isOdia
        ? "3D ରେ ଐତିହ୍ୟ ପୁନର୍ନିର୍ମାଣ କରନ୍ତୁ"
        : "Reconstruct Heritage in 3D",

    description:
      isOdia
        ? "ଏକ ଐତିହ୍ୟ ଛବି ଅପଲୋଡ୍ କରନ୍ତୁ। HeritageHub ଏହାକୁ Django 3D generation pipeline କୁ ପଠାଇବ, ପ୍ରକ୍ରିୟାର ସ୍ଥିତି ଯାଞ୍ଚ କରିବ ଏବଂ ପ୍ରସ୍ତୁତ 3D model ଦେଖାଇବ।"
        : "Upload a heritage image and HeritageHub will send it to the Django 3D generation pipeline, monitor its processing status, and display the generated model.",

    sourceImage:
      isOdia
        ? "ମୂଳ ଛବି"
        : "Source Image",

    chooseImage:
      isOdia
        ? "ଐତିହ୍ୟ ଛବି ବାଛନ୍ତୁ"
        : "Choose Heritage Image",

    imageHint:
      isOdia
        ? "JPG, PNG, WEBP କିମ୍ବା browser ଦ୍ୱାରା ସମର୍ଥିତ ଛବି।"
        : "JPG, PNG, WEBP or another browser-supported image.",

    selectedFile:
      isOdia
        ? "ବାଛାଯାଇଥିବା ଫାଇଲ୍"
        : "Selected File",

    generate:
      isOdia
        ? "3D ମଡେଲ୍ ତିଆରି କରନ୍ତୁ"
        : "Generate 3D Model",

    starting:
      isOdia
        ? "Generation ଆରମ୍ଭ ହେଉଛି..."
        : "Starting Generation...",

    startOver:
      isOdia
        ? "ପୁନର୍ବାର ଆରମ୍ଭ"
        : "Start Over",

    generationStatus:
      isOdia
        ? "Generation ସ୍ଥିତି"
        : "Generation Status",

    idle:
      isOdia
        ? "3D ପୁନର୍ନିର୍ମାଣ ଆରମ୍ଭ କରିବା ପାଇଁ ଏକ ଛବି ବାଛନ୍ତୁ।"
        : "Select an image to begin the reconstruction workflow.",

    processing:
      isOdia
        ? "ପ୍ରକ୍ରିୟା ଚାଲିଛି"
        : "Processing",

    processingDescription:
      isOdia
        ? "HeritageHub ଆପଣଙ୍କ 3D ପୁନର୍ନିର୍ମାଣ ତିଆରି କରୁଛି।"
        : "HeritageHub is generating your 3D reconstruction.",

    progress:
      isOdia
        ? "ଅଗ୍ରଗତି"
        : "Progress",

    complete:
      isOdia
        ? "Generation ସମ୍ପୂର୍ଣ୍ଣ"
        : "Generation Complete",

    completeDescription:
      isOdia
        ? "ଆପଣଙ୍କ ଐତିହ୍ୟ 3D ପୁନର୍ନିର୍ମାଣ ପ୍ରସ୍ତୁତ।"
        : "Your heritage reconstruction is ready.",

    failed:
      isOdia
        ? "Generation ବିଫଳ"
        : "Generation Failed",

    genericFailure:
      isOdia
        ? "3D model ତିଆରି କରିହେଲା ନାହିଁ।"
        : "Unable to generate the model.",

    generationId:
      "Generation ID",

    viewer:
      isOdia
        ? "3D ଐତିହ୍ୟ ଭ୍ୟୁଅର୍"
        : "3D Heritage Viewer",

    viewerDescription:
      isOdia
        ? "Backend reconstruction ସମ୍ପୂର୍ଣ୍ଣ ହେଲେ ଆପଣଙ୍କ 3D ଐତିହ୍ୟ model ଏଠାରେ ଦେଖାଯିବ।"
        : "Your generated heritage model will appear here when the backend reconstruction is complete.",

    openModel:
      isOdia
        ? "Model ଫାଇଲ୍ ଖୋଲନ୍ତୁ"
        : "Open Model File",

    uploadStep:
      isOdia
        ? "ଛବି ଅପଲୋଡ୍"
        : "Upload Image",

    uploadStepText:
      isOdia
        ? "ପୁନର୍ନିର୍ମାଣ କରିବାକୁ ଚାହୁଁଥିବା ଐତିହ୍ୟ ବସ୍ତୁର ଏକ ସ୍ପଷ୍ଟ ଛବି ବାଛନ୍ତୁ।"
        : "Select a clear image of the heritage object you want to reconstruct.",

    generateStep:
      isOdia
        ? "3D Generation"
        : "Generate",

    generateStepText:
      isOdia
        ? "Django image-to-3D generation task ଆରମ୍ଭ କରି Generation ID ଫେରାଇବ।"
        : "Django starts the image-to-3D generation task and returns a generation ID.",

    exploreStep:
      isOdia
        ? "3D ଅନ୍ୱେଷଣ"
        : "Explore",

    exploreStepText:
      isOdia
        ? "HeritageHub task status ସ୍ୱୟଂଚାଳିତ ଭାବେ ଯାଞ୍ଚ କରି ପ୍ରସ୍ତୁତ 3D model ଲୋଡ୍ କରିବ।"
        : "HeritageHub checks the task status automatically and loads the finished 3D model.",

    invalidImage:
      isOdia
        ? "ଦୟାକରି ଏକ ସଠିକ୍ image file ବାଛନ୍ତୁ।"
        : "Please select a valid image file.",

    selectBeforeGenerate:
      isOdia
        ? "3D generation ଆରମ୍ଭ କରିବା ପୂର୍ବରୁ ଏକ ଛବି ବାଛନ୍ତୁ।"
        : "Select an image before starting 3D generation.",

    unableStart:
      isOdia
        ? "3D generation ଆରମ୍ଭ କରିହେଲା ନାହିଁ।"
        : "Unable to start 3D generation.",

    modelDisplayError:
      isOdia
        ? "3D model ତିଆରି ହୋଇଛି, କିନ୍ତୁ browser model file ଦେଖାଇପାରିଲା ନାହିଁ।"
        : "The 3D model was generated, but the browser could not display the model file.",

    reconstruction:
      isOdia
        ? "ଡିଜିଟାଲ୍ ପୁନର୍ନିର୍ମାଣ"
        : "Digital Reconstruction",
  };

  /* =======================================================
     STATE
  ======================================================= */

  const [
    selectedImage,
    setSelectedImage,
  ] = useState<File | null>(null);

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState<string | null>(null);

  const [
    generationId,
    setGenerationId,
  ] = useState<string | null>(null);

  const [
    status,
    setStatus,
  ] = useState<GenerationStatus>("idle");

  const [
    progress,
    setProgress,
  ] = useState<number>(0);

  const [
    modelUrl,
    setModelUrl,
  ] = useState<string | null>(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    generating,
    setGenerating,
  ] = useState(false);

  /* =======================================================
     THREE.JS REFS
  ======================================================= */

  const viewerRef =
    useRef<HTMLDivElement | null>(null);

  const sceneRef =
    useRef<THREE.Scene | null>(null);

  const cameraRef =
    useRef<THREE.PerspectiveCamera | null>(
      null
    );

  const rendererRef =
    useRef<THREE.WebGLRenderer | null>(
      null
    );

  const modelRef =
    useRef<THREE.Group | null>(null);

  const animationRef =
    useRef<number | null>(null);

  const isDraggingRef =
    useRef(false);

  const lastMouseRef =
    useRef({
      x: 0,
      y: 0,
    });

  /* =======================================================
     IMAGE SELECTION
  ======================================================= */

  const handleImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        t.invalidImage
      );

      return;
    }

    if (
      previewUrl
    ) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    const newPreview =
      URL.createObjectURL(
        file
      );

    setSelectedImage(
      file
    );

    setPreviewUrl(
      newPreview
    );

    setGenerationId(
      null
    );

    setStatus(
      "idle"
    );

    setProgress(
      0
    );

    setModelUrl(
      null
    );

    setError(
      ""
    );
  };

  /* =======================================================
     GENERATE 3D
  ======================================================= */

  const handleGenerate =
    async () => {
      if (
        !selectedImage
      ) {
        setError(
          t.selectBeforeGenerate
        );

        return;
      }

      try {
        setGenerating(
          true
        );

        setError(
          ""
        );

        setProgress(
          0
        );

        setModelUrl(
          null
        );

        setStatus(
          "processing"
        );

        const response =
          await api.generate3D(
            selectedImage
          );

        console.log(
          "3D generation response:",
          response
        );

        setGenerationId(
          response.generation_id
        );

        setStatus(
          response.status ||
            "processing"
        );
      } catch (
        err
      ) {
        console.error(
          "3D generation failed:",
          err
        );

        setStatus(
          "error"
        );

        if (
          err instanceof Error
        ) {
          setError(
            err.message
          );
        } else {
          setError(
            t.unableStart
          );
        }
      } finally {
        setGenerating(
          false
        );
      }
    };

  /* =======================================================
     POLL BACKEND STATUS
  ======================================================= */

  useEffect(() => {
    if (
      !generationId
    ) {
      return;
    }

    if (
      status === "succeeded" ||
      status === "failed" ||
      status === "error"
    ) {
      return;
    }

    let cancelled =
      false;

    const checkStatus =
      async () => {
        try {
          const result =
            await api.check3DStatus(
              generationId
            );

          if (
            cancelled
          ) {
            return;
          }

          console.log(
            "3D status:",
            result
          );

          if (
            result.progress !==
            undefined
          ) {
            setProgress(
              result.progress
            );
          }

          if (
            result.model_url
          ) {
            setModelUrl(
              result.model_url
            );
          }

          if (
            result.status ===
            "succeeded"
          ) {
            setStatus(
              "succeeded"
            );

            setProgress(
              100
            );

            return;
          }

          if (
            result.status ===
            "failed"
          ) {
            setStatus(
              "failed"
            );

            setError(
              result.error_message ||
                t.genericFailure
            );

            return;
          }

          if (
            result.status ===
            "error"
          ) {
            setStatus(
              "error"
            );

            setError(
              result.detail ||
                result.error_message ||
                t.genericFailure
            );

            return;
          }

          setStatus(
            result.status
          );
        } catch (
          err
        ) {
          console.error(
            "3D status check failed:",
            err
          );

          if (
            err instanceof Error
          ) {
            setError(
              err.message
            );
          }
        }
      };

    checkStatus();

    const interval =
      window.setInterval(
        checkStatus,
        5000
      );

    return () => {
      cancelled =
        true;

      window.clearInterval(
        interval
      );
    };
  }, [
    generationId,
    status,
  ]);

  /* =======================================================
     THREE.JS VIEWER
  ======================================================= */

  useEffect(() => {
    if (
      status !==
        "succeeded" ||
      !modelUrl ||
      !viewerRef.current
    ) {
      return;
    }

    const container =
      viewerRef.current;

    /* -------------------------
       SCENE
    ------------------------- */

    const scene =
      new THREE.Scene();

    scene.background =
      new THREE.Color(
        0x151311
      );

    sceneRef.current =
      scene;

    /* -------------------------
       CAMERA
    ------------------------- */

    const camera =
      new THREE.PerspectiveCamera(
        45,

        container.clientWidth /
          Math.max(
            container.clientHeight,
            1
          ),

        0.1,

        1000
      );

    camera.position.set(
      0,
      1,
      4
    );

    cameraRef.current =
      camera;

    /* -------------------------
       RENDERER
    ------------------------- */

    const renderer =
      new THREE.WebGLRenderer({
        antialias:
          true,
      });

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure =
      1.1;

    container.innerHTML =
      "";

    container.appendChild(
      renderer.domElement
    );

    rendererRef.current =
      renderer;

    /* -------------------------
       LIGHTS
    ------------------------- */

    const ambient =
      new THREE.AmbientLight(
        0xffffff,
        1.5
      );

    scene.add(
      ambient
    );

    const keyLight =
      new THREE.DirectionalLight(
        0xffffff,
        3
      );

    keyLight.position.set(
      4,
      6,
      5
    );

    scene.add(
      keyLight
    );

    const fillLight =
      new THREE.DirectionalLight(
        0xffd8c4,
        1.2
      );

    fillLight.position.set(
      -4,
      2,
      3
    );

    scene.add(
      fillLight
    );

    /* -------------------------
       FLOOR
    ------------------------- */

    const floorGeometry =
      new THREE.CircleGeometry(
        2.1,
        64
      );

    const floorMaterial =
      new THREE.MeshStandardMaterial({
        color:
          0x222222,

        roughness:
          0.9,
      });

    const floor =
      new THREE.Mesh(
        floorGeometry,
        floorMaterial
      );

    floor.rotation.x =
      -Math.PI / 2;

    floor.position.y =
      -1.2;

    scene.add(
      floor
    );

    /* -------------------------
       LOAD MODEL
    ------------------------- */

    const loader =
      new GLTFLoader();

    const proxyModelUrl =
      `/api/meshy-model?url=${encodeURIComponent(modelUrl)}`;

    loader.load(
      proxyModelUrl,

      (
        gltf
      ) => {
        const model =
          gltf.scene;

        const box =
          new THREE.Box3()
            .setFromObject(
              model
            );

        const center =
          box.getCenter(
            new THREE.Vector3()
          );

        const size =
          box.getSize(
            new THREE.Vector3()
          );

        model.position.sub(
          center
        );

        const largest =
          Math.max(
            size.x,
            size.y,
            size.z
          );

        if (
          largest >
          0
        ) {
          const scale =
            2.4 /
            largest;

          model.scale.setScalar(
            scale
          );
        }

        scene.add(
          model
        );

        modelRef.current =
          model;
      },

      undefined,

      (
        loadError
      ) => {
        console.error(
          "Unable to load generated model:",
          loadError
        );

        setError(
          t.modelDisplayError
        );
      }
    );

    /* -------------------------
       DRAG ROTATION
    ------------------------- */

    const canvas =
      renderer.domElement;

    const handleDown = (
      event: MouseEvent
    ) => {
      isDraggingRef.current =
        true;

      lastMouseRef.current =
        {
          x:
            event.clientX,

          y:
            event.clientY,
        };
    };

    const handleMove = (
      event: MouseEvent
    ) => {
      if (
        !isDraggingRef.current ||
        !modelRef.current
      ) {
        return;
      }

      const dx =
        event.clientX -
        lastMouseRef.current.x;

      const dy =
        event.clientY -
        lastMouseRef.current.y;

      modelRef.current.rotation.y +=
        dx *
        0.008;

      modelRef.current.rotation.x +=
        dy *
        0.005;

      lastMouseRef.current =
        {
          x:
            event.clientX,

          y:
            event.clientY,
        };
    };

    const handleUp =
      () => {
        isDraggingRef.current =
          false;
      };

    canvas.addEventListener(
      "mousedown",
      handleDown
    );

    window.addEventListener(
      "mousemove",
      handleMove
    );

    window.addEventListener(
      "mouseup",
      handleUp
    );

    /* -------------------------
       ANIMATION
    ------------------------- */

    const animate =
      () => {
        animationRef.current =
          requestAnimationFrame(
            animate
          );

        if (
          modelRef.current &&
          !isDraggingRef.current
        ) {
          modelRef.current
            .rotation.y +=
            0.002;
        }

        renderer.render(
          scene,
          camera
        );
      };

    animate();

    /* -------------------------
       RESIZE
    ------------------------- */

    const handleResize =
      () => {
        if (
          !viewerRef.current
        ) {
          return;
        }

        const width =
          viewerRef.current
            .clientWidth;

        const height =
          viewerRef.current
            .clientHeight;

        if (
          width <= 0 ||
          height <= 0
        ) {
          return;
        }

        camera.aspect =
          width /
          height;

        camera.updateProjectionMatrix();

        renderer.setSize(
          width,
          height
        );
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    /* -------------------------
       CLEANUP
    ------------------------- */

    return () => {
      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      canvas.removeEventListener(
        "mousedown",
        handleDown
      );

      window.removeEventListener(
        "mousemove",
        handleMove
      );

      window.removeEventListener(
        "mouseup",
        handleUp
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      renderer.dispose();

      floorGeometry.dispose();
      floorMaterial.dispose();

      modelRef.current =
        null;

      rendererRef.current =
        null;

      sceneRef.current =
        null;
    };
  }, [
    modelUrl,
    status,
  ]);

  /* =======================================================
     VIEWER CONTROLS
  ======================================================= */

  const resetModel =
    () => {
      if (
        modelRef.current
      ) {
        modelRef.current.rotation.set(
          0,
          0,
          0
        );
      }

      if (
        cameraRef.current
      ) {
        cameraRef.current.position.set(
          0,
          1,
          4
        );
      }
    };

  const zoomIn =
    () => {
      if (
        cameraRef.current
      ) {
        cameraRef.current.position.z =
          Math.max(
            1.5,

            cameraRef.current
              .position.z -
              0.4
          );
      }
    };

  const zoomOut =
    () => {
      if (
        cameraRef.current
      ) {
        cameraRef.current.position.z =
          Math.min(
            8,

            cameraRef.current
              .position.z +
              0.4
          );
      }
    };

  /* =======================================================
     RESET WORKFLOW
  ======================================================= */

  const resetGeneration =
    () => {
      if (
        previewUrl
      ) {
        URL.revokeObjectURL(
          previewUrl
        );
      }

      setSelectedImage(
        null
      );

      setPreviewUrl(
        null
      );

      setGenerationId(
        null
      );

      setStatus(
        "idle"
      );

      setProgress(
        0
      );

      setModelUrl(
        null
      );

      setError(
        ""
      );
    };

  /* =======================================================
     PREVIEW CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      if (
        previewUrl
      ) {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    };
  }, [
    previewUrl,
  ]);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-[#faf9f5]
        dark:bg-[#12100f]
        text-[#1b1c1a]
        dark:text-[#f3eee7]
        transition-colors
        duration-300
      "
    >
      {/* HERO */}

      <section
        className="
          border-b
          border-[#ded9d3]
          dark:border-[#38322e]
        "
      >
        <div
          className="
            max-w-[1440px]
            mx-auto
            px-5
            md:px-16
            py-14
            md:py-20
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-[#94492d]
              dark:text-[#d97955]
            "
          >
            <Box className="w-4 h-4" />

            <span
              className="
                text-[11px]
                uppercase
                tracking-[0.16em]
                font-bold
              "
            >
              {t.eyebrow}
            </span>
          </div>

          <h1
            className="
              font-display
              text-[40px]
              sm:text-[48px]
              md:text-[60px]
              lg:text-[68px]
              leading-[1.03]
              tracking-[-0.035em]
              font-bold
              mt-4
              max-w-4xl
            "
          >
            {t.title}
          </h1>

          <p
            className="
              max-w-2xl
              text-[#555550]
              dark:text-[#aaa39c]
              leading-7
              text-[15px]
              md:text-[17px]
              mt-5
            "
          >
            {t.description}
          </p>
        </div>
      </section>

      {/* WORKSPACE */}

      <section
        className="
          max-w-[1440px]
          mx-auto
          px-5
          md:px-16
          py-12
          md:py-16
          pb-20
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-8
            items-start
          "
        >
          {/* LEFT */}

          <div
            className="
              lg:col-span-4
              space-y-6
            "
          >
            {/* SOURCE IMAGE */}

            <section
              className="
                bg-white
                dark:bg-[#1c1917]
                border
                border-[#c4c7c7]
                dark:border-[#3b3531]
                p-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-5
                "
              >
                <ImageIcon
                  className="
                    w-5
                    h-5
                    text-[#94492d]
                    dark:text-[#d97955]
                  "
                />

                <h2
                  className="
                    font-display
                    text-xl
                    font-bold
                  "
                >
                  {t.sourceImage}
                </h2>
              </div>

              <label
                className="
                  block
                  border-2
                  border-dashed
                  border-[#c4c7c7]
                  dark:border-[#49413c]
                  hover:border-[#94492d]
                  dark:hover:border-[#d97955]
                  transition-colors
                  cursor-pointer
                  overflow-hidden
                  bg-[#faf9f5]
                  dark:bg-[#151311]
                "
              >
                {previewUrl ? (
                  <img
                    src={
                      previewUrl
                    }
                    alt="Selected heritage"
                    className="
                      w-full
                      h-[280px]
                      object-contain
                      bg-[#efeeea]
                      dark:bg-[#11100f]
                    "
                  />
                ) : (
                  <div
                    className="
                      min-h-[280px]
                      flex
                      flex-col
                      items-center
                      justify-center
                      px-5
                      text-center
                    "
                  >
                    <Upload
                      className="
                        w-10
                        h-10
                        text-[#94492d]
                        dark:text-[#d97955]
                      "
                    />

                    <h3
                      className="
                        font-semibold
                        mt-4
                      "
                    >
                      {t.chooseImage}
                    </h3>

                    <p
                      className="
                        text-xs
                        text-[#747878]
                        dark:text-[#8f8882]
                        mt-2
                        leading-5
                      "
                    >
                      {t.imageHint}
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageSelect
                  }
                  className="hidden"
                />
              </label>

              {selectedImage && (
                <div
                  className="
                    mt-4
                    border
                    border-[#c4c7c7]
                    dark:border-[#3b3531]
                    bg-[#faf9f5]
                    dark:bg-[#151311]
                    p-4
                  "
                >
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-[#747878]
                      dark:text-[#8f8882]
                    "
                  >
                    {t.selectedFile}
                  </p>

                  <p
                    className="
                      text-sm
                      font-semibold
                      break-all
                      mt-1
                    "
                  >
                    {selectedImage.name}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={
                  handleGenerate
                }
                disabled={
                  !selectedImage ||
                  generating ||
                  status ===
                    "processing" ||
                  status ===
                    "pending"
                }
                className="
                  mt-5
                  w-full
                  bg-[#94492d]
                  hover:bg-[#773319]
                  dark:bg-[#b85b38]
                  dark:hover:bg-[#cf6944]
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  text-white
                  py-4
                  font-bold
                  text-[11px]
                  uppercase
                  tracking-[0.12em]
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-colors
                "
              >
                {generating ? (
                  <Loader2
                    className="
                      w-4
                      h-4
                      animate-spin
                    "
                  />
                ) : (
                  <Box className="w-4 h-4" />
                )}

                {generating
                  ? t.starting
                  : t.generate}
              </button>

              {selectedImage && (
                <button
                  type="button"
                  onClick={
                    resetGeneration
                  }
                  className="
                    mt-3
                    w-full
                    border
                    border-[#c4c7c7]
                    dark:border-[#4a433e]
                    py-3
                    text-[11px]
                    uppercase
                    tracking-[0.12em]
                    font-bold
                    hover:bg-[#efeeea]
                    dark:hover:bg-[#24201d]
                    transition-colors
                  "
                >
                  {t.startOver}
                </button>
              )}
            </section>

            {/* STATUS */}

            <section
              className="
                bg-[#1c1b1b]
                dark:bg-[#090908]
                text-white
                p-6
                border
                border-black
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-5
                "
              >
                <ShieldCheck
                  className="
                    w-5
                    h-5
                    text-[#fd9e7b]
                  "
                />

                <h2
                  className="
                    font-display
                    text-xl
                    font-bold
                  "
                >
                  {t.generationStatus}
                </h2>
              </div>

              {status ===
                "idle" && (
                <p
                  className="
                    text-sm
                    text-[#c4c7c7]
                    leading-6
                  "
                >
                  {t.idle}
                </p>
              )}

              {(status ===
                "processing" ||
                status ===
                  "pending") && (
                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <RefreshCw
                      className="
                        w-5
                        h-5
                        text-[#fd9e7b]
                        animate-spin
                      "
                    />

                    <div>
                      <p className="font-semibold">
                        {t.processing}
                      </p>

                      <p
                        className="
                          text-xs
                          text-[#c4c7c7]
                          mt-1
                          leading-5
                        "
                      >
                        {t.processingDescription}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div
                      className="
                        flex
                        justify-between
                        text-xs
                        text-[#c4c7c7]
                        mb-2
                      "
                    >
                      <span>
                        {t.progress}
                      </span>

                      <span>
                        {progress}%
                      </span>
                    </div>

                    <div
                      className="
                        h-2
                        bg-white/10
                        overflow-hidden
                      "
                    >
                      <div
                        className="
                          h-full
                          bg-[#b85b38]
                          transition-all
                          duration-500
                        "
                        style={{
                          width: `${
                            Math.min(
                              Math.max(
                                progress,
                                0
                              ),
                              100
                            )
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {status ===
                "succeeded" && (
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <CheckCircle
                    className="
                      w-6
                      h-6
                      text-emerald-400
                    "
                  />

                  <div>
                    <p className="font-semibold">
                      {t.complete}
                    </p>

                    <p
                      className="
                        text-xs
                        text-[#c4c7c7]
                        mt-1
                      "
                    >
                      {t.completeDescription}
                    </p>
                  </div>
                </div>
              )}

              {(status ===
                "failed" ||
                status ===
                  "error") && (
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <XCircle
                    className="
                      w-6
                      h-6
                      text-red-400
                    "
                  />

                  <div>
                    <p className="font-semibold">
                      {t.failed}
                    </p>

                    <p
                      className="
                        text-xs
                        text-red-300
                        mt-1
                      "
                    >
                      {error ||
                        t.genericFailure}
                    </p>
                  </div>
                </div>
              )}

              {generationId && (
                <div
                  className="
                    mt-6
                    pt-5
                    border-t
                    border-white/10
                  "
                >
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-[#747878]
                    "
                  >
                    {t.generationId}
                  </p>

                  <p
                    className="
                      text-xs
                      font-mono
                      text-[#c4c7c7]
                      break-all
                      mt-1
                    "
                  >
                    {generationId}
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT VIEWER */}

          <div className="lg:col-span-8">
            <div
              className="
                bg-[#151311]
                min-h-[600px]
                lg:min-h-[720px]
                border
                border-black
                relative
                overflow-hidden
              "
            >
              {status !==
                "succeeded" && (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    text-center
                    px-6
                  "
                >
                  <div className="max-w-md">
                    <div
                      className="
                        w-20
                        h-20
                        mx-auto
                        border
                        border-white/10
                        rounded-full
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Box
                        className="
                          w-10
                          h-10
                          text-[#b85b38]
                        "
                      />
                    </div>

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        text-[10px]
                        uppercase
                        tracking-[0.15em]
                        text-[#d97955]
                        font-bold
                        mt-6
                      "
                    >
                      <Sparkles className="w-3.5 h-3.5" />

                      {t.reconstruction}
                    </span>

                    <h2
                      className="
                        font-display
                        text-3xl
                        text-white
                        font-bold
                        mt-3
                      "
                    >
                      {t.viewer}
                    </h2>

                    <p
                      className="
                        text-[#8d8883]
                        text-sm
                        mt-3
                        leading-6
                      "
                    >
                      {t.viewerDescription}
                    </p>
                  </div>
                </div>
              )}

              {status ===
                "succeeded" &&
                modelUrl && (
                <>
                  <div
                    ref={
                      viewerRef
                    }
                    className="
                      absolute
                      inset-0
                      cursor-grab
                      active:cursor-grabbing
                    "
                  />

                  <div
                    className="
                      absolute
                      right-4
                      top-4
                      z-20
                      flex
                      flex-col
                      gap-2
                    "
                  >
                    <ViewerButton
                      label="Zoom in"
                      onClick={
                        zoomIn
                      }
                    >
                      <ZoomIn className="w-4 h-4" />
                    </ViewerButton>

                    <ViewerButton
                      label="Zoom out"
                      onClick={
                        zoomOut
                      }
                    >
                      <ZoomOut className="w-4 h-4" />
                    </ViewerButton>

                    <ViewerButton
                      label="Reset model"
                      onClick={
                        resetModel
                      }
                    >
                      <RotateCcw className="w-4 h-4" />
                    </ViewerButton>
                  </div>

                  <div
                    className="
                      absolute
                      left-4
                      bottom-4
                      z-20
                    "
                  >
                    <a
                      href={`/api/meshy-model?url=${encodeURIComponent(modelUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        bg-[#94492d]
                        hover:bg-[#773319]
                        text-white
                        px-4
                        py-3
                        text-[10px]
                        uppercase
                        tracking-[0.12em]
                        font-bold
                        flex
                        items-center
                        gap-2
                        transition-colors
                      "
                    >
                      {t.openModel}

                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* WORKFLOW */}

            <section
              className="
                border
                border-[#c4c7c7]
                dark:border-[#3b3531]
                border-t-0
                bg-white
                dark:bg-[#1c1917]
                p-6
                md:p-8
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-8
                "
              >
                <WorkflowStep
                  number="01"
                  title={
                    t.uploadStep
                  }
                  description={
                    t.uploadStepText
                  }
                />

                <WorkflowStep
                  number="02"
                  title={
                    t.generateStep
                  }
                  description={
                    t.generateStepText
                  }
                />

                <WorkflowStep
                  number="03"
                  title={
                    t.exploreStep
                  }
                  description={
                    t.exploreStepText
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
};

/* =========================================================
   VIEWER BUTTON
========================================================= */

interface ViewerButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

const ViewerButton:
React.FC<ViewerButtonProps> = ({
  label,
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="
        w-10
        h-10
        bg-black/70
        text-white
        border
        border-white/20
        flex
        items-center
        justify-center
        hover:bg-black
        transition-colors
      "
    >
      {children}
    </button>
  );
};

/* =========================================================
   WORKFLOW STEP
========================================================= */

interface WorkflowStepProps {
  number: string;
  title: string;
  description: string;
}

const WorkflowStep:
React.FC<WorkflowStepProps> = ({
  number,
  title,
  description,
}) => {
  return (
    <div>
      <span
        className="
          text-[#94492d]
          dark:text-[#d97955]
          text-xs
          font-bold
        "
      >
        {number}
      </span>

      <h3
        className="
          font-display
          text-lg
          font-bold
          mt-2
        "
      >
        {title}
      </h3>

      <p
        className="
          text-xs
          text-[#747878]
          dark:text-[#aaa39c]
          mt-2
          leading-6
        "
      >
        {description}
      </p>
    </div>
  );
};

export default ThreeDHeritagePage;