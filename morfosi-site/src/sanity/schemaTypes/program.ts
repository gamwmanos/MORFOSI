// src/sanity/schemaTypes/program.ts
import { defineType, defineField } from 'sanity'

export const programType = defineType({
  name: 'program',
  title: 'Προγράμματα Σπουδών',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Όνομα Προγράμματος (π.χ. Γενικό Λύκειο)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Σύντομη Περιγραφή',
      type: 'text',
    }),
    defineField({
      name: 'body',
      title: 'Αναλυτικές Λεπτομέρειες',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'icon',
      title: 'Εικονίδιο / Εικόνα Προγράμματος',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
