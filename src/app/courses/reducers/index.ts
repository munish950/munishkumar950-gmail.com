import { Lesson } from '../model/lesson';
import { createReducer, on } from '@ngrx/store';

import { LessonActions } from '../action.types';

export interface LessonState {
    lesson: Lesson;
}

export const lessonInitialState: LessonState = {
    lesson: undefined
};

export const lessonReducer = createReducer(
    lessonInitialState,

    on(LessonActions.lessonLoad, (state, action) => {
        return {
            lesson: action.lesson
        };
    })
);
