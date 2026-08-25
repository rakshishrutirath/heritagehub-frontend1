export type NavigationTab = 
  | 'home'
  | 'explore'
  | 'learn'
  | 'contribute'
  | 'community'
  | '3d-heritage'
  | 'marketplace'
  | 'canvas';

export interface Artifact {
  id: string;
  title: string;
  subtitle?: string;
  catalogNumber: string;
  period: string;
  epoch: string;
  dateRange: string;
  culture: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  medium: string;
  dimensions: string;
  description: string;
  provenance: string;
  historicalContext: string;
  imageUrl: string;
  additionalImages?: string[];
  threeDModelAvailable?: boolean;
  modelId?: string;
  category: 'pottery' | 'metalwork' | 'sculpture' | 'manuscripts' | 'textiles' | 'numismatics' | 'jewelry' | 'architecture';
  verificationStatus: 'verified' | 'in_review' | 'museum_partner';
  institution: string;
  curatorNotes?: string;
  audioGuideUrl?: string;
  audioDuration?: string;
  tags: string[];
  featured?: boolean;
  significanceRating?: number;
}

export interface ThreeDModelData {
  id: string;
  artifactId: string;
  title: string;
  geometryType: 'amphora' | 'horse' | 'helmet' | 'mask' | 'stele' | 'chalice';
  wireframeUrl?: string;
  texturePreset: 'terracotta' | 'bronze' | 'jade' | 'limestone' | 'gold_patina';
  polygonCount: number;
  hotspots: {
    id: string;
    position: [number, number, number];
    title: string;
    annotation: string;
  }[];
  historicalContext: string;
  dimensions: string;
  curatorAudioGuide?: string;
}

export interface TimelineEpoch {
  id: string;
  name: string;
  span: string;
  startBCE: number;
  endBCE: number;
  description: string;
  keyEvents: string[];
  representativeArtifactIds: string[];
  image: string;
}

export interface OnlineExhibition {
  id: string;
  title: string;
  curator: string;
  curatorTitle: string;
  curatorAvatar: string;
  description: string;
  heroImage: string;
  artifactIds: string[];
  estimatedTime: string;
  publishedDate: string;
  sections: {
    title: string;
    body: string;
    imageId?: string;
  }[];
}

export interface CommunityStory {
  id: string;
  title: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  region: string;
  date: string;
  content: string;
  audioRecordingUrl?: string;
  audioLength?: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  verifiedByScholar: boolean;
  relatedArtifactId?: string;
  images: string[];
}

export interface ForumDiscussion {
  id: string;
  title: string;
  category: 'Epigraphy & Translation' | 'Provenance Debate' | 'Oral Histories' | 'Conservation Tech' | 'Field Discoveries';
  author: string;
  authorBadge: string;
  timeAgo: string;
  replies: number;
  views: number;
  tags: string[];
  pinned?: boolean;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  category: 'replicas' | 'prints' | 'books' | 'crafts';
  artisanGuild: string;
  originRegion: string;
  material: string;
  imageUrl: string;
  description: string;
  dimensions: string;
  inStock: boolean;
  certifiedMasterpiece: boolean;
  editionLimit?: string;
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
}

export interface CanvasNode {
  id: string;
  type: 'artifact' | 'note' | 'connection' | 'date_pin';
  x: number;
  y: number;
  width?: number;
  height?: number;
  title?: string;
  content?: string;
  artifactId?: string;
  color?: string;
}

export interface CanvasItem {
  id: string;
  type: 'artifact' | 'note';
  title: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  imageUrl?: string;
  artifactId?: string;
  categoryTag?: string;
}


export interface CanvasEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
}

export interface ArchivalContribution {
  id: string;
  title: string;
  culture: string;
  era: string;
  region: string;
  submitterName: string;
  submitterEmail: string;
  story: string;
  mediaFiles: string[];
  submissionDate: string;
  status: 'pending_review' | 'scholar_assigned' | 'photogrammetry_qa' | 'published_to_archive';
  reviewNotes?: string;
}

export interface BackendStatus {
  connected: boolean;
  url: string;
  latencyMs?: number;
  lastChecked: string;
  version?: string;
}
