interface ServiceInteraction {
  serviceTitle: string
  timestamp: number
  category: 'hover' | 'click' | 'book'
}

interface ServiceMemory {
  lastClickedService?: string
  serviceInteractions: ServiceInteraction[]
  totalVisits: number
  firstVisit: number
  lastVisit: number
}

class ServiceMemorySystem {
  private readonly STORAGE_KEY = 'brendaNails_serviceMemory'
  private memory: ServiceMemory

  constructor() {
    this.memory = this.loadMemory()
    this.updateVisit()
  }

  private loadMemory(): ServiceMemory {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          lastClickedService: parsed.lastClickedService,
          serviceInteractions: parsed.serviceInteractions || [],
          totalVisits: parsed.totalVisits || 1,
          firstVisit: parsed.firstVisit || Date.now(),
          lastVisit: parsed.lastVisit || Date.now(),
        }
      }
    } catch (error) {
      console.warn('Error loading service memory:', error)
    }

    // Default memory for new users
    return {
      serviceInteractions: [],
      totalVisits: 1,
      firstVisit: Date.now(),
      lastVisit: Date.now(),
    }
  }

  private saveMemory() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.memory))
    } catch (error) {
      console.warn('Error saving service memory:', error)
    }
  }

  private updateVisit() {
    const now = Date.now()
    const timeSinceLastVisit = now - this.memory.lastVisit

    // Count as new visit if more than 30 minutes have passed
    if (timeSinceLastVisit > 30 * 60 * 1000) {
      this.memory.totalVisits++
    }

    this.memory.lastVisit = now
    this.saveMemory()
  }

  // Record service interaction
  recordServiceInteraction(
    serviceTitle: string,
    category: 'hover' | 'click' | 'book'
  ) {
    const interaction: ServiceInteraction = {
      serviceTitle,
      timestamp: Date.now(),
      category,
    }

    // Add to interactions list
    this.memory.serviceInteractions.push(interaction)

    // Keep only last 50 interactions to prevent storage bloat
    if (this.memory.serviceInteractions.length > 50) {
      this.memory.serviceInteractions =
        this.memory.serviceInteractions.slice(-50)
    }

    // Update last clicked service for clicks and bookings
    if (category === 'click' || category === 'book') {
      this.memory.lastClickedService = serviceTitle
    }

    this.saveMemory()
  }

  // Get last clicked service
  getLastClickedService(): string | undefined {
    return this.memory.lastClickedService
  }

  // Get most interacted services
  getMostPopularServices(): string[] {
    const serviceCounts = new Map<string, number>()

    this.memory.serviceInteractions.forEach((interaction) => {
      const count = serviceCounts.get(interaction.serviceTitle) || 0
      serviceCounts.set(interaction.serviceTitle, count + 1)
    })

    return Array.from(serviceCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([service]) => service)
  }

  // Check if returning user
  isReturningUser(): boolean {
    return this.memory.totalVisits > 1
  }

  // Get user type for personalization
  getUserType(): 'new' | 'returning' | 'frequent' {
    if (this.memory.totalVisits === 1) return 'new'
    if (this.memory.totalVisits < 5) return 'returning'
    return 'frequent'
  }

  // Get days since first visit
  getDaysSinceFirstVisit(): number {
    return Math.floor(
      (Date.now() - this.memory.firstVisit) / (1000 * 60 * 60 * 24)
    )
  }

  // Clear all memory (for testing or user request)
  clearMemory() {
    localStorage.removeItem(this.STORAGE_KEY)
    this.memory = {
      serviceInteractions: [],
      totalVisits: 1,
      firstVisit: Date.now(),
      lastVisit: Date.now(),
    }
  }

  // Get memory stats for debugging
  getStats() {
    return {
      totalVisits: this.memory.totalVisits,
      daysSinceFirstVisit: this.getDaysSinceFirstVisit(),
      totalInteractions: this.memory.serviceInteractions.length,
      lastClickedService: this.memory.lastClickedService,
      userType: this.getUserType(),
      mostPopularServices: this.getMostPopularServices(),
    }
  }
}

// Create singleton instance
export const serviceMemory = new ServiceMemorySystem()

// Helper function to get personalized greeting
export function getPersonalizedGreeting(): string {
  const userType = serviceMemory.getUserType()
  const lastService = serviceMemory.getLastClickedService()
  const hour = new Date().getHours()

  let timeGreeting = 'Hello'
  if (hour < 12) timeGreeting = 'Good morning'
  else if (hour < 17) timeGreeting = 'Good afternoon'
  else timeGreeting = 'Good evening'

  switch (userType) {
    case 'new':
      return `${timeGreeting}! Welcome to Brenda Nails Studio `

    case 'returning':
      if (lastService) {
        return `${timeGreeting}! Ready for another ${lastService}? 💅`
      }
      return `${timeGreeting}! Welcome back to Brenda Nails Studio 🌟`

    case 'frequent':
      if (lastService) {
        return `${timeGreeting}! Your usual ${lastService} or something new today? `
      }
      return `${timeGreeting}! Great to see you again! 💖`

    default:
      return `${timeGreeting}! Welcome to Brenda Nails Studio `
  }
}
