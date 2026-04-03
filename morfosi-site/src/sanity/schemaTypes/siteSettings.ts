// src/sanity/schemaTypes/siteSettings.ts
import { defineType, defineField } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Γενικές Ρυθμίσεις',
  type: 'document',
  fields: [
    defineField({
      name: 'contactEmail',
      title: 'Email Επικοινωνίας',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Τηλέφωνο Επικοινωνίας',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Διεύθυνση / Έδρα',
      type: 'text',
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', type: 'url', title: 'Facebook URL' }),
        defineField({ name: 'instagram', type: 'url', title: 'Instagram URL' }),
        defineField({ name: 'youtube', type: 'url', title: 'YouTube URL' }),
      ],
    }),
    defineField({
      name: 'announcementBanner',
      title: 'Έκτακτη Ανακοίνωση (Banner Μπάρα)',
      type: 'object',
      fields: [
        defineField({ name: 'isActive', type: 'boolean', title: 'Ενεργό;' }),
        defineField({ name: 'text', type: 'string', title: 'Κείμενο Ειδοποίησης' }),
      ],
    }),
  ],
})
