// src/sanity/schemaTypes/studentSuccess.ts
import { defineType, defineField } from 'sanity'

export const studentSuccessType = defineType({
  name: 'studentSuccess',
  title: 'Επιτυχόντες & Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'studentName',
      title: 'Ονοματεπώνυμο Μαθητή',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Έτος Επιτυχίας',
      type: 'number',
    }),
    defineField({
      name: 'university',
      title: 'Σχολή Εισαγωγής / Φοίτησης',
      type: 'string',
    }),
    defineField({
      name: 'quote',
      title: 'Κριτική / Δήλωση',
      type: 'text',
    }),
    defineField({
      name: 'photo',
      title: 'Φωτογραφία',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'isTopScorer',
      title: 'Ήταν από τους Πρώτους;',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
