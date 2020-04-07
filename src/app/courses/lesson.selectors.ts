import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LessonState } from './reducers';


export const featureLessonSelector = createFeatureSelector<LessonState>('lesson');

export const getCourseLessons = createSelector(
    featureLessonSelector,
    lessons => lessons
);
