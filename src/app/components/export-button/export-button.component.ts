import { Component, Input, OnInit } from '@angular/core';
import { ExporterService } from '../../services/export/exporter.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-export-button',
  templateUrl: './export-button.component.html',
  styleUrl: './export-button.component.scss'
})
export class ExportButtonComponent implements OnInit {
  
  @Input() blogId: number | null = null;
  @Input() entityType!: string;
  @Input() skip: number = 0;
  @Input() limit: number = 10;
  @Input() sortField?: string;
  @Input() sortOrder?: number;
  @Input() filter?: string;
  loading: boolean = false;

  constructor(
    private exporterService: ExporterService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  export() {
    if (!this.blogId) {
      return;
    }
    this.loading = true;
    this.exporterService.exportEntities(this.blogId, this.entityType, this.skip, this.limit, this.sortField, this.sortOrder, this.filter).subscribe({
      next: (blob) => {
        const filename = `${this.entityType}_export.csv`;
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.loading = false;
      },
      error: (err) => {
        console.error(`Error exporting ${this.entityType}`, err);
        this.notificationService.showError('Error', `Failed to export ${this.entityType}.`);
        this.loading = false;
      }
    });
  }
}
