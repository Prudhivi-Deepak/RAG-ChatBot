import { Component, inject, ViewChild, ElementRef, AfterViewChecked, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../core/services/chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
  private chatService = inject(ChatService);
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  queryText = signal('');

  messages = this.chatService.messages;
  isLoading = this.chatService.isLoading;

  // Auto-scroll logic
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      const el = document.querySelector('.chat-window');
      if (el) el.scrollTop = el.scrollHeight;
    } catch (err) {}
  }

  
  // New signal to track the filename
  fileName = signal<string | null>(null);

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName.set(file.name); // Set the name to display
      this.chatService.uploadFile(file);
    }
  }

//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     if (file) this.chatService.uploadFile(file);
//   }

//   send(input: HTMLInputElement) {
//     const val = this.queryText().trim();
//     if (!val) return;
//     this.chatService.askQuestion(val);
//     this.queryText.set('');
//   }
  send() {
    const value = this.queryText().trim();
    if (!value) return;

    // 1. Logic to send the question to your service
    this.chatService.askQuestion(value);

    // 2. Reset the signal - this automatically clears the HTML input box!
    this.queryText.set(''); 
  }
}