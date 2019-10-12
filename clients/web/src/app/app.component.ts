import { Component } from '@angular/core';
import { PerudoApiService } from './perudo-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public gameName = '';

  public existingGames: string[] = [];

  constructor(private perudoApiService: PerudoApiService) {

  }

  ngOnInit() {
    this.updateExistingGames();
  }


  private updateExistingGames() {
    this.perudoApiService.getAvailableGames().then(
      (games) => {
        this.existingGames = games;
      });
  }

  public createGame() {
    console.log('s');
    console.log(this.gameName);
  }
}
