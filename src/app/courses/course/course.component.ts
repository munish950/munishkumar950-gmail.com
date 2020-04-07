import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {Observable, of, noop} from 'rxjs';
import {Lesson} from '../model/lesson';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom, mergeMap, take} from 'rxjs/operators';
import { CourseEntityService } from '../services/course-entity.service';
import { LessonEntityService } from '../services/lesson-entity.service';
import { PageEvent } from '@angular/material/paginator';

import { CoursesHttpService } from '../services/courses-http.service';
import { Store, select } from '@ngrx/store';
import { lessonLoad } from '../lesson.actions';
import { getCourseLessons } from '../lesson.selectors';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course$: Observable<any>;

  loading$: Observable<boolean>;

  lessons$: Observable<Lesson[]> = this.store.pipe(
    select(getCourseLessons),
     map(x => x[this.courseId][this.nextPage])
  );

  length: number;
  courseId: number;
  pageSize = 3;
  nextPage = 0;

  // pageSizeOptions: number[] = [5, 10, 25, 100];
  // MatPaginator Output
  pageEvent: PageEvent;
  displayedColumns = ['seqNo', 'description', 'duration'];

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
    // Check Store for courses first
    this.course$ = this.coursesService.entities$
    .pipe(
      map(courses => courses.find(course => course.url === courseUrl)),
      mergeMap(course =>
        // put check here
        this.courseHttpService.findLessons(course.id, this.nextPage, this.pageSize)
        .pipe(
          tap(lesson => {
            this.courseId = course.id;
            // Total number of lessons for courses
            this.length = lesson['lessonCount'];
            this.store.dispatch(lessonLoad({
              page: this.nextPage,
              lesson: lesson['result'],
              courseId: course.id
            }));
          })
        )
      )
    );
    
    /* REFACTOR ABOVE
    this.course$ = this.coursesService.entities$
    .pipe(
      map(courses => courses.find(course => course.url === courseUrl))
    );

    this.course$.subscribe(
      (courseData) => {
        const courseId = courseData.id;
        this.courseHttpService.findLessons(courseId, this.nextPage, this.pageSize).pipe(
          tap(lesson => {
            this.store.dispatch(lessonLoad({page: this.nextPage, lesson: lesson['result']}));
          })
        )
        .subscribe(
          noop,
          () => console.log('Error in Lessons')
        );
      }
    );
    */


    /* INITIAL CODE
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

  /*
  loadLessonsPage(course: Course, nextPage: number) {
    this.lessonService.getWithQuery({
      'courseId': course.id.toString(),
      'pageNumber': nextPage.toString(),
      'pageSize': this.pageSize.toString()
    });
  }
  */

  getServerData(event: PageEvent) {
    this.nextPage = event.pageIndex;
    this.loadLessons(this.courseId, this.nextPage, this.pageSize);
  }

  loadLessons(courseId: number, pageNumber: number, pageSize: number) {
    // console.log('INSIDE Lessons pagination', courseId, pageNumber, pageSize);
    this.store.select(getCourseLessons)
    .pipe(take(1))
    .subscribe(
      lessons => {
         console.log('lessons', courseId, pageNumber, lessons);
        if (!lessons[courseId][pageNumber]) {
          // Fetch lesson from http and keep it in store
          this.courseHttpService.findLessons(courseId, pageNumber, pageSize)
            .subscribe(
              lesson => {
                // lessons according to our current page index
                this.store.dispatch(lessonLoad({
                  page: pageNumber,
                  lesson: lesson['result'],
                  courseId: courseId
                }));
              },
              () => console.log('Error Occur in lessons')
            );
        } else {
          // Select lesson from store
          this.lessons$ = this.store.pipe(
            select(getCourseLessons),
            map(x => x[courseId][pageNumber])
          );
        }
      }
    );

    /*
    this.courseHttpService.findLessons(courseId, pageNumber, pageSize)
    .subscribe(
      lesson => {
        // lessons according to our current page index
        this.store.dispatch(lessonLoad({page: this.nextPage, lesson: lesson['result']}));
      },
      () => console.log('Error Occur in lessons')
    );
    */
  }

}
