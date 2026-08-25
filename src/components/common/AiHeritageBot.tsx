import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bot,
  Loader2,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

import {
  useLanguage,
} from "../../context/LanguageContext";

/* =========================================================
   TYPES
========================================================= */

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

interface ChatApiResponse {
  status?: string;
  reply?: string;
  language?: string;
  detail?: string;
}

/* =========================================================
   SPEECH RECOGNITION TYPES
========================================================= */

type SpeechRecognitionConstructor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;

  onresult:
    | ((
        event: any
      ) => void)
    | null;

  onerror:
    | ((
        event: any
      ) => void)
    | null;

  onend:
    | (() => void)
    | null;
};

declare global {
  interface Window {
    SpeechRecognition?:
      SpeechRecognitionConstructor;

    webkitSpeechRecognition?:
      SpeechRecognitionConstructor;
  }
}

/* =========================================================
   API
========================================================= */

const AI_CHAT_URL =
  "http://127.0.0.1:8000/api/ai/chat/";

/* =========================================================
   COMPONENT
========================================================= */

const AiHeritageBot:
React.FC = () => {
  const {
    language,
  } =
    useLanguage();

  const isOdia =
    language === "or";

  const [
    open,
    setOpen,
  ] =
    useState(false);

  const [
    input,
    setInput,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    listening,
    setListening,
  ] =
    useState(false);

  const [
    speaking,
    setSpeaking,
  ] =
    useState(false);

  const [
    voiceEnabled,
    setVoiceEnabled,
  ] =
    useState(true);

  const [
    speechSupported,
    setSpeechSupported,
  ] =
    useState(true);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const recognitionRef =
    useRef<any>(
      null
    );

  const [
    messages,
    setMessages,
  ] =
    useState<Message[]>([
      {
        id: 1,
        role:
          "assistant",
        text:
          language === "or"
            ? "ନମସ୍କାର! ମୁଁ HeritageHub AI ସହାୟକ। ଓଡ଼ିଶାର ଐତିହ୍ୟ, କଳା, ସଂସ୍କୃତି, ନୃତ୍ୟ, ସଙ୍ଗୀତ କିମ୍ବା ପରମ୍ପରା ବିଷୟରେ ମୋତେ ପଚାରନ୍ତୁ।"
            : "Hello! I am the HeritageHub AI Assistant. Ask me about Odisha's heritage, art, culture, dance, music or traditions.",
      },
    ]);

  /* =======================================================
     LANGUAGE-SENSITIVE WELCOME MESSAGE
  ======================================================= */

  useEffect(
    () => {
      setMessages(
        (
          current
        ) => {
          if (
            current.length !==
            1
          ) {
            return current;
          }

          return [
            {
              id: 1,
              role:
                "assistant",
              text:
                isOdia
                  ? "ନମସ୍କାର! ମୁଁ HeritageHub AI ସହାୟକ। ଓଡ଼ିଶାର ଐତିହ୍ୟ, କଳା, ସଂସ୍କୃତି, ନୃତ୍ୟ, ସଙ୍ଗୀତ କିମ୍ବା ପରମ୍ପରା ବିଷୟରେ ମୋତେ ପଚାରନ୍ତୁ।"
                  : "Hello! I am the HeritageHub AI Assistant. Ask me about Odisha's heritage, art, culture, dance, music or traditions.",
            },
          ];
        }
      );
    },
    [
      isOdia,
    ]
  );

  /* =======================================================
     AUTO-SCROLL
  ======================================================= */

  useEffect(
    () => {
      messagesEndRef
        .current
        ?.scrollIntoView(
          {
            behavior:
              "smooth",
          }
        );
    },
    [
      messages,
      loading,
    ]
  );

  /* =======================================================
     SPEECH SYNTHESIS
  ======================================================= */

  const stopSpeaking =
    () => {
      if (
        "speechSynthesis" in
        window
      ) {
        window.speechSynthesis.cancel();
      }

      setSpeaking(
        false
      );
    };

  const speakText =
    (
      text: string
    ) => {
      if (
        !voiceEnabled ||
        !text ||
        !(
          "speechSynthesis" in
          window
        )
      ) {
        return;
      }

      stopSpeaking();

      const utterance =
        new SpeechSynthesisUtterance(
          text
        );

      utterance.lang =
        isOdia
          ? "or-IN"
          : "en-IN";

      utterance.rate =
        0.95;

      utterance.pitch =
        1;

      const voices =
        window.speechSynthesis.getVoices();

      if (
        voices.length >
        0
      ) {
        const exactVoice =
          voices.find(
            (
              voice
            ) =>
              voice.lang
                .toLowerCase()
                .startsWith(
                  isOdia
                    ? "or"
                    : "en-in"
                )
          );

        const englishFallback =
          voices.find(
            (
              voice
            ) =>
              voice.lang
                .toLowerCase()
                .startsWith(
                  "en"
                )
          );

        if (
          exactVoice
        ) {
          utterance.voice =
            exactVoice;
        } else if (
          !isOdia &&
          englishFallback
        ) {
          utterance.voice =
            englishFallback;
        }
      }

      utterance.onstart =
        () => {
          setSpeaking(
            true
          );
        };

      utterance.onend =
        () => {
          setSpeaking(
            false
          );
        };

      utterance.onerror =
        () => {
          setSpeaking(
            false
          );
        };

      window.speechSynthesis.speak(
        utterance
      );
    };

  /* =======================================================
     ADD ASSISTANT MESSAGE
  ======================================================= */

  const addAssistantMessage =
    (
      text: string,
      shouldSpeak =
        true
    ) => {
      const assistantMessage:
      Message = {
        id:
          Date.now() +
          Math.floor(
            Math.random() *
              1000
          ),

        role:
          "assistant",

        text,
      };

      setMessages(
        (
          current
        ) => [
          ...current,
          assistantMessage,
        ]
      );

      if (
        shouldSpeak
      ) {
        speakText(
          text
        );
      }
    };

  /* =======================================================
     REAL DJANGO + GEMINI CHAT
  ======================================================= */

  const sendMessage =
    async (
      rawMessage:
        string
    ) => {
      const message =
        rawMessage.trim();

      if (
        !message ||
        loading
      ) {
        return;
      }

      stopSpeaking();

      const userMessage:
      Message = {
        id:
          Date.now(),

        role:
          "user",

        text:
          message,
      };

      setMessages(
        (
          current
        ) => [
          ...current,
          userMessage,
        ]
      );

      setInput(
        ""
      );

      setLoading(
        true
      );

      try {
        const response =
          await fetch(
            AI_CHAT_URL,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    message,

                    language:
                      isOdia
                        ? "odia"
                        : "english",
                  }
                ),
            }
          );

        let data:
        ChatApiResponse = {};

        try {
          data =
            await response.json();
        } catch {
          data = {};
        }

        /*
         * This supports both:
         * 1. normal success response
         * 2. your graceful 429 fallback response
         *
         * {
         *   status: "temporary_unavailable",
         *   reply: "..."
         * }
         */
        if (
          data.reply
        ) {
          addAssistantMessage(
            data.reply
          );

          return;
        }

        if (
          response.status ===
          429
        ) {
          addAssistantMessage(
            isOdia
              ? "HeritageHub AI ର ମାଗଣା Gemini ସୀମା ବର୍ତ୍ତମାନ ପୂର୍ଣ୍ଣ ହୋଇଛି। ଦୟାକରି କିଛି ସମୟ ପରେ ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।"
              : "HeritageHub AI has reached its temporary Gemini free-tier limit. Please try again shortly.",
            false
          );

          return;
        }

        throw new Error(
          data.detail ||
            `AI request failed (${response.status})`
        );
      } catch (
        error
      ) {
        console.error(
          "HeritageHub AI chat error:",
          error
        );

        addAssistantMessage(
          isOdia
            ? "AI ସେବା ସହିତ ଯୋଗାଯୋଗ କରିହେଲା ନାହିଁ। Django ସର୍ଭର୍ ଚାଲୁ ଅଛି କି ନାହିଁ ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।"
            : "I could not connect to the AI service. Check that the Django server is running and try again.",
          false
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  const handleSend =
    async () => {
      await sendMessage(
        input
      );
    };

  /* =======================================================
     MICROPHONE / SPEECH RECOGNITION
  ======================================================= */

  const stopListening =
    () => {
      if (
        recognitionRef.current
      ) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore already-stopped recognition.
        }
      }

      setListening(
        false
      );
    };

  const startListening =
    () => {
      if (
        loading
      ) {
        return;
      }

      stopSpeaking();

      const Recognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (
        !Recognition
      ) {
        setSpeechSupported(
          false
        );

        addAssistantMessage(
          isOdia
            ? "ଏହି ବ୍ରାଉଜରରେ ଭଏସ୍ ଇନପୁଟ୍ ସମର୍ଥିତ ନୁହେଁ। Chrome କିମ୍ବା Edge ବ୍ୟବହାର କରନ୍ତୁ।"
            : "Voice input is not supported in this browser. Please use Chrome or Edge.",
          false
        );

        return;
      }

      setSpeechSupported(
        true
      );

      const recognition =
        new Recognition();

      recognitionRef.current =
        recognition;

      recognition.lang =
        isOdia
          ? "or-IN"
          : "en-IN";

      recognition.interimResults =
        false;

      recognition.continuous =
        false;

      recognition.onresult =
        (
          event:
            any
        ) => {
          const transcript =
            event.results?.[0]?.[0]?.transcript?.trim?.() ||
            "";

          if (
            transcript
          ) {
            setInput(
              transcript
            );

            /*
             * Voice assistant behavior:
             * once speech is recognized, send it immediately.
             */
            sendMessage(
              transcript
            );
          }
        };

      recognition.onerror =
        (
          event:
            any
        ) => {
          console.error(
            "Speech recognition error:",
            event
          );

          setListening(
            false
          );

          if (
            event?.error ===
            "not-allowed"
          ) {
            addAssistantMessage(
              isOdia
                ? "ମାଇକ୍ରୋଫୋନ୍ ଅନୁମତି ଦିଆଯାଇନାହିଁ। ବ୍ରାଉଜରରେ microphone permission Allow କରନ୍ତୁ।"
                : "Microphone permission was blocked. Allow microphone access in your browser and try again.",
              false
            );
          }
        };

      recognition.onend =
        () => {
          setListening(
            false
          );
        };

      try {
        recognition.start();

        setListening(
          true
        );
      } catch (
        error
      ) {
        console.error(
          "Unable to start microphone:",
          error
        );

        setListening(
          false
        );
      }
    };

  const toggleListening =
    () => {
      if (
        listening
      ) {
        stopListening();
      } else {
        startListening();
      }
    };

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(
    () => {
      return () => {
        if (
          recognitionRef.current
        ) {
          try {
            recognitionRef.current.abort();
          } catch {
            // ignore
          }
        }

        if (
          "speechSynthesis" in
          window
        ) {
          window.speechSynthesis.cancel();
        }
      };
    },
    []
  );

  /* =======================================================
     CLOSE
  ======================================================= */

  const handleClose =
    () => {
      stopListening();

      stopSpeaking();

      setOpen(
        false
      );
    };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* ===================================================
          FLOATING BUTTON
      =================================================== */}

      {!open && (
        <button
          type="button"
          onClick={() =>
            setOpen(
              true
            )
          }
          className="
            fixed

            right-6
            bottom-6

            z-[90]

            w-14
            h-14

            rounded-full

            bg-[#94492d]
            hover:bg-[#773319]

            dark:bg-[#d97955]
            dark:hover:bg-[#cf6944]

            text-white

            shadow-2xl

            flex
            items-center
            justify-center

            transition-all

            hover:scale-105
          "
          aria-label={
            isOdia
              ? "AI ସହାୟକ ଖୋଲନ୍ତୁ"
              : "Open AI Assistant"
          }
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* ===================================================
          CHAT PANEL
      =================================================== */}

      {open && (
        <div
          className="
            fixed

            right-4
            bottom-4

            sm:right-6
            sm:bottom-6

            z-[100]

            w-[calc(100vw-32px)]
            sm:w-[410px]

            h-[610px]
            max-h-[84vh]

            bg-[#faf9f5]
            dark:bg-[#171614]

            border
            border-[#c4c7c7]
            dark:border-[#3b3531]

            shadow-2xl

            flex
            flex-col

            overflow-hidden

            rounded-2xl
          "
        >
          {/* ===============================================
              HEADER
          =============================================== */}

          <div
            className="
              px-5
              py-4

              bg-[#1b1c1a]
              dark:bg-[#0d0c0b]

              text-white

              flex
              items-center
              justify-between

              shrink-0
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  w-10
                  h-10

                  rounded-full

                  bg-[#94492d]

                  flex
                  items-center
                  justify-center
                "
              >
                <Bot className="w-5 h-5" />
              </div>

              <div>
                <h3
                  className="
                    font-display
                    font-bold

                    text-[16px]
                  "
                >
                  {isOdia
                    ? "HeritageHub AI ସହାୟକ"
                    : "HeritageHub AI Assistant"}
                </h3>

                <div
                  className="
                    flex
                    items-center
                    gap-2

                    mt-0.5
                  "
                >
                  <span
                    className={`
                      w-2
                      h-2

                      rounded-full

                      ${
                        listening
                          ? "bg-red-500 animate-pulse"
                          : speaking
                          ? "bg-[#cca730] animate-pulse"
                          : loading
                          ? "bg-orange-400 animate-pulse"
                          : "bg-green-500"
                      }
                    `}
                  />

                  <span
                    className="
                      text-[10px]

                      uppercase
                      tracking-wider

                      text-[#c4c7c7]
                    "
                  >
                    {listening
                      ? isOdia
                        ? "ଶୁଣୁଛି..."
                        : "Listening..."
                      : loading
                      ? isOdia
                        ? "ଚିନ୍ତା କରୁଛି..."
                        : "Thinking..."
                      : speaking
                      ? isOdia
                        ? "କହୁଛି..."
                        : "Speaking..."
                      : isOdia
                      ? "ଅନଲାଇନ୍"
                      : "Online"}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-1
              "
            >
              {/* SPEAKER TOGGLE */}

              <button
                type="button"
                onClick={() => {
                  if (
                    voiceEnabled
                  ) {
                    stopSpeaking();
                  }

                  setVoiceEnabled(
                    (
                      current
                    ) =>
                      !current
                  );
                }}
                className="
                  w-8
                  h-8

                  flex
                  items-center
                  justify-center

                  hover:bg-white/10

                  rounded-full
                "
                title={
                  voiceEnabled
                    ? isOdia
                      ? "ଶବ୍ଦ ବନ୍ଦ କରନ୍ତୁ"
                      : "Mute AI voice"
                    : isOdia
                    ? "ଶବ୍ଦ ଚାଲୁ କରନ୍ତୁ"
                    : "Enable AI voice"
                }
              >
                {voiceEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              {/* CLOSE */}

              <button
                type="button"
                onClick={
                  handleClose
                }
                className="
                  w-8
                  h-8

                  flex
                  items-center
                  justify-center

                  hover:bg-white/10

                  rounded-full
                "
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ===============================================
              VOICE STATUS
          =============================================== */}

          {(listening ||
            speaking) && (
            <div
              className="
                px-4
                py-2.5

                bg-[#94492d]/10
                dark:bg-[#d97955]/10

                border-b
                border-[#c4c7c7]/60
                dark:border-[#3b3531]

                text-[11px]
                font-semibold

                text-[#94492d]
                dark:text-[#d97955]

                flex
                items-center
                justify-center
                gap-2

                shrink-0
              "
            >
              {listening ? (
                <>
                  <Mic className="w-4 h-4 animate-pulse" />

                  {isOdia
                    ? "ମୁଁ ଶୁଣୁଛି — କହନ୍ତୁ..."
                    : "I'm listening — speak now..."}
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse" />

                  {isOdia
                    ? "AI ଉତ୍ତର କହୁଛି..."
                    : "AI is speaking..."}
                </>
              )}
            </div>
          )}

          {/* ===============================================
              MESSAGES
          =============================================== */}

          <div
            className="
              flex-1

              overflow-y-auto

              px-4
              py-5

              space-y-4
            "
          >
            {messages.map(
              (
                message
              ) => (
                <div
                  key={
                    message.id
                  }
                  className={`
                    flex

                    ${
                      message.role ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }
                  `}
                >
                  <div
                    className={`
                      max-w-[84%]

                      px-4
                      py-3

                      text-[13px]
                      leading-6

                      whitespace-pre-wrap

                      ${
                        message.role ===
                        "user"
                          ? `
                            bg-[#94492d]
                            dark:bg-[#d97955]

                            text-white

                            rounded-2xl
                            rounded-br-sm
                          `
                          : `
                            bg-[#efeeea]
                            dark:bg-[#24201d]

                            text-[#1b1c1a]
                            dark:text-[#f3eee7]

                            rounded-2xl
                            rounded-bl-sm
                          `
                      }
                    `}
                  >
                    {
                      message.text
                    }

                    {message.role ===
                      "assistant" &&
                      voiceEnabled && (
                        <button
                          type="button"
                          onClick={() =>
                            speakText(
                              message.text
                            )
                          }
                          className="
                            mt-2

                            flex
                            items-center
                            gap-1

                            text-[10px]
                            font-semibold

                            text-[#94492d]
                            dark:text-[#d97955]
                          "
                        >
                          <Volume2 className="w-3 h-3" />

                          {isOdia
                            ? "ଶୁଣନ୍ତୁ"
                            : "Listen"}
                        </button>
                      )}
                  </div>
                </div>
              )
            )}

            {loading && (
              <div
                className="
                  flex
                  justify-start
                "
              >
                <div
                  className="
                    bg-[#efeeea]
                    dark:bg-[#24201d]

                    px-4
                    py-3

                    rounded-2xl
                    rounded-bl-sm

                    flex
                    items-center
                    gap-2
                  "
                >
                  <Loader2
                    className="
                      w-4
                      h-4

                      animate-spin

                      text-[#94492d]
                      dark:text-[#d97955]
                    "
                  />

                  <span
                    className="
                      text-[11px]

                      text-[#747878]
                      dark:text-[#aaa39c]
                    "
                  >
                    {isOdia
                      ? "HeritageHub AI ଉତ୍ତର ତିଆରି କରୁଛି..."
                      : "HeritageHub AI is preparing a response..."}
                  </span>
                </div>
              </div>
            )}

            <div
              ref={
                messagesEndRef
              }
            />
          </div>

          {/* ===============================================
              INPUT
          =============================================== */}

          <div
            className="
              border-t
              border-[#c4c7c7]
              dark:border-[#3b3531]

              bg-white
              dark:bg-[#1c1917]

              p-3

              shrink-0
            "
          >
            {/* MICROPHONE SUPPORT WARNING */}

            {!speechSupported && (
              <p
                className="
                  mb-2

                  text-[10px]
                  text-red-600
                  dark:text-red-400
                "
              >
                {isOdia
                  ? "ଭଏସ୍ ଇନପୁଟ୍ ପାଇଁ Chrome କିମ୍ବା Edge ବ୍ୟବହାର କରନ୍ତୁ।"
                  : "Use Chrome or Edge for voice input."}
              </p>
            )}

            <div
              className="
                flex
                items-end
                gap-2
              "
            >
              <textarea
                value={
                  input
                }
                onChange={(
                  event
                ) =>
                  setInput(
                    event.target.value
                  )
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                      "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();

                    handleSend();
                  }
                }}
                placeholder={
                  listening
                    ? isOdia
                      ? "ଶୁଣୁଛି..."
                      : "Listening..."
                    : isOdia
                    ? "ଐତିହ୍ୟ ବିଷୟରେ ପଚାରନ୍ତୁ..."
                    : "Ask about Odisha heritage..."
                }
                rows={
                  1
                }
                disabled={
                  loading
                }
                className="
                  flex-1

                  max-h-28

                  resize-none

                  border
                  border-[#c4c7c7]
                  dark:border-[#3b3531]

                  bg-[#faf9f5]
                  dark:bg-[#24201d]

                  text-[#1b1c1a]
                  dark:text-[#f3eee7]

                  px-4
                  py-3

                  text-sm

                  outline-none

                  focus:border-[#94492d]
                  dark:focus:border-[#d97955]

                  disabled:opacity-60

                  rounded-xl
                "
              />

              {/* MICROPHONE */}

              <button
                type="button"
                onClick={
                  toggleListening
                }
                disabled={
                  loading
                }
                className={`
                  w-11
                  h-11

                  shrink-0

                  rounded-xl

                  flex
                  items-center
                  justify-center

                  transition-all

                  disabled:opacity-40

                  ${
                    listening
                      ? `
                        bg-red-600
                        hover:bg-red-700

                        text-white

                        animate-pulse
                      `
                      : `
                        bg-[#efeeea]
                        hover:bg-[#dfddd6]

                        dark:bg-[#24201d]
                        dark:hover:bg-[#302b27]

                        text-[#94492d]
                        dark:text-[#d97955]

                        border
                        border-[#c4c7c7]
                        dark:border-[#3b3531]
                      `
                  }
                `}
                title={
                  listening
                    ? isOdia
                      ? "ଶୁଣିବା ବନ୍ଦ କରନ୍ତୁ"
                      : "Stop listening"
                    : isOdia
                    ? "ମାଇକ୍ରୋଫୋନ୍"
                    : "Use microphone"
                }
              >
                {listening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              {/* SEND */}

              <button
                type="button"
                onClick={
                  handleSend
                }
                disabled={
                  !input.trim() ||
                  loading
                }
                className="
                  w-11
                  h-11

                  shrink-0

                  rounded-xl

                  bg-[#94492d]
                  hover:bg-[#773319]

                  dark:bg-[#d97955]
                  dark:hover:bg-[#cf6944]

                  text-white

                  flex
                  items-center
                  justify-center

                  disabled:opacity-40
                "
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* BOTTOM STATUS */}

            <div
              className="
                mt-2

                flex
                items-center
                justify-between

                gap-3
              "
            >
              <p
                className="
                  text-[9px]

                  text-[#747878]
                  dark:text-[#aaa39c]
                "
              >
                {isOdia
                  ? "HeritageHub AI • ଓଡ଼ିଆ ଏବଂ ଇଂରାଜୀ"
                  : "HeritageHub AI • English & Odia"}
              </p>

              <p
                className="
                  text-[9px]

                  text-[#747878]
                  dark:text-[#aaa39c]
                "
              >
                {isOdia
                  ? "🎤 କହନ୍ତୁ • 🔊 ଶୁଣନ୍ତୁ"
                  : "🎤 Speak • 🔊 Listen"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiHeritageBot;