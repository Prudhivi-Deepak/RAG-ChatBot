import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  // private apiUrl = 'http://localhost:5000';
  private apiUrl = 'https://prudhivi-deepak-my-rag-backend.hf.space';

  sessionId = signal<string | null>(null);
  messages = signal<Message[]>([]);
  isLoading = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const sid = localStorage.getItem('sessionId');
      if (sid) this.sessionId.set(sid);
    }
  }

  uploadFile(file: File) {
    this.isLoading.set(true);
    // Clear chat on new upload
    this.messages.set([]);
    
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{sessionId: string}>(`${this.apiUrl}/upload`, formData).subscribe({
      next: (res) => {
        this.sessionId.set(res.sessionId);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('sessionId', res.sessionId);
        }
        this.messages.set([{ role: 'assistant', content: '✅ PDF Uploaded Successfully! How can I help?' }]);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  askQuestion(query: string) {
    const sid = this.sessionId();
    if (!sid) return;

    this.messages.update(m => [...m, { role: 'user', content: query }]);
    this.isLoading.set(true);

    this.http.post<{answer: string}>(`${this.apiUrl}/ask`, { sessionId: sid, query }).subscribe({
      next: (res) => {
        this.messages.update(m => [...m, { role: 'assistant', content: res.answer }]);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}