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
      description: 'Επιλέξτε την κατηγορία του διαγωνίσματος (Πανελλήνιες, ΟΕΦΕ κλπ). Αν μείνει κενό, θα εμφανιστεί στις Πανελλήνιες.',
      type: 'string',
      options: {
        list: [
          { title: 'Πανελλήνιες', value: 'panellinies' },
          { title: 'Ο.Ε.Φ.Ε.', value: 'oefe' },
          { title: 'Προσομοιώσεις Μόρφωσης', value: 'morfosi' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'panellinies'
    }),
    defineField({
      name: 'tracks',
      title: 'Κατεύθυνση / Προσανατολισμός',
      description: 'Επιλέξτε μία ή περισσότερες κατευθύνσεις για αυτό το διαγώνισμα.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Γενικής Παιδείας', value: 'general' },
          { title: 'Ανθρωπιστικών Σπουδών', value: 'humanities' },
          { title: 'Θετικών Σπουδών', value: 'positive' },
          { title: 'Σπουδών Υγείας', value: 'health' },
          { title: 'Σπουδών Οικονομίας & Πληροφορικής', value: 'econ' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: ['general']
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
