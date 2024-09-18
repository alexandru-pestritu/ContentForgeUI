import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit = 190, completeWords = false, ellipsis = '...'): string {
    if (!value) {
      return '';
    }
    if (value.length <= limit) {
      return value;
    }

    if (completeWords) {
      limit = value.slice(0, limit).lastIndexOf(' ');
    }
    
    return value.slice(0, limit) + ellipsis;
  }
}
