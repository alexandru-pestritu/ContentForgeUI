import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImportEntry } from '../../models/import/import-entry';
import { ImporterService } from '../../services/import/importer.service';
import { NotificationService } from '../../services/notification/notification.service';
import { WebsocketImportService } from '../../services/websocket/websocket-import.service';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrl: './import-dialog.component.scss'
})
export class ImportDialogComponent {
  @Input() entityType!: string;
  @Output() closed = new EventEmitter<void>();

  selectedFile: File | null = null;
  importEntries: ImportEntry[] = [];
  importTaskId: string | null = null;
  taskComplete: boolean = false;
  importloading: boolean = false;
  retryloading: boolean = false;
  visible: boolean = false;

  constructor(
    private importerService: ImporterService,
    private notificationService: NotificationService,
    private webSocketImportService: WebsocketImportService
  ) {}

  open() {
    this.visible = true;
    this.selectedFile = null;
    this.importEntries = [];
    this.taskComplete = false;
    this.importTaskId = null;
  }

  close() {
    this.visible = false;
    this.webSocketImportService.close();
    this.selectedFile = null;
    this.importEntries = [];
    this.taskComplete = false;
    this.importTaskId = null;
    this.closed.emit();
  }

  onFileSelected(event: any) {
    const files: File[] = event.files || [];
    this.selectedFile = files.length > 0 ? files[0] : null;
  }

  onFileRemoved(event: any): void {
    if (event.file) {
      this.selectedFile = null;
    }
  }

  startImport() {
    if (!this.selectedFile) {
      this.notificationService.showError("Error", "Please select a CSV file.");
      return;
    }

    this.importloading = true;
    this.importerService.importEntities(this.entityType, this.selectedFile).subscribe({
      next: (res) => {
        this.importTaskId = res.task_id;
        this.importEntries = res.entries.map((e: any) => {
          return { data: e, status: 'pending', error_message: '' };
        });

        this.webSocketImportService.connect(this.importTaskId!);
        this.webSocketImportService.messages$.subscribe((message) => {
          this.handleWebSocketMessage(message);
        });
      },
      error: (err) => {
        console.error('Error starting import', err);
        this.notificationService.showError('Error', 'Failed to start import.');
        this.importloading = false;
      }
    });
  }

  handleWebSocketMessage(message: any) {
    if (message.type === 'entry_update') {
      const index = message.entry_index;
      if (this.importEntries[index]) {
        this.importEntries[index].status = message.status;
        this.importEntries[index].error_message = message.error_message;
      }
    } else if (message.type === 'task_complete') {
      this.importloading = false;
      this.retryloading = false;
      this.taskComplete = true;
    }
  }

  retryFailed() {
    if (!this.importTaskId) return;

    this.retryloading = true;
    this.importerService.retryImportTask(this.importTaskId, this.entityType).subscribe({
      next: (resp) => {
        resp.entries.forEach((e: any, i: number) => {
          if (e.status === 'failed') {
            this.importEntries[i].status = 'pending';
            this.importEntries[i].error_message = '';
          }
        });
        this.taskComplete = false;
      },
      error: (err) => {
        console.error('Error retrying import', err);
        this.notificationService.showError('Error', 'Failed to retry import.');
        this.retryloading = false;
      }
    });
  }

  hasFailedEntries(): boolean {
    return this.importEntries.some(e => e.status === 'failed');
  }

  formatSize(size: number): string {
    if (size === 0) {
      return '0 B';
    }
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
}

