import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  countries: {
    id: string;
    name: string;
  }[] = [ // todo move to const file
    { id: 'rus', name: 'Russia' },
    { id: 'ger', name: 'Germany' },
    { id: 'bra', name: 'Brazil' },
    { id: 'por', name: 'Portugal' },
    { id: 'arg', name: 'Argentina' },
    { id: 'bel', name: 'Belgium' },
    { id: 'pol', name: 'Poland' },
    { id: 'fra', name: 'France' },
    { id: 'esp', name: 'Spain' },
    { id: 'per', name: 'Peru' },
    { id: 'sui', name: 'Switzerland' },
    { id: 'eng', name: 'England' },
    { id: 'col', name: 'Colombia' },
    { id: 'mex', name: 'Mexico' },
    { id: 'uru', name: 'Uruguay' },
    { id: 'cro', name: 'Croatia' },
    { id: 'den', name: 'Denmark' },
    { id: 'isl', name: 'Iceland' },
    { id: 'crc', name: 'Costa Rica' },
    { id: 'swe', name: 'Sweden' },
    { id: 'tun', name: 'Tunisia' },
    { id: 'egy', name: 'Egypt' },
    { id: 'sen', name: 'Senegal' },
    { id: 'irn', name: 'Iran' },
    { id: 'srb', name: 'Serbia' },
    { id: 'nga', name: 'Nigeria' },
    { id: 'aus', name: 'Australia' },
    { id: 'jpn', name: 'Japan' },
    { id: 'mar', name: 'Morocco' },
    { id: 'pan', name: 'Panama' },
    { id: 'kor', name: 'South Korea' },
    { id: 'ksa', name: 'Saudi Arabia' }
  ];
  final_1_8 = {
    '2018-06-30T14:00:00.000Z' : {
      localteam_name: 'C1',
      visitorteam_name: 'D2',
      index: '8F-1'
    },
    '2018-06-30T18:00:00.000Z' : {
      localteam_name: 'A1',
      visitorteam_name: 'B2',
      index: '8F-2'
    },
    '2018-07-01T14:00:00.000Z' : {
      localteam_name: 'B1',
      visitorteam_name: 'A2',
      index: '8F-3'
    },
    '2018-07-01T18:00:00.000Z' : {
      localteam_name: 'D1',
      visitorteam_name: 'C2',
      index: '8F-4'
    },
    '2018-07-02T14:00:00.000Z' : {
      localteam_name: 'E1',
      visitorteam_name: 'F2',
      index: '8F-5'
    },
    '2018-07-02T18:00:00.000Z' : {
      localteam_name: 'G1',
      visitorteam_name: 'H2',
      index: '8F-6'
    },
    '2018-07-03T14:00:00.000Z' : {
      localteam_name: 'F1',
      visitorteam_name: 'E2',
      index: '8F-7'
    },
    '2018-07-03T18:00:00.000Z' : {
      localteam_name: 'H1',
      visitorteam_name: 'G2',
      index: '8F-8'
    },
  }; // todo move to const file
  final_1_4 = {
    '2018-07-06T14:00:00.000Z' : {
      localteam_name: '8F-1',
      visitorteam_name: '8F-2',
      index: 'QF1'
    },
    '2018-07-06T18:00:00.000Z' : {
      localteam_name: '8F-3',
      visitorteam_name: '8F-4',
      index: 'QF2'
    },
    '2018-07-07T14:00:00.000Z' : {
      localteam_name: '8F-5',
      visitorteam_name: '8F-6',
      index: 'QF3'
    },
    '2018-07-07T18:00:00.000Z' : {
      localteam_name: '8F-7',
      visitorteam_name: '8F-8',
      index: 'QF4'
    }
  }; // todo move to const file
  final_1_2 = {
    '2018-07-10T18:00:00.000Z' : {
       localteam_name: 'QF1',
       visitorteam_name: 'QF2',
       index: 'SF1'
     },
    '2018-07-11T18:00:00.000Z' : {
      localteam_name: 'QF3',
      visitorteam_name: 'QF4',
      index: 'SF2'
    }
  }; // todo move to const file
  place_3 = {'2018-07-14T17:00:00.000Z': {
      localteam_name: 'LSF1',
      visitorteam_name: 'LSF2'
    }}; // todo move to const file

    final = {'2018-07-15T15:00:00.000Z': {
      localteam_name: 'WSF1',
      visitorteam_name: 'WSF2'
   }};
group_stage = [
    {name: 'A', selected: false, id: 'group_a', class: 'group-a', nameGroup: 'groupA', value: 'groupA'},
    {name: 'B', selected: false, id: 'group_b', class: 'group-b', nameGroup: 'groupB', value: 'groupB'},
    {name: 'C', selected: false, id: 'group_c', class: 'group-c', nameGroup: 'groupC', value: 'groupC'},
    {name: 'D', selected: false, id: 'group_d', class: 'group-d', nameGroup: 'groupD', value: 'groupD'},
    {name: 'E', selected: false, id: 'group_e', class: 'group-e', nameGroup: 'groupE', value: 'groupE'},
    {name: 'F', selected: false, id: 'group_f', class: 'group-f', nameGroup: 'groupF', value: 'groupF'},
    {name: 'G', selected: false, id: 'group_g', class: 'group-g', nameGroup: 'groupG', value: 'groupG'},
    {name: 'H', selected: false, id: 'group_h', class: 'group-h', nameGroup: 'groupH', value: 'groupH'}
  ];
  play_off = [
    {name: '1/8', selected: false, id: 'group_1_8', class: 'group-1-8', value: 'roundOf16'},
    {name: '1/4', selected: false, id: 'group_1_4', class: 'group-1-4', value: 'quarter'},
    {name: '1/2', selected: false, id: 'group_1_2', class: 'group-1-2', value: 'semi'},
    {name: '3 Place', selected: false, id: 'group_3_place', class: 'group-3-place', value: 'third'},
    {name: 'Final', selected: false, id: 'group_final', class: 'group-final', value: 'final'}
  ];
  language = [
    {
      src: '../../../assets/images/gb.svg',
      lang: 'ENG',
      code: 'en'
    },
    {
      src: '../../../assets/images/br.svg',
      lang: 'BRA',
      code: 'pt'
    }
  ];
  group_stage2 = [
    {name: 'A', selected: false, id: 'group_a', class: 'group-a', nameGroup: 'groupA'},
    {name: 'B', selected: false, id: 'group_b', class: 'group-b', nameGroup: 'groupB'},
    {name: 'C', selected: false, id: 'group_c', class: 'group-c', nameGroup: 'groupC'},
    {name: 'D', selected: false, id: 'group_d', class: 'group-d', nameGroup: 'groupD'},
    {name: 'E', selected: false, id: 'group_e', class: 'group-e', nameGroup: 'groupE'},
    {name: 'F', selected: false, id: 'group_f', class: 'group-f', nameGroup: 'groupF'},
    {name: 'G', selected: false, id: 'group_g', class: 'group-g', nameGroup: 'groupG'},
    {name: 'H', selected: false, id: 'group_h', class: 'group-h', nameGroup: 'groupH'}
  ];
  teams = [
    {id: 'rus', name: 'Russia'},
    {id: 'ger', name: 'Germany'},
    {id: 'bra', name: 'Brazil'},
    {id: 'por', name: 'Portugal'},
    {id: 'arg', name: 'Argentina'},
    {id: 'bel', name: 'Belgium'},
    {id: 'pol', name: 'Poland'},
    {id: 'fra', name: 'France'},
    {id: 'esp', name: 'Spain'},
    {id: 'per', name: 'Peru'},
    {id: 'sui', name: 'Switzerland'},
    {id: 'eng', name: 'England'},
    {id: 'col', name: 'Colombia'},
    {id: 'mex', name: 'Mexico'},
    {id: 'uru', name: 'Uruguay'},
    {id: 'cro', name: 'Croatia'},
    {id: 'den', name: 'Denmark'},
    {id: 'isl', name: 'Iceland'},
    {id: 'crc', name: 'Costa Rica'},
    {id: 'swe', name: 'Sweden'},
    {id: 'tun', name: 'Tunisia'},
    {id: 'egy', name: 'Egypt'},
    {id: 'sen', name: 'Senegal'},
    {id: 'irn', name: 'Iran'},
    {id: 'srb', name: 'Serbia'},
    {id: 'nga', name: 'Nigeria'},
    {id: 'aus', name: 'Australia'},
    {id: 'jpn', name: 'Japan'},
    {id: 'mar', name: 'Morocco'},
    {id: 'pan', name: 'Panama'},
    {id: 'kor', name: 'South Korea'},
    {id: 'ksa', name: 'Saudi Arabia'}
  ];
  stages: any = [
    'group',
    'roundOf16',
    'quarter',
    'semi',
    'third',
    'final',
  ];
  stages2: any = [
    {name: 'Groups', value: 'group', checked: false},
    {name: '1/8 Finals', value: 'roundOf16', checked: false},
    {name: '1/4 Finals', value: 'quarter', checked: false},
    {name: '1/2 Finals', value: 'semi', checked: false},
    {name: '3rd Place', value: 'third', checked: false},
    {name: 'Final', value: 'final', checked: false}
  ];
  constructor() { }

}
