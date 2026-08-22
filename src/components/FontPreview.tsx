import './FontPreview.css'

const ALPHABET_LINES = [
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'abcdefghijklmnopqrstuvwxyz',
  '0123456789 !?.,',
]

const FONT_SAMPLES = [
  { label: 'RuneScape (regular)', fontFamily: 'RuneScape', fontWeight: 400 },
  { label: 'RuneScape (bold)', fontFamily: 'RuneScape', fontWeight: 700 },
  { label: 'RuneScape Small', fontFamily: 'RuneScape Small', fontWeight: 400 },
]

/** Temporary debug section for eyeballing that the local font files actually render. */
function FontPreview() {
  return (
    <div className="font-preview">
      {FONT_SAMPLES.map((sample) => (
        <div key={sample.label} className="font-preview-box">
          <p className="font-preview-label">{sample.label}</p>
          {ALPHABET_LINES.map((line) => (
            <p
              key={line}
              style={{ fontFamily: sample.fontFamily, fontWeight: sample.fontWeight }}
            >
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}

export default FontPreview
