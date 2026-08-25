import React, { useState } from 'react';

import { Artifact } from '../../types';
import { api } from '../../services/api';

import {
  X,
  Box,
  Volume2,
  VolumeX,
  Bookmark,
  Sparkles,
  Copy,
  Check,
  Share2,
  MapPin,
  Calendar,
  ShieldCheck,
  Layers,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface ArtifactDetailModalProps {
  artifact: Artifact | null;
  onClose: () => void;
  onOpen3D?: (artifactId: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (artifactId: string) => void;
  onAddToCanvas?: (artifact: Artifact) => void;
}

export const ArtifactDetailModal: React.FC<ArtifactDetailModalProps> = ({
  artifact,
  onClose,
  onOpen3D,
  isBookmarked = false,
  onToggleBookmark,
  onAddToCanvas,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'provenance' | 'curator' | 'citation' | 'ai'
  >('overview');

  const [copiedCitation, setCopiedCitation] = useState(false);

  const [citationFormat, setCitationFormat] = useState<
    'chicago' | 'mla' | 'apa'
  >('chicago');

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiTags, setAiTags] = useState('');
  const [aiTranslation, setAiTranslation] = useState('');

  if (!artifact) {
    return null;
  }

  const getCitationText = () => {
    switch (citationFormat) {
      case 'chicago':
        return `HeritageHub Digital Archive. "${artifact.title}." ${artifact.culture}, ${artifact.dateRange}. Catalog No. ${artifact.catalogNumber}.`;

      case 'mla':
        return `"${artifact.title}." HeritageHub Archive, ${artifact.culture}, ${artifact.dateRange}.`;

      case 'apa':
        return `HeritageHub Consortium. (${new Date().getFullYear()}). ${artifact.title} [Artifact].`;

      default:
        return artifact.title;
    }
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(getCitationText());

    setCopiedCitation(true);

    setTimeout(() => {
      setCopiedCitation(false);
    }, 2000);
  };

  const handleGenerateAi = async () => {
    try {
      setAiLoading(true);
      setAiError('');
      setActiveTab('ai');

      const response = await api.generateAiAssistance(artifact.id);

      console.log('AI assistance response:', response);

      setAiSummary(response.ai_summary || '');
      setAiTags(response.ai_tags || '');
      setAiTranslation(response.ai_translation || '');
    } catch (error) {
      console.error('AI assistance failed:', error);

      setAiError(
        error instanceof Error
          ? error.message
          : 'Unable to generate AI assistance.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  const toggleAudio = () => {
    setIsPlayingAudio((previous) => !previous);
  };
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/60
        flex
        items-center
        justify-center
        p-4
        overflow-y-auto
      "
    >
      <div
        className="
          bg-[#faf9f5]
          w-full
          max-w-5xl
          max-h-[92vh]
          overflow-hidden
          border
          border-[#c4c7c7]
          shadow-2xl
          flex
          flex-col
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-4
            border-b
            border-[#c4c7c7]
            bg-[#efeeea]
          "
        >
          <div className="flex items-center gap-3">
            <span
              className="
                px-2.5
                py-1
                bg-[#94492d]
                text-white
                text-[10px]
                font-bold
                uppercase
                tracking-wider
              "
            >
              {artifact.catalogNumber}
            </span>

            <span
              className="
                flex
                items-center
                gap-1
                text-[12px]
                text-[#444748]
              "
            >
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Verified Heritage Record
            </span>
          </div>

          <div className="flex items-center gap-2">

            {onToggleBookmark && (
              <button
                type="button"
                onClick={() =>
                  onToggleBookmark(artifact.id)
                }
                className={`
                  p-2
                  border
                  border-[#c4c7c7]
                  ${
                    isBookmarked
                      ? 'bg-[#94492d] text-white'
                      : 'bg-white text-[#1b1c1a]'
                  }
                `}
              >
                <Bookmark
                  className="w-4 h-4"
                  fill={
                    isBookmarked
                      ? 'currentColor'
                      : 'none'
                  }
                />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  window.location.href
                );

                alert(
                  'Heritage record link copied.'
                );
              }}
              className="
                p-2
                border
                border-[#c4c7c7]
                bg-white
              "
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="
                p-2
                border
                border-[#c4c7c7]
                bg-white
              "
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* MAIN CONTENT */}

        <div
          className="
            flex-1
            overflow-y-auto
            p-6
            md:p-8
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-8
          "
        >

          {/* LEFT SIDE */}

          <div
            className="
              lg:col-span-6
              flex
              flex-col
              gap-4
            "
          >

            <div
              className="
                relative
                aspect-[4/3]
                bg-[#1b1c1a]
                overflow-hidden
              "
            >

              {artifact.imageUrl ? (
                <img
                  src={artifact.imageUrl}
                  alt={artifact.title}
                  className="
                    w-full
                    h-full
                    object-cover
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
                    text-white/60
                  "
                >
                  No image available
                </div>
              )}

              <div
                className="
                  absolute
                  bottom-3
                  left-3
                  right-3
                  bg-black/70
                  text-white
                  px-3
                  py-2
                  flex
                  justify-between
                  gap-3
                  text-[11px]
                "
              >
                <span>
                  {artifact.dimensions}
                </span>

                <span className="text-[#fd9e7b]">
                  {artifact.medium}
                </span>
              </div>

            </div>

            {/* ACTION BUTTONS */}

            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >

              {artifact.threeDModelAvailable &&
                onOpen3D && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpen3D(artifact.id);
                  }}
                  className="
                    px-4
                    py-3
                    bg-[#94492d]
                    text-white
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Box className="w-4 h-4" />
                  Launch 3D
                </button>
              )}

              <button
                type="button"
                onClick={handleGenerateAi}
                disabled={aiLoading}
                className="
                  px-4
                  py-3
                  bg-[#1b1c1a]
                  text-white
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-wider
                  flex
                  items-center
                  gap-2
                  disabled:opacity-50
                "
              >
                {aiLoading ? (
                  <Loader2
                    className="
                      w-4
                      h-4
                      animate-spin
                    "
                  />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}

                {aiLoading
                  ? 'Generating AI'
                  : 'Consult AI Docent'}
              </button>

              {onAddToCanvas && (
                <button
                  type="button"
                  onClick={() =>
                    onAddToCanvas(artifact)
                  }
                  className="
                    px-4
                    py-3
                    bg-white
                    border
                    border-[#c4c7c7]
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Layers className="w-4 h-4" />
                  Canvas
                </button>
              )}

            </div>

            {/* AUDIO */}

            {artifact.audioGuideUrl && (
              <div
                className="
                  p-4
                  bg-[#efeeea]
                  border
                  border-[#c4c7c7]
                  flex
                  items-center
                  gap-3
                "
              >
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-[#94492d]
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                >
                  {isPlayingAudio ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                <div>
                  <div
                    className="
                      text-[12px]
                      font-semibold
                    "
                  >
                    Heritage Audio Guide
                  </div>

                  <div
                    className="
                      text-[11px]
                      text-[#747878]
                    "
                  >
                    {artifact.audioDuration ||
                      'Audio available'}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDE */}

          <div className="lg:col-span-6">

            <div
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#94492d]
              "
            >
              {artifact.culture}
              {' • '}
              {artifact.period}
            </div>

            <h2
              className="
                mt-2
                text-[30px]
                font-display
                font-bold
                leading-tight
              "
            >
              {artifact.title}
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-[#747878]
              "
            >
              {artifact.subtitle ||
                artifact.medium}
            </p>

            {/* TABS */}

            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-4
                border-b
                border-[#c4c7c7]
              "
            >

              {[
                ['overview', 'Overview'],
                ['provenance', 'Provenance'],
                ['curator', 'Curator'],
                ['ai', 'AI Docent'],
                ['citation', 'Citation'],
              ].map(([id, label]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() =>
                    setActiveTab(
                      id as
                        | 'overview'
                        | 'provenance'
                        | 'curator'
                        | 'citation'
                        | 'ai'
                    )
                  }
                  className={`
                    pb-3
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    ${
                      activeTab === id
                        ? 'text-[#94492d] border-b-2 border-[#94492d]'
                        : 'text-[#747878]'
                    }
                  `}
                >
                  {label}
                </button>
              ))}

            </div>  
                        {/* OVERVIEW */}

            {activeTab === 'overview' && (
              <div className="mt-5 space-y-4">
                <p className="text-[14px] leading-6 text-[#1b1c1a]">
                  {artifact.description}
                </p>

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-3
                    p-4
                    bg-[#efeeea]
                    border
                    border-[#c4c7c7]
                  "
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#747878]">
                      Date & Era
                    </div>

                    <div className="mt-1 text-sm">
                      {artifact.dateRange}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#747878]">
                      Origin
                    </div>

                    <div className="mt-1 text-sm">
                      {artifact.region}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#747878]">
                      Medium
                    </div>

                    <div className="mt-1 text-sm">
                      {artifact.medium}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#747878]">
                      Institution
                    </div>

                    <div className="mt-1 text-sm">
                      {artifact.institution}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PROVENANCE */}

            {activeTab === 'provenance' && (
              <div className="mt-5 space-y-5">
                <div>
                  <h3
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#94492d]
                    "
                  >
                    Provenance
                  </h3>

                  <p className="mt-2 text-sm leading-6">
                    {artifact.provenance}
                  </p>
                </div>

                <div>
                  <h3
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#94492d]
                    "
                  >
                    Historical Context
                  </h3>

                  <p className="mt-2 text-sm leading-6">
                    {artifact.historicalContext}
                  </p>
                </div>
              </div>
            )}

            {/* CURATOR */}

            {activeTab === 'curator' && (
              <div className="mt-5 space-y-4">
                <p className="text-sm leading-6">
                  {artifact.curatorNotes ||
                    'Verified by the HeritageHub archival review process.'}
                </p>

                <div className="flex flex-wrap gap-2">
                  {(artifact.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="
                        px-2.5
                        py-1
                        bg-[#efeeea]
                        border
                        border-[#c4c7c7]
                        text-[11px]
                      "
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI DOCENT */}

            {activeTab === 'ai' && (
              <div className="mt-5 space-y-5">

                {aiLoading && (
                  <div
                    className="
                      p-5
                      bg-[#efeeea]
                      border
                      border-[#c4c7c7]
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <Loader2
                      className="
                        w-5
                        h-5
                        animate-spin
                        text-[#94492d]
                      "
                    />

                    <span className="text-sm">
                      Generating AI assistance...
                    </span>
                  </div>
                )}

                {aiError && (
                  <div
                    className="
                      p-4
                      bg-red-50
                      border
                      border-red-200
                      text-red-700
                      flex
                      items-start
                      gap-2
                    "
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />

                    <span className="text-sm">
                      {aiError}
                    </span>
                  </div>
                )}

                {!aiLoading &&
                  !aiError &&
                  !aiSummary && (
                    <div
                      className="
                        py-10
                        text-center
                        border
                        border-dashed
                        border-[#c4c7c7]
                      "
                    >
                      <Sparkles
                        className="
                          w-8
                          h-8
                          mx-auto
                          text-[#94492d]
                        "
                      />

                      <p className="mt-3 text-sm text-[#747878]">
                        Click Consult AI Docent to generate
                        assistance for this heritage record.
                      </p>
                    </div>
                  )}

                {aiSummary && (
                  <>
                    <div>
                      <h3
                        className="
                          text-[11px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-[#94492d]
                        "
                      >
                        AI Summary
                      </h3>

                      <p className="mt-2 text-sm leading-6">
                        {aiSummary}
                      </p>
                    </div>

                    <div>
                      <h3
                        className="
                          text-[11px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-[#94492d]
                        "
                      >
                        AI Tags
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {aiTags
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="
                                px-2.5
                                py-1
                                bg-[#efeeea]
                                border
                                border-[#c4c7c7]
                                text-[11px]
                              "
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3
                        className="
                          text-[11px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-[#94492d]
                        "
                      >
                        Translation
                      </h3>

                      <p
                        className="
                          mt-2
                          p-3
                          bg-[#efeeea]
                          border
                          border-[#c4c7c7]
                          text-sm
                          leading-6
                        "
                      >
                        {aiTranslation ||
                          'No translation returned.'}
                      </p>
                    </div>
                  </>
                )}

              </div>
            )}

            {/* CITATION */}

            {activeTab === 'citation' && (
              <div className="mt-5 space-y-4">

                <div className="flex gap-2">
                  {(['chicago', 'mla', 'apa'] as const).map(
                    (format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() =>
                          setCitationFormat(format)
                        }
                        className={`
                          px-3
                          py-1.5
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wider
                          border
                          ${
                            citationFormat === format
                              ? 'bg-[#1b1c1a] text-white border-[#1b1c1a]'
                              : 'bg-white text-[#1b1c1a] border-[#c4c7c7]'
                          }
                        `}
                      >
                        {format.toUpperCase()}
                      </button>
                    )
                  )}
                </div>

                <div
                  className="
                    p-4
                    bg-[#efeeea]
                    border
                    border-[#c4c7c7]
                    text-[12px]
                    leading-5
                    font-mono
                  "
                >
                  {getCitationText()}
                </div>

                <button
                  type="button"
                  onClick={handleCopyCitation}
                  className="
                    px-4
                    py-2.5
                    bg-[#94492d]
                    text-white
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    flex
                    items-center
                    gap-2
                  "
                >
                  {copiedCitation ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}

                  {copiedCitation
                    ? 'Citation Copied'
                    : 'Copy Citation'}
                </button>

              </div>
            )}

            {/* FOOTER INFO */}

            <div
              className="
                mt-6
                pt-5
                border-t
                border-[#c4c7c7]
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-2
                text-[11px]
                text-[#747878]
              "
            >

              <span
                className="
                  flex
                  items-center
                  gap-1
                "
              >
                <MapPin className="w-3.5 h-3.5 text-[#94492d]" />

                {artifact.coordinates?.lat?.toFixed?.(2) ?? '—'}° N,
                {' '}
                {artifact.coordinates?.lng?.toFixed?.(2) ?? '—'}° E
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-1
                "
              >
                <Calendar className="w-3.5 h-3.5 text-[#94492d]" />

                {artifact.epoch}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ArtifactDetailModal;
