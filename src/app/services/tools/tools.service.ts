import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { environment } from 'environments/environment';
import { DataService } from 'app/services/data/data.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

@Injectable()
export class ToolsService {

    constructor(private _dataService: DataService) { }

    /**
     * Retourne la liste complète des outils
     */
    public list(): Observable<any[]> {

        return Observable.forkJoin([
            this._dataService.observeTable('Tools')
        ]).map((results: any[]) => {
            const tools: any[] = results[0];
            // Filter to keep only "published" tools
            tools['records'] = tools['records'].filter( (tool: any) => tool['fields']['Published']);
            tools['records'].forEach( (tool: any) => {
              (tool.fields['Staff pick']) ? tool.fields['Staff pick filter'] = 'Yes' : tool.fields['Staff pick filter'] = 'No';
            })
            return this.shuffleToolsList(tools);
        });
    }
    /* Create random list of tools from Airtable */
    private shuffleToolsList(array: any[]): any[] {
      for (let i = array['records'].length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array['records'][i], array['records'][j]] = [array['records'][j], array['records'][i]];
      }
      return array
    }

  }
