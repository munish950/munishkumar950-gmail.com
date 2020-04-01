import { Injectable } from '@angular/core';
import { HttpUrlGenerator, DefaultDataService, QueryParams } from '@ngrx/data';
import { Lesson } from '../model/lesson';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class LessonDataService extends DefaultDataService<Lesson> {
    constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('Lesson', http, httpUrlGenerator);
    }
// {result: Lesson[], lessonCount: number}
    getWithQuery(params: string | QueryParams
        ): Observable<any> {
        const queryParams: HttpParams = this.buildQueryParams(params);
        console.log('PARAM', queryParams);
        return this.http.get('/api/lessons', {params: queryParams})
        .pipe(
            map(response => response['result'])
        );
        /*
        return super.getWithQuery(params)
            .pipe(
                map(response => response['result'])
            );
        */
    }

    buildQueryParams(source: Object): HttpParams {
        let target: HttpParams = new HttpParams();
        Object.keys(source).forEach((key: string) => {
            const value: string | number | boolean | Date = source[key];
            if ((typeof value !== 'undefined') && (value !== null)) {
                target = target.append(key, value.toString());
            }
        });
        return target;
    }
}
