import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CourseEntityService } from './course-entity.service';
import { map } from 'rxjs/operators';

@Injectable()
export class CoursesResolver implements Resolve<boolean> {
    constructor(private courseService: CourseEntityService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.courseService.getAll()
        .pipe(
            map(courses => !!courses)
        );
    }
}
