// src/sanity/schemaTypes/examMaterial.ts
import { defineType, defineField } from 'sanity'

export const examMaterialType = defineType({
  name: 'examMaterial',
  title: 'Διαγωνίσματα & Εκπαιδευτικό Υλικό',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Τίτλος Διαγωνίσματος',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Ημερομηνία Προέλευσης',
      type: 'date',
    }),
    defineField({
      name: 'examCategory',
      title: 'Κατηγορία',
      type: 'string',
      options: {
        list: [
          { title: 'Πανελλήνιες', value: 'panellinies' },
          { title: 'Ο.Ε.Φ.Ε.', value: 'oefe' },
          { title: 'Προσομοιώσεις Μόρφωσης', value: 'morfosi' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'morfosi'
    }),
    defineField({
      name: 'classDropdown',
      title: 'Τάξη',
      type: 'string',
      options: {
        list: [
          { title: 'Α Λυκείου', value: 'a_lykeiou' },
          { title: 'Β Λυκείου', value: 'b_lykeiou' },
          { title: 'Γ Λυκείου', value: 'g_lykeiou' },
          { title: 'ΓΕΛ', value: 'gel' },
          { title: 'ΕΠΑΛ', value: 'epal' },
          { title: 'Γυμνάσιο', value: 'gymnasio' },
          { title: 'Δημοτικό', value: 'dimotiko' },
        ],
      },
    }),
    defineField({
      name: 'subject',
      title: 'Μάθημα',
      type: 'string',
    }),
    defineField({
      name: 'questionsFile',
      title: 'Αρχείο Εκφωνήσεων (PDF)',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),
    defineField({
      name: 'answersFile',
      title: 'Αρχείο Απαντήσεων (PDF)',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),
  ],
})
