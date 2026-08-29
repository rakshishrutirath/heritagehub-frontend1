const DEFAULT_BACKEND_URL =
  'https://rakshi.pythonanywhere.com';

/* =========================================================
   TYPES — MATCHING DJANGO BACKEND
========================================================= */

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role?: 'contributor' | 'verifier' | 'admin';
  community?: string;
}

export interface RegisteredUser {
  id: number;
  username: string;
  email: string;
  role: string;
  community: string | null;
}

export interface Category {
  id: number;
  name: string;
}

export interface Language {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  village_or_area: string;
  district: string;
  state: string;
}

export type HeritageStatus =
  | 'pending'
  | 'approved'
  | 'rejected';

export interface HeritageRecord {
  id: string;
  title: string;
  description: string;

  category: number | null;
  language: number | null;
  location: number | null;

  contributor: number;

  image: string | null;
  audio: string | null;

  ai_summary: string | null;
  ai_tags: string | null;
  ai_translation: string | null;

  consent_given: boolean;

  status: HeritageStatus;

  verified_by: number | null;

  qr_code: string | null;

  created_at: string;
}

export interface CreateHeritagePayload {
  title: string;
  description: string;
  category?: number | null;
  language?: number | null;
  location?: number | null;
  consent_given: boolean;
  image?: File | null;
  audio?: File | null;
}

export interface VerificationResponse {
  status: string;
  record_status: HeritageStatus;
}

export interface AiAssistanceResponse {
  status: 'success';
  ai_summary: string;
  ai_tags: string;
  ai_translation: string;
}

export interface DashboardStats {
  total_records: number;
  approved_records: number;
  pending_records: number;
  communities_involved: number;
  languages_documented: number;
  categories_covered: number;
}

/* ================= SHOPPING ================= */

export interface ProductCategory {
  id: number;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string | null;
  category: number | null;
  image: string | null;
  buy_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

/* ================= LEARN ================= */

export interface Song {
  id: number;
  title: string;

  genre:
    | 'sambalpuri'
    | 'koraputia'
    | 'bhajan'
    | 'santali';

  artist: string;
  region: string;

  image: string | null;
  youtube_url: string;

  audio: string | null;

  lyrics: string;
  cultural_context: string;

  created_at: string;
}

export interface DancePose {
  id: number;

  dance_name:
    | 'odissi'
    | 'dhemsa'
    | 'sambalpuri';

  pose_name: string;

  image: string | null;

  explanation: string;

  tutorial_link: string;

  order: number;
}

export interface LanguagePhrase {
  id: number;

  category:
    | 'greetings'
    | 'everyday'
    | 'family'
    | 'food'
    | 'travel'
    | 'culture'
    | 'numbers'
    | 'sentences';

  english_phrase: string;

  odia_translation: string;

  audio: string | null;
}

export interface TranslationResponse {
  status: 'success';
  english_phrase: string;
  odia_translation: string;
  word_count: number;
}

export interface RitualPractice {
  id: number;
  title: string;
  region: string;
  description: string;
  cultural_significance: string;
  practices: string;
  image: string | null;
  created_at: string;
}

/* ================= EXPLORE ================= */

export interface ExploreEra {
  id: number;
  era_name: string;
  year: number;
  image: string | null;
  description: string;
  order: number;
}

export interface ExplorePlace {
  id: string;

  name: string;

  district: string;

  short_description: string;

  main_image: string | null;

  culture_title: string;
  culture_description: string;
  culture_image: string | null;

  food_title: string;
  food_description: string;
  food_image: string | null;

  story_audio: string | null;

  display_order: number;

  is_active: boolean;

  created_at: string;

  eras: ExploreEra[];
}

/* ================= 3D ================= */

export interface ThreeDStartResponse {
  status: 'processing';
  generation_id: string;
  meshy_task_id: string;
}

export interface ThreeDStatusResponse {
  status:
    | 'pending'
    | 'processing'
    | 'succeeded'
    | 'failed'
    | 'error';

  generation_id?: string;

  meshy_task_id?: string | null;

  progress?: number;

  model_url?: string | null;

  error_message?: string | null;

  detail?: string;
}

/* ================= CANVAS ================= */

export interface CanvasArtwork {
  id: string;

  title: string;

  template_image: string | null;

  artwork_image: string | null;

  created_at: string;

  updated_at: string;
}

export interface SaveCanvasPayload {
  title?: string;
  template_image?: File | null;
  artwork_image?: File | null;
}

/* =========================================================
   API SERVICE
========================================================= */

class HeritageApiService {
  private baseUrl: string;

  private accessToken: string | null;

  private refreshToken: string | null;

  constructor() {
    const configuredUrl =
      localStorage.getItem('hh_backend_url') ||
      import.meta.env.VITE_API_BASE_URL ||
      DEFAULT_BACKEND_URL;

    /*
      IMPORTANT:
      All API endpoints below already start with /api/...

      Therefore baseUrl must NEVER end with /api.
    */
    this.baseUrl = configuredUrl
      .replace(/\/api\/?$/, '')
      .replace(/\/$/, '');

    this.accessToken =
      localStorage.getItem('hh_access_token') ||
      localStorage.getItem('access_token');

    this.refreshToken =
      localStorage.getItem('hh_refresh_token') ||
      localStorage.getItem('refresh_token');
  }

  /* =========================================================
     GENERAL
  ========================================================= */

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url
      .replace(/\/api\/?$/, '')
      .replace(/\/$/, '');

    localStorage.setItem(
      'hh_backend_url',
      this.baseUrl
    );
  }

  public isLoggedIn(): boolean {
    const token =
      localStorage.getItem('hh_access_token') ||
      localStorage.getItem('access_token');

    this.accessToken = token;

    return !!token;
  }

  public logout(): void {
    this.accessToken = null;
    this.refreshToken = null;

    localStorage.removeItem('hh_access_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('hh_refresh_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('hh_username');
  }

  /* =========================================================
     CORE REQUEST
  ========================================================= */

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const cleanBaseUrl =
      this.baseUrl
        .replace(/\/api\/?$/, '')
        .replace(/\/$/, '');

    const cleanEndpoint =
      endpoint.startsWith('/')
        ? endpoint
        : `/${endpoint}`;

    const url =
      `${cleanBaseUrl}${cleanEndpoint}`;

    this.accessToken =
      localStorage.getItem('hh_access_token') ||
      localStorage.getItem('access_token');

    this.refreshToken =
      localStorage.getItem('hh_refresh_token') ||
      localStorage.getItem('refresh_token');

    const headers = new Headers(
      options.headers || {}
    );

    if (!(options.body instanceof FormData)) {
      if (!headers.has('Content-Type')) {
        headers.set(
          'Content-Type',
          'application/json'
        );
      }
    }

    headers.set(
      'Accept',
      'application/json'
    );

    if (this.accessToken) {
      headers.set(
        'Authorization',
        `Bearer ${this.accessToken}`
      );
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    /*
      If access token expired, refresh it
      and retry the original request.
    */
    if (
      response.status === 401 &&
      this.refreshToken
    ) {
      const refreshed =
        await this.refreshAccessToken();

      if (refreshed) {
        this.accessToken =
          localStorage.getItem('hh_access_token') ||
          localStorage.getItem('access_token');

        const retryHeaders =
          new Headers(
            options.headers || {}
          );

        if (!(options.body instanceof FormData)) {
          if (!retryHeaders.has('Content-Type')) {
            retryHeaders.set(
              'Content-Type',
              'application/json'
            );
          }
        }

        retryHeaders.set(
          'Accept',
          'application/json'
        );

        if (this.accessToken) {
          retryHeaders.set(
            'Authorization',
            `Bearer ${this.accessToken}`
          );
        }

        response = await fetch(url, {
          ...options,
          headers: retryHeaders,
        });
      }
    }

    if (!response.ok) {
      throw await this.createApiError(
        response
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const responseText =
      await response.text();

    if (!responseText) {
      return undefined as T;
    }

    try {
      return JSON.parse(responseText) as T;
    } catch {
      return responseText as T;
    }
  }

  private async createApiError(
    response: Response
  ): Promise<Error> {
    let message =
      `Request failed: ${response.status}`;

    try {
      const data = await response.json();

      message =
        data.detail ||
        data.error ||
        JSON.stringify(data);
    } catch {
      // Ignore JSON parse failure
    }

    return new Error(message);
  }

  /* =========================================================
     ACCOUNTS
  ========================================================= */

  public async register(
    payload: RegisterPayload
  ): Promise<RegisteredUser> {
    return this.request<RegisteredUser>(
      '/api/accounts/register/',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  public async login(
    payload: LoginPayload
  ): Promise<LoginResponse> {
    this.accessToken = null;
    this.refreshToken = null;

    localStorage.removeItem('hh_access_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('hh_refresh_token');
    localStorage.removeItem('refresh_token');

    const result =
      await this.request<LoginResponse>(
        '/api/accounts/login/',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

    this.accessToken =
      result.access;

    this.refreshToken =
      result.refresh;

    localStorage.setItem(
      'hh_access_token',
      result.access
    );

    localStorage.setItem(
      'access_token',
      result.access
    );

    localStorage.setItem(
      'hh_refresh_token',
      result.refresh
    );

    localStorage.setItem(
      'refresh_token',
      result.refresh
    );

    return result;
  }

  public async refreshAccessToken():
    Promise<boolean> {
    this.refreshToken =
      localStorage.getItem('hh_refresh_token') ||
      localStorage.getItem('refresh_token');

    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/api/accounts/login/refresh/`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Accept:
              'application/json',
          },
          body: JSON.stringify({
            refresh:
              this.refreshToken,
          }),
        }
      );

      if (!response.ok) {
        this.logout();
        return false;
      }

      const data: {
        access: string;
      } = await response.json();

      this.accessToken =
        data.access;

      localStorage.setItem(
        'hh_access_token',
        data.access
      );

      localStorage.setItem(
        'access_token',
        data.access
      );

      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  /* =========================================================
     HERITAGE
  ========================================================= */

  public async getHeritageRecords(
    search?: string
  ): Promise<HeritageRecord[]> {
    let endpoint =
      '/api/heritage/records/';

    if (search?.trim()) {
      endpoint +=
        `?search=${encodeURIComponent(
          search.trim()
        )}`;
    }

    return this.request<HeritageRecord[]>(
      endpoint
    );
  }

  public async getHeritageRecord(
    id: string
  ): Promise<HeritageRecord> {
    return this.request<HeritageRecord>(
      `/api/heritage/records/${id}/`
    );
  }

  public async createHeritageRecord(
    payload: CreateHeritagePayload
  ): Promise<HeritageRecord> {
    const formData =
      new FormData();

    formData.append(
      'title',
      payload.title
    );

    formData.append(
      'description',
      payload.description
    );

    formData.append(
      'consent_given',
      String(payload.consent_given)
    );

    if (
      payload.category !== undefined &&
      payload.category !== null
    ) {
      formData.append(
        'category',
        String(payload.category)
      );
    }

    if (
      payload.language !== undefined &&
      payload.language !== null
    ) {
      formData.append(
        'language',
        String(payload.language)
      );
    }

    if (
      payload.location !== undefined &&
      payload.location !== null
    ) {
      formData.append(
        'location',
        String(payload.location)
      );
    }

    if (payload.image) {
      formData.append(
        'image',
        payload.image
      );
    }

    if (payload.audio) {
      formData.append(
        'audio',
        payload.audio
      );
    }

    return this.request<HeritageRecord>(
      '/api/heritage/records/',
      {
        method: 'POST',
        body: formData,
      }
    );
  }

  public async updateHeritageRecord(
    id: string,
    payload: Partial<CreateHeritagePayload>
  ): Promise<HeritageRecord> {
    const formData =
      new FormData();

    if (payload.title !== undefined) {
      formData.append(
        'title',
        payload.title
      );
    }

    if (
      payload.description !==
      undefined
    ) {
      formData.append(
        'description',
        payload.description
      );
    }

    if (
      payload.consent_given !==
      undefined
    ) {
      formData.append(
        'consent_given',
        String(
          payload.consent_given
        )
      );
    }

    if (
      payload.category !==
        undefined &&
      payload.category !== null
    ) {
      formData.append(
        'category',
        String(payload.category)
      );
    }

    if (
      payload.language !==
        undefined &&
      payload.language !== null
    ) {
      formData.append(
        'language',
        String(payload.language)
      );
    }

    if (
      payload.location !==
        undefined &&
      payload.location !== null
    ) {
      formData.append(
        'location',
        String(payload.location)
      );
    }

    if (payload.image) {
      formData.append(
        'image',
        payload.image
      );
    }

    if (payload.audio) {
      formData.append(
        'audio',
        payload.audio
      );
    }

    return this.request<HeritageRecord>(
      `/api/heritage/records/${id}/`,
      {
        method: 'PATCH',
        body: formData,
      }
    );
  }

  public async deleteHeritageRecord(
    id: string
  ): Promise<void> {
    await this.request<void>(
      `/api/heritage/records/${id}/`,
      {
        method: 'DELETE',
      }
    );
  }

  /* =========================================================
     HERITAGE CATEGORIES
  ========================================================= */

  public async getCategories():
    Promise<Category[]> {
    return this.request<Category[]>(
      '/api/heritage/categories/'
    );
  }

  public async getCategory(
    id: number
  ): Promise<Category> {
    return this.request<Category>(
      `/api/heritage/categories/${id}/`
    );
  }

  /* =========================================================
     LANGUAGES
  ========================================================= */

  public async getLanguages():
    Promise<Language[]> {
    return this.request<Language[]>(
      '/api/heritage/languages/'
    );
  }

  public async getLanguage(
    id: number
  ): Promise<Language> {
    return this.request<Language>(
      `/api/heritage/languages/${id}/`
    );
  }

  /* =========================================================
     LOCATIONS
  ========================================================= */

  public async getLocations():
    Promise<Location[]> {
    return this.request<Location[]>(
      '/api/heritage/locations/'
    );
  }

  public async getLocation(
    id: number
  ): Promise<Location> {
    return this.request<Location>(
      `/api/heritage/locations/${id}/`
    );
  }

  /* =========================================================
     COMMUNITY VERIFICATION
  ========================================================= */

  public async reviewRecord(
    recordId: string,
    action:
      | 'approved'
      | 'rejected'
      | 'correction_requested',
    comment = ''
  ): Promise<VerificationResponse> {
    return this.request<VerificationResponse>(
      `/api/community/review/${recordId}/`,
      {
        method: 'POST',
        body: JSON.stringify({
          action,
          comment,
        }),
      }
    );
  }

  /* =========================================================
     AI ASSISTANCE
  ========================================================= */

  public async generateAiAssistance(
    recordId: string
  ): Promise<AiAssistanceResponse> {
    return this.request<AiAssistanceResponse>(
      `/api/ai/assist/${recordId}/`,
      {
        method: 'POST',
      }
    );
  }

  /* =========================================================
     DASHBOARD
  ========================================================= */

  public async getDashboardStats():
    Promise<DashboardStats> {
    return this.request<DashboardStats>(
      '/api/dashboard/stats/'
    );
  }

  /* =========================================================
     SHOPPING
  ========================================================= */

  public async getProducts():
    Promise<Product[]> {
    return this.request<Product[]>(
      '/api/shopping/products/'
    );
  }

  public async getProduct(
    id: string
  ): Promise<Product> {
    return this.request<Product>(
      `/api/shopping/products/${id}/`
    );
  }

  public async getProductCategories():
    Promise<ProductCategory[]> {
    return this.request<
      ProductCategory[]
    >(
      '/api/shopping/categories/'
    );
  }

  /* =========================================================
     LEARN — SONGS
  ========================================================= */

  public async getSongs(
    options?: {
      genre?: string;
      search?: string;
    }
  ): Promise<Song[]> {
    const params =
      new URLSearchParams();

    if (options?.genre) {
      params.set(
        'genre',
        options.genre
      );
    }

    if (options?.search) {
      params.set(
        'search',
        options.search
      );
    }

    const query =
      params.toString();

    return this.request<Song[]>(
      `/api/learn/songs/${
        query ? `?${query}` : ''
      }`
    );
  }

  public async getSong(
    id: number
  ): Promise<Song> {
    return this.request<Song>(
      `/api/learn/songs/${id}/`
    );
  }

  /* =========================================================
     LEARN — DANCE
  ========================================================= */

  public async getDancePoses(
    danceName?:
      | 'odissi'
      | 'dhemsa'
      | 'sambalpuri'
  ): Promise<DancePose[]> {
    let endpoint =
      '/api/learn/dance-poses/';

    if (danceName) {
      endpoint +=
        `?dance_name=${encodeURIComponent(
          danceName
        )}`;
    }

    return this.request<DancePose[]>(
      endpoint
    );
  }

  public async getDancePose(
    id: number
  ): Promise<DancePose> {
    return this.request<DancePose>(
      `/api/learn/dance-poses/${id}/`
    );
  }

  /* =========================================================
     LEARN — LANGUAGE PHRASES
  ========================================================= */

  public async getLanguagePhrases(
    options?: {
      category?: string;
      search?: string;
    }
  ): Promise<LanguagePhrase[]> {
    const params =
      new URLSearchParams();

    if (options?.category) {
      params.set(
        'category',
        options.category
      );
    }

    if (options?.search) {
      params.set(
        'search',
        options.search
      );
    }

    const query =
      params.toString();

    return this.request<
      LanguagePhrase[]
    >(
      `/api/learn/language-phrases/${
        query ? `?${query}` : ''
      }`
    );
  }

  public async translateToOdia(
    englishPhrase: string
  ): Promise<TranslationResponse> {
    return this.request<
      TranslationResponse
    >(
      '/api/learn/translate/',
      {
        method: 'POST',
        body: JSON.stringify({
          english_phrase:
            englishPhrase,
        }),
      }
    );
  }

  /* =========================================================
     LEARN — RITUALS
  ========================================================= */

  public async getRituals():
    Promise<RitualPractice[]> {
    return this.request<
      RitualPractice[]
    >(
      '/api/learn/rituals/'
    );
  }

  /* =========================================================
     EXPLORE
  ========================================================= */

  public async getExplorePlaces():
    Promise<ExplorePlace[]> {
    return this.request<
      ExplorePlace[]
    >(
      '/api/explore/places/'
    );
  }

  public async getExplorePlace(
    id: string
  ): Promise<ExplorePlace> {
    return this.request<
      ExplorePlace
    >(
      `/api/explore/places/${id}/`
    );
  }

  public async getExploreEras(
    placeId?: string
  ): Promise<ExploreEra[]> {
    let endpoint =
      '/api/explore/eras/';

    if (placeId) {
      endpoint +=
        `?place=${encodeURIComponent(
          placeId
        )}`;
    }

    return this.request<
      ExploreEra[]
    >(endpoint);
  }

  /* =========================================================
     3D GENERATION
  ========================================================= */

  public async generate3D(
    image: File
  ): Promise<ThreeDStartResponse> {
    const formData =
      new FormData();

    formData.append(
      'image',
      image
    );

    return this.request<
      ThreeDStartResponse
    >(
      '/api/3d/generate/',
      {
        method: 'POST',
        body: formData,
      }
    );
  }

  public async check3DStatus(
    generationId: string
  ): Promise<ThreeDStatusResponse> {
    return this.request<
      ThreeDStatusResponse
    >(
      `/api/3d/status/${generationId}/`
    );
  }

  /* =========================================================
     CANVAS
  ========================================================= */

  public async getCanvasArtworks():
    Promise<CanvasArtwork[]> {
    return this.request<
      CanvasArtwork[]
    >(
      '/api/canvas/artworks/'
    );
  }

  public async saveCanvasArtwork(
    payload: SaveCanvasPayload
  ): Promise<CanvasArtwork> {
    const formData =
      new FormData();

    if (payload.title) {
      formData.append(
        'title',
        payload.title
      );
    }

    if (
      payload.template_image
    ) {
      formData.append(
        'template_image',
        payload.template_image
      );
    }

    if (
      payload.artwork_image
    ) {
      formData.append(
        'artwork_image',
        payload.artwork_image
      );
    }

    return this.request<
      CanvasArtwork
    >(
      '/api/canvas/save/',
      {
        method: 'POST',
        body: formData,
      }
    );
  }

  /* =========================================================
     TEMPORARY STITCH FRONTEND COMPATIBILITY
  ========================================================= */

  public getLocalBookmarks(): string[] {
    try {
      const saved =
        localStorage.getItem(
          'hh_bookmarks'
        );

      return saved
        ? JSON.parse(saved)
        : [];
    } catch {
      return [];
    }
  }

  public toggleBookmark(
    id: string
  ): string[] {
    const current =
      this.getLocalBookmarks();

    const updated =
      current.includes(id)
        ? current.filter(
            (item) =>
              item !== id
          )
        : [
            ...current,
            id,
          ];

    localStorage.setItem(
      'hh_bookmarks',
      JSON.stringify(
        updated
      )
    );

    return updated;
  }

  public getLocalContributions():
    any[] {
    try {
      const saved =
        localStorage.getItem(
          'hh_contributions'
        );

      return saved
        ? JSON.parse(saved)
        : [];
    } catch {
      return [];
    }
  }

  public async submitContribution(
    data: any
  ): Promise<any> {
    const contribution = {
      id:
        `temp-${Date.now()}`,

      ...data,

      submissionDate:
        new Date()
          .toISOString()
          .split('T')[0],

      status:
        'pending_review',
    };

    const current =
      this.getLocalContributions();

    localStorage.setItem(
      'hh_contributions',
      JSON.stringify([
        contribution,
        ...current,
      ])
    );

    return contribution;
  }

  public getLocalCanvasItems():
    any[] {
    try {
      const saved =
        localStorage.getItem(
          'hh_canvas_items'
        );

      return saved
        ? JSON.parse(saved)
        : [];
    } catch {
      return [];
    }
  }

  public saveCanvasItems(
    items: any[]
  ): void {
    localStorage.setItem(
      'hh_canvas_items',
      JSON.stringify(
        items
      )
    );
  }

  public async checkConnection():
    Promise<{
      connected: boolean;
      url: string;
      latencyMs?: number;
      lastChecked: string;
      version?: string;
    }> {
    const startTime =
      performance.now();

    try {
      const response =
        await fetch(
          `${this.baseUrl}/api/dashboard/stats/`,
          {
            method: 'GET',

            headers: {
              Accept:
                'application/json',
            },
          }
        );

      return {
        connected:
          response.ok ||
          response.status === 401 ||
          response.status === 403,

        url:
          this.baseUrl,

        latencyMs:
          Math.round(
            performance.now() -
              startTime
          ),

        lastChecked:
          new Date()
            .toLocaleTimeString(),

        version:
          'HeritageHub Django REST API',
      };
    } catch {
      return {
        connected:
          false,

        url:
          this.baseUrl,

        lastChecked:
          new Date()
            .toLocaleTimeString(),
      };
    }
  }
}

export const api =
  new HeritageApiService();

export default api;