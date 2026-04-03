// src/sanity/schemaTypes/post.ts
import { defineType, defineField } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Νέα & Ανακοινώσεις',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Τίτλος',
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
      name: 'publishedAt',
      title: 'Ημερομηνία Δημοσίευσης',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Εικόνα Εξωφύλλου',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'category',
      title: 'Κατηγορία',
      type: 'string',
      options: {
        list: [
          { title: 'Γενικά', value: 'general' },
          { title: 'Μαθητές', value: 'students' },
          { title: 'Γονείς', value: 'parents' },
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Κυρίως Κείμενο',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})
