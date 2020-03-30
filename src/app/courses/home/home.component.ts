import {Component, OnInit} from '@angular/core';
import {compareCourses, Course} from '../model/course';
import {Observable} from "rxjs";
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {EditCourseDialogComponent} from '../edit-course-dialog/edit-course-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {map, shareReplay} from 'rxjs/operators';
import { CourseEntityService } from '../services/course-entity.service';
// import {CoursesHttpService} from '../services/courses-http.service';



@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    promoTotal$: Observable<number>;

    // loading$: Observable<boolean>;

    beginnerCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;


    constructor(
      private dialog: MatDialog,
      private coursesEntityService: CourseEntityService) {

    }

    ngOnInit() {
      this.reload();
    }

  reload() {
    /*
    const courses$ = this.coursesHttpService.findAllCourses()
      .pipe(
        map(courses => courses.sort(compareCourses)),
        shareReplay()
      );
    */

    // this.loading$ = courses$.pipe(map(courses => !!courses));

    this.beginnerCourses$ = this.coursesEntityService.entities$
      .pipe(
        map(courses => courses.filter(course => course.category === 'BEGINNER'))
      );


    this.advancedCourses$ = this.coursesEntityService.entities$
      .pipe(
        map(courses => courses.filter(course => course.category === 'ADVANCED'))
      );

    this.promoTotal$ = this.coursesEntityService.entities$
        .pipe(
            map(courses => courses.filter(course => course.promo).length)
        );

  }

  onAddCourse() {

    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle:"Create Course",
      mode: 'create'
    };

    this.dialog.open(EditCourseDialogComponent, dialogConfig);

  }


}
