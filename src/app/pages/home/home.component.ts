import {Component, Pipe, PipeTransform} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AppInfoService} from '../../shared/services';

@Pipe({
  name: 'secure'
})
export class SecurePipe implements PipeTransform {
  constructor(private http: HttpClient) {
  }

  transform(url: string) {

    return new Observable<string>((observer) => {
      // This is a tiny blank image
      observer.next('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

      // The next and error callbacks from the observer
      const {next, error} = observer;

      this.http.get(url, {responseType: 'blob'}).subscribe(response => {
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = function() {
          observer.next((reader.result as any));
        };
      });

      return {
        unsubscribe() {
        }
      };
    });
  }
}

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  public movies = [];

  constructor(private route: Router, public service: AppInfoService) {
    this.movies = JSON.parse(JSON.stringify(this.service.getMovies()));
  }

  showDetails = (e, movie) => {
    this.route.navigate(['/tasks', {id: movie.id}]);
  };

  search(e) {
    if (e.value === '') {
      this.movies = JSON.parse(JSON.stringify(this.service.getMovies()));
    } else {
      this.movies = this.movies.filter(item => item.title.toLowerCase().includes(e.value.toLowerCase()));
    }
  }

  sort(e) {
    if (e.value === false) {
      this.movies = JSON.parse(JSON.stringify(this.service.getMovies()));
    } else {
      this.movies = this.movies.sort((obj1, obj2) => {
        if (obj1.avgRate > obj2.avgRate) {
          return -1;
        }

        if (obj1.avgRate < obj2.avgRate) {
          return 1;
        }

        return 0;
      });
    }
  }
}
