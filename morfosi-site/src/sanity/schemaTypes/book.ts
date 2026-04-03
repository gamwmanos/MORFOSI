import { defineType, defineField } from 'sanity'

export const bookType = defineType({
  name: 'book',
  title: 'Βιβλία & Εκδόσεις',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Τίτλος Βιβλίου',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Κατηγορία / Τάξη',
      type: 'string',
      options: {
        list: [
          { title: 'Γ\' Λυκείου', value: 'Γ_ΛΥΚΕΙΟΥ' },
          { title: 'Β\' Λυκείου', value: 'Β_ΛΥΚΕΙΟΥ' },
          { title: 'Α\' Λυκείου', value: 'Α_ΛΥΚΕΙΟΥ' },
          { title: 'Γυμνάσιο', value: 'ΓΥΜΝΑΣΙΟ' },
          { title: 'Γενικό Αναγνωστήριο', value: 'ΓΕΝΙΚΟ' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subject',
      title: 'Μάθημα',
      type: 'string',
      description: 'π.χ. Νεοελληνική Γλώσσα, Μαθηματικά Προσανατολισμού',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orderPriority',
      title: 'Σειρά Εμφάνισης',
      type: 'number',
      description: '1 για το πρώτο μάθημα που θα εμφανίζεται (π.χ. Γλώσσα), 2 για το δεύτερο κ.ο.κ.',
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'coverImage',
      title: 'Εξώφυλλο Βιβλίου',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pdfFile',
      title: 'Αρχείο PDF (Προαιρετικό)',
      type: 'file',
      description: 'Ανέβασε το PDF εδώ αν θέλεις να κατεβαίνει απευθείας.'
    }),
    defineField({
      name: 'externalUrl',
      title: 'Εξωτερικό URL (Προαιρετικό)',
      type: 'url',
      description: 'Βάλε link αν το βιβλίο είναι σε άλλη σελίδα (π.χ. eshop). Αν βάλεις PDF, το URL θα αγνοηθεί.'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
})
