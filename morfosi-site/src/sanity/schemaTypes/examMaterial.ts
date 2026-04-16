// src/sanity/schemaTypes/examMaterial.ts
import { defineType, defineField } from 'sanity'

export const examMaterialType = defineType({
  name: 'examMaterial',
  title: 'Διαγωνίσματα & Εκπαιδευτικό Υλικό',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Κλασικός Τίτλος (Προαιρετικό)',
      description: 'Συμπληρώστε μόνο αν θέλετε έναν ειδικό τίτλο (αλλιώς θα βγει αυτόματα από το μάθημα και τη χρονολογία).',
      type: 'string',
    }),
    defineField({
      name: 'subject',
      title: 'Μάθημα',
      type: 'string',
      options: {
        list: [
          { title: 'Μαθηματικά', value: 'Μαθηματικά' },
          { title: 'Φυσική', value: 'Φυσική' },
          { title: 'Χημεία', value: 'Χημεία' },
          { title: 'Έκθεση (Νεοελληνική Γλώσσα)', value: 'Έκθεση' },
          { title: 'Αρχαία Ελληνικά', value: 'Αρχαία' },
          { title: 'Ιστορία', value: 'Ιστορία' },
          { title: 'Λατινικά', value: 'Λατινικά' },
          { title: 'Βιολογία', value: 'Βιολογία' },
          { title: 'Πληροφορική (ΑΕΠΠ)', value: 'Πληροφορική' },
          { title: 'Οικονομία (ΑΟΘ)', value: 'Οικονομία' },
          { title: 'Λογοτεχνία', value: 'Λογοτεχνία' },
        ],
      },
    }),
    defineField({
      name: 'classDropdown',
      title: 'Τάξη',
      type: 'string',
      options: {
        list: [
          { title: 'Γ Λυκείου', value: 'g_lykeiou' },
          { title: 'Β Λυκείου', value: 'b_lykeiou' },
          { title: 'Α Λυκείου', value: 'a_lykeiou' },
          { title: 'ΓΕΛ (Γενικά)', value: 'gel' },
          { title: 'Γυμνάσιο', value: 'gymnasio' },
          { title: 'Δημοτικό', value: 'dimotiko' },
        ],
      },
      initialValue: 'g_lykeiou'
    }),
    defineField({
      name: 'examYear',
      title: 'Χρονολογία Διαγωνίσματος',
      description: 'Π.χ. 2024 (εναλλακτικά αφήστε το κενό αν πρόκειται για γενικό υλικό)',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Ακριβής Ημερομηνία Προέλευσης (Προαιρετικό)',
      type: 'date',
    }),
    defineField({
      name: 'examCategory',
      title: 'Κατηγορία',
      description: 'Επιλέξτε την κατηγορία του διαγωνίσματος (Πανελλήνιες, Επαναληπτικές κλπ).',
      type: 'string',
      options: {
        list: [
          { title: 'Πανελλήνιες', value: 'panellinies' },
          { title: 'Επαναληπτικές Πανελλήνιες', value: 'epanaliptikes' },
          { title: 'Προσομοιώσεις Μόρφωσης', value: 'morfosi' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'panellinies'
    }),
    defineField({
      name: 'tracks',
      title: 'Κατεύθυνση / Προσανατολισμός',
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
  preview: {
    select: {
      title: 'title',
      subject: 'subject',
      year: 'examYear',
      date: 'date'
    },
    prepare(selection) {
      const { title, subject, year, date } = selection;
      // Fetch year from date if examYear isn't provided
      const finalYear = year || (date ? new Date(date).getFullYear() : '');
      const autoTitle = subject ? `${subject} ${finalYear}`.trim() : 'Διαγώνισμα Χωρίς Τίτλο';
      
      return {
        title: title || autoTitle,
      };
    }
  }
})
