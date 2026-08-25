/**
 * AI Assistant Service
 * Handles communication with the Django REST backend for AI enrichment tasks.
 */
import api from './api';

const aiService = {
  /**
   * Generates AI assistance for a specific heritage record.
   * Connects to POST /api/ai/assist/:record_id/
   * 
   * @param {string} recordId - The ID of the heritage record to enrich.
   * @returns {Promise} - The AI enrichment results (summary, tags, translation).
   */
  generateAIAssistance: async (recordId) => {
    try {
      const response = await api.post(`/ai/assist/${recordId}/`);
      return response.data;
    } catch (error) {
      console.error('Error generating AI assistance:', error);
      throw error;
    }
  },

  /**
   * Mock implementation for hackathon demo purposes.
   * Simulates the AI processing flow with a delay.
   */
  generateAIAssistanceMock: async (recordId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          ai_summary: 'Pipili applique is a renowned traditional textile craft originating from Odisha, characterized by vibrant decorative fabric designs. This centuries-old art form, intricately linked with the rituals of the Jagannath Temple, involves the meticulous stitching of geometric and animal motifs onto a base cloth. It represents a vital living tradition of the Puri district, serving both religious and decorative purposes in contemporary Odia culture.',
          ai_tags: ['Pipili Applique', 'Odisha', 'Traditional Craft', 'Textile Art', 'Indian Heritage', 'Handicraft', 'Puri', 'Jagannath Culture'],
          ai_translation: 'Pipili applique eka paramparika Odisha ra bastra kala, jaha nijara rangina ebaṁ kalatmaka nirmana pain prasiddha. Ehi kala Jagannath Sanskruti sahita gabhira bhabare joda...',
        });
      }, 3000); // 3 second delay for "processing" feel
    });
  }
};

export default aiService;
