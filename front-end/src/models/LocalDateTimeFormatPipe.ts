import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'localDateTimeFormat'
})
export class LocalDateTimeFormatPipe implements PipeTransform {
  transform(dateTimeString: string): string {
    const formattedDateTime = moment(dateTimeString).format('MMMM Do YYYY, h:mm:ss a');
    return formattedDateTime;
  }
}
