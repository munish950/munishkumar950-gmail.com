import { createAction, props } from "@ngrx/store";
import { Lesson } from "./model/lesson";


export const lessonLoad = createAction(
    '[Course Lesson] Lesson',
    props<{lesson: Lesson}>()
);
