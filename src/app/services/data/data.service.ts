import { Injectable } from '@angular/core';
import { Http, Response }     from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {GoogleAnalyticsEventsService} from '../../services/google-analytics-events.service/google-analytics-events.service';

@Injectable()
export class DataService {

  private apiKey = "keyLtjlBongEfqxXa";
  airtableUrl = 'https://api.airtable.com/v0/app8NspdipCZRwGXM/';

  constructor(private http: Http, public googleAnalyticsEventsService: GoogleAnalyticsEventsService) { }



  getTable(tableName): Promise<any> {
    var url = this.airtableUrl + tableName + '?view=Grid%20view&api_key=' + this.apiKey;
    return this.http.get(url)
          .toPromise()
          .then((response:Response) => response.json() as any)
          .catch(this.handleError);
          //.map((res:Response) => res.json());
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  /**
   * Retourne les lignes d'une table
   * @param tableName
   * @returns Le tableau des lignes de la table sous la forme Observable<any>
   */
  observeTable(tableName): Observable<any> {
      var url = this.airtableUrl + tableName + '?view=Grid%20view&api_key=' + this.apiKey;
      return this.http.get(url)
          .map((response: Response) => {
              var rows = response.json() as any[];
              return rows;
          });
  }

  // Agregation functions

  count(object) {
    return (object != null && object != "") ? Object.keys(object).length : 0;
  }

  sum(object, collumn) {
    var result = 0;
    for (var i = 0; i < Object.keys(object).length; i++) {
      result += ( object[i][collumn] == "" ) ? 0 : parseInt( object[i][collumn] );
    }
    return result;
  }

  getDistinctValues(myTable, myColumn): any[] {
    var distinctValues = [];
    for (var i = 0; i < myTable.length; i++) {
      if ((distinctValues.indexOf(myTable[i].fields[myColumn]) == -1) && (myTable[i].fields[myColumn] != "")) {
        distinctValues.push(myTable[i].fields[myColumn]);
      }
    }
    return distinctValues;
  }

  prettyDate(date, label = "Date") {
    var myDate = new Date(date);
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return (date != "") ? myDate.getDate() + " " + monthNames[myDate.getMonth()] : "No " + label ;
  }

  getTagColor(tagName, tags) {
    for (var i = 0; i < tags.records.length; i++) {
      if(tags.records[i].fields.Name === tagName ) { return tags.records[i].fields.Color; }
    }
    return "lightgrey";
  }

  isUrl(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res == null) ? false : true;
  }

  isImageUrl(userInput) {
    var res = userInput.match(/(https?:\/\/.*\.(?:png|jpg))/i);
    return (res == null) ? false : true;
  }

  openUrl(url, category, action, label) {
    this.googleAnalyticsEventsService.emitEvent(category, action, label, 1);
    window.open(url, "_blank");
  }

  sendAnalyticsEvent(category, action, label) {
    this.googleAnalyticsEventsService.emitEvent(category, action, label, 1);
  }

  embedify(url) {
    // DETECT URL LIKE https://www.youtube.com/watch?v=htPYk6QxacQ
    var youtubePattern = /\b(?:https?|ftp):\/\/www.youtube.com\/watch\?v=([a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim
    // DETECT URL LIKE https://www.useloom.com/share/4d85a469abea4dbea739b2d1735c8983
    var loomPattern = /\b(?:https?|ftp):\/\/www.useloom.com\/share\/([a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim
    return url
      .replace(youtubePattern, 'https://www.youtube.com/embed/$1?rel=0&amp;showinfo=0')
      .replace(loomPattern, 'https://www.useloom.com/embed/$1')
  }

  removeLineBreaks(text) {
    return text.replace(/(\r\n|\n|\r)/gm,"");
  }

}
