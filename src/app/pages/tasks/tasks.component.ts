import {Component} from '@angular/core';
import 'devextreme/data/odata/store';
import {ActivatedRoute, Router} from '@angular/router';
import {AppInfoService} from '../../shared/services';

@Component({
  templateUrl: 'tasks.component.html'
})

export class TasksComponent {

  public params: any;
  public movie: any;

  constructor(private route: ActivatedRoute, public service: AppInfoService) {
    this.params = this.route.snapshot.paramMap.params;
    const movies = this.service.getMovies();
    this.movie = movies.filter(item => item.id === +this.params.id)[0];
  }

  calculateAVG(e) {
    const concatRatings = Object.keys(this.movie.ratings).reduce((res, key) => {
      return res.concat(this.movie.ratings[key]);
    }, []);
    this.movie.avgRate = concatRatings.reduce((a, b) => a + b.rating, 0) / concatRatings.length;
  }
}
