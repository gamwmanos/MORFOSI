// src/sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'

import { postType } from './post'
import { bookType } from './book'
import { studentSuccessType } from './studentSuccess'
import { teacherType } from './teacher'
import { programType } from './program'
import { siteSettingsType } from './siteSettings'
import { classScheduleType } from './classSchedule'
import { facilityPhotoType } from './facilityPhoto'
import { examMaterialType } from './examMaterial'
import { planPageType } from './planPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    postType,
    bookType,
    studentSuccessType,
    teacherType,
    programType,
    siteSettingsType,
    classScheduleType,
    facilityPhotoType,
    examMaterialType,
    planPageType,
  ],
}
