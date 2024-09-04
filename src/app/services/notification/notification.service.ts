import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) {}

  showSuccess(summary: string, detail: string): void {
    this.messageService.add({severity: 'success', summary: summary, detail: detail});
  }

  showInfo(summary: string, detail: string): void {
    this.messageService.add({severity: 'info', summary: summary, detail: detail});
  }

  showWarn(summary: string, detail: string): void {
    this.messageService.add({severity: 'warn', summary: summary, detail: detail});
  }

  showError(summary: string, detail: string): void {
    this.messageService.add({severity: 'error', summary: summary, detail: detail});
  }

  clear(): void {
    this.messageService.clear();
  }
}