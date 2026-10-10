import re

classes = """-left-[5px] absolute accent-primary animate-fade-in animate-pulse animate-spin badge badge-act badge-ask badge-neutral badge-stop bg-[#143D30] bg-[#FAFAFA] bg-amber-50 bg-gray-100 bg-gray-50 bg-green-50 bg-green-500 bg-green-600 bg-red-50 bg-white border border-amber-100 border-amber-200 border-b border-gray-100 border-gray-200 border-gray-900 border-green-100 border-green-200 border-green-700 border-l-2 border-red-100 border-red-200 border-t border-t-2 border-t-4 border-t-amber-500 border-t-primary border-t-red-600 border-transparent btn btn-ask btn-outline btn-primary card container cursor-pointer flex flex-1 flex-col flex-shrink-0 flex-wrap font-bold font-medium font-normal font-semibold gap-0 gap-1 gap-2 gap-3 gap-4 gap-6 gap-8 grid group group-hover:opacity-100 group-hover:text-primary h-10 h-12 h-16 h-2 h-6 h-full hidden hover-lift hover:bg-gray-50 hover:border-primary hover:border-t-primary hover:text-gray-900 hover:text-primary hover:underline inline-flex input-field italic items-center items-end items-start justify-between justify-center label last:border-0 last:pb-0 leading-relaxed leading-tight left-3 lg:grid-cols-3 m-0 m-4 max-w-2xl max-w-3xl max-w-4xl max-w-md max-w-sm mb-1 mb-10 mb-12 mb-16 mb-2 mb-3 mb-4 mb-6 mb-8 md:flex-row md:grid-cols-2 md:grid-cols-3 md:items-end min-h-screen ml-2 mt-0.5 mt-1 mt-10 mt-2 mt-3 mt-4 mt-6 mt-8 mx-auto my-1 opacity-0 overflow-hidden overflow-x-auto overflow-y-auto p-0 p-1 p-2 p-3 p-4 p-5 p-6 p-8 pb-1 pb-16 pb-2 pb-3 pb-4 pl-3 pl-8 pr-2 pt-3 pt-4 px-1.5 px-2 px-3 px-4 px-8 py-0.5 py-1 py-1.5 py-16 py-2 py-4 receipt-paper relative rotate-90 rounded rounded-2xl rounded-full rounded-lg rounded-xl shadow-lg shadow-md shadow-sm sm:flex-row sm:w-auto text-2xl text-5xl text-[#E3E9E5] text-[10px] text-amber-500 text-amber-600 text-amber-700 text-amber-800 text-amber-900 text-base text-center text-gray-300 text-gray-400 text-gray-500 text-gray-600 text-gray-700 text-gray-800 text-gray-900 text-green-600 text-green-700 text-green-800 text-green-900 text-left text-lg text-light text-primary text-red-600 text-red-700 text-red-800 text-right text-sm text-white text-xl text-xs top-2 top-2.5 tracking-wide tracking-wider transition-all transition-colors transition-opacity two-col-grid uppercase w-10 w-12 w-16 w-2 w-20 w-4 w-6 w-full workspace-grid workspace-panel"""

output = """
/* Auto-generated Utility Classes to fix layout */

.absolute { position: absolute; }
.relative { position: relative; }
.hidden { display: none; }
.grid { display: grid; }
.-left-\\[5px\\] { left: -5px; }
.left-3 { left: 0.75rem; }
.top-2 { top: 0.5rem; }
.top-2\\.5 { top: 0.625rem; }

.accent-primary { accent-color: var(--color-primary); }
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.bg-\\[\\#143D30\\] { background-color: #143D30; }
.bg-\\[\\#FAFAFA\\] { background-color: #FAFAFA; }
.bg-amber-50 { background-color: #fffbeb; }
.bg-gray-100 { background-color: #f3f4f6; }
.bg-gray-50 { background-color: #f9fafb; }
.bg-green-50 { background-color: #f0fdf4; }
.bg-green-500 { background-color: #22c55e; }
.bg-green-600 { background-color: #16a34a; }
.bg-red-50 { background-color: #fef2f2; }
.bg-white { background-color: #fff; }

.border { border-width: 1px; border-style: solid; }
.border-b { border-bottom-width: 1px; border-bottom-style: solid; }
.border-t { border-top-width: 1px; border-top-style: solid; }
.border-t-2 { border-top-width: 2px; border-top-style: solid; }
.border-t-4 { border-top-width: 4px; border-top-style: solid; }
.border-l-2 { border-left-width: 2px; border-left-style: solid; }

.border-amber-100 { border-color: #fef3c7; }
.border-amber-200 { border-color: #fde68a; }
.border-gray-100 { border-color: #f3f4f6; }
.border-gray-200 { border-color: #e5e7eb; }
.border-gray-900 { border-color: #111827; }
.border-green-100 { border-color: #dcfce7; }
.border-green-200 { border-color: #bbf7d0; }
.border-green-700 { border-color: #15803d; }
.border-red-100 { border-color: #fee2e2; }
.border-red-200 { border-color: #fecaca; }
.border-t-amber-500 { border-top-color: #f59e0b; }
.border-t-primary { border-top-color: var(--color-primary); }
.border-t-red-600 { border-top-color: #dc2626; }
.border-transparent { border-color: transparent; }

.flex-1 { flex: 1 1 0%; }
.flex-shrink-0 { flex-shrink: 0; }
.flex-wrap { flex-wrap: wrap; }

.font-bold { font-weight: 700; }
.font-medium { font-weight: 500; }
.font-normal { font-weight: 400; }
.font-semibold { font-weight: 600; }

.gap-0 { gap: 0px; }
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }

.group:hover .group-hover\\:opacity-100 { opacity: 1; }
.group:hover .group-hover\\:text-primary { color: var(--color-primary); }

.h-10 { height: 2.5rem; }
.h-12 { height: 3rem; }
.h-16 { height: 4rem; }
.h-2 { height: 0.5rem; }
.h-6 { height: 1.5rem; }

.hover\\:bg-gray-50:hover { background-color: #f9fafb; }
.hover\\:border-primary:hover { border-color: var(--color-primary); }
.hover\\:border-t-primary:hover { border-top-color: var(--color-primary); }
.hover\\:text-gray-900:hover { color: #111827; }
.hover\\:text-primary:hover { color: var(--color-primary); }
.hover\\:underline:hover { text-decoration: underline; }

.italic { font-style: italic; }

.last\\:border-0:last-child { border-width: 0; }
.last\\:pb-0:last-child { padding-bottom: 0; }

.leading-relaxed { line-height: 1.625; }
.leading-tight { line-height: 1.25; }

.m-0 { margin: 0px; }
.m-4 { margin: 1rem; }
.max-w-2xl { max-width: 42rem; }
.max-w-3xl { max-width: 48rem; }
.max-w-4xl { max-width: 56rem; }
.max-w-md { max-width: 28rem; }
.max-w-sm { max-width: 24rem; }

.mb-1 { margin-bottom: 0.25rem; }
.mb-10 { margin-bottom: 2.5rem; }
.mb-12 { margin-bottom: 3rem; }
.mb-16 { margin-bottom: 4rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }

.ml-2 { margin-left: 0.5rem; }

.mt-0\\.5 { margin-top: 0.125rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-10 { margin-top: 2.5rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }

.mx-auto { margin-left: auto; margin-right: auto; }
.my-1 { margin-top: 0.25rem; margin-bottom: 0.25rem; }

.opacity-0 { opacity: 0; }
.opacity-60 { opacity: 0.6; }

.overflow-hidden { overflow: hidden; }
.overflow-x-auto { overflow-x: auto; }
.overflow-y-auto { overflow-y: auto; }

.p-0 { padding: 0px; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-5 { padding: 1.25rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }

.pb-1 { padding-bottom: 0.25rem; }
.pb-16 { padding-bottom: 4rem; }
.pb-2 { padding-bottom: 0.5rem; }
.pb-3 { padding-bottom: 0.75rem; }
.pb-4 { padding-bottom: 1rem; }

.pl-3 { padding-left: 0.75rem; }
.pl-8 { padding-left: 2rem; }
.pr-2 { padding-right: 0.5rem; }
.pt-3 { padding-top: 0.75rem; }
.pt-4 { padding-top: 1rem; }

.px-1\\.5 { padding-left: 0.375rem; padding-right: 0.375rem; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }

.py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.py-16 { padding-top: 4rem; padding-bottom: 4rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }

.rotate-90 { transform: rotate(90deg); }

.rounded { border-radius: 0.25rem; }
.rounded-2xl { border-radius: 1rem; }
.rounded-full { border-radius: 9999px; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }

.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }

.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-5xl { font-size: 3rem; line-height: 1; }
.text-\\[\\#E3E9E5\\] { color: #E3E9E5; }
.text-\\[10px\\] { font-size: 10px; line-height: 14px; }

.text-amber-500 { color: #f59e0b; }
.text-amber-600 { color: #d97706; }
.text-amber-700 { color: #b45309; }
.text-amber-800 { color: #92400e; }
.text-amber-900 { color: #78350f; }

.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-center { text-align: center; }

.text-gray-300 { color: #d1d5db; }
.text-gray-400 { color: #9ca3af; }
.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-gray-800 { color: #1f2937; }
.text-gray-900 { color: #111827; }

.text-green-600 { color: #16a34a; }
.text-green-700 { color: #15803d; }
.text-green-800 { color: #166534; }
.text-green-900 { color: #14532d; }

.text-left { text-align: left; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-red-600 { color: #dc2626; }
.text-red-700 { color: #b91c1c; }
.text-red-800 { color: #991b1b; }
.text-right { text-align: right; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-white { color: #ffffff; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }

.tracking-wide { letter-spacing: 0.025em; }
.tracking-wider { letter-spacing: 0.05em; }

.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-colors { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-opacity { transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }

.uppercase { text-transform: uppercase; }

.w-10 { width: 2.5rem; }
.w-12 { width: 3rem; }
.w-16 { width: 4rem; }
.w-2 { width: 0.5rem; }
.w-20 { width: 5rem; }
.w-4 { width: 1rem; }
.w-6 { width: 1.5rem; }
.w-full { width: 100%; }

@media (min-width: 640px) {
  .sm\\:flex-row { flex-direction: row; }
  .sm\\:w-auto { width: auto; }
}
@media (min-width: 768px) {
  .md\\:flex-row { flex-direction: row; }
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\\:items-end { align-items: flex-end; }
}
@media (min-width: 1024px) {
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

"""

with open('src/index.css', 'a') as f:
    f.write(output)

print("Done appending CSS")
