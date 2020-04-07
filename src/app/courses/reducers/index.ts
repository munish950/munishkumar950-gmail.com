import { Lesson } from '../model/lesson';
import { createReducer, on } from '@ngrx/store';

import { LessonActions } from '../action.types';

export interface LessonState {
    [key: number]: {[key: number]: Lesson[]};
}

export const lessonInitialState = {

};

export const lessonReducer = createReducer(
    lessonInitialState,

    on(LessonActions.lessonLoad, (state, action) => {
        // console.log('Lesson Reducer', action, state);
        const course = state[action.courseId] || {};
        return {
            ...state,
            [action.courseId]: {
                ...course,
                [action.page]: action.lesson
            }
        };
    })
);
