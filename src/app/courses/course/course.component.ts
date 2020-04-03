import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {Observable, of, noop} from 'rxjs';
import {Lesson} from '../model/lesson';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import { CourseEntityService } from '../services/course-entity.service';
import { LessonEntityService } from '../services/lesson-entity.service';
import { PageEvent } from '@angular/material/paginator';

import { CoursesHttpService } from '../services/courses-http.service';
import { Store } from '@ngrx/store';
import { lessonLoad } from '../lesson.actions';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course$: Observable<Course>;

  loading$: Observable<boolean>;

  lessons$: Observable<Lesson[]>;

  length: number;
  pageSize = 3;
  // pageSizeOptions: number[] = [5, 10, 25, 100];
  // MatPaginator Output
  pageEvent: PageEvent;

  displayedColumns = ['seqNo', 'description', 'duration'];

  nextPage = 0;

  constructor(
    private coursesService: CourseEntityService,
    private lessonService: LessonEntityService,
    private route: ActivatedRoute,

    private courseHttpService: CoursesHttpService,
    private store: Store<Lesson>
  ) {

  }

  ngOnInit() {

    const courseUrl = this.route.snapshot.paramMap.get('courseUrl');

    this.course$ = this.coursesService.entities$
                    .pipe(
                      map(courses => courses.find(course => course.url === courseUrl))
                    );
    
    this.course$.subscribe(
      (courseData) => {
        const courseId = courseData.id;
        console.log('Course ID', courseId);
        this.courseHttpService.findLessons(courseId, this.nextPage, this.pageSize).pipe(
          tap(lesson => {
            console.log('pop', lesson);
            this.store.dispatch(lessonLoad(lesson['result']));
          })
        )
        .subscribe(
          noop,
          () => console.log('Error in Lessons')
        );
      }
    );
    
    /*
    this.lessons$ = this.lessonService.entities$
                      .pipe(
                        withLatestFrom(this.course$),
                        tap(([lessons, course]) => {
                            if (this.nextPage === 0) {
                              this.loadLessonsPage(course, this.nextPage);
                            }
                          }
                        ),
                        map(([lessons, course]) =>
                        lessons.filter(lesson => lesson.courseId === course.id))
                      );

    this.loading$ = this.lessonService.loading$.pipe(delay(0));
    */
  }

  loadLessonsPage(course: Course, nextPage: number) {
    this.lessonService.getWithQuery({
      'courseId': course.id.toString(),
      'pageNumber': nextPage.toString(),
      'pageSize': this.pageSize.toString()
    });
  }
  /*
  getServerData(course: Course, event: PageEvent) {
    console.log(event);
    this.loadLessonsPage(course, 1);
  }
  */

  loadLessons(courseId: number, pageNumber: number, pageSize: number) {
    console.log('INSIDE Lessons');
    this.courseHttpService.findLessons(courseId, pageNumber, pageSize).pipe(
      tap(lesson => {
        console.log('pop', lesson);
        this.store.dispatch(lessonLoad(lesson['result']));
      })
    );
   
  }

}
