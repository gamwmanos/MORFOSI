// src/sanity/schemaTypes/facilityPhoto.ts
import { defineType, defineField } from 'sanity'

export const facilityPhotoType = defineType({
  name: 'facilityPhoto',
  title: 'Φωτογραφίες Χώρου',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Τίτλος (π.χ. Αίθουσα Α1)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Φωτογραφία Χώρου',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Σύντομη Περιγραφή (προαιρετικό)',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Σειρά Εμφάνισης',
      type: 'number',
      initialValue: 99,
    }),
  ],
})
