const ASSISTANT_INTRO_KEY = 'shiftmate.assistantIntroSeen'

export function hasSeenAssistantIntro() {
  return localStorage.getItem(ASSISTANT_INTRO_KEY) === 'true'
}

export function markAssistantIntroSeen() {
  localStorage.setItem(ASSISTANT_INTRO_KEY, 'true')
}
