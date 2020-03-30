import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Course } from '../model/course';
/// import { coursesKeyCounter } from '../../../../server/create-course.route';
import { Injectable } from '@angular/core';

@Injectable()
export class CourseEntityService extends EntityCollectionServiceBase<Course> {
    constructor(
        serviceElementsFactory:
        EntityCollectionServiceElementsFactory
    ) {
        super('Course', serviceElementsFactory);
    }
}
