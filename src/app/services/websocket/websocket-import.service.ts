import { Injectable } from '@angular/core';
import { env } from 'process';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketImportService {
  private socket: WebSocket | null = null;
  public messages$ = new Subject<any>();
  private apiUrl = environment.apiUrl.replace('http', 'ws').replace('https', 'wss');

  connect(taskId: string): void {
    const wsUrl = `${this.apiUrl}/ws/import?task_id=${taskId}`;
    this.socket = new WebSocket(wsUrl);
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messages$.next(data);
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    this.socket.onclose = () => {
      console.log('WebSocket closed');
    };
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
