// src/sanity/schemaTypes/classSchedule.ts
import { defineType, defineField } from 'sanity'

// Τα μέρη της εβδομάδας
const DAYS = [
  { title: 'Δευτέρα', value: 'monday' },
  { title: 'Τρίτη', value: 'tuesday' },
  { title: 'Τετάρτη', value: 'wednesday' },
  { title: 'Πέμπτη', value: 'thursday' },
  { title: 'Παρασκευή', value: 'friday' },
  { title: 'Σάββατο', value: 'saturday' },
]

// Αντικείμενο για κάθε ώρα μαθήματος μέσα στο τμήμα
const lessonSlotType = defineField({
  name: 'lessonSlot',
  title: 'Ώρα Μαθήματος',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      title: 'Μέρα',
      type: 'string',
      options: {
        list: DAYS,
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Ώρα Έναρξης (π.χ. 16:00)',
      type: 'string',
      validation: (Rule) =>
        Rule.required().regex(
          /^([01]?\d|2[0-3]):([0-5]\d)$/,
          { name: 'time', invert: false }
        ).error('Χρησιμοποίησε μορφή ΩΩ:ΛΛ, π.χ. 16:00'),
    }),
    defineField({
      name: 'endTime',
      title: 'Ώρα Λήξης (π.χ. 18:00)',
      type: 'string',
      validation: (Rule) =>
        Rule.required().regex(
          /^([01]?\d|2[0-3]):([0-5]\d)$/,
          { name: 'time', invert: false }
        ).error('Χρησιμοποίησε μορφή ΩΩ:ΛΛ, π.χ. 18:00'),
    }),
    defineField({
      name: 'subject',
      title: 'Μάθημα',
      type: 'string',
      description: 'π.χ. Μαθηματικά, Φυσική, Έκθεση...',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'teacher',
      title: 'Καθηγητής/τρια',
      type: 'string',
    }),
    defineField({
      name: 'room',
      title: 'Αίθουσα',
      type: 'string',
      description: 'π.χ. Αίθουσα 1, Αίθουσα 2',
    }),
  ],
  preview: {
    select: {
      day: 'day',
      startTime: 'startTime',
      endTime: 'endTime',
      subject: 'subject',
      teacher: 'teacher',
    },
    prepare({ day, startTime, endTime, subject, teacher }) {
      const dayLabels: Record<string, string> = {
        monday: 'Δευ',
        tuesday: 'Τρί',
        wednesday: 'Τετ',
        thursday: 'Πέμ',
        friday: 'Παρ',
        saturday: 'Σάβ',
      }
      return {
        title: `${dayLabels[day] ?? day} ${startTime}–${endTime}: ${subject}`,
        subtitle: teacher ? `Καθ.: ${teacher}` : '',
      }
    },
  },
})

// Κύριο document του τμήματος
export const classScheduleType = defineType({
  name: 'classSchedule',
  title: 'Πρόγραμμα Τμημάτων',
  type: 'document',
  icon: () => '📅',

  fields: [
    // ── Βασικές πληροφορίες ──────────────────────────────────────
    defineField({
      name: 'className',
      title: 'Όνομα Τμήματος',
      type: 'string',
      description: 'π.χ. Α1, Α2, Β1, Β2, Γ1, Γ2',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'schoolYear',
      title: 'Σχολική Τάξη',
      type: 'string',
      options: {
        list: [
          { title: 'Α΄ Λυκείου', value: 'A_LYKEIOU' },
          { title: 'Β΄ Λυκείου', value: 'B_LYKEIOU' },
          { title: 'Γ΄ Λυκείου', value: 'C_LYKEIOU' },
          { title: 'Α΄ Γυμνασίου', value: 'A_GYMNASIOU' },
          { title: 'Β΄ Γυμνασίου', value: 'B_GYMNASIOU' },
          { title: 'Γ΄ Γυμνασίου', value: 'C_GYMNASIOU' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'trackType',
      title: 'Κατεύθυνση / Τύπος',
      type: 'string',
      description: 'Αφήστε κενό αν δεν εφαρμόζεται',
      options: {
        list: [
          { title: 'Θετικές Επιστήμες', value: 'THETIKES' },
          { title: 'Ανθρωπιστικές Σπουδές', value: 'ANTHROPISTIKES' },
          { title: 'Σπουδές Οικονομίας & Πληροφορικής', value: 'OIKONOMIAS' },
          { title: 'Γενικό (χωρίς κατεύθυνση)', value: 'GENIKO' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Σύντομη Περιγραφή Τμήματος',
      type: 'text',
      rows: 2,
      description: 'Προαιρετική σύντομη περιγραφή για τη σελίδα προγράμματος.',
    }),
    defineField({
      name: 'maxStudents',
      title: 'Μέγιστος Αριθμός Μαθητών',
      type: 'number',
      description: 'Αφήστε κενό αν δεν υπάρχει όριο.',
    }),
    defineField({
      name: 'currentStudents',
      title: 'Τρέχον Πλήθος Μαθητών',
      type: 'number',
    }),
    defineField({
      name: 'color',
      title: 'Χρώμα Τμήματος (στη σελίδα)',
      type: 'string',
      description: 'Χρωματικός κωδικός hex, π.χ. #0c82a2',
      options: {
        list: [
          { title: 'Teal (Προεπιλογή)', value: '#0c82a2' },
          { title: 'Πορτοκαλί', value: '#f58220' },
          { title: 'Σκούρο Teal', value: '#095f77' },
          { title: 'Κόκκινο', value: '#e31837' },
          { title: 'Πράσινο', value: '#00a651' },
          { title: 'Μωβ', value: '#8e4585' },
          { title: 'Μαύρο', value: '#111111' },
        ],
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Ενεργό Τμήμα;',
      type: 'boolean',
      description: 'Ανενεργά τμήματα δεν εμφανίζονται στη σελίδα.',
      initialValue: true,
    }),
    defineField({
      name: 'isFull',
      title: 'Πλήρες (Δεν δέχεται εγγραφές);',
      type: 'boolean',
      initialValue: false,
    }),

    // ── Πρόγραμμα ────────────────────────────────────────────────
    defineField({
      name: 'schedule',
      title: 'Πρόγραμμα Εβδομάδας',
      type: 'array',
      of: [lessonSlotType],
      description: 'Πρόσθεσε τις ώρες των μαθημάτων για αυτό το τμήμα.',
    }),

    // ── Σημειώσεις ───────────────────────────────────────────────
    defineField({
      name: 'notes',
      title: 'Σημειώσεις (εσωτερικές)',
      type: 'text',
      rows: 3,
      description: 'Εσωτερικές σημειώσεις γραμματείας — δεν εμφανίζονται δημόσια.',
    }),
  ],

  // Πώς εμφανίζεται στη λίστα του Studio
  preview: {
    select: {
      className: 'className',
      schoolYear: 'schoolYear',
      isActive: 'isActive',
      isFull: 'isFull',
      currentStudents: 'currentStudents',
      maxStudents: 'maxStudents',
    },
    prepare({ className, schoolYear, isActive, isFull, currentStudents, maxStudents }) {
      const yearLabels: Record<string, string> = {
        A_LYKEIOU: 'Α΄ Λυκ.',
        B_LYKEIOU: 'Β΄ Λυκ.',
        C_LYKEIOU: 'Γ΄ Λυκ.',
        A_GYMNASIOU: 'Α΄ Γυμν.',
        B_GYMNASIOU: 'Β΄ Γυμν.',
        C_GYMNASIOU: 'Γ΄ Γυμν.',
      }
      const status = isFull ? '🔴 ΠΛΗΡΕΣ' : isActive ? '🟢 Ενεργό' : '⚫ Ανενεργό'
      const students =
        currentStudents != null && maxStudents != null
          ? ` · ${currentStudents}/${maxStudents} μαθητές`
          : currentStudents != null
          ? ` · ${currentStudents} μαθητές`
          : ''

      return {
        title: `Τμήμα ${className} — ${yearLabels[schoolYear] ?? schoolYear}`,
        subtitle: `${status}${students}`,
        media: () => '📅',
      }
    },
  },

  // Ταξινόμηση στο Studio
  orderings: [
    {
      title: 'Τάξη, μετά Τμήμα',
      name: 'schoolYearThenClass',
      by: [
        { field: 'schoolYear', direction: 'asc' },
        { field: 'className', direction: 'asc' },
      ],
    },
  ],
})
