import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerudoApiService {



  constructor() {

  }

  public getAvailableGames(): Promise<string[]> {
    return fetch(environment.apiURL + '/games')
      .then((response) => {
        return response.json();
      })
      .then((response) => response.games)

      ;
  }
}
