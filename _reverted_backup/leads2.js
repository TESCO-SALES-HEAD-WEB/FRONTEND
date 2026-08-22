// Frontend service for the Lead / Pipeline backend API.
// Uses the shared api() client which targets VITE_API_URL (default http://localhost:5000/api).
import { api } from '../api/client';

// GET /api/leads -> array of lead documents
export const getLeads = () => api('/leads');

// POST /api/leads -> creates a lead (backend auto-generates the LD- id)
export const createLead = (lead) => api('/leads', { method: 'POST', body: lead });

// PUT /api/leads/:id -> update a single lead
export const updateLead = (id, patch) => api(`/leads/${id}`, { method: 'PUT', body: patch });

// DELETE /api/leads/:id -> remove a single lead
export const deleteLead = (id) => api(`/leads/${id}`, { method: 'DELETE' });
