import { defineType, defineField } from 'sanity'

export const eventPhotoType = defineType({
  name: 'eventPhoto',
  title: 'Φωτογραφίες Εκδηλώσεων',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Τίτλος (π.χ. Κοπή Πίτας 2026)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Φωτογραφία Εκδήλωσης',
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
      name: 'date',
      title: 'Ημερομηνία (Προαιρετικό)',
      type: 'date',
    }),
    defineField({
      name: 'order',
      title: 'Σειρά Εμφάνισης',
      type: 'number',
      initialValue: 99,
    }),
  ],
})
