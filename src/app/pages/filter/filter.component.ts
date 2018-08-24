import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'
import {ApiService} from '../../services/api/api.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  group_stage: any;
  play_off: any;
  selectedAll: any;
  constructor(private http: ApiService) {
    this.group_stage = [
      { name: 'A', selected: false, id: 'group_a', class: 'group-a' },
      { name: 'B', selected: false, id: 'group_b', class: 'group-b' },
      { name: 'C', selected: false, id: 'group_c', class: 'group-c' },
      { name: 'D', selected: false, id: 'group_d', class: 'group-d' },
      { name: 'E', selected: false, id: 'group_e', class: 'group-e' },
      { name: 'F', selected: false, id: 'group_f', class: 'group-f' },
      { name: 'G', selected: false, id: 'group_g', class: 'group-g' },
      { name: 'H', selected: false, id: 'group_h', class: 'group-h' }
    ];
    this.play_off = [
      { name: '1/8',  id: 'group_1_8', class: 'group-1-8' },
      { name: '1/4',  id: 'group_1_4', class: 'group-1-4' },
      { name: '1/2',  id: 'group_1_2', class: 'group-1-2' },
      { name: '3 Place',  id: 'group_3_place', class: 'group-3-place'},
      { name: 'Final',  id: 'group_final', class: 'group-final' }
    ];

  }
  selectAll() {
    for (var i = 0; i < this.group_stage.length; i++) {
      this.group_stage[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.group_stage.every(function(item:any) {
        return item.selected == true;
      })
  }


  show(){
    let groups = document.getElementsByClassName('group-stage') as HTMLCollectionOf<HTMLElement>;
    groups[0].style.display == 'block'? groups[0].style.display = "none" : groups[0].style.display = "block";
  };
  ngOnInit() {

  }

}
