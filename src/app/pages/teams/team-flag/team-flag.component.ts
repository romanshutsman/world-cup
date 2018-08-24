import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api/api.service';


@Component({
  selector: 'app-team-flag',
  templateUrl: './team-flag.component.html',
  styleUrls: ['./team-flag.component.less']
})
export class TeamFlagComponent implements OnInit {
  public kof: any = [];
  isLoadingCoef = false;

  constructor( private http: ApiService) {
  }

  ngOnInit() {
    this.oddWins();
  }

  oddWins() {
    this.isLoadingCoef = true;
    this.http.oddWins().subscribe(
      (odds: any) => {
        for (let i = 0; i < odds.length; i++) {
          if (odds[i].odds !== null) {
            this.kof.push(odds[i]);
          }
        }
        this.isLoadingCoef = false;
      }
    );
  }
}
