import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'durationFormat'
})
export class DurationFormatPipe implements PipeTransform {
  transform(durationString: string): string {
    const duration = moment.duration(durationString);
    return duration.humanize();
  }
}
