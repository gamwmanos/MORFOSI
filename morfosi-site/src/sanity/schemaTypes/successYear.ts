// src/sanity/schemaTypes/successYear.ts
import { defineType, defineField } from 'sanity'

export const successYearType = defineType({
  name: 'successYear',
  title: 'Επιτυχόντες (PDF ανά Έτος)',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Έτος (π.χ. 2023)',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1990).max(2100),
    }),
    defineField({
      name: 'pdfArchive',
      title: 'Αρχείο PDF με ονόματα',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'year',
    },
    prepare(selection) {
      const { title } = selection
      return {
        title: `Επιτυχόντες ${title}`,
      }
    },
  },
})
