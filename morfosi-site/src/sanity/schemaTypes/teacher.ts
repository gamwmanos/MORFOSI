// src/sanity/schemaTypes/teacher.ts
import { defineType, defineField } from 'sanity'

export const teacherType = defineType({
  name: 'teacher',
  title: 'Εκπαιδευτικό Προσωπικό',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'Όνομα',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Επίθετο',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'specialty',
      title: 'Ειδικότητα (π.χ. Φιλόλογος)',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Σύντομο Βιογραφικό / Προσόντα',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Φωτογραφία',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Σειρά Εμφάνισης (Μικρότερος Αριθμός προηγείται)',
      type: 'number',
      initialValue: 99,
    }),
  ],
})
