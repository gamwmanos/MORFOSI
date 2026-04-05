const fs = require('fs');

const path = './src/app/about/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// The corrupted block we need to target:
const corruptedBlock = `                        <Gr            {[
              {
                icon: MapPin,
                label: "Βρείτε μας",
                val: address,
                sub: "[Ενημερώσιμο από Sanity → siteSettings.address]",
                color: "bg-brand-teal",
                href: "https://maps.google.com",
              },
              {
                icon: Phone,
                label: "Καλέστε μας",
                val: contactPhone,
                sub: "Δευ-Παρ 09:00-21:00 · Σάβ 09:00-14:00",
                color: "bg-brand-orange",
                href: \`tel:\${contactPhone.replace(/\\s+/g, "")}\`,
              },
              {
                icon: Mail,
                label: "Email",
                val: contactEmail,
                sub: "[Ενημερώσιμο από Sanity → siteSettings.contactEmail]",
                color: "bg-brand-green",
                href: \`mailto:\${contactEmail}\`,
              },
            ].map((c, i) => {
              const Icon = c.icon; gap-3">`;

const fixedTestimonialBlock = `                        <GraduationCap size={28} className={t.accent} />
                      </div>
                      <div>
                        <div className="font-black text-gray-900 text-lg">{t.name}</div>
                        <div className={\`font-black text-sm uppercase tracking-widest \${t.accent}\`}>{t.school}</div>
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-0.5">Εισαγωγή {t.year}</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-gray-400 font-black text-xs uppercase tracking-widest mb-1">Μόρια</div>
                      <div className={\`font-black text-5xl tracking-tighter \${t.accent}\`}>{t.grade}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-3">`;

console.log("Replacing corrupted testimonials block...");
content = content.replace(corruptedBlock, fixedTestimonialBlock);


const contactStripBlock = `            {[
              {
                icon: MapPin,
                label: "Βρείτε μας",
                val: "Λεωφόρος Αθηνών 00, Αθήνα",
                sub: "[Ενημερώσιμο από Sanity → siteSettings.address]",
                color: "bg-brand-teal",
                href: "https://maps.google.com",
              },
              {
                icon: Phone,
                label: "Καλέστε μας",
                val: contactPhone,
                sub: "Δευ-Παρ 09:00-21:00 · Σάβ 09:00-14:00",
                color: "bg-brand-orange",
                href: \`tel:\${contactPhone.replace(/\\s+/g, "")}\`,
              },
              {
                icon: Mail,
                label: "Email",
                val: "morfosifront@gmail.com",
                sub: "[Ενημερώσιμο από Sanity → siteSettings.contactEmail]",
                color: "bg-brand-green",
                href: "mailto:morfosifront@gmail.com",
              },
            ].map((c, i) => {`;

const fixedContactStrip = `            {[
              {
                icon: MapPin,
                label: "Βρείτε μας",
                val: address,
                sub: "[Ενημερώσιμο από Sanity → siteSettings.address]",
                color: "bg-brand-teal",
                href: "https://maps.google.com",
              },
              {
                icon: Phone,
                label: "Καλέστε μας",
                val: contactPhone,
                sub: "Δευ-Παρ 09:00-21:00 · Σάβ 09:00-14:00",
                color: "bg-brand-orange",
                href: \`tel:\${contactPhone.replace(/\\s+/g, "")}\`,
              },
              {
                icon: Mail,
                label: "Email",
                val: contactEmail,
                sub: "[Ενημερώσιμο από Sanity → siteSettings.contactEmail]",
                color: "bg-brand-green",
                href: \`mailto:\${contactEmail}\`,
              },
            ].map((c, i) => {`;

console.log("Replacing hardcoded contact text...");
content = content.replace(contactStripBlock, fixedContactStrip);

fs.writeFileSync(path, content, 'utf8');
console.log("File updated successfully!");
