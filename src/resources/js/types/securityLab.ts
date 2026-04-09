export type Mode = 'vuln' | 'fixed'

export type StageExplanation = {
    problem: string
    impact: string
    fix: string
    practice: string
}

export type StageDefinition = {
    code: string
    number: number
    title: string
    theme: string
    objective: string
    overview: string
    focus_points: string[]
    hint: string
    vulnerable: {
        label: string
        summary: string
        accent: 'warning' | 'safe'
    }
    fixed: {
        label: string
        summary: string
        accent: 'warning' | 'safe'
    }
    explanation: StageExplanation
}

export type LabProgress = {
    vulnViewed: boolean
    fixedViewed: boolean
    completed: boolean
}

export type LabUser = {
    id: number
    name: string
    email: string
    role: string
    bio: string | null
    createdAt: string | null
}

export type RankingEntry = {
    rank: number
    id: number
    playerId: number
    playerName: string
    score: number
    comment: string | null
    updatedAt: string | null
    variant: Mode
}

export type StageOption = {
    code: string
    label: string
    title?: string
}

export type DemoAccount = {
    name: string
    email: string
    role: string
    password: string
}

export type LabActionResult = {
    success: boolean
    message: string
    request: unknown
    serverDecision: unknown
    stored: unknown
    response: unknown
}

export type AdminLog = {
    id: number
    action: string
    actor: string
    targetType: string | null
    targetId: string | null
    meta: unknown
    createdAt: string | null
}

export type AdminScore = {
    id: number
    stageCode: string
    player: string | null
    score: number
    comment: string | null
    updatedAt: string | null
}
