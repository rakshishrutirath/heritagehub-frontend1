import React, { useEffect, useState } from "react";

import {
  api,
  Category,
  Language,
  Location,
  HeritageRecord,
} from "../services/api";

import { useLanguage } from "../context/LanguageContext";

import {
  Upload,
  CheckCircle,
  ShieldCheck,
  Image as ImageIcon,
  Mic,
  FileText,
  QrCode,
  Sparkles,
  LogIn,
} from "lucide-react";

export const ContributePage: React.FC = () => {
  const { language: siteLanguage } = useLanguage();
  const isOdia = siteLanguage === "or";

  // =========================================================
  // STATE
  // =========================================================

  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // IMPORTANT:
  // Select values are strings in HTML.
  // Convert them to numbers only when submitting.
  const [category, setCategory] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const [consentGiven, setConsentGiven] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [error, setError] = useState("");

  const [successRecord, setSuccessRecord] =
    useState<HeritageRecord | null>(null);

  // =========================================================
  // TRANSLATIONS
  // =========================================================

  const t = {
    eyebrow: isOdia
      ? "ଐତିହ୍ୟ ଅବଦାନ"
      : "HERITAGE CONTRIBUTION",

    heading: isOdia
      ? "ସାଂସ୍କୃତିକ ଐତିହ୍ୟ ଯୋଗଦାନ କରନ୍ତୁ"
      : "Contribute Cultural Heritage",

    description: isOdia
      ? "ସଂରକ୍ଷଣ ଏବଂ ସମୁଦାୟ ଯାଞ୍ଚ ପାଇଁ ଏକ ଐତିହ୍ୟ ରେକର୍ଡ ଦାଖଲ କରନ୍ତୁ।"
      : "Submit a heritage record for preservation and community verification.",

    title: isOdia
      ? "ଐତିହ୍ୟ ଶୀର୍ଷକ"
      : "Heritage Title",

    titlePlaceholder: isOdia
      ? "ଉଦାହରଣ: କୋଟପାଡ଼ ପ୍ରାକୃତିକ ରଙ୍ଗ ବୁଣାକାମ"
      : "e.g. Kotpad Natural Dye Weaving",

    recordDescription: isOdia
      ? "ବିବରଣୀ"
      : "Description",

    descriptionPlaceholder: isOdia
      ? "ସାଂସ୍କୃତିକ ଐତିହ୍ୟ, ପରମ୍ପରା, ବସ୍ତୁ, ପ୍ରଥା କିମ୍ବା କାହାଣୀ ବିଷୟରେ ବର୍ଣ୍ଣନା କରନ୍ତୁ..."
      : "Describe the cultural heritage, tradition, object, practice or story...",

    category: isOdia ? "ବର୍ଗ" : "Category",

    language: isOdia ? "ଭାଷା" : "Language",

    location: isOdia ? "ସ୍ଥାନ" : "Location",

    selectCategory: isOdia
      ? "ବର୍ଗ ବାଛନ୍ତୁ"
      : "Select Category",

    selectLanguage: isOdia
      ? "ଭାଷା ବାଛନ୍ତୁ"
      : "Select Language",

    selectLocation: isOdia
      ? "ସ୍ଥାନ ବାଛନ୍ତୁ"
      : "Select Location",

    image: isOdia ? "ଛବି" : "Image",

    audio: isOdia ? "ଅଡିଓ" : "Audio",

    chooseImage: isOdia
      ? "ଛବି ବାଛନ୍ତୁ"
      : "Choose Image",

    chooseAudio: isOdia
      ? "ଅଡିଓ ବାଛନ୍ତୁ"
      : "Choose Audio",

    consent: isOdia
      ? "ସମ୍ମତି"
      : "Consent Given",

    consentDescription: isOdia
      ? "ସାଂସ୍କୃତିକ ସଂରକ୍ଷଣ ପାଇଁ ଏହି ଐତିହ୍ୟ ସାମଗ୍ରୀକୁ HeritageHub ରେ ସଂରକ୍ଷଣ ଏବଂ ବ୍ୟବହାର କରିବାକୁ ମୁଁ ସମ୍ମତି ଦେଉଛି।"
      : "I consent to this heritage material being stored and used by HeritageHub for cultural preservation.",

    submit: isOdia
      ? "ଐତିହ୍ୟ ରେକର୍ଡ ଦାଖଲ କରନ୍ତୁ"
      : "Submit Heritage Record",

    submitting: isOdia
      ? "ଦାଖଲ ହେଉଛି..."
      : "Submitting...",

    workflow: isOdia
      ? "ସଂରକ୍ଷଣ ପ୍ରକ୍ରିୟା"
      : "Preservation Workflow",

    workflowOne: isOdia
      ? "୧. ରେକର୍ଡ ଦାଖଲ"
      : "1. Submit Record",

    workflowOneText: isOdia
      ? "ଶୀର୍ଷକ, ବିବରଣୀ, ବର୍ଗ, ଭାଷା, ସ୍ଥାନ, ଛବି ଏବଂ ଅଡିଓ Django କୁ ପଠାଯାଏ।"
      : "Your title, description, category, language, location, image and audio are sent to Django.",

    workflowTwo: isOdia
      ? "୨. AI ସହାୟତା"
      : "2. AI Assistance",

    workflowTwoText: isOdia
      ? "HeritageHub ରେକର୍ଡ ପାଇଁ ସାରାଂଶ, ଟ୍ୟାଗ ଏବଂ ଅନୁବାଦ ସୃଷ୍ଟି କରିପାରିବ।"
      : "HeritageHub can generate summary, tags and translation for the record.",

    workflowThree: isOdia
      ? "୩. ସମୁଦାୟ ଯାଞ୍ଚ"
      : "3. Community Review",

    workflowThreeText: isOdia
      ? "ରେକର୍ଡଟି ଅନୁମୋଦନ, ପ୍ରତ୍ୟାଖ୍ୟାନ କିମ୍ବା ସଂଶୋଧନ ପାଇଁ ପଠାଯାଇପାରିବ।"
      : "The record can be approved, rejected or sent for correction.",

    submitted: isOdia
      ? "ଐତିହ୍ୟ ରେକର୍ଡ ଦାଖଲ ହୋଇଛି"
      : "Heritage Record Submitted",

    submittedDescription: isOdia
      ? "ଆପଣଙ୍କ ଐତିହ୍ୟ ରେକର୍ଡ Django backend କୁ ସଫଳତାର ସହ ପଠାଯାଇଛି।"
      : "Your heritage record was submitted to the Django backend successfully.",

    recordId: isOdia ? "ରେକର୍ଡ ID" : "Record ID",

    status: isOdia ? "ସ୍ଥିତି" : "Status",

    aiSummary: isOdia ? "AI ସାରାଂଶ" : "AI Summary",

    aiTags: isOdia ? "AI ଟ୍ୟାଗ" : "AI Tags",

    aiTranslation: isOdia
      ? "AI ଅନୁବାଦ"
      : "AI Translation",

    qrCode: isOdia ? "QR କୋଡ୍" : "QR Code",

    submitAnother: isOdia
      ? "ଆଉ ଏକ ରେକର୍ଡ ଦାଖଲ କରନ୍ତୁ"
      : "Submit Another Record",

    loading: isOdia
      ? "ଲୋଡ୍ ହେଉଛି..."
      : "Loading...",

    loginRequired: isOdia
      ? "ଦାଖଲ କରିବା ପୂର୍ବରୁ ଦୟାକରି ଲଗଇନ୍ କରନ୍ତୁ।"
      : "Please log in before submitting a heritage record.",

    loginButton: isOdia
      ? "ଲଗଇନ୍ କରନ୍ତୁ"
      : "Log In",
  };

  // =========================================================
  // LOAD CATEGORIES / LANGUAGES / LOCATIONS
  // =========================================================

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        setError("");

        const [
          categoryData,
          languageData,
          locationData,
        ] = await Promise.all([
          api.getCategories(),
          api.getLanguages(),
          api.getLocations(),
        ]);

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : []
        );

        setLanguages(
          Array.isArray(languageData)
            ? languageData
            : []
        );

        setLocations(
          Array.isArray(locationData)
            ? locationData
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load contribution options:",
          err
        );

        setError(
          isOdia
            ? "ବର୍ଗ, ଭାଷା କିମ୍ବା ସ୍ଥାନ ଲୋଡ୍ କରିହେଲା ନାହିଁ।"
            : "Unable to load categories, languages or locations."
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [isOdia]);

  // =========================================================
  // CHECK LOGIN
  // =========================================================

  const checkAuthentication = (): boolean => {
    const accessToken =
      localStorage.getItem("hh_access_token") ||
      localStorage.getItem("access_token");

    return Boolean(accessToken);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    // -------------------------------------------------------
    // LOGIN
    // -------------------------------------------------------

    if (!checkAuthentication()) {
      setError(t.loginRequired);
      return;
    }

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!title.trim()) {
      setError(
        isOdia
          ? "ଶୀର୍ଷକ ଆବଶ୍ୟକ।"
          : "Title is required."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        isOdia
          ? "ବିବରଣୀ ଆବଶ୍ୟକ।"
          : "Description is required."
      );
      return;
    }

    if (!category) {
      setError(
        isOdia
          ? "ଦୟାକରି ବର୍ଗ ବାଛନ୍ତୁ।"
          : "Please select a category."
      );
      return;
    }

    if (!language) {
      setError(
        isOdia
          ? "ଦୟାକରି ଭାଷା ବାଛନ୍ତୁ।"
          : "Please select a language."
      );
      return;
    }

    if (!location) {
      setError(
        isOdia
          ? "ଦୟାକରି ସ୍ଥାନ ବାଛନ୍ତୁ।"
          : "Please select a location."
      );
      return;
    }

    if (!consentGiven) {
      setError(
        isOdia
          ? "ଦାଖଲ କରିବା ପୂର୍ବରୁ ସମ୍ମତି ଦେବା ଆବଶ୍ୟକ।"
          : "You must give consent before submitting."
      );
      return;
    }

    // -------------------------------------------------------
    // CONVERT SELECT VALUES TO NUMBERS
    // -------------------------------------------------------

    const categoryId = Number(category);
    const languageId = Number(language);
    const locationId = Number(location);

    if (
      !Number.isInteger(categoryId) ||
      categoryId <= 0
    ) {
      setError(
        isOdia
          ? "ଅବୈଧ ବର୍ଗ।"
          : "Invalid category."
      );
      return;
    }

    if (
      !Number.isInteger(languageId) ||
      languageId <= 0
    ) {
      setError(
        isOdia
          ? "ଅବୈଧ ଭାଷା।"
          : "Invalid language."
      );
      return;
    }

    if (
      !Number.isInteger(locationId) ||
      locationId <= 0
    ) {
      setError(
        isOdia
          ? "ଅବୈଧ ସ୍ଥାନ।"
          : "Invalid location."
      );
      return;
    }

    // -------------------------------------------------------
    // SUBMIT TO DJANGO
    // -------------------------------------------------------

    try {
      setSubmitting(true);

      console.log(
        "Submitting heritage record..."
      );

      console.log(
        "Authenticated:",
        checkAuthentication()
      );

      const result =
        await api.createHeritageRecord({
          title: title.trim(),

          description: description.trim(),

          category: categoryId,

          language: languageId,

          location: locationId,

          consent_given: consentGiven,

          image: image,

          audio: audio,
        });

      console.log(
        "Heritage record created:",
        result
      );

      setSuccessRecord(result);

    } catch (err: unknown) {
      console.error(
        "Heritage submission failed:",
        err
      );

      let message =
        "Unable to submit heritage record.";

      if (err instanceof Error) {
        message = err.message;
      }

      const lowerMessage =
        message.toLowerCase();

      if (
        lowerMessage.includes("401") ||
        lowerMessage.includes("authentication") ||
        lowerMessage.includes("credentials") ||
        lowerMessage.includes("unauthorized")
      ) {
        setError(
          isOdia
            ? "ଆପଣଙ୍କ ଲଗଇନ୍ ସେସନ୍ ସମାପ୍ତ ହୋଇଛି। ଦୟାକରି ପୁଣି ଲଗଇନ୍ କରନ୍ତୁ।"
            : "Your login session has expired. Please log in again."
        );

        return;
      }

      setError(
        message ||
          (isOdia
            ? "ଐତିହ୍ୟ ରେକର୍ଡ ଦାଖଲ କରିହେଲା ନାହିଁ।"
            : "Unable to submit heritage record.")
      );

    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {
    setTitle("");
    setDescription("");

    setCategory("");
    setLanguage("");
    setLocation("");

    setConsentGiven(false);

    setImage(null);
    setAudio(null);

    setError("");
    setSuccessRecord(null);
  };

  // =========================================================
  // SUCCESS SCREEN
  // =========================================================

  if (successRecord) {
    return (
      <div
        className="
          w-full min-h-screen
          bg-[#faf9f5]
          dark:bg-[#12100f]
          text-[#1b1c1a]
          dark:text-[#f3eee7]
          px-5 md:px-16 py-16
        "
      >
        <div className="max-w-4xl mx-auto">
          <div
            className="
              bg-white
              dark:bg-[#1c1917]
              border border-[#c4c7c7]
              dark:border-[#3b3531]
              p-8 md:p-12
              shadow-sm
            "
          >
            <div
              className="
                w-16 h-16
                rounded-full
                bg-emerald-100
                dark:bg-emerald-950
                text-emerald-700
                dark:text-emerald-400
                flex items-center justify-center
              "
            >
              <CheckCircle className="w-9 h-9" />
            </div>

            <span
              className="
                block mt-7
                text-[11px]
                uppercase
                tracking-[0.16em]
                font-bold
                text-[#94492d]
              "
            >
              HeritageHub Archive
            </span>

            <h1
              className="
                font-display
                text-[34px]
                md:text-[46px]
                font-bold
                mt-2
              "
            >
              {t.submitted}
            </h1>

            <p
              className="
                text-[#444748]
                dark:text-[#aaa39c]
                mt-3
                leading-7
              "
            >
              {t.submittedDescription}
            </p>

            {/* RECORD INFO */}

            <div
              className="
                mt-8
                grid grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >
              <div
                className="
                  border border-[#c4c7c7]/60
                  dark:border-[#3b3531]
                  bg-[#faf9f5]
                  dark:bg-[#151311]
                  p-5
                "
              >
                <span
                  className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-[#747878]
                  "
                >
                  {t.recordId}
                </span>

                <div
                  className="
                    font-mono
                    text-sm
                    mt-2
                    break-all
                  "
                >
                  {successRecord.id}
                </div>
              </div>

              <div
                className="
                  border border-[#c4c7c7]/60
                  dark:border-[#3b3531]
                  bg-[#faf9f5]
                  dark:bg-[#151311]
                  p-5
                "
              >
                <span
                  className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    text-[#747878]
                  "
                >
                  {t.status}
                </span>

                <div
                  className="
                    font-bold
                    text-[#94492d]
                    mt-2
                    capitalize
                  "
                >
                  {successRecord.status}
                </div>
              </div>
            </div>

            {/* TITLE */}

            <div
              className="
                mt-8
                border-t
                border-[#c4c7c7]
                pt-7
              "
            >
              <h2
                className="
                  font-display
                  text-2xl
                  md:text-3xl
                  font-bold
                "
              >
                {successRecord.title}
              </h2>

              <p
                className="
                  text-[#444748]
                  dark:text-[#aaa39c]
                  leading-relaxed
                  mt-3
                "
              >
                {successRecord.description}
              </p>
            </div>

            {/* AI SUMMARY */}

            {successRecord.ai_summary && (
              <div
                className="
                  mt-7
                  border
                  border-[#c4c7c7]/60
                  dark:border-[#3b3531]
                  bg-[#faf9f5]
                  dark:bg-[#151311]
                  p-5
                "
              >
                <div
                  className="
                    flex items-center
                    gap-2
                    text-[#94492d]
                    text-xs
                    uppercase
                    tracking-wider
                    font-bold
                  "
                >
                  <Sparkles className="w-4 h-4" />
                  {t.aiSummary}
                </div>

                <p
                  className="
                    text-[#444748]
                    dark:text-[#aaa39c]
                    mt-3
                    leading-relaxed
                  "
                >
                  {successRecord.ai_summary}
                </p>
              </div>
            )}

            {/* AI TAGS */}

            {successRecord.ai_tags && (
              <div
                className="
                  mt-5
                  border
                  border-[#c4c7c7]/60
                  dark:border-[#3b3531]
                  bg-[#faf9f5]
                  dark:bg-[#151311]
                  p-5
                "
              >
                <span
                  className="
                    text-xs
                    uppercase
                    tracking-wider
                    text-[#94492d]
                    font-bold
                  "
                >
                  {t.aiTags}
                </span>

                <p
                  className="
                    text-[#444748]
                    dark:text-[#aaa39c]
                    mt-2
                  "
                >
                  {successRecord.ai_tags}
                </p>
              </div>
            )}

            {/* AI TRANSLATION */}

            {successRecord.ai_translation && (
              <div
                className="
                  mt-5
                  border
                  border-[#c4c7c7]/60
                  dark:border-[#3b3531]
                  bg-[#faf9f5]
                  dark:bg-[#151311]
                  p-5
                "
              >
                <span
                  className="
                    text-xs
                    uppercase
                    tracking-wider
                    text-[#94492d]
                    font-bold
                  "
                >
                  {t.aiTranslation}
                </span>

                <p
                  className="
                    text-[#444748]
                    dark:text-[#aaa39c]
                    mt-2
                  "
                >
                  {successRecord.ai_translation}
                </p>
              </div>
            )}

            {/* QR CODE */}

            {successRecord.qr_code && (
              <div
                className="
                  mt-7
                  border-t
                  border-[#c4c7c7]
                  pt-7
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mb-4
                  "
                >
                  <QrCode
                    className="
                      w-5 h-5
                      text-[#94492d]
                    "
                  />

                  <h3
                    className="
                      font-display
                      text-xl
                      font-bold
                    "
                  >
                    {t.qrCode}
                  </h3>
                </div>

                <div
                  className="
                    bg-white
                    inline-block
                    p-3
                  "
                >
                  <img
                    src={successRecord.qr_code}
                    alt="Heritage QR Code"
                    className="
                      w-40
                      h-40
                      object-contain
                    "
                  />
                </div>
              </div>
            )}

            {/* SUBMIT ANOTHER */}

            <button
              onClick={handleReset}
              className="
                mt-9
                bg-[#94492d]
                hover:bg-[#773319]
                text-white
                px-7 py-3.5
                text-xs
                uppercase
                tracking-wider
                font-bold
                transition-colors
              "
            >
              {t.submitAnother}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN FORM
  // =========================================================

  return (
    <div
      className="
        w-full min-h-screen
        bg-[#faf9f5]
        dark:bg-[#12100f]
        text-[#1b1c1a]
        dark:text-[#f3eee7]
        px-5 md:px-16
        py-14 md:py-20
      "
    >
      <div className="max-w-[1200px] mx-auto">

        {/* PAGE HEADER */}

        <div className="mb-12">
          <span
            className="
              text-[11px]
              uppercase
              tracking-[0.16em]
              text-[#94492d]
              font-bold
            "
          >
            {t.eyebrow}
          </span>

          <h1
            className="
              font-display
              text-[40px]
              md:text-[56px]
              lg:text-[64px]
              leading-[1.05]
              font-bold
              mt-3
              max-w-4xl
            "
          >
            {t.heading}
          </h1>

          <p
            className="
              text-[#444748]
              dark:text-[#aaa39c]
              text-[16px]
              md:text-[17px]
              max-w-2xl
              mt-5
              leading-7
            "
          >
            {t.description}
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="
              mb-7
              bg-red-50
              dark:bg-red-950/30
              border
              border-red-200
              dark:border-red-900
              text-red-700
              dark:text-red-300
              p-4
              text-sm
            "
          >
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-8
            items-start
          "
        >

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="
              lg:col-span-8
              bg-white
              dark:bg-[#1c1917]
              border
              border-[#c4c7c7]
              dark:border-[#3b3531]
              p-6
              md:p-9
              space-y-7
              shadow-sm
            "
          >

            {/* TITLE */}

            <div>
              <label
                className="
                  block
                  text-[11px]
                  uppercase
                  tracking-wider
                  font-bold
                  mb-2
                "
              >
                {t.title} *
              </label>

              <input
                type="text"
                required
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder={t.titlePlaceholder}
                className="
                  w-full
                  px-4 py-3.5
                  bg-[#faf9f5]
                  dark:bg-[#151311]
                  border
                  border-[#c4c7c7]
                  dark:border-[#3b3531]
                  focus:outline-none
                  focus:border-[#94492d]
                "
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label
                className="
                  block
                  text-[11px]
                  uppercase
                  tracking-wider
                  font-bold
                  mb-2
                "
              >
                {t.recordDescription} *
              </label>

              <textarea
                rows={6}
                required
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder={
                  t.descriptionPlaceholder
                }
                className="
                  w-full
                  px-4 py-3.5
                  bg-[#faf9f5]
                  dark:bg-[#151311]
                  border
                  border-[#c4c7c7]
                  dark:border-[#3b3531]
                  focus:outline-none
                  focus:border-[#94492d]
                  resize-y
                "
              />
            </div>

            {/* DROPDOWNS */}

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-4
              "
            >

              {/* CATEGORY */}

              <div>
                <label
                  className="
                    block
                    text-[11px]
                    uppercase
                    tracking-wider
                    font-bold
                    mb-2
                  "
                >
                  {t.category}
                </label>

                <select
                  value={category}
                  disabled={loadingOptions}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    px-4 py-3.5
                    bg-[#faf9f5]
                    dark:bg-[#151311]
                    border
                    border-[#c4c7c7]
                    dark:border-[#3b3531]
                    focus:outline-none
                  "
                >
                  <option value="">
                    {loadingOptions
                      ? t.loading
                      : t.selectCategory}
                  </option>

                  {categories.map((item) => (
                    <option
                      key={item.id}
                      value={String(item.id)}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* LANGUAGE */}

              <div>
                <label
                  className="
                    block
                    text-[11px]
                    uppercase
                    tracking-wider
                    font-bold
                    mb-2
                  "
                >
                  {t.language}
                </label>

                <select
                  value={language}
                  disabled={loadingOptions}
                  onChange={(event) =>
                    setLanguage(
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    px-4 py-3.5
                    bg-[#faf9f5]
                    dark:bg-[#151311]
                    border
                    border-[#c4c7c7]
                    dark:border-[#3b3531]
                    focus:outline-none
                  "
                >
                  <option value="">
                    {loadingOptions
                      ? t.loading
                      : t.selectLanguage}
                  </option>

                  {languages.map((item) => (
                    <option
                      key={item.id}
                      value={String(item.id)}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* LOCATION */}

              <div>
                <label
                  className="
                    block
                    text-[11px]
                    uppercase
                    tracking-wider
                    font-bold
                    mb-2
                  "
                >
                  {t.location}
                </label>

                <select
                  value={location}
                  disabled={loadingOptions}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    px-4 py-3.5
                    bg-[#faf9f5]
                    dark:bg-[#151311]
                    border
                    border-[#c4c7c7]
                    dark:border-[#3b3531]
                    focus:outline-none
                  "
                >
                  <option value="">
                    {loadingOptions
                      ? t.loading
                      : t.selectLocation}
                  </option>

                  {locations.map((item) => (
                    <option
                      key={item.id}
                      value={String(item.id)}
                    >
                      {item.village_or_area}
                      {" — "}
                      {item.district}
                      {", "}
                      {item.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* MEDIA */}

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >

              {/* IMAGE */}

              <div>
                <label
                  className="
                    block
                    text-[11px]
                    uppercase
                    tracking-wider
                    font-bold
                    mb-2
                  "
                >
                  {t.image}
                </label>

                <label
                  className="
                    min-h-[150px]
                    border-2
                    border-dashed
                    border-[#c4c7c7]
                    dark:border-[#48413c]
                    bg-[#faf9f5]
                    dark:bg-[#151311]
                    p-6
                    flex
                    flex-col
                    items-center
                    justify-center
                    cursor-pointer
                    hover:border-[#94492d]
                  "
                >
                  <ImageIcon
                    className="
                      w-8 h-8
                      text-[#94492d]
                    "
                  />

                  <span
                    className="
                      text-sm
                      font-semibold
                      mt-3
                      text-center
                    "
                  >
                    {image
                      ? image.name
                      : t.chooseImage}
                  </span>

                  <span
                    className="
                      text-[11px]
                      text-[#747878]
                      mt-2
                    "
                  >
                    JPG, PNG, WEBP
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      setImage(
                        event.target.files?.[0] ||
                          null
                      )
                    }
                  />
                </label>
              </div>

              {/* AUDIO */}

              <div>
                <label
                  className="
                    block
                    text-[11px]
                    uppercase
                    tracking-wider
                    font-bold
                    mb-2
                  "
                >
                  {t.audio}
                </label>

                <label
                  className="
                    min-h-[150px]
                    border-2
                    border-dashed
                    border-[#c4c7c7]
                    dark:border-[#48413c]
                    bg-[#faf9f5]
                    dark:bg-[#151311]
                    p-6
                    flex
                    flex-col
                    items-center
                    justify-center
                    cursor-pointer
                    hover:border-[#94492d]
                  "
                >
                  <Mic
                    className="
                      w-8 h-8
                      text-[#94492d]
                    "
                  />

                  <span
                    className="
                      text-sm
                      font-semibold
                      mt-3
                      text-center
                    "
                  >
                    {audio
                      ? audio.name
                      : t.chooseAudio}
                  </span>

                  <span
                    className="
                      text-[11px]
                      text-[#747878]
                      mt-2
                    "
                  >
                    MP3, WAV, M4A
                  </span>

                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(event) =>
                      setAudio(
                        event.target.files?.[0] ||
                          null
                      )
                    }
                  />
                </label>
              </div>
            </div>

            {/* CONSENT */}

            <div
              className="
                border
                border-[#c4c7c7]
                dark:border-[#3b3531]
                bg-[#efeeea]
                dark:bg-[#151311]
                p-5
              "
            >
              <label
                className="
                  flex
                  items-start
                  gap-3
                  cursor-pointer
                "
              >
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(event) =>
                    setConsentGiven(
                      event.target.checked
                    )
                  }
                  className="mt-1"
                />

                <div>
                  <div
                    className="
                      font-bold
                      text-sm
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <ShieldCheck
                      className="
                        w-4 h-4
                        text-[#94492d]
                      "
                    />

                    {t.consent}
                  </div>

                  <p
                    className="
                      text-xs
                      text-[#747878]
                      mt-2
                      leading-relaxed
                    "
                  >
                    {t.consentDescription}
                  </p>
                </div>
              </label>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={
                submitting ||
                loadingOptions
              }
              className="
                w-full
                bg-[#94492d]
                hover:bg-[#773319]
                disabled:opacity-50
                disabled:cursor-not-allowed
                text-white
                py-4
                text-xs
                uppercase
                tracking-[0.12em]
                font-bold
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <Upload className="w-4 h-4" />

              {submitting
                ? t.submitting
                : t.submit}
            </button>
          </form>

          {/* RIGHT SIDE */}

          <aside
            className="
              lg:col-span-4
              space-y-5
              lg:sticky
              lg:top-28
            "
          >

            {/* WORKFLOW */}

            <div
              className="
                bg-[#1c1b1b]
                text-white
                p-7
              "
            >
              <div
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.16em]
                  text-[#fd9e7b]
                  mb-3
                  font-bold
                "
              >
                HeritageHub
              </div>

              <h3
                className="
                  font-display
                  text-2xl
                  font-bold
                  flex
                  items-center
                  gap-2
                "
              >
                <FileText
                  className="
                    w-5 h-5
                    text-[#fd9e7b]
                  "
                />

                {t.workflow}
              </h3>

              <div
                className="
                  space-y-6
                  mt-7
                  text-sm
                "
              >

                <div>
                  <div className="font-bold">
                    {t.workflowOne}
                  </div>

                  <p
                    className="
                      text-[#c4c7c7]
                      text-xs
                      mt-2
                      leading-5
                    "
                  >
                    {t.workflowOneText}
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <div
                    className="
                      font-bold
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <Sparkles
                      className="
                        w-4 h-4
                        text-[#fd9e7b]
                      "
                    />

                    {t.workflowTwo}
                  </div>

                  <p
                    className="
                      text-[#c4c7c7]
                      text-xs
                      mt-2
                      leading-5
                    "
                  >
                    {t.workflowTwoText}
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <div className="font-bold">
                    {t.workflowThree}
                  </div>

                  <p
                    className="
                      text-[#c4c7c7]
                      text-xs
                      mt-2
                      leading-5
                    "
                  >
                    {t.workflowThreeText}
                  </p>
                </div>

              </div>
            </div>

            {/* ARCHIVE NOTE */}

            <div
              className="
                border
                border-[#c4c7c7]
                bg-[#efe1d7]
                p-6
              "
            >
              <ShieldCheck
                className="
                  w-6 h-6
                  text-[#94492d]
                "
              />

              <h4
                className="
                  font-display
                  text-xl
                  font-bold
                  mt-4
                "
              >
                {isOdia
                  ? "ଆପଣଙ୍କ ଐତିହ୍ୟକୁ ସଂରକ୍ଷଣ କରନ୍ତୁ"
                  : "Preserve Your Heritage"}
              </h4>

              <p
                className="
                  text-sm
                  text-[#5d5d59]
                  leading-6
                  mt-2
                "
              >
                {isOdia
                  ? "ଆଜି ଆପଣ ଯାହା ଡକ୍ୟୁମେଣ୍ଟ କରୁଛନ୍ତି, ତାହା ଆଗାମୀ ପିଢ଼ି ପାଇଁ ଓଡ଼ିଶାର ସାଂସ୍କୃତିକ ସ୍ମୃତିର ଅଂଶ ହୋଇପାରେ।"
                  : "What you document today can become part of Odisha's cultural memory for future generations."}
              </p>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default ContributePage;