import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const patterns = [
  ['Google Client Secret', /GOCSPX-[A-Za-z0-9_-]+/],
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['GitHub token', /gh[pousr]_[A-Za-z0-9]{20,}/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['secret Vite variable', /VITE_[A-Z0-9_]*(?:SECRET|PRIVATE_KEY)\s*=/],
]

const candidateFiles = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  {
    encoding: 'utf8',
  },
).split('\0').filter(Boolean)

const findings = []

for (const file of candidateFiles) {
  let content

  try {
    content = readFileSync(file, 'utf8')
  } catch {
    continue
  }

  for (const [label, pattern] of patterns) {
    if (pattern.test(content)) findings.push(`${file}: ${label}`)
  }
}

if (findings.length > 0) {
  console.error('커밋 후보 파일에서 민감정보로 의심되는 패턴을 발견했습니다:')
  findings.forEach((finding) => console.error(`- ${finding}`))
  process.exit(1)
}

console.log(`민감정보 패턴 검사 통과 (${candidateFiles.length}개 커밋 후보 파일)`)
